# Railway Deployment Guide for Guhuza Quiz App

## 🚂 **Step-by-Step Railway Deployment**

### **Prerequisites**
- GitHub account with your quiz app repository
- Railway account (free at [railway.app](https://railway.app))

---

## **Step 1: Prepare Your App**

### **1.1 Update Prisma Schema for PostgreSQL**
Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from "mysql" to "postgresql"
  url      = env("DATABASE_URL")
}
```

### **1.2 Create Railway Configuration**
Create `railway.json` in your project root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **1.3 Update package.json Scripts**
Ensure your `package.json` has:
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

---

## **Step 2: Set Up Railway Account**

### **2.1 Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Railway to access your GitHub

### **2.2 Install Railway CLI (Optional)**
```bash
npm install -g @railway/cli
railway login
```

---

## **Step 3: Deploy Your App**

### **3.1 Connect Repository**
1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `GuhuzaQuizApp` repository
4. Click "Deploy Now"

### **3.2 Add PostgreSQL Database**
1. In your project dashboard, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. Note the database connection details

---

## **Step 4: Configure Environment Variables**

### **4.1 Set Database URL**
1. In Railway dashboard, go to your app service
2. Click "Variables" tab
3. Add environment variable:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ```
   (Railway will provide this automatically)

### **4.2 Add Other Environment Variables**
Add these variables in Railway:
```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app-url.railway.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
RESEND_API_KEY=your-resend-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### **4.3 Generate Secret Keys**
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## **Step 5: Set Up Database**

### **5.1 Run Database Migrations**
1. In Railway dashboard, go to your app service
2. Click "Deployments" tab
3. Click "Deploy" to trigger a new deployment
4. Railway will automatically run `prisma generate` and `prisma db push`

### **5.2 Alternative: Manual Database Setup**
If automatic migration doesn't work:
```bash
# Connect to Railway via CLI
railway login
railway link

# Run migrations
railway run npx prisma db push
railway run npx prisma generate
```

---

## **Step 6: Deploy and Test**

### **6.1 Trigger Deployment**
1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Configure for Railway deployment"
   git push origin main
   ```

2. Railway will automatically deploy from your GitHub repository

### **6.2 Monitor Deployment**
1. Watch the deployment logs in Railway dashboard
2. Check for any build errors
3. Verify the app starts successfully

### **6.3 Test Your App**
1. Click the generated URL in Railway dashboard
2. Test all features:
   - User registration/login
   - Quiz functionality
   - Analytics dashboard
   - PWA installation

---

## **Step 7: Custom Domain (Optional)**

### **7.1 Add Custom Domain**
1. In Railway dashboard, go to your app service
2. Click "Settings" tab
3. Under "Domains", click "Generate Domain"
4. Or add your own custom domain

### **7.2 Update Environment Variables**
Update `NEXTAUTH_URL` with your new domain:
```env
NEXTAUTH_URL=https://your-custom-domain.com
```

---

## **Step 8: Monitoring and Maintenance**

### **8.1 View Logs**
- Go to Railway dashboard
- Click on your app service
- View real-time logs

### **8.2 Monitor Performance**
- Check Railway metrics
- Monitor database usage
- Watch for errors

### **8.3 Update Environment Variables**
- Add/update variables in Railway dashboard
- Redeploy after changes

---

## **🚨 Troubleshooting**

### **Common Issues:**

#### **1. Build Failures**
```bash
# Check build logs in Railway dashboard
# Common fixes:
npm install
npm run build
```

#### **2. Database Connection Issues**
```bash
# Verify DATABASE_URL format
# Test connection locally
npx prisma db push
```

#### **3. Environment Variables**
- Ensure all required variables are set
- Check variable names (case-sensitive)
- Redeploy after adding variables

#### **4. PWA Issues**
- Verify HTTPS is working
- Check manifest.json is accessible
- Test PWA installation

### **Debug Commands:**
```bash
# Connect to Railway and run commands
railway run npm run build
railway run npx prisma db push
railway run npm start
```

---

## **💰 Cost Management**

### **Railway Free Tier:**
- $5 credit monthly
- Enough for small to medium apps
- Automatic scaling

### **Monitor Usage:**
- Check usage in Railway dashboard
- Set up usage alerts
- Optimize if needed

---

## **🎯 Success Checklist**

- [ ] App deploys successfully
- [ ] Database connects and migrations run
- [ ] User authentication works
- [ ] Quiz functionality works
- [ ] Analytics tracking works
- [ ] PWA installation works
- [ ] Custom domain configured (optional)
- [ ] Environment variables set correctly
- [ ] Performance monitoring active

---

## **🔗 Useful Links**

- [Railway Dashboard](https://railway.app/dashboard)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

---

**Your quiz app will be live at: `https://your-app-name.railway.app`** 🎉 