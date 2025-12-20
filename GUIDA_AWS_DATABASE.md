# 🗄️ GUIDA CONFIGURAZIONE DATABASE AWS RDS

## Panoramica
Database PostgreSQL su AWS RDS per l'agenda del sito del Dott. Bernardo Giammetta.

---

## ✅ DATABASE CONFIGURATO!

### Dettagli Database RDS:
| Campo | Valore |
|-------|--------|
| **Endpoint** | `agenda-db.criu4sm20xow.eu-north-1.rds.amazonaws.com` |
| **Porta** | `5432` |
| **Nome DB** | `agenda_db` |
| **Username** | `postgres` |
| **Password** | `!Godosybe28081991` |
| **Regione** | `eu-north-1` (Stockholm) |
| **Istanza** | `db.t4g.micro` |
| **Storage** | `20 GB SSD` |

---

## 📋 STEP 1: Configura DATABASE_URL su Amplify Console

**Vai su AWS Amplify Console** → **La tua app** → **Environment variables**

Aggiungi/modifica questa variabile:

```
DATABASE_URL=postgresql://postgres:%21Godosybe28081991@agenda-db.criu4sm20xow.eu-north-1.rds.amazonaws.com:5432/agenda_db?schema=public
```

⚠️ **NOTA**: Il carattere `!` è codificato come `%21`

---

## ✅ STEP 2: Security Group Configurato!

**Security Group ID:** `sg-0c00f86c7541e9483`

Regole Inbound configurate:
| Tipo | Porta | Sorgente | Descrizione |
|------|-------|----------|-------------|
| PostgreSQL | 5432 | `10.0.0.0/8` | Amplify VPC |
| PostgreSQL | 5432 | `87.17.161.232/32` | IP Admin |

---

## 📋 STEP 3: Crea le Tabelle (dopo deploy)

Dopo aver configurato DATABASE_URL su Amplify e fatto redeploy:

1. Vai su: `https://TUO-SITO.amplifyapp.com/api/db/init`
2. Clicca il pulsante **"Inizializza Database"**
3. Aspetta che le tabelle vengano create

Oppure fai una chiamata POST:
```bash
curl -X POST https://TUO-SITO.amplifyapp.com/api/db/init
```

---

## 📋 STEP 4: Migrazione Database Locale (opzionale)

Se vuoi creare le tabelle da locale:

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
