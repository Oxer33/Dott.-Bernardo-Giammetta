// =============================================================================
// NEXTAUTH CONFIGURATION - DOTT. BERNARDO GIAMMETTA
// Configurazione autenticazione con Google OAuth
// =============================================================================

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';

// =============================================================================
// AUTH OPTIONS
// =============================================================================

export const authOptions: NextAuthOptions = {
  // Adapter Prisma per persistenza sessioni nel database
  adapter: PrismaAdapter(db) as any,
  
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
    // Aggiunge dati custom alla sessione
    async session({ session, user }) {
      if (session.user) {
        // Recupera dati aggiuntivi dal database
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            role: true,
            isWhitelisted: true,
            phone: true,
          },
        });
        
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role as 'ADMIN' | 'PATIENT';
          session.user.isWhitelisted = dbUser.isWhitelisted;
          session.user.phone = dbUser.phone;
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
    signIn: '/login',
    error: '/login',
  },
  
  // Opzioni sessione
  session: {
    strategy: 'database',
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
