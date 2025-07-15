# Analytics & Performance Monitoring Setup

## 🎯 Overview

Your Guhuza Quiz App now includes comprehensive analytics tracking and performance monitoring to help you understand user behavior and optimize app performance.

## 📊 Analytics Features Implemented

### 1. **Google Analytics 4 Integration**
- ✅ Page view tracking
- ✅ Custom event tracking
- ✅ User engagement metrics
- ✅ Real-time data collection

### 2. **Quiz-Specific Tracking**
- ✅ Quiz start/completion rates
- ✅ Answer submission tracking
- ✅ Time spent per question
- ✅ Level progression tracking
- ✅ Achievement earning events
- ✅ Sound toggle interactions
- ✅ Share actions

### 3. **Performance Monitoring**
- ✅ Core Web Vitals tracking
- ✅ Page load time monitoring
- ✅ Memory usage tracking
- ✅ Network latency measurement
- ✅ Real-time performance dashboard

### 4. **Analytics Dashboard**
- ✅ User engagement metrics
- ✅ Quiz completion rates
- ✅ Level performance analysis
- ✅ Achievement distribution
- ✅ Daily activity trends

## 🚀 Quick Setup

### 1. **Environment Variables**
Add to your `.env.local`:
```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. **Get Google Analytics ID**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your quiz app
3. Copy the Measurement ID (starts with G-)
4. Add it to your environment variables

### 3. **Test Analytics**
```bash
npm run dev
```
Visit your app and check the browser console for analytics events.

## 📱 Analytics Dashboard

### Access Dashboard
Visit: `http://localhost:3000/analytics`

### Dashboard Features:
- **Key Metrics**: Total users, active users, completions, average score
- **Level Performance**: Completion rates and scores by level
- **Daily Activity**: User engagement over time
- **Achievement Stats**: Most earned achievements
- **Performance Metrics**: Load times and optimization tips

## 🔍 Tracking Events

### Quiz Events
```typescript
// Track quiz start
analytics.trackQuizStart(levelId, levelTitle);

// Track answer submission
analytics.trackAnswerSubmit(levelId, questionIndex, isCorrect, timeToAnswer);

// Track quiz completion
analytics.trackQuizComplete(levelId, score, timeSpent, correctAnswers, totalQuestions);

// Track quiz abandonment
analytics.trackQuizAbandon(levelId, progress, timeSpent);
```

### User Behavior Events
```typescript
// Track level unlock
analytics.trackLevelUnlock(levelId, previousLevelScore);

// Track achievement earned
analytics.trackAchievementEarned(achievementId, achievementName, achievementType);

// Track leaderboard view
analytics.trackLeaderboardView(leaderboardType);

// Track profile update
analytics.trackProfileUpdate(updateType);
```

### Performance Events
```typescript
// Track page load
analytics.trackPageLoad(pageName, loadTime);

// Track errors
analytics.trackError(errorType, errorMessage, pageName);

// Track sound toggle
analytics.trackSoundToggle(isMuted);

// Track share action
analytics.trackShareAction(platform, score, levelTitle);
```

## 📈 Performance Monitoring

### Real-Time Monitor
- Click the performance icon (📊) in the bottom-right corner
- View real-time performance metrics
- Get optimization suggestions

### Metrics Tracked:
- **Page Load Time**: Total time to load the page
- **First Contentful Paint**: Time to first visual content
- **Largest Contentful Paint**: Time to largest content element
- **Network Latency**: Time for network requests
- **Memory Usage**: JavaScript heap usage

### Performance Grades:
- **A**: Excellent performance (< 2.5s LCP)
- **B**: Good performance (2.5s - 4s LCP)
- **C**: Needs improvement (> 4s LCP)

## 🗄️ Database Analytics

### API Endpoint
`GET /api/analytics?timeRange=7d`

### Query Parameters:
- `timeRange`: 7d, 30d, 90d

### Response Data:
```json
{
  "totalUsers": 1250,
  "activeUsers": 342,
  "quizCompletions": 2847,
  "averageScore": 78.5,
  "averageTime": 12.3,
  "completionRate": 85.2,
  "levelPerformance": [...],
  "dailyActivity": [...],
  "achievementStats": [...]
}
```

## 📊 Key Metrics Explained

### User Engagement
- **Total Users**: All registered users
- **Active Users**: Users who took quizzes in the time period
- **Quiz Completions**: Total completed quiz sessions
- **Completion Rate**: Percentage of started quizzes that were completed

### Performance Metrics
- **Average Score**: Mean score across all completed quizzes
- **Average Time**: Mean time spent per quiz
- **Page Load Time**: Time from request to fully loaded page
- **Core Web Vitals**: Google's performance metrics

### Level Analysis
- **Completion Count**: How many times each level was completed
- **Average Score**: Mean score for each level
- **Difficulty Assessment**: Based on completion rates and scores

## 🔧 Customization

### Add Custom Events
```typescript
// In your component
import { useAnalytics } from '../components/AnalyticsProvider';

const analytics = useAnalytics();

// Track custom event
analytics.trackEvent('custom_event', {
  custom_parameter: 'value',
  timestamp: new Date().toISOString(),
});
```

### Modify Dashboard
Edit `app/components/AnalyticsDashboard.tsx` to:
- Add new charts
- Change time ranges
- Customize metrics display
- Add new data sources

### Performance Alerts
```typescript
// Add performance thresholds
const performanceThresholds = {
  pageLoadTime: 3000, // 3 seconds
  lcp: 2500, // 2.5 seconds
  memoryUsage: 50 * 1024 * 1024, // 50MB
};
```

## 📱 Mobile Analytics

### PWA Tracking
- Install prompts tracked automatically
- Offline usage patterns
- App-like experience metrics

### Mobile-Specific Events
- Touch interactions
- Screen orientation changes
- Device performance metrics

## 🚨 Error Tracking

### Automatic Error Capture
- JavaScript errors
- Promise rejections
- Network failures
- Performance issues

### Error Analytics
- Error frequency by type
- Affected pages
- User impact assessment
- Resolution tracking

## 📈 Reporting

### Daily Reports
- User activity summary
- Performance trends
- Error rates
- Engagement metrics

### Weekly Insights
- Level difficulty analysis
- User retention patterns
- Achievement progression
- Performance optimization opportunities

## 🔒 Privacy & Compliance

### Data Collection
- No personally identifiable information (PII) collected
- Anonymous user tracking
- GDPR compliant
- Cookie consent ready

### Data Retention
- Analytics data: 26 months (Google Analytics default)
- Performance data: 90 days
- Error logs: 30 days

## 🛠️ Troubleshooting

### Analytics Not Working
1. Check `NEXT_PUBLIC_GA_ID` environment variable
2. Verify Google Analytics property setup
3. Check browser console for errors
4. Ensure ad blockers are disabled for testing

### Performance Monitor Issues
1. Check browser compatibility
2. Verify Performance API support
3. Check console for errors
4. Ensure HTTPS in production

### Dashboard Not Loading
1. Check API endpoint `/api/analytics`
2. Verify database connection
3. Check Prisma schema
4. Review server logs

## 🎯 Next Steps

### Immediate Actions:
1. Set up Google Analytics property
2. Add GA ID to environment variables
3. Test analytics tracking
4. Review dashboard data

### Optimization:
1. Analyze user behavior patterns
2. Identify performance bottlenecks
3. Optimize slow-loading pages
4. Improve quiz completion rates

### Advanced Features:
1. Set up custom dashboards
2. Configure performance alerts
3. Implement A/B testing
4. Add user segmentation

---

**Need help?** Check the console for analytics events and performance metrics! 