# Prisma in the Air

Demo about Prisma

## Setup

create a .env file with the following content:

```
# Environment variables declared in this file are automatically made available to Prisma.

# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.

# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://prisma:demo@localhost:5432/prisma-demo?schema=public"
```

```bash
docker up -d

npm install

npx prisma migrate deploy
```

## Run

```bash
npm run dev
```
