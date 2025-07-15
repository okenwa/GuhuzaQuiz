# Guhuza Quiz App

An interactive quiz application with leaderboards, achievements, and Progressive Web App (PWA) support.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd GuhuzaQuizApp
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# Add your database URL, auth secrets, etc.
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### Running in Production Mode
```bash
# Build the application
npm run build

# Start the production server
npm run start
```

## 📱 PWA (Progressive Web App) Features

Your app is configured as a Progressive Web App, which means users can install it on their mobile devices!

### PWA Features Enabled:
- ✅ **Installable** - Users can add to home screen
- ✅ **Offline Support** - Cached content works without internet
- ✅ **App-like Experience** - Full-screen mode, no browser UI
- ✅ **Fast Loading** - Service worker caches assets
- ✅ **Mobile Optimized** - Responsive design for all devices

### Testing PWA Features:

#### 1. **Install Prompt**
- Visit the app on a mobile device or desktop
- Look for the install prompt at the bottom of the screen
- Click "Install" to add to home screen

#### 2. **Mobile Testing**
```bash
# Start the development server
npm run dev

# On your mobile device:
# 1. Make sure your phone and computer are on the same WiFi
# 2. Find your computer's IP address (e.g., 192.168.1.100)
# 3. Visit http://192.168.1.100:3000 on your phone
# 4. You should see the install prompt!
```

#### 3. **Desktop Testing**
- Open Chrome/Edge
- Visit `http://localhost:3000`
- Look for the install icon in the address bar
- Click to install the app

### PWA Configuration Files:
- `next.config.mjs` - PWA plugin configuration
- `public/manifest.json` - App metadata and icons
- `app/layout.tsx` - PWA meta tags and viewport settings
- `app/components/PWAInstallPrompt.tsx` - Install prompt component

## 🎮 App Features

### Core Features:
- **Quiz System** - Multiple levels with progressive difficulty
- **Leaderboard** - Real-time rankings and user scores
- **User Profiles** - Customizable profiles with achievements
- **Achievement System** - Badges and milestones
- **Sound Effects** - Immersive audio experience
- **Progress Saving** - Resume quizzes where you left off

### User Experience:
- **Responsive Design** - Works on all screen sizes
- **Smooth Animations** - Framer Motion powered transitions
- **Real-time Updates** - Live leaderboard and progress
- **Offline Support** - PWA caching for better performance

## 🗄️ Database

### Prisma Schema
The app uses Prisma with the following main models:
- `User` - User accounts and profiles
- `Quiz` - Quiz questions and answers
- `Player` - Player progress and scores
- `Leaderboard` - Rankings and statistics

### Database Commands:
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name migration_name

# Deploy migrations to production
npx prisma migrate deploy
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:

```env
# Database
DATABASE_URL="your-database-url"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (for notifications)
RESEND_API_KEY="your-resend-api-key"

# External Services
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### PWA Configuration
The PWA is configured in `next.config.mjs`:
- Service worker caching
- Offline support
- Install prompts
- App manifest

## 📱 Mobile App Development

### React Native Migration
If you want to create a native mobile app, see `REACT_NATIVE_MIGRATION.md` for detailed instructions.

### Current PWA Benefits:
- ✅ **No App Store Approval** - Instant deployment
- ✅ **Cross-Platform** - Works on iOS and Android
- ✅ **Easy Updates** - No app store updates needed
- ✅ **Web Technologies** - Use existing React/Next.js skills

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean
- AWS Amplify

### Production Checklist:
- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Test PWA installation
- [ ] Verify mobile responsiveness
- [ ] Check offline functionality
- [ ] Test all quiz features

## 🧪 Testing

### Manual Testing
1. **Quiz Flow** - Complete quizzes and check scoring
2. **Leaderboard** - Verify rankings update correctly
3. **User Profiles** - Test profile updates and achievements
4. **PWA Features** - Test installation and offline mode
5. **Mobile Experience** - Test on various devices

### Automated Testing
```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

## 📊 Performance

### Optimization Features:
- **Image Optimization** - Next.js automatic image optimization
- **Code Splitting** - Automatic bundle splitting
- **Service Worker** - PWA caching for faster loads
- **Lazy Loading** - Components load on demand

### Performance Monitoring:
- Use Chrome DevTools Lighthouse for PWA scores
- Monitor Core Web Vitals
- Check mobile performance

## 🐛 Troubleshooting

### Common Issues:

#### PWA Not Installing
- Ensure HTTPS in production
- Check manifest.json is valid
- Verify service worker is registered

#### Database Connection Issues
```bash
# Check database connection
npx prisma db pull

# Reset database if needed
npx prisma migrate reset
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

#### Mobile Testing Issues
- Ensure same WiFi network
- Check firewall settings
- Use ngrok for external access: `npx ngrok http 3000`

## 📚 API Documentation

### Authentication Endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Quiz Endpoints:
- `GET /api/quiz` - Get quiz questions
- `POST /api/updateScore` - Update user score
- `GET /api/leaderboard` - Get leaderboard data

### User Endpoints:
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/reward` - Get user achievements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Open an issue on GitHub

---

**Happy Quizzing! 🎉**
