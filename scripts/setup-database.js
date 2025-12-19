// =============================================================================
// SCRIPT SETUP DATABASE - DOTT. BERNARDO GIAMMETTA
// Crea le tabelle nel database PostgreSQL se non esistono
// Viene eseguito durante il build su AWS Amplify
// =============================================================================

const { execSync } = require('child_process');

console.log('🔧 Setup Database Script');
console.log('========================');

// Verifica se DATABASE_URL è configurata
if (!process.env.DATABASE_URL) {
  console.log('⚠️  DATABASE_URL non configurata - skip setup database');
  console.log('   Il database verrà configurato quando DATABASE_URL sarà disponibile');
  process.exit(0);
}

console.log('✅ DATABASE_URL trovata');
console.log('📡 Tentativo connessione al database...');

try {
  // Prima genera il client Prisma
  console.log('🔨 Generazione Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Poi prova a fare il push dello schema
  console.log('📤 Push schema al database...');
  execSync('npx prisma db push --accept-data-loss', { 
    stdio: 'inherit',
    timeout: 60000 // 60 secondi timeout
  });
  
  console.log('✅ Database configurato con successo!');
} catch (error) {
  console.log('⚠️  Impossibile connettersi al database durante il build');
  console.log('   Questo è normale se il database non è raggiungibile da questo ambiente');
  console.log('   Le tabelle verranno create al primo avvio dell\'applicazione');
  
  // Non far fallire il build
  process.exit(0);
}
