# Database Setup Guide

This guide will help you set up the database for both local development (MySQL) and production (PostgreSQL).

## 🏠 Local Development Setup (MySQL)

### 1. Install MySQL
- **Windows**: Download and install MySQL from [mysql.com](https://dev.mysql.com/downloads/mysql/)
- **macOS**: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server`

### 2. Create Database
```sql
CREATE DATABASE guhuza_quiz;
CREATE USER 'quiz_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON guhuza_quiz.* TO 'quiz_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Switch to MySQL Schema
```bash
npm run db:mysql
```

### 4. Environment Configuration
Create a `.env.local` file in your project root:

```env
# Local Development Environment (MySQL)
DATABASE_URL="mysql://quiz_user:your_password@localhost:3306/guhuza_quiz"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-local-secret-key-change-this"

# Google OAuth (for local development)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Analytics (optional for local)
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
```

### 5. Initialize Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database (optional)
npm run db:seed
```

## 🚀 Production Setup (PostgreSQL)

### 1. Switch to PostgreSQL Schema
```bash
npm run db:postgresql
```

### 2. Railway Deployment
Railway automatically provides PostgreSQL. Set these environment variables in Railway:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_URL="https://your-app.railway.app"
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### 3. Vercel + PlanetScale
If using Vercel with PlanetScale:

```bash
npm run db:mysql
```

Then set environment variables:
```env
DATABASE_URL="mysql://username:password@host:port/database"
```

## 🔧 Database Commands

```bash
# Switch database schemas
npm run db:mysql        # Switch to MySQL schema
npm run db:postgresql   # Switch to PostgreSQL schema
npm run db:status       # Show current database provider

# Database operations
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema changes
npm run db:migrate      # Create and run migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database
```

## 🚨 Troubleshooting

### Error: "URL must start with the protocol"
- **MySQL**: Ensure URL starts with `mysql://`
- **PostgreSQL**: Ensure URL starts with `postgresql://` or `postgres://`

### Error: "DATABASE_URL environment variable is required"
- Set `DATABASE_URL` in your environment variables
- Check that the URL format matches your database provider

### Connection Issues
- Verify database server is running
- Check credentials and permissions
- Ensure firewall allows connections on database port

### Schema Mismatch
- Use `npm run db:status` to check current provider
- Switch to correct schema: `npm run db:mysql` or `npm run db:postgresql`
- Regenerate client: `npm run db:generate`

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string | `mysql://user:pass@host:port/db` or `postgresql://user:pass@host:port/db` |
| `NEXTAUTH_URL` | App URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Auth secret | `your-secret-key` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `your-google-secret` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID | `G-XXXXXXXXXX` |

## 🔄 Switching Between Environments

### Local to Production
1. Switch schema: `npm run db:postgresql`
2. Update `DATABASE_URL` to PostgreSQL connection string
3. Update `NEXTAUTH_URL` to production URL
4. Deploy with new environment variables

### Production to Local
1. Switch schema: `npm run db:mysql`
2. Update `DATABASE_URL` to MySQL connection string
3. Update `NEXTAUTH_URL` to `http://localhost:3000`
4. Run `npm run db:generate` and `npm run db:push`

## 🎯 Quick Start Commands

```bash
# For local development
npm run db:mysql
# Update .env.local with MySQL credentials
npm run db:generate
npm run db:push
npm run dev

# For production deployment
npm run db:postgresql
# Set production environment variables
npm run build
npm run start
``` 