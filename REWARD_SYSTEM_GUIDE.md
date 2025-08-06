# 🏆 Guhuza Quiz App - Reward System Guide

## Overview

The Guhuza Quiz App features a comprehensive reward system that motivates players to progress through levels and achieve milestones. This guide explains how the reward claiming system works and how to implement it effectively.

## 🎯 Reward System Features

### 1. **Milestone-Based Rewards**
- Rewards are tied to specific level milestones
- Players must reach a certain level to unlock rewards
- Each milestone has unique rewards and point values

### 2. **Dynamic Point Calculation**
- Base reward points: `Milestone_ID * 100`
- Level bonus: `Math.floor(Player_Level / 5) * 50`
- Total points = Base + Level bonus

### 3. **Reward Validation**
- ✅ Level requirement check
- ✅ Duplicate claim prevention
- ✅ Real-time validation
- ✅ Error handling and user feedback

### 4. **Reward History Tracking**
- Complete history of all claimed rewards
- Points earned tracking
- Timestamp and milestone details
- Visual reward timeline

## 🚀 How to Use the Reward System

### For Players

#### **Claiming Rewards**
1. **Navigate to Profile** → Click "Claim Reward" button
2. **Visit Rewards Center** → Go to `/reward` page
3. **Check Requirements** → Ensure you meet the level requirement
4. **Click Claim** → Receive points and unlock next milestone

#### **Reward Types**
- 🏆 **Milestone Rewards**: Level-based achievements
- 🔥 **Streak Rewards**: Daily login bonuses (future)
- ⭐ **Special Rewards**: Event-based rewards (future)

### For Developers

#### **API Endpoints**

**Claim Reward (POST)**
```typescript
POST /api/reward
{
  "playerId": number,
  "nextMilestone": number
}
```

**Get Available Rewards (GET)**
```typescript
GET /api/reward?playerId={playerId}
```

#### **Database Schema**

**RewardClaim Table**
```sql
CREATE TABLE RewardClaim (
  Claim_ID INT PRIMARY KEY AUTO_INCREMENT,
  Player_ID INT,
  Milestone_Id INT,
  Points_Awarded INT,
  Claimed_At DATETIME DEFAULT NOW(),
  Reward_Type VARCHAR(50) DEFAULT 'milestone',
  Reward_Data TEXT,
  FOREIGN KEY (Player_ID) REFERENCES player(Player_ID),
  FOREIGN KEY (Milestone_Id) REFERENCES milestone(Milestone_Id)
);
```

## 🛠️ Implementation Details

### **Frontend Components**

#### **1. EnhancedProfileSection.tsx**
- Inline reward claiming functionality
- Real-time validation and feedback
- Toast notifications for success/error states

#### **2. RewardCopy.tsx (Rewards Center)**
- Comprehensive rewards dashboard
- All available rewards display
- Reward history and statistics
- Beautiful UI with animations

#### **3. RewardHistory.tsx**
- Displays reward claim history
- Points earned tracking
- Visual timeline of achievements

### **Backend API**

#### **Reward Validation Logic**
```typescript
// Check level requirement
if (currentPlayer.Level_Id < currentPlayer.milestone?.UnlockingLevel) {
  return { success: false, message: "Level requirement not met" };
}

// Check if already claimed
if (currentPlayer.Milestone_Id >= nextMilestone) {
  return { success: false, message: "Already claimed" };
}
```

#### **Point Calculation**
```typescript
function calculateRewardPoints(milestoneId: number, playerLevel: number): number {
  const baseReward = milestoneId * 100;
  const levelBonus = Math.floor(playerLevel / 5) * 50;
  return baseReward + levelBonus;
}
```

## 📊 Reward Statistics

### **Available Data**
- Total rewards available
- Rewards claimed by player
- Points earned from rewards
- Reward claim history
- Milestone progress tracking

### **Analytics Integration**
- Reward claim frequency
- Player engagement metrics
- Milestone completion rates
- Points distribution analysis

## 🎨 UI/UX Features

### **Visual Elements**
- 🎁 Reward claim buttons with animations
- 🏆 Milestone achievement cards
- 📊 Progress indicators
- 🎯 Level requirement displays
- ✅ Success/error notifications

### **User Experience**
- **Immediate Feedback**: Toast notifications for all actions
- **Progress Tracking**: Visual progress bars and statistics
- **Accessibility**: Clear labels and intuitive navigation
- **Responsive Design**: Works on all device sizes

## 🔧 Configuration Options

### **Reward Types**
```typescript
type RewardType = 
  | "milestone"    // Level-based rewards
  | "streak"       // Daily login rewards
  | "special"      // Event-based rewards
  | "achievement"  // Skill-based rewards
```

### **Customizable Settings**
- Point calculation formulas
- Level requirements
- Reward descriptions
- Milestone links and CTAs
- Notification preferences

## 🚀 Future Enhancements

### **Planned Features**
1. **Streak Rewards**: Daily login bonuses
2. **Special Events**: Limited-time rewards
3. **Achievement System**: Skill-based rewards
4. **Social Rewards**: Referral bonuses
5. **Seasonal Events**: Holiday-themed rewards

### **Advanced Features**
- **Reward Bundles**: Multiple rewards at once
- **Reward Trading**: Exchange rewards between players
- **Reward Marketplace**: Purchase rewards with points
- **Reward Challenges**: Time-limited achievements

## 🐛 Troubleshooting

### **Common Issues**

#### **"Level requirement not met"**
- Check player's current level
- Verify milestone unlocking level
- Ensure level progression is working

#### **"Already claimed" error**
- Check player's milestone ID
- Verify reward claim history
- Reset milestone if needed for testing

#### **Points not updating**
- Check database transaction
- Verify point calculation
- Ensure player data refresh

### **Debug Commands**
```sql
-- Check player's current milestone
SELECT Player_ID, Level_Id, Milestone_Id FROM player WHERE Player_ID = ?;

-- View reward history
SELECT * FROM RewardClaim WHERE Player_ID = ? ORDER BY Claimed_At DESC;

-- Check available milestones
SELECT * FROM milestone WHERE UnlockingLevel <= ? ORDER BY Milestone_Id;
```

## 📝 Best Practices

### **For Players**
1. **Regular Check-ins**: Visit rewards center frequently
2. **Level Progression**: Focus on completing levels to unlock rewards
3. **Point Management**: Track your earned points and progress
4. **Social Sharing**: Share achievements with friends

### **For Developers**
1. **Data Validation**: Always validate input data
2. **Error Handling**: Provide clear error messages
3. **Performance**: Optimize database queries
4. **Security**: Validate user permissions
5. **Testing**: Test all reward scenarios

## 🎯 Success Metrics

### **Key Performance Indicators**
- **Reward Claim Rate**: Percentage of available rewards claimed
- **Player Engagement**: Time spent in rewards center
- **Level Progression**: Correlation with reward claims
- **User Retention**: Impact of rewards on player retention

### **Analytics Tracking**
```typescript
// Track reward claim events
analytics.track('reward_claimed', {
  playerId: player.Player_ID,
  milestoneId: milestone.Milestone_Id,
  pointsAwarded: rewardPoints,
  playerLevel: player.Level_Id
});
```

---

## 🎉 Conclusion

The Guhuza Quiz App reward system provides a comprehensive solution for motivating player engagement and progression. With its robust validation, beautiful UI, and extensive tracking capabilities, it creates an engaging experience that encourages continued participation and achievement.

For questions or support, please refer to the development team or check the API documentation for technical details. 