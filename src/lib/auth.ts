// =============================================================================
// NEXTAUTH CONFIGURATION - DOTT. BERNARDO GIAMMETTA
// Configurazione autenticazione con Google OAuth
// =============================================================================

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';

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
  // NOTA: Adapter disabilitato finché le tabelle non sono create
  // Decommentare dopo aver eseguito: prisma db push
  // adapter: getAdapter(),
  
  // Providers di autenticazione
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  
  // Callbacks per personalizzare comportamento
  callbacks: {
    // JWT callback - salva dati nel token
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = 'PATIENT';
        token.isWhitelisted = false;
      }
      return token;
    },
    
    // Session callback - usa dati dal token JWT
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub || token.id as string || 'jwt-user';
        session.user.role = (token.role as 'ADMIN' | 'PATIENT') || 'PATIENT';
        session.user.isWhitelisted = (token.isWhitelisted as boolean) || false;
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
        // Logica per nuovo utente (es. invia email benvenuto)
        console.log(`Nuovo utente registrato: ${user.email}`);
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
