# TLS Blog Project

A Next.js web application with a PostgreSQL database using Prisma ORM.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22 recommended) - [Download](https://nodejs.org/)
- **pnpm** (v10 recommended) - Install with `npm install -g pnpm`
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
  - For Windows: Docker Desktop with WSL2 backend
  - For macOS: Docker Desktop
  - For Linux: Docker Engine and Docker Compose

## Getting Started

> [!WARNING]
> This project uses PNPM, not NPM or Yarn. Make sure to use PNPM commands.

### 1. Clone the Repository

```bash
git clone https://github.com/TeRacksito/tls-blog
cd tls-blog
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp example.env .env
```

Create a `docker-compose.yml` file in the root directory:

```bash
cp docker-compose.yml.example docker-compose.yml
```

### 4. Start Docker Services

**Make sure Docker Desktop is running**, then start the PostgreSQL database:

> [!TIP]
> If you have installed Microsoft's Docker extension for VS Code, you can also start the services by simply
> clicking the "Run all services" button at the top of the [docker-compose.yml](https://github.com/TeRacksito/tls-blog/blob/main/docker-compose.yml) file.

```bash
docker-compose up -d
```

This will:

- Start a PostgreSQL 16 database
- Create a database named `tls_blog`
- Expose it on port `5432`
- Set up health checks to ensure the database is ready

Because the command runs in detached mode (`-d`), you can check the logs in Docker Desktop.
If you want, instead, to see the logs in the terminal, run without `-d`.

> [!TIP]
> We recommend using a PostgreSQL-compatible database Client, like [DBeaver](https://dbeaver.io/), to connect to the database and inspect data visually.

### 5. Run Prisma Migrations

Once the database is running, apply the migrations to set up the schema:

```bash
pnpx prisma migrate dev
```

This command will:

- Create the database tables
- Generate the Prisma Client
- Apply all pending migrations

### 6. Generate Prisma Client

When changes are made to the Prisma schema, regeneration of the Prisma Client is needed:

```bash
pnpx prisma generate
```

### 7. Seed the Database

Populate the database with initial test data:

```bash
pnpx prisma db seed
```

This will create a test record to verify the database connection.

### 8. Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

You should see the database connection test page displaying the seeded data.

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpx prisma generate` - Regenerate Prisma Client after schema changes
- `pnpx prisma migrate deploy` - Apply new migrations
- `pnpx prisma migrate dev` - Create and apply new migrations
- `pnpx prisma migrate reset` - Reset the database and reapply migrations
- `pnpx prisma db seed` - Seed the database with initial data

## Docker Commands

> [!TIP]
> We recommend using Docker Desktop for easier container management.

- `docker-compose up -d` - Start services in detached mode
- `docker-compose down` - Stop services
- `docker-compose down -v` - Stop services and remove volumes (deletes data)
- `docker-compose logs postgres` - View PostgreSQL logs
- `docker-compose restart postgres` - Restart PostgreSQL

## Project Structure

```
tls-web/
├── app/                    # Next.js app directory
│   ├── generated/         # Generated Prisma Client
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── prisma/                # Prisma configuration
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Database seeding script
│   └── migrations/        # Migration files
├── docker-compose.yml     # Docker services configuration
├── .env                   # Environment variables (not in git)
└── package.json           # Project dependencies
```

## Troubleshooting

### Docker Issues

**Database won't start:**

- Ensure Docker Desktop is running
- Check if port 5432 is already in use.
- Try restarting Docker and Docker Desktop.

**Connection refused:**

- Wait a few seconds for the database to be fully ready
- Check health status: `docker-compose ps`

### Prisma Issues

**Migration fails:**

- Ensure the database is running: `docker-compose ps`
- Reset the database: `pnpx prisma migrate reset`
- Check DATABASE_URL in `.env` is correct. Try connecting with a database client.

**Prisma Client not found:**

- Regenerate the client: `pnpx prisma generate`

### Next.js Issues

**Port 3000 already in use:**

- Use a different port: `pnpm dev -- -p 3001`
- Or kill the process using port 3000

## Database Access

We recommend using a database client like [DBeaver](https://dbeaver.io/) to connect to the PostgreSQL database.
Alternatively, you can use the `psql` command line tool.

```bash
docker-compose exec postgres psql -U postgres -d tls_blog
```

## Development Workflow

1. Make changes to `prisma/schema.prisma`
2. Run `pnpx prisma migrate dev --name <migration-name>` to create a migration
3. The Prisma Client will be automatically regenerated
4. Update your application code to use the new schema
5. Test your changes with `pnpm dev`

## Tech Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL 16
- **ORM:** Prisma 7
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript 5
- **Package Manager:** pnpm
