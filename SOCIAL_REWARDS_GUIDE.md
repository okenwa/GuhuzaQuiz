# Social Rewards System Guide

## Overview

The Guhuza Quiz App now includes a comprehensive social rewards system that incentivizes users to share their achievements and invite friends to join the platform. This system tracks social activities and rewards users with points for their engagement.

## Features

### 1. Social Sharing Rewards
- **Multi-platform Support**: Facebook, Twitter, LinkedIn, TikTok, WhatsApp
- **Daily Limits**: 5 shares per platform per day
- **Platform-specific Rewards**: Different point values based on platform reach
- **Automatic Tracking**: Shares are automatically recorded when users click share buttons

### 2. Friend Invitation Rewards
- **Email Invitations**: Send invites directly to friends via email
- **Referral Codes**: Unique codes for tracking successful referrals
- **Invitation Limits**: Maximum 10 active invitations per user
- **Bonus Rewards**: Additional points when invitees complete their first quiz

### 3. Real-time Statistics
- **Activity Dashboard**: View today's shares and total activity
- **Progress Tracking**: Monitor pending and accepted invitations
- **Reward History**: Complete history of all social rewards earned

## Reward Structure

### Sharing Rewards
| Platform | Base Points | Multiplier | Total Points |
|----------|-------------|------------|--------------|
| Facebook | 50 | 1.0x | 50 |
| Twitter | 50 | 1.0x | 50 |
| LinkedIn | 50 | 1.2x | 60 |
| TikTok | 50 | 1.5x | 75 |
| WhatsApp | 50 | 0.8x | 40 |

### Invitation Rewards
- **Base Reward**: 200 points per invitation sent
- **Bonus Reward**: 100 points when invitee completes first quiz
- **Maximum Invites**: 10 active invitations per user

## Database Schema

### New Tables

#### SocialShare
```sql
CREATE TABLE SocialShare (
  Share_ID        INT PRIMARY KEY AUTO_INCREMENT,
  Player_ID       INT NOT NULL,
  Platform        VARCHAR(50) NOT NULL,
  Share_Content   TEXT NOT NULL,
  Share_Url       VARCHAR(500),
  Shared_At       DATETIME DEFAULT CURRENT_TIMESTAMP,
  Points_Earned   INT DEFAULT 0,
  FOREIGN KEY (Player_ID) REFERENCES player(Player_ID) ON DELETE CASCADE
);
```

#### FriendInvite
```sql
CREATE TABLE FriendInvite (
  Invite_ID       INT PRIMARY KEY AUTO_INCREMENT,
  Player_ID       INT NOT NULL,
  Invitee_Email   VARCHAR(255) NOT NULL,
  Invitee_Name    VARCHAR(255),
  Referral_Code   VARCHAR(100) NOT NULL,
  Invited_At      DATETIME DEFAULT CURRENT_TIMESTAMP,
  Accepted_At     DATETIME,
  Accepted_By     INT,
  Points_Earned   INT DEFAULT 0,
  Status          VARCHAR(20) DEFAULT 'pending',
  FOREIGN KEY (Player_ID) REFERENCES player(Player_ID) ON DELETE CASCADE
);
```

### Updated Tables

#### player
Added new fields:
- `sharesCount`: Total number of shares made
- `invitesCount`: Total number of invitations sent
- `lastShareAt`: Timestamp of last share
- `lastInviteAt`: Timestamp of last invitation

#### RewardClaim
Updated to support social rewards:
- `Milestone_Id`: Now optional (for non-milestone rewards)
- `Reward_Type`: Extended to include 'share' and 'invite'

## API Endpoints

### POST /api/social-rewards
Record a social share or invitation.

**Request Body:**
```json
{
  "playerId": 123,
  "action": "share" | "invite",
  "platform": "facebook" | "twitter" | "linkedin" | "tiktok" | "whatsapp",
  "content": "Share content text",
  "url": "https://example.com",
  "inviteeEmail": "friend@example.com",
  "inviteeName": "Friend Name"
}
```

**Response:**
```json
{
  "success": true,
  "pointsEarned": 50,
  "totalPoints": 1250,
  "message": "Share recorded successfully! +50 points",
  "data": {
    "platform": "facebook",
    "dailyShares": 1,
    "dailyLimit": 5
  }
}
```

### GET /api/social-rewards?playerId=123
Get social activity statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "player": {
      "Player_ID": 123,
      "sharesCount": 15,
      "invitesCount": 3,
      "lastShareAt": "2024-01-15T10:30:00Z",
      "lastInviteAt": "2024-01-14T15:45:00Z"
    },
    "todayShares": {
      "facebook": 2,
      "twitter": 1,
      "linkedin": 0
    },
    "pendingInvites": 2,
    "acceptedInvites": 1,
    "recentShares": [...],
    "recentInvites": [...],
    "limits": {
      "share": 5,
      "invite": 10
    }
  }
}
```

## Frontend Integration

### EnhancedProfileSection Component

The main profile component now includes:

1. **Social Sharing Buttons**: Updated to track rewards automatically
2. **Invitation Modal**: Enhanced with reward tracking
3. **Social Stats Dashboard**: Real-time display of activity
4. **Reward Information**: Clear display of point values and limits

### Key Functions

#### handleSocialShare(platform)
```typescript
const handleSocialShare = async (platform: string) => {
  // Record share in database
  const response = await fetch("/api/social-rewards", {
    method: "POST",
    body: JSON.stringify({
      playerId: player.Player_ID,
      action: "share",
      platform,
      content: shareContent,
      url: shareLink
    })
  });
  
  // Show success message and update stats
  if (data.success) {
    setToast({ message: `🎉 Shared on ${platform}! +${data.pointsEarned} points earned!` });
    fetchSocialStats();
  }
};
```

#### handleSendInvite()
```typescript
const handleSendInvite = async (e: React.FormEvent) => {
  // Validate email and send invitation
  const response = await fetch("/api/social-rewards", {
    method: "POST",
    body: JSON.stringify({
      playerId: player.Player_ID,
      action: "invite",
      inviteeEmail: inviteEmail,
      inviteeName: inviteeName
    })
  });
  
  // Show success message and update stats
  if (data.success) {
    setToast({ message: `🎉 Invite sent! +${data.pointsEarned} points earned!` });
    fetchSocialStats();
  }
};
```

## User Experience

### Sharing Flow
1. User clicks share button on any platform
2. Share dialog opens automatically
3. Share is recorded in database
4. Points are awarded immediately
5. Success toast notification appears
6. Social stats update in real-time

### Invitation Flow
1. User opens "Invite Friends" modal
2. Enters friend's email address
3. System validates email format
4. Invitation is sent and recorded
5. Points are awarded immediately
6. Success notification appears
7. Social stats update

### Statistics Display
- **Activity Summary**: Total shares and invites
- **Today's Activity**: Platform-specific share counts
- **Invitation Status**: Pending and accepted invites
- **Reward Information**: Point values and limits

## Configuration

### Reward Configuration
Located in `/api/social-rewards/route.ts`:

```typescript
const REWARD_CONFIG = {
  share: {
    basePoints: 50,
    dailyLimit: 5,
    platforms: {
      facebook: { multiplier: 1.0 },
      twitter: { multiplier: 1.0 },
      linkedin: { multiplier: 1.2 },
      tiktok: { multiplier: 1.5 },
      whatsapp: { multiplier: 0.8 }
    }
  },
  invite: {
    basePoints: 200,
    bonusPoints: 100,
    maxInvites: 10
  }
};
```

### Customization Options
- **Point Values**: Adjust base points and multipliers
- **Daily Limits**: Change share limits per platform
- **Invitation Limits**: Modify maximum invitations
- **Platform Support**: Add or remove social platforms

## Security & Validation

### Input Validation
- Email format validation for invitations
- Platform validation for shares
- Content length limits
- Rate limiting for API calls

### Anti-Abuse Measures
- Daily limits per platform
- Maximum invitation limits
- Duplicate invitation prevention
- Content filtering

### Data Privacy
- Email addresses stored securely
- Share content logged for moderation
- User consent for data collection
- GDPR compliance considerations

## Future Enhancements

### Planned Features
1. **Social Leaderboards**: Compare social activity with friends
2. **Achievement Badges**: Special badges for social milestones
3. **Referral Trees**: Track multi-level referrals
4. **Social Challenges**: Time-limited social events
5. **Analytics Dashboard**: Detailed social activity insights

### Technical Improvements
1. **Real-time Updates**: WebSocket integration for live stats
2. **Mobile Optimization**: Enhanced mobile sharing experience
3. **Deep Linking**: Direct links to specific achievements
4. **Social Proof**: Display of recent shares and invites
5. **A/B Testing**: Test different reward structures

## Troubleshooting

### Common Issues

#### Shares Not Recording
- Check browser console for errors
- Verify API endpoint is accessible
- Ensure user is authenticated
- Check daily limits haven't been reached

#### Invitations Not Sending
- Validate email format
- Check invitation limits
- Verify email service configuration
- Ensure referral code generation

#### Stats Not Updating
- Refresh social stats manually
- Check network connectivity
- Verify database connection
- Clear browser cache

### Debug Information
- API response logging
- Database query monitoring
- User activity tracking
- Error reporting system

## Best Practices

### For Users
1. **Share Regularly**: Maximize daily rewards
2. **Invite Quality Contacts**: Focus on engaged users
3. **Use Multiple Platforms**: Diversify social presence
4. **Track Progress**: Monitor social stats regularly

### For Developers
1. **Monitor Performance**: Track API response times
2. **Validate Data**: Ensure data integrity
3. **Handle Errors Gracefully**: Provide clear error messages
4. **Test Thoroughly**: Verify all platforms work correctly

## Support

For technical support or questions about the social rewards system:
- Check this documentation first
- Review API response logs
- Test with different user accounts
- Contact development team for issues

---

*This guide covers the complete social rewards system implementation. For updates and changes, refer to the latest version of this document.* 