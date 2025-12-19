// =============================================================================
// NEXTAUTH API ROUTE - DOTT. BERNARDO GIAMMETTA
// Endpoint per gestione autenticazione
// =============================================================================

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Crea handler NextAuth
const handler = NextAuth(authOptions);

// Esporta per GET e POST
export { handler as GET, handler as POST };
