// =============================================================================
// NEXTAUTH CONFIGURATION - DOTT. BERNARDO GIAMMETTA
// Configurazione autenticazione con Google OAuth e AWS Cognito
// =============================================================================

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CognitoProvider from 'next-auth/providers/cognito';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';
import bcrypt from 'bcryptjs';

// =============================================================================
// HELPER: Verifica se utente è nel gruppo master su Cognito
// =============================================================================
function isCognitoMaster(profile: any): boolean {
  // Cognito passa i gruppi nel campo 'cognito:groups' del token
  const groups = profile?.['cognito:groups'] || [];
  return Array.isArray(groups) && groups.includes('master');
}

// Verifica se il database è configurato e accessibile
const isDatabaseAvailable = async () => {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};

// =============================================================================
// AUTH OPTIONS
// =============================================================================

// Configurazione dinamica basata sulla disponibilità del database
const getAdapter = () => {
  // In produzione, usa sempre PrismaAdapter se DATABASE_URL è configurata
  if (process.env.DATABASE_URL) {
    try {
      return PrismaAdapter(db) as any;
    } catch (error) {
      console.warn('PrismaAdapter non disponibile, uso sessioni JWT');
      return undefined;
    }
  }
  return undefined;
};

export const authOptions: NextAuthOptions = {
  // Adapter Prisma per salvare utenti nel database
  // ABILITATO: Le tabelle sono state create con prisma db push
  adapter: getAdapter(),
  
  // Providers di autenticazione
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // IMPORTANTE: Permette di collegare account OAuth a utenti esistenti con stessa email
      // Risolve errore OAuthAccountNotLinked quando utente esiste già nel DB
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    
    // AWS Cognito - Per gestione account master e autenticazione alternativa
    // I gruppi Cognito determinano i permessi: "master" = ADMIN
    ...(process.env.COGNITO_CLIENT_ID && process.env.COGNITO_CLIENT_SECRET ? [
      CognitoProvider({
        clientId: process.env.COGNITO_CLIENT_ID,
        clientSecret: process.env.COGNITO_CLIENT_SECRET,
        issuer: process.env.COGNITO_ISSUER,
        // Permette di collegare account a utenti esistenti con stessa email
        allowDangerousEmailAccountLinking: true,
      }),
    ] : []),
    
    // Autenticazione Email/Password
    CredentialsProvider({
      id: 'credentials',
      name: 'Email e Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@esempio.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validazione input
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e password sono richiesti');
        }
        
        // Cerca utente nel database
        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });
        
        // Utente non trovato
        if (!user) {
          throw new Error('Credenziali non valide');
        }
        
        // Utente senza password (registrato solo con OAuth)
        if (!user.password) {
          throw new Error('Questo account usa accesso con Google. Usa il pulsante Google per accedere.');
        }
        
        // Verifica password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error('Credenziali non valide');
        }
        
        // Ritorna utente per creare sessione
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: isMasterAccount(user.email) ? 'ADMIN' : 'PATIENT',
          isWhitelisted: user.isWhitelisted || isMasterAccount(user.email),
        };
      },
    }),
  ],
  
  // Callbacks per personalizzare comportamento
  callbacks: {
    // JWT callback - salva dati nel token
    // IMPORTANTE: Ricalcoliamo SEMPRE il ruolo per garantire che modifiche a MASTER_ACCOUNTS
    // abbiano effetto immediato senza richiedere logout/login
    async jwt({ token, user, account, profile }) {
      // Al primo login, salva i dati base dell'utente
      if (user) {
        token.id = user.id;
        token.email = user.email;
        
        // Log per debug Cognito
        if (account?.provider === 'cognito') {
          console.log('[COGNITO AUTH] User:', user.email, 'Groups:', (profile as any)?.['cognito:groups']);
        }
      }
      
      // CRITICO: Ricalcola SEMPRE il ruolo basandosi sull'email
      // Questo garantisce che se aggiungiamo un'email a MASTER_ACCOUNTS, funziona subito
      // senza richiedere logout/login dell'utente
      if (token.email) {
        const isMasterByEmail = isMasterAccount(token.email as string);
        // Per Cognito, controlliamo anche i gruppi (solo al primo login quando profile è disponibile)
        const isMasterByCognito = account?.provider === 'cognito' && isCognitoMaster(profile);
        const isMaster = isMasterByEmail || isMasterByCognito;
        
        token.role = isMaster ? 'ADMIN' : 'PATIENT';
        token.isWhitelisted = isMaster;
      }
      
      return token;
    },
    
    // Session callback - usa dati dal token JWT
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub || token.id as string || 'jwt-user';
        session.user.role = (token.role as 'ADMIN' | 'PATIENT') || 'PATIENT';
        session.user.isWhitelisted = (token.isWhitelisted as boolean) || false;
        
        // CRITICO: Copia email dal token alla sessione (necessario per isMasterAccount)
        // L'email potrebbe non essere presente in session.user da OAuth
        if (token.email) {
          session.user.email = token.email as string;
        }
        
        // Ricontrolla se è master (per sicurezza)
        if (isMasterAccount(session.user.email)) {
          session.user.role = 'ADMIN';
          session.user.isWhitelisted = true;
        }
      }
      return session;
    },
    
    // Redirect dopo login
    async redirect({ url, baseUrl }) {
      // Se l'URL è relativo, aggiungi baseUrl
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Se è dello stesso dominio, permetti
      if (new URL(url).origin === baseUrl) return url;
      // Altrimenti redirect a home
      return baseUrl;
    },
  },
  
  // Pagine custom
  pages: {
    signIn: '/accedi',
    error: '/accedi',
  },
  
  // Opzioni sessione - SEMPRE JWT finché le tabelle non sono create
  // NOTA: Cambiare a 'database' dopo aver creato le tabelle con prisma db push
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 giorni
  },
  
  // Eventi per logging/analytics
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        // TODO: Invia email di benvenuto al nuovo utente
        // Per ora loggiamo solo in development
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(`[DEV] Nuovo utente registrato: ${user.email}`);
        }
      }
    },
  },
  
  // Debug in development
  debug: process.env.NODE_ENV === 'development',
};

// =============================================================================
// TYPE EXTENSIONS
// Estendi i tipi di NextAuth per includere campi custom
// =============================================================================

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'ADMIN' | 'PATIENT';
      isWhitelisted: boolean;
      phone?: string | null;
    };
  }
  
  interface User {
    role: 'ADMIN' | 'PATIENT';
    isWhitelisted: boolean;
    phone?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'ADMIN' | 'PATIENT';
    isWhitelisted: boolean;
  }
}
