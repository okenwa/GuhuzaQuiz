import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Reward configuration
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
    bonusPoints: 100, // Bonus when invitee completes first quiz
    maxInvites: 10
  }
};

// POST /api/social-rewards - Record a social share or invite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, action, platform, content, url, inviteeEmail, inviteeName } = body;

    if (!playerId || !action) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 400 });
    }

    // Get player data
    const player = await prisma.player.findUnique({
      where: { Player_ID: parseInt(playerId) }
    });

    if (!player) {
      return NextResponse.json({ 
        success: false, 
        message: 'Player not found' 
      }, { status: 404 });
    }

    let pointsEarned = 0;
    let rewardData = {};

    if (action === 'share') {
      if (!platform || !content) {
        return NextResponse.json({ 
          success: false, 
          message: 'Platform and content required for sharing' 
        }, { status: 400 });
      }

      // Check daily limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayShares = await prisma.socialShare.count({
        where: {
          Player_ID: parseInt(playerId),
          Platform: platform,
          Shared_At: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      if (todayShares >= REWARD_CONFIG.share.dailyLimit) {
        return NextResponse.json({ 
          success: false, 
          message: `Daily limit of ${REWARD_CONFIG.share.dailyLimit} shares reached for ${platform}` 
        }, { status: 429 });
      }

      // Calculate points based on platform
      const platformConfig = REWARD_CONFIG.share.platforms[platform as keyof typeof REWARD_CONFIG.share.platforms];
      if (!platformConfig) {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid platform' 
        }, { status: 400 });
      }

      pointsEarned = Math.floor(REWARD_CONFIG.share.basePoints * platformConfig.multiplier);

      // Record the share
      await prisma.socialShare.create({
        data: {
          Player_ID: parseInt(playerId),
          Platform: platform,
          Share_Content: content,
          Share_Url: url,
          Points_Earned: pointsEarned
        }
      });

      // Update player stats
      await prisma.player.update({
        where: { Player_ID: parseInt(playerId) },
        data: {
          Playerpoint: { increment: pointsEarned },
          sharesCount: { increment: 1 },
          lastShareAt: new Date()
        }
      });

      rewardData = {
        platform,
        content,
        dailyShares: todayShares + 1,
        dailyLimit: REWARD_CONFIG.share.dailyLimit
      };

    } else if (action === 'invite') {
      if (!inviteeEmail) {
        return NextResponse.json({ 
          success: false, 
          message: 'Invitee email required' 
        }, { status: 400 });
      }

      // Check if already invited this email
      const existingInvite = await prisma.friendInvite.findFirst({
        where: {
          Player_ID: parseInt(playerId),
          Invitee_Email: inviteeEmail,
          Status: { not: 'expired' }
        }
      });

      if (existingInvite) {
        return NextResponse.json({ 
          success: false, 
          message: 'Already invited this email' 
        }, { status: 409 });
      }

      // Check invite limit
      const totalInvites = await prisma.friendInvite.count({
        where: {
          Player_ID: parseInt(playerId),
          Status: { not: 'expired' }
        }
      });

      if (totalInvites >= REWARD_CONFIG.invite.maxInvites) {
        return NextResponse.json({ 
          success: false, 
          message: `Maximum invites limit of ${REWARD_CONFIG.invite.maxInvites} reached` 
        }, { status: 429 });
      }

      pointsEarned = REWARD_CONFIG.invite.basePoints;

      // Generate referral code
      const referralCode = `GUHUZA${player.Player_ID}${Date.now()}`;

      // Record the invite
      await prisma.friendInvite.create({
        data: {
          Player_ID: parseInt(playerId),
          Invitee_Email: inviteeEmail,
          Invitee_Name: inviteeName,
          Referral_Code: referralCode,
          Points_Earned: pointsEarned
        }
      });

      // Update player stats
      await prisma.player.update({
        where: { Player_ID: parseInt(playerId) },
        data: {
          Playerpoint: { increment: pointsEarned },
          invitesCount: { increment: 1 },
          lastInviteAt: new Date()
        }
      });

      rewardData = {
        inviteeEmail,
        referralCode,
        totalInvites: totalInvites + 1,
        maxInvites: REWARD_CONFIG.invite.maxInvites
      };

    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid action' 
      }, { status: 400 });
    }

    // Create reward claim record
    await prisma.rewardClaim.create({
      data: {
        Player_ID: parseInt(playerId),
        Points_Awarded: pointsEarned,
        Reward_Type: action,
        Reward_Data: JSON.stringify(rewardData)
      }
    });

    return NextResponse.json({
      success: true,
      pointsEarned,
      totalPoints: player.Playerpoint + pointsEarned,
      message: `${action === 'share' ? 'Share' : 'Invite'} recorded successfully! +${pointsEarned} points`,
      data: rewardData
    });

  } catch (error) {
    console.error('Social rewards error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET /api/social-rewards - Get social activity stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Player ID required' 
      }, { status: 400 });
    }

    // Get player with social stats
    const player = await prisma.player.findUnique({
      where: { Player_ID: parseInt(playerId) },
      include: {
        socialShares: {
          orderBy: { Shared_At: 'desc' },
          take: 10
        },
        friendInvites: {
          orderBy: { Invited_At: 'desc' },
          take: 10
        }
      }
    });

    if (!player) {
      return NextResponse.json({ 
        success: false, 
        message: 'Player not found' 
      }, { status: 404 });
    }

    // Calculate today's shares by platform
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayShares = await prisma.socialShare.groupBy({
      by: ['Platform'],
      where: {
        Player_ID: parseInt(playerId),
        Shared_At: {
          gte: today,
          lt: tomorrow
        }
      },
      _count: {
        Platform: true
      }
    });

    const shareStats = todayShares.reduce((acc, share) => {
      acc[share.Platform] = share._count.Platform;
      return acc;
    }, {} as Record<string, number>);

    // Get pending invites count
    const pendingInvites = await prisma.friendInvite.count({
      where: {
        Player_ID: parseInt(playerId),
        Status: 'pending'
      }
    });

    // Get accepted invites count
    const acceptedInvites = await prisma.friendInvite.count({
      where: {
        Player_ID: parseInt(playerId),
        Status: 'accepted'
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        player: {
          Player_ID: player.Player_ID,
          sharesCount: player.sharesCount,
          invitesCount: player.invitesCount,
          lastShareAt: player.lastShareAt,
          lastInviteAt: player.lastInviteAt
        },
        todayShares: shareStats,
        pendingInvites,
        acceptedInvites,
        recentShares: player.socialShares,
        recentInvites: player.friendInvites,
        limits: {
          share: REWARD_CONFIG.share.dailyLimit,
          invite: REWARD_CONFIG.invite.maxInvites
        }
      }
    });

  } catch (error) {
    console.error('Get social stats error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
} 