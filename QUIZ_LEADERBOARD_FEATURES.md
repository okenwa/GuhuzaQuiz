# Dynamic Leaderboard During Quiz Sessions

## Overview
The quiz app now displays a dynamic, real-time leaderboard while users are actively taking quizzes. This provides immediate feedback and competitive motivation during the quiz experience.

## Features

### 🖥️ **Desktop Experience**
- **Sidebar Leaderboard**: Compact widget displayed on the right side of the quiz interface
- **Real-time Updates**: Refreshes every 10 seconds during quiz sessions
- **Live Animations**: Visual feedback when scores or positions change
- **User Highlighting**: Current user is highlighted in blue
- **Medal System**: Gold, silver, and bronze medals for top 3 positions

### 📱 **Mobile Experience**
- **Toggle Button**: "Leaderboard" button in the quiz controls
- **Floating Action Button**: Always-visible floating button for quick access
- **Modal Overlay**: Full-screen leaderboard popup on mobile devices
- **Touch-Friendly**: Optimized for mobile interactions

### ⚡ **Real-time Features**
- **Live Updates**: Every 10 seconds during quiz
- **Position Animations**: 
  - Green bounce animation when moving up
  - Red pulse animation when moving down
  - Yellow pulse for score updates
- **Score Notifications**: Pop-up notifications when user earns points
- **Live Indicator**: Green pulsing dot showing real-time status

## Components

### QuizLeaderboardWidget
- **Location**: `app/components/QuizLeaderboardWidget.tsx`
- **Purpose**: Compact leaderboard for quiz sessions
- **Features**:
  - Top 5 players display
  - User rank indicator (if not in top 5)
  - Real-time animations
  - Responsive design
  - Live update indicator

### Integration Points
- **QuizPageSection**: Main quiz interface integration
- **Mobile Overlay**: Modal for mobile devices
- **Floating Button**: Always-accessible on mobile

## User Experience

### During Quiz
1. **Desktop**: Leaderboard visible on right sidebar
2. **Mobile**: Access via toggle button or floating action button
3. **Real-time Updates**: See live changes every 10 seconds
4. **Score Feedback**: Immediate notifications for points earned
5. **Competitive Motivation**: See how you rank against others

### Visual Feedback
- **Position Changes**: Animated indicators for rank changes
- **Score Updates**: Yellow highlight when scores increase
- **User Position**: Blue highlighting for current user
- **Live Status**: Green pulsing indicator

## Technical Implementation

### Update Frequency
- **Quiz Sessions**: Every 10 seconds (more frequent for engagement)
- **Regular Pages**: Every 15-30 seconds
- **Manual Refresh**: Available via API calls

### Performance Optimizations
- **Efficient Polling**: Smart interval management
- **Animation Cleanup**: Automatic cleanup after 2 seconds
- **Mobile Optimization**: Reduced animations on mobile
- **Memory Management**: Proper cleanup on component unmount

### API Integration
- **GET /api/leaderboard**: Fetches top players
- **GET /api/leaderboard/rank**: Gets user's current rank
- **Real-time Updates**: Automatic polling during quiz

## Mobile-Specific Features

### Floating Action Button
- **Position**: Bottom-right corner
- **Always Visible**: During entire quiz session
- **Quick Access**: One-tap leaderboard access
- **Visual Design**: Green color with chart icon

### Modal Overlay
- **Full Screen**: Takes entire mobile viewport
- **Backdrop**: Semi-transparent black background
- **Close Button**: X button in top-right corner
- **Responsive**: Adapts to different screen sizes

### Touch Interactions
- **Large Touch Targets**: Easy to tap buttons
- **Swipe Gestures**: Can be added for future enhancements
- **Haptic Feedback**: Ready for mobile vibration feedback

## Benefits

### User Engagement
- **Competitive Motivation**: See real-time rankings
- **Immediate Feedback**: Know your position instantly
- **Social Aspect**: Compare with other players
- **Achievement Tracking**: Visual progress indicators

### Learning Enhancement
- **Goal Setting**: Clear targets to beat
- **Progress Tracking**: See improvement over time
- **Motivation**: Competitive element increases engagement
- **Feedback Loop**: Immediate response to performance

### Technical Advantages
- **Real-time Data**: Live leaderboard updates
- **Responsive Design**: Works on all devices
- **Performance Optimized**: Efficient updates
- **Scalable**: Can handle many concurrent users

## Future Enhancements

### Planned Features
1. **WebSocket Integration**: True real-time without polling
2. **Push Notifications**: Browser notifications for rank changes
3. **Sound Effects**: Audio feedback for score updates
4. **Advanced Animations**: More sophisticated visual effects
5. **Social Features**: Challenge friends, share achievements

### Potential Improvements
1. **Customizable Updates**: User-controlled refresh frequency
2. **Filtering Options**: Filter by level, time period, etc.
3. **Historical Data**: Show position changes over time
4. **Achievement Badges**: Special indicators for milestones
5. **Leaderboard Categories**: Different rankings (speed, accuracy, etc.)

## Usage Examples

### Basic Implementation
```tsx
// In quiz component
<QuizLeaderboardWidget />
```

### Mobile Integration
```tsx
// Toggle button
<button onClick={() => setShowLeaderboard(!showLeaderboard)}>
  Leaderboard
</button>

// Modal overlay
{showLeaderboard && (
  <div className="modal">
    <QuizLeaderboardWidget />
  </div>
)}
```

### Custom Styling
```css
/* Custom leaderboard styling */
.quiz-leaderboard {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
}
```

## Configuration

### Update Intervals
- **Quiz Mode**: 10 seconds
- **Regular Mode**: 15-30 seconds
- **Manual Refresh**: On-demand

### Animation Durations
- **Position Changes**: 2 seconds
- **Score Updates**: 2 seconds
- **Fade Effects**: 300ms

### Mobile Settings
- **Floating Button**: Always visible
- **Modal Size**: Responsive to screen
- **Touch Targets**: Minimum 44px 