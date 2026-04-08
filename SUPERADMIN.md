# Dyneros — Credenziali SuperAdmin

## Accesso al Pannello SuperAdmin

Il pannello SuperAdmin è disponibile all'indirizzo:

```
https://tuodominio.com/superadmin
```

Il SuperAdmin ha accesso completo alla gestione di tutti gli utenti della piattaforma: può modificare ruoli, sospendere account, eliminare utenti e visualizzare statistiche globali.

---

## Credenziali Predefinite

All'avvio del server, se non esiste ancora nessun SuperAdmin nel database, il sistema ne crea automaticamente uno con le seguenti credenziali di default:

| Campo    | Valore predefinito       |
|----------|--------------------------|
| Email    | `admin@dyneros.com`      |
| Password | `Dyneros@2026!`          |
| Ruolo    | `superadmin`             |

> **IMPORTANTE:** Cambia immediatamente la password dopo il primo accesso.

---

## Personalizzare le Credenziali SuperAdmin

Puoi sovrascrivere le credenziali predefinite tramite variabili d'ambiente **prima** di avviare il server per la prima volta:

```bash
SUPERADMIN_EMAIL=tuo@email.com
SUPERADMIN_PASSWORD=TuaPasswordSicura123!
```

Aggiungi queste variabili nel file `.env` o nelle variabili d'ambiente del tuo server/hosting.

### Requisiti password consigliati
- Minimo 12 caratteri
- Almeno una lettera maiuscola
- Almeno un numero
- Almeno un carattere speciale (`!@#$%^&*`)

---

## Ruoli Disponibili

| Ruolo        | Descrizione                                                    |
|--------------|----------------------------------------------------------------|
| `user`       | Utente standard — accesso solo alla propria dashboard          |
| `admin`      | Amministratore — accesso esteso, gestione contenuti            |
| `superadmin` | SuperAdmin — accesso completo, gestione utenti e configurazioni |

---

## Reset Password SuperAdmin

Se hai perso l'accesso al SuperAdmin, puoi resettarlo direttamente nel database:

```sql
UPDATE users
SET passwordHash = '<nuovo_hash_bcrypt>', role = 'superadmin', status = 'active'
WHERE email = 'admin@dyneros.com';
```

Per generare un nuovo hash bcrypt (costo 12):

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('NuovaPassword123!', 12).then(h => console.log(h));"
```

---

## Note di Sicurezza

1. Il pannello `/superadmin` non è indicizzato dai motori di ricerca (robots.txt).
2. Considera di proteggere la route `/superadmin` con un firewall IP in produzione.
3. Abilita l'autenticazione a due fattori (2FA) appena disponibile.
4. Monitora il log di sicurezza nella sezione Security della dashboard.
5. Non condividere mai le credenziali SuperAdmin con il personale non autorizzato.
