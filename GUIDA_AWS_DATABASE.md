# 🗄️ GUIDA CONFIGURAZIONE DATABASE AWS RDS

## Panoramica
Questa guida ti aiuterà a configurare il database PostgreSQL su AWS RDS per far funzionare l'agenda del sito.

---

## 📋 STEP 1: Verifica Variabili Ambiente AWS

Dalla tua console AWS Amplify/Elastic Beanstalk, verifica che queste variabili siano configurate:

```
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres?schema=public
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx
```

**Il tuo DATABASE_URL attuale sembra essere:**
```
postgresql://postgres:$#?hAaoN8bJsu:p$<OgN7x24lPFR@database-agenda.cluster-criu4sm20xow.eu-north-1.rds.amazonaws.com:5432/postgres?schema=public
```

⚠️ **ATTENZIONE**: Se la password contiene caratteri speciali come `$`, `#`, `<`, `>`, `?`, devi fare l'URL encoding!

---

## 📋 STEP 2: URL Encoding della Password

Se la tua password è: `$#?hAaoN8bJsu:p$<OgN7x24lPFR`

Devi convertire i caratteri speciali:
- `$` → `%24`
- `#` → `%23`
- `?` → `%3F`
- `:` → `%3A`
- `<` → `%3C`

**Password codificata:** `%24%23%3FhAaoN8bJsu%3Ap%24%3COgN7x24lPFR`

**DATABASE_URL corretta:**
```
postgresql://postgres:%24%23%3FhAaoN8bJsu%3Ap%24%3COgN7x24lPFR@database-agenda.cluster-criu4sm20xow.eu-north-1.rds.amazonaws.com:5432/postgres?schema=public
```

---

## 📋 STEP 3: Migrazione Database (Prisma)

Una volta configurato DATABASE_URL, devi creare le tabelle nel database.

### Opzione A: Da locale (consigliata per prima volta)

1. **Crea file `.env` locale** con il DATABASE_URL corretto:
```bash
DATABASE_URL="postgresql://postgres:PASSWORD_ENCODED@HOST:5432/postgres?schema=public"
```

2. **Esegui migrazione:**
```bash
npx prisma migrate deploy
```

3. **Oppure push diretto (per sviluppo):**
```bash
npx prisma db push
```

### Opzione B: Da AWS (dopo deploy)

Aggiungi uno script di build in `package.json`:
```json
"scripts": {
  "postbuild": "prisma migrate deploy"
}
```

---

## 📋 STEP 4: Verifica Connessione

Per testare la connessione al database:

```bash
npx prisma studio
```

Questo aprirà un'interfaccia web dove puoi vedere le tabelle.

---

## 📋 STEP 5: Configurazione Security Group AWS

Assicurati che il database RDS sia accessibile:

1. Vai su **AWS RDS** → **Database** → **Security Groups**
2. Modifica le **Inbound Rules**
3. Aggiungi regola:
   - **Type:** PostgreSQL
   - **Port:** 5432
   - **Source:** Il security group della tua app Amplify/EB

---

## 🔧 TROUBLESHOOTING

### Errore "Database non configurato"
- Verifica che `DATABASE_URL` sia impostata correttamente
- Controlla che la password sia URL-encoded
- Verifica che il database RDS sia attivo e accessibile

### Errore "Connection refused"
- Il security group RDS non permette connessioni dalla tua app
- Il database potrebbe essere in una VPC privata

### Errore "Authentication failed"
- Password errata o non codificata correttamente
- Username errato (default: `postgres`)

### NutriBot non risponde
- Verifica `OPENROUTER_API_KEY` sia completa (non troncata)
- La chiave deve iniziare con `sk-or-v1-`
- Controlla i log di CloudWatch per errori dettagliati

---

## 📞 SUPPORTO

Se hai problemi:
1. Controlla i **CloudWatch Logs** su AWS per errori dettagliati
2. Verifica che tutte le variabili ambiente siano salvate correttamente
3. Assicurati che il database RDS sia nello stato "Available"

---

## ✅ CHECKLIST FINALE

- [ ] DATABASE_URL configurata con password URL-encoded
- [ ] OPENROUTER_API_KEY configurata (completa, non troncata)
- [ ] Security Group RDS permette connessioni dalla app
- [ ] Migrazione Prisma eseguita (`prisma migrate deploy`)
- [ ] Database RDS in stato "Available"
- [ ] Test connessione con `prisma studio` riuscito
