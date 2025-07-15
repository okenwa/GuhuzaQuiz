# Railway Deployment Guide

## 🚀 Quick Setup

### 1. Environment Variables Required

Set these environment variables in your Railway project:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth Configuration
NEXTAUTH_URL=https://your-app-name.railway.app
NEXTAUTH_SECRET=your-super-secret-key-here

# External API (if using)
GUHUZA_API=https://your-external-api.com

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. How to Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your service
3. Go to the "Variables" tab
4. Add each variable with its value
5. Click "Save" and redeploy

## 🔧 Database Setup

### PostgreSQL Database
Railway automatically provides a PostgreSQL database. Use the connection string from:
1. Go to your Railway project
2. Click "New" → "Database" → "Add PostgreSQL"
3. Copy the connection string from the database service

### Database Schema
Your app uses PostgreSQL. Make sure your schema is set correctly:
```bash
npm run db:postgresql
```

## 🛠️ Troubleshooting

### Issue 1: Login Redirects to Localhost
**Problem:** After login, users are redirected to `localhost:3000`

**Solution:** 
- Set `NEXTAUTH_URL` to your Railway app URL
- Example: `NEXTAUTH_URL=https://your-app-name.railway.app`

### Issue 2: Server-Side Exceptions on Profile Page
**Problem:** Profile page shows server errors

**Solution:**
- Check that `DATABASE_URL` is correctly set
- Ensure database is accessible
- Check Railway logs for specific error messages

### Issue 3: Database Connection Issues
**Problem:** Can't connect to database

**Solution:**
1. Verify `DATABASE_URL` format: `postgresql://username:password@host:port/database`
2. Check if database service is running in Railway
3. Ensure database has been initialized

### Issue 4: Build Failures
**Problem:** App fails to build

**Solution:**
1. Check Railway build logs
2. Ensure all TypeScript errors are fixed
3. Verify all dependencies are in `package.json`

## 📋 Deployment Checklist

- [ ] Environment variables set in Railway
- [ ] Database service added and running
- [ ] `DATABASE_URL` points to Railway PostgreSQL
- [ ] `NEXTAUTH_URL` set to Railway app URL
- [ ] `NEXTAUTH_SECRET` is a secure random string
- [ ] App builds successfully
- [ ] Database schema is applied
- [ ] Login redirects correctly
- [ ] Profile page loads without errors

## 🔍 Debugging

### Check Railway Logs
1. Go to your Railway service
2. Click on "Deployments"
3. Click on the latest deployment
4. Check "Build Logs" and "Runtime Logs"

### Common Error Messages

**"DATABASE_URL environment variable is required"**
- Set the `DATABASE_URL` environment variable

**"NEXTAUTH_URL environment variable is required"**
- Set the `NEXTAUTH_URL` environment variable

**"Connection refused"**
- Check if database service is running
- Verify connection string format

**"Table does not exist"**
- Run database migrations: `npx prisma db push`

## 🚀 Production Best Practices

1. **Use strong secrets:** Generate a secure `NEXTAUTH_SECRET`
2. **Monitor logs:** Check Railway logs regularly
3. **Database backups:** Railway provides automatic backups
4. **Environment separation:** Use different databases for staging/production

## 📞 Support

If you encounter issues:
1. Check Railway documentation
2. Review build and runtime logs
3. Verify all environment variables are set
4. Test database connectivity 