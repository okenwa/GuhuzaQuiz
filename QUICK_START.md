# Quick Start Guide - Guhuza Quiz App

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Database (if not already done)
```bash
npx prisma generate
npx prisma migrate dev
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Visit: `http://localhost:3000`

## 📱 Test PWA Features

### Desktop Testing:
1. Open Chrome or Edge
2. Go to `http://localhost:3000`
3. Look for the install icon in the address bar
4. Click to install the app

### Mobile Testing:
1. Make sure your phone and computer are on the same WiFi
2. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
3. On your phone, visit: `http://YOUR_IP:3000`
4. You should see the install prompt at the bottom!

## 🎯 What to Test

### PWA Features:
- ✅ Install prompt appears
- ✅ App can be added to home screen
- ✅ Works offline (after first visit)
- ✅ App-like experience (full screen)

### Quiz Features:
- ✅ Take quizzes
- ✅ Check leaderboard
- ✅ View profile
- ✅ Earn achievements

## 🔧 Troubleshooting

### PWA Not Working?
```bash
# Clear cache and restart
npm run build
npm run start
```

### Database Issues?
```bash
npx prisma studio
# Check if database is connected
```

### Mobile Can't Connect?
- Check firewall settings
- Ensure same WiFi network
- Try using ngrok: `npx ngrok http 3000`

## 📱 PWA Installation Guide

### iOS (Safari):
1. Open the app in Safari
2. Tap the share button (square with arrow)
3. Tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome):
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home screen"
4. Tap "Add"

### Desktop (Chrome/Edge):
1. Look for install icon in address bar
2. Click the install icon
3. Click "Install"

## 🎉 Success!

Your app is now running as a PWA! Users can install it on their devices and use it like a native app.

---

**Need help?** Check the full README.md for detailed documentation. 