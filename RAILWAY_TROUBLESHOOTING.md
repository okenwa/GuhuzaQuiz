# Railway Deployment Troubleshooting

## 🚨 **Prisma Import Error Fix**

### **Error: `'prisma' is not exported from '@/lib/prisma'`**

This error occurs because of incorrect import/export patterns. Here's how to fix it:

### **Step 1: Fix lib/prisma.ts**
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
export default prisma;
```

### **Step 2: Fix Import Statements**
All files should use default import:
```typescript
// ✅ Correct
import prisma from "@/lib/prisma";

// ❌ Incorrect
import { prisma } from "@/lib/prisma";
```

### **Step 3: Update package.json**
Add postinstall script:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  }
}
```

---

## 🔧 **Common Railway Deployment Issues**

### **1. Database Connection Issues**

**Error**: `Can't reach database server`

**Solution**:
1. Ensure PostgreSQL database is created in Railway
2. Check DATABASE_URL environment variable
3. Verify database is in same project as app

```bash
# Test database connection
railway run npx prisma db push
```

### **2. Build Failures**

**Error**: `Build failed`

**Solution**:
1. Check build logs in Railway dashboard
2. Ensure all dependencies are in package.json
3. Verify TypeScript compilation

```bash
# Test build locally
npm run build
```

### **3. Environment Variables**

**Error**: `Environment variable not found`

**Solution**:
1. Add all required variables in Railway dashboard
2. Check variable names (case-sensitive)
3. Redeploy after adding variables

**Required Variables**:
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-app.railway.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### **4. Prisma Schema Issues**

**Error**: `Schema validation failed`

**Solution**:
1. Update schema for PostgreSQL
2. Run migrations
3. Generate Prisma client

```bash
# Update schema
npx prisma db push
npx prisma generate
```

---

## 🚀 **Deployment Checklist**

### **Before Deployment**:
- [ ] Prisma schema updated for PostgreSQL
- [ ] All imports use default import for prisma
- [ ] package.json has postinstall script
- [ ] Environment variables prepared
- [ ] App builds locally

### **During Deployment**:
- [ ] Database created in Railway
- [ ] Environment variables set
- [ ] Build completes successfully
- [ ] App starts without errors
- [ ] Database migrations run

### **After Deployment**:
- [ ] App accessible via URL
- [ ] Database connection works
- [ ] User registration works
- [ ] Quiz functionality works
- [ ] Analytics tracking works

---

## 🛠️ **Debug Commands**

### **Local Testing**:
```bash
# Test build
npm run build

# Test database connection
npx prisma db push

# Test app start
npm start
```

### **Railway Debugging**:
```bash
# Connect to Railway
railway login
railway link

# Run commands on Railway
railway run npm run build
railway run npx prisma db push
railway run npx prisma generate

# View logs
railway logs
```

---

## 📋 **Environment Variables Template**

Create `.env.local` with these variables:
```env
# Database (Railway will provide)
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
NEXTAUTH_SECRET=your-generated-secret-key
NEXTAUTH_URL=https://your-app.railway.app

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Email (optional)
RESEND_API_KEY=your-resend-api-key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 🔍 **Log Analysis**

### **Common Log Patterns**:

**Build Success**:
```
✓ Compiled successfully
✓ Ready to start
```

**Prisma Success**:
```
Generated Prisma Client
Database connection successful
```

**Deployment Success**:
```
Listening on port 3000
Ready - started server on 0.0.0.0:3000
```

---

## 🆘 **Getting Help**

### **Railway Support**:
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)

### **Next.js Support**:
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Community](https://github.com/vercel/next.js/discussions)

### **Prisma Support**:
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma GitHub](https://github.com/prisma/prisma)

---

**Remember**: Always check the Railway deployment logs for specific error messages! 🔍 