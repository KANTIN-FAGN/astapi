# ASTAPI — README

Un projet **NestJS + Prisma + PostgreSQL (Docker)**, prêt pour le développement local avec **Swagger**, **Auth JWT**, **CORS**, **upload de fichiers**, et **migrations propres**.

---

## Sommaire
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration .env](#configuration-env)
- [Docker (PostgreSQL)](#docker-postgresql)
- [Prisma](#prisma)
- [Lancement de l'API](#lancement-de-lapi)
- [CORS](#cors)
- [Swagger (API docs)](#swagger-api-docs)
- [Uploads](#uploads)
- [Commandes utiles](#commandes-utiles)
- [Arborescence](#arborescence)
- [Dépannage](#dépannage)
- [Scripts npm](#scripts-npm)
- [Notes finales](#notes-finales)

---

## Prérequis
- Node.js **18+**
- npm **9+**
- Docker et Docker Compose
- Port libre pour l'API : **3000**
- Port libre pour PostgreSQL : **5432** (ou personnalisé)

---

## Installation

### 1. Cloner le repo
```bash
git clone <repo-url> && cd astapi
```

### 2. Installer les dépendances
```bash
npm install
```

---

## Configuration .env

Créer un fichier `.env` à la racine du projet.

**Exemple pour Postgres local dans Docker :**

```env
DATABASE_URL="postgresql://astapi:password@localhost:5432/astapi-db?schema=public"
PORT=3000
JWT_SECRET=changeme-super-secret
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

**Notes :**
- `DATABASE_URL` : adapte `user`, `password`, `host`, `port`, `dbname`.
- Si tu utilises un autre port Postgres dans Docker (ex: `5433`), change `localhost:5433`.
- `JWT_SECRET` : utilise un secret fort en production.

---

## Docker (PostgreSQL)

### docker-compose.yml minimal recommandé

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      - POSTGRES_USER=astapi
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=astapi-db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

### Commandes Docker

```bash
# Démarrer
docker compose up -d

# Logs
docker compose logs -f postgres

# Stopper
docker compose down

# Supprimer avec volumes
docker compose down -v
```

---

## Prisma

### Générer le client
```bash
npx prisma generate
```

### Créer une migration depuis le schéma
```bash
npx prisma migrate dev --name "init"
```

### Appliquer l'état du schéma sans migration (dev uniquement)
```bash
npx prisma db push
```

### Reset complet (drop + migrations + seed)
```bash
npx prisma migrate reset
```

### Seed (remplir la base de données)
```bash
npx prisma db seed
# ou directement :
ts-node prisma/seed.ts
```

### Studio (UI pour la base)
```bash
npx prisma studio
```

---

## Lancement de l'API

### En mode développement (watch)
```bash
npm run start:dev
```

### Build et prod locale
```bash
npm run build
npm run start:prod
```

---

## CORS

Activé dans `main.ts`.

Par défaut :

```typescript
origin: 'http://localhost:3000'
```

Adapte si ton front tourne sur un autre port/origine.

---

## Swagger (API docs)

- **UI** : [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- Les endpoints sont préfixés : `/api/v1`
- Exemple : `/api/v1/users`

---

## Uploads

- Dossier `uploads/` servi statiquement avec préfixe `/uploads/`
- Endpoints d'upload consomment `multipart/form-data`
- Swagger affiche un champ `file` (format : `binary`)

---

## Commandes utiles

| Action | Commande |
|--------|----------|
| Installer | `npm install` |
| Lancer Postgres (Docker) | `docker compose up -d` |
| Générer Prisma | `npx prisma generate` |
| Migrer | `npx prisma migrate dev --name ""` |
| Reset DB | `npx prisma migrate reset` |
| Seed | `npx prisma db seed` |
| Studio | `npx prisma studio` |
| Dev | `npm run start:dev` |
| Build | `npm run build` |
| Prod | `npm run start:prod` |
| Lint | `npm run lint` |
| Tests | `npm test` |

---

## Arborescence

```
prisma/
  schema.prisma
  seed.ts
  migrations/
src/
  main.ts
  modules/
    users/
    vincent/
    auth/
    common/
uploads/   # généré au runtime
```

---

## Dépannage

### Prisma "DATABASE_URL missing"
- Vérifie que `.env` est présent à la racine et correct.
- Si tu utilises `prisma.config.ts`, Prisma peut ignorer `.env`.
- Exporte `DATABASE_URL` dans l'environnement ou configure Prisma explicitement.

### Drift detected / migrations manquantes
```bash
npx prisma migrate reset
```

### Types incohérents (string vs number)
```bash
npx prisma generate
```
Redémarre Nest :
```bash
npm run start:dev
```

### Connexion refusée à Postgres
- Vérifie les ports : `docker compose ps`
- Vérifie `DATABASE_URL` (host/port/user/password/db)

### Swagger ne s'affiche pas
- URL : [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- Vérifie que l'app écoute sur le bon port

### CORS
Ajuste dans :
```typescript
app.enableCors({ origin: [...] })
```

---

## Scripts npm

Exemples (à adapter selon `package.json`) :

```json
{
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:prod": "node dist/main.js",
  "build": "nest build",
  "lint": "eslint .",
  "test": "jest",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:reset": "prisma migrate reset",
  "prisma:studio": "prisma studio",
  "db:up": "docker compose up -d",
  "db:down": "docker compose down"
}
```

---

## Notes finales

- En dev : privilégie `migrate dev` et `migrate reset` plutôt que `db push` pour garder un historique propre.
- Après toute modif du schéma Prisma : exécute `npx prisma generate` puis redémarre le serveur TS si nécessaire.
- Pense à sécuriser `JWT_SECRET` et `CORS` avant toute mise en production.

**Bonne dev !**
