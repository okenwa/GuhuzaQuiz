# Dynamic Leaderboard Features

## Overview
The quiz app now includes a dynamic, real-time leaderboard system that provides live updates and interactive features.

## Components

### 1. RealTimeLeaderBoard
- **Location**: `app/components/RealTimeLeaderBoard.tsx`
- **Features**:
  - Auto-refreshes every 15 seconds
  - Live animations when scores change
  - Position change indicators (green for moving up, red for moving down)
  - Score update animations
  - Toast notifications for score changes
  - Medal emojis for top 3 positions (🥇🥈🥉)
  - User rank display if not in top 5

### 2. DynamicLeaderBoard
- **Location**: `app/components/DynamicLeaderBoard.tsx`
- **Features**:
  - Auto-refreshes every 30 seconds
  - Manual refresh button
  - Last updated timestamp
  - Error handling with retry functionality

### 3. LeaderboardWidget
- **Location**: `app/components/LeaderboardWidget.tsx`
- **Features**:
  - Compact design for smaller spaces
  - Perfect for sidebars or smaller sections
  - Shows top 5 players with user rank if not in top 5

### 4. LeaderboardToast
- **Location**: `app/components/LeaderboardToast.tsx`
- **Features**:
  - Toast notifications for score updates
  - Multiple toast management
  - Auto-dismiss with fade animations
  - Different types: success, error, info

## API Endpoints

### 1. GET /api/leaderboard
- Returns top 10 players sorted by points
- Used by all leaderboard components

### 2. GET /api/leaderboard/rank?playerId={id}
- Returns the rank of a specific player
- Used to show user's position when not in top 5

### 3. POST /api/leaderboard
- Updates a player's score
- Used when quiz scores are submitted

### 4. POST /api/updateScore
- Updates player score and level
- Triggers leaderboard updates

## Custom Hook

### useLeaderboard
- **Location**: `app/hooks/useLeaderboard.ts`
- **Features**:
  - Centralized leaderboard state management
  - Automatic data fetching
  - Error handling
  - User rank calculation
  - Real-time updates

## Usage

### Basic Implementation
```tsx
import RealTimeLeaderBoard from '../components/RealTimeLeaderBoard';

// In your page component
<RealTimeLeaderBoard />
```

### Widget Implementation
```tsx
import LeaderboardWidget from '../components/LeaderboardWidget';

// In sidebar or smaller section
<LeaderboardWidget />
```

### Custom Hook Usage
```tsx
import { useLeaderboard } from '../hooks/useLeaderboard';

function MyComponent() {
  const { displayPlayers, loading, error, userRank } = useLeaderboard();
  // Use the data as needed
}
```

## Features

### Real-time Updates
- Automatic polling every 15-30 seconds
- Manual refresh capability
- Visual indicators for changes

### User Experience
- Loading states with spinners
- Error handling with retry buttons
- Toast notifications for score updates
- Animations for position changes
- Highlighted current user row

### Performance
- Efficient data fetching
- Optimized re-renders
- Cleanup on component unmount

### Responsive Design
- Mobile-friendly table layout
- Responsive text sizing
- Touch-friendly buttons

## Configuration

### Update Intervals
- RealTimeLeaderBoard: 15 seconds
- DynamicLeaderBoard: 30 seconds
- LeaderboardWidget: 30 seconds

### Toast Duration
- Default: 3 seconds
- Configurable per toast

### Animation Duration
- Position change animations: 2 seconds
- Toast fade animations: 300ms

## Future Enhancements

1. **WebSocket Integration**: Real-time updates without polling
2. **Push Notifications**: Browser notifications for score changes
3. **Leaderboard History**: Track position changes over time
4. **Seasonal Leaderboards**: Time-based competitions
5. **Social Features**: Share achievements, challenge friends
6. **Advanced Filtering**: Filter by level, date range, etc. 