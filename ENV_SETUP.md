# Dyneros — Configurazione Variabili d'Ambiente

Crea un file `.env` nella cartella root del progetto con il seguente contenuto:

```
DATABASE_URL=mysql://root:DynerosRoot2026@127.0.0.1:3306/dyneros

JWT_SECRET=cambia-questa-stringa-con-una-chiave-segreta-lunga-almeno-32-caratteri

NODE_ENV=production

SUPERADMIN_EMAIL=admin@dyneros.com
SUPERADMIN_PASSWORD=Dyneros@2026!

SMTP_HOST=smtp.tuoprovider.com
SMTP_PORT=587
SMTP_USER=noreply@dyneros.com
SMTP_PASS=tuapassword
SMTP_FROM_NAME=Dyneros Ltd
SMTP_FROM_EMAIL=noreply@dyneros.com

VITE_APP_ID=dyneros
VITE_APP_TITLE=Dyneros Ltd
OAUTH_SERVER_URL=
OWNER_OPEN_ID=
OWNER_NAME=
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=
VITE_FRONTEND_FORGE_API_KEY=
VITE_FRONTEND_FORGE_API_URL=
VITE_OAUTH_PORTAL_URL=
```

## Procedura di avvio sul server

```bash
# 1. Crea il database MariaDB (se non esiste)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS dyneros CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Installa le dipendenze
pnpm install

# 3. Crea le tabelle nel database
DATABASE_URL=mysql://root:DynerosRoot2026@127.0.0.1:3306/dyneros npx drizzle-kit migrate

# 4. Build del frontend
pnpm build

# 5. Avvia il server
pnpm start
```

## Note importanti

- `DATABASE_URL` deve usare il formato `mysql://utente:password@host:porta/database`
- `JWT_SECRET` deve essere una stringa casuale lunga almeno 32 caratteri
- Al primo avvio, il server crea automaticamente l'account SuperAdmin con le credenziali in `SUPERADMIN_EMAIL` e `SUPERADMIN_PASSWORD`
- Il pannello SuperAdmin è accessibile su `/superadmin`
