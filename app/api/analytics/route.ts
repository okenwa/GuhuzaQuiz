import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default: // 7d
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get total users
    const totalUsers = await prisma.player.count();

    // Get active users (users who have taken quizzes in the time range)
    const activeUsers = await prisma.player.count({
      where: {
        lastLogin: {
          gte: startDate,
        },
      },
    });

    // Get quiz completions
    const quizCompletions = await prisma.quizSession.count({
      where: {
        Completed: true,
        Last_Activity: {
          gte: startDate,
        },
      },
    });

    // Get average score
    const scoreData = await prisma.quizSession.aggregate({
      where: {
        Completed: true,
        Last_Activity: {
          gte: startDate,
        },
      },
      _avg: {
        Score: true,
      },
    });

    // Get level performance
    const levelPerformance = await prisma.quizSession.groupBy({
      by: ['Level_Id'],
      where: {
        Completed: true,
        Last_Activity: {
          gte: startDate,
        },
      },
      _count: {
        Session_ID: true,
      },
      _avg: {
        Score: true,
      },
    });

    // Get daily activity
    const dailyActivity = await prisma.quizSession.groupBy({
      by: ['Started_At'],
      where: {
        Started_At: {
          gte: startDate,
        },
      },
      _count: {
        Session_ID: true,
      },
    });

    // Get achievement stats (using reward claims as achievements)
    const achievementStats = await prisma.rewardClaim.groupBy({
      by: ['Reward_Type'],
      _count: {
        Claim_ID: true,
      },
    });

    // Calculate completion rate
    const totalSessions = await prisma.quizSession.count({
      where: {
        Started_At: {
          gte: startDate,
        },
      },
    });

    const completionRate = totalSessions > 0 ? (quizCompletions / totalSessions) * 100 : 0;

    // Calculate average time (mock data for now)
    const averageTime = 12.3; // This would be calculated from actual session data

    const analyticsData = {
      totalUsers,
      activeUsers,
      quizCompletions,
      averageScore: Math.round(scoreData._avg.Score || 0),
      averageTime,
      completionRate: Math.round(completionRate * 10) / 10,
      levelPerformance: levelPerformance.map((level: any) => ({
        levelId: level.Level_Id.toString(),
        levelTitle: `Level ${level.Level_Id}`,
        completions: level._count.Session_ID,
        averageScore: Math.round(level._avg.Score || 0),
        averageTime: 12.3, // Mock data
      })),
      dailyActivity: dailyActivity.map(day => ({
        date: day.Started_At.toISOString().split('T')[0],
        users: day._count.Session_ID, // This is sessions, not unique users
        completions: day._count.Session_ID,
      })),
      achievementStats: achievementStats.map(achievement => ({
        achievementId: achievement.Reward_Type,
        achievementName: `${achievement.Reward_Type} Reward`,
        earnedCount: achievement._count.Claim_ID,
      })),
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 