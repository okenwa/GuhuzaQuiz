import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { playerId, nextMilestone } = await req.json()
        
        if (!playerId || !nextMilestone) {
            return NextResponse.json(
                { message: "All fields are required", success: false },
                { status: 400 }
            )
        }

        // Get current player data
        const currentPlayer = await prisma.player.findUnique({
            where: { Player_ID: playerId },
            include: {
                milestone: true,
                level: true
            }
        })

        if (!currentPlayer) {
            return NextResponse.json(
                { message: "Player not found", success: false },
                { status: 404 }
            )
        }

        // Validate if player can claim this milestone
        if ((currentPlayer.Level_Id || 0) < (currentPlayer.milestone?.UnlockingLevel || 0)) {
            return NextResponse.json(
                { 
                    message: `You need to reach level ${currentPlayer.milestone?.UnlockingLevel} to claim this reward`, 
                    success: false,
                    requiredLevel: currentPlayer.milestone?.UnlockingLevel,
                    currentLevel: currentPlayer.Level_Id
                },
                { status: 403 }
            )
        }

        // Check if reward already claimed
        if ((currentPlayer.Milestone_Id || 0) >= nextMilestone) {
            return NextResponse.json(
                { 
                    message: "This reward has already been claimed", 
                    success: false,
                    alreadyClaimed: true
                },
                { status: 409 }
            )
        }

        // Get the new milestone data
        const newMilestone = await prisma.milestone.findUnique({
            where: { Milestone_Id: nextMilestone }
        })

        if (!newMilestone) {
            return NextResponse.json(
                { message: "Milestone not found", success: false },
                { status: 404 }
            )
        }

        // Calculate reward points based on milestone
        const rewardPoints = calculateRewardPoints(nextMilestone, currentPlayer.Level_Id || 0)
        
        // Update player with new milestone and reward points
        const updatePlayer = await prisma.player.update({
            where: { 
                Player_ID: playerId
            }, 
            data: { 
                Milestone_Id: nextMilestone,
                Playerpoint: {
                    increment: rewardPoints
                }
            }, 
            include: {
                milestone: true,
                level: true
            }
        })

        // Create reward claim record to track history
        await prisma.rewardClaim.create({
            data: {
                Player_ID: playerId,
                Milestone_Id: nextMilestone,
                Points_Awarded: rewardPoints,
                Reward_Type: "milestone",
                Reward_Data: JSON.stringify({
                    milestoneTitle: newMilestone.Milestone_Title,
                    playerLevel: currentPlayer.Level_Id,
                    milestoneLevel: newMilestone.UnlockingLevel
                })
            }
        })

        return NextResponse.json({ 
            message: "Reward claimed successfully!", 
            success: true,
            player: updatePlayer, 
            nextMilestone: nextMilestone,
            rewardPoints: rewardPoints,
            milestone: newMilestone
        }, { status: 200 })
        
    } catch (e) {
        console.error("Reward claim error:", e)
        return NextResponse.json({ 
            message: "Failed to claim reward", 
            success: false,
            error: e 
        }, { status: 500 })
    }
}

// Helper function to calculate reward points
function calculateRewardPoints(milestoneId: number, playerLevel: number): number {
    // Base reward points for milestone
    const baseReward = milestoneId * 100
    
    // Bonus points for higher levels
    const levelBonus = Math.floor(playerLevel / 5) * 50
    
    // Streak bonus (if you want to include it)
    // const streakBonus = Math.floor(playerStreak / 7) * 25
    
    return baseReward + levelBonus
}

// GET endpoint to check available rewards
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const playerId = searchParams.get('playerId')

        if (!playerId) {
            return NextResponse.json(
                { message: "Player ID is required", success: false },
                { status: 400 }
            )
        }

        const player = await prisma.player.findUnique({
            where: { Player_ID: parseInt(playerId) },
            include: {
                milestone: true,
                level: true
            }
        })

        if (!player) {
            return NextResponse.json(
                { message: "Player not found", success: false },
                { status: 404 }
            )
        }

        // Get all available milestones
        const allMilestones = await prisma.milestone.findMany({
            orderBy: { Milestone_Id: 'asc' }
        })

        // Get reward history
        const rewardHistory = await prisma.rewardClaim.findMany({
            where: { Player_ID: parseInt(playerId) },
            include: {
                milestone: true
            },
            orderBy: { Claimed_At: 'desc' },
            take: 10 // Last 10 rewards
        })

        // Check which rewards are available to claim
        const availableRewards = allMilestones.map(milestone => ({
            ...milestone,
            canClaim: (player.Level_Id || 0) >= milestone.UnlockingLevel && (player.Milestone_Id || 0) < milestone.Milestone_Id,
            alreadyClaimed: (player.Milestone_Id || 0) >= milestone.Milestone_Id,
            rewardPoints: calculateRewardPoints(milestone.Milestone_Id, player.Level_Id || 0)
        }))

        return NextResponse.json({
            success: true,
            player,
            availableRewards,
            nextReward: availableRewards.find(r => r.canClaim),
            totalRewards: allMilestones.length,
            claimedRewards: player.Milestone_Id || 0,
            rewardHistory
        })

    } catch (e) {
        console.error("Get rewards error:", e)
        return NextResponse.json({ 
            message: "Failed to get rewards", 
            success: false,
            error: e 
        }, { status: 500 })
    }
}