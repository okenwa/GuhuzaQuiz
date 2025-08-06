"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Toast from "./Toast";
import RewardHistory from "./RewardHistory";

type milestoneType = {
  Milestone_Id: number;
  Milestone_Title: string;
  Milestone_description: string;
  UnlockingLevel: number;
  Milestone_reward_message: string;
  Milestone_Link: string; 
  Milestone_Button_CTA: string;
  canClaim?: boolean;
  alreadyClaimed?: boolean;
  rewardPoints?: number;
};

type playerType = {
  Player_ID: number;
  Player_name: string;
  Playerpoint: number;
  streak: number;
  lastLogin: Date;
  Level_Id: number | null;
  Milestone_Id?: number | null;
  milestone?: milestoneType | null;
};

type typeRewardCopy = { 
  player: playerType | null;
}

function RewardCopy({ player }: typeRewardCopy) {
  const router = useRouter();
  const [isClaiming, setIsClaiming] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [availableRewards, setAvailableRewards] = useState<milestoneType[]>([]);
  const [nextReward, setNextReward] = useState<milestoneType | null>(null);
  const [rewardStats, setRewardStats] = useState({
    totalRewards: 0,
    claimedRewards: 0,
    availableRewards: 0
  });
  const [rewardHistory, setRewardHistory] = useState<any[]>([]);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);

  useEffect(() => {
    if (player?.Player_ID) {
      fetchAvailableRewards();
    }
  }, [player?.Player_ID]);

  const fetchAvailableRewards = async () => {
    try {
      const response = await fetch(`/api/reward?playerId=${player?.Player_ID}`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableRewards(data.availableRewards);
        setNextReward(data.nextReward);
        setRewardHistory(data.rewardHistory || []);
        setTotalPointsEarned(data.rewardHistory?.reduce((sum: number, r: any) => sum + r.Points_Awarded, 0) || 0);
        setRewardStats({
          totalRewards: data.totalRewards,
          claimedRewards: data.claimedRewards,
          availableRewards: data.availableRewards.filter((r: milestoneType) => r.canClaim).length
        });
      }
    } catch (error) {
      console.error("Failed to fetch rewards:", error);
    }
  };

  const handleClaimReward = async (milestoneId: number) => {
    if (!player?.Player_ID) return;

    setIsClaiming(true);
    setToast(null);

    try {
      const response = await fetch("/api/reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          playerId: player.Player_ID, 
          nextMilestone: milestoneId 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setToast({ 
          message: `🎉 Reward claimed! +${data.rewardPoints} points!`, 
          type: 'success' 
        });

        // Refresh rewards data
        await fetchAvailableRewards();

        // Open milestone link if available
        if (data.milestone?.Milestone_Link) {
          setTimeout(() => {
            window.open(data.milestone.Milestone_Link, "_blank");
          }, 1500);
        }

        // Navigate back to quiz after a delay
        setTimeout(() => {
          router.push("/quiz");
        }, 2000);

      } else {
        setToast({ 
          message: data.message || "Failed to claim reward", 
          type: 'error' 
        });
      }
    } catch (error) {
      setToast({ 
        message: "Network error. Please try again.", 
        type: 'error' 
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const currentMilestone = player?.milestone;
  const canClaimCurrent = currentMilestone && (player?.Level_Id || 0) >= currentMilestone.UnlockingLevel && 
                         (player?.Milestone_Id || 0) < currentMilestone.Milestone_Id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🏆 Rewards Center</h1>
          <p className="text-xl text-blue-200">Claim your achievements and unlock new possibilities!</p>
        </div>

        {/* Reward Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{rewardStats.totalRewards}</div>
            <div className="text-blue-200">Total Rewards</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{rewardStats.claimedRewards}</div>
            <div className="text-blue-200">Claimed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">{rewardStats.availableRewards}</div>
            <div className="text-blue-200">Available</div>
          </div>
        </div>

        {/* Current Milestone */}
        {currentMilestone && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-8 mb-8 border border-yellow-500/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-yellow-400">{currentMilestone.Milestone_Title}</h2>
              <div className="text-right">
                <div className="text-sm text-blue-200">Required Level</div>
                <div className="text-xl font-bold text-white">{currentMilestone.UnlockingLevel}</div>
              </div>
            </div>
            
            <p className="text-blue-200 mb-4">{currentMilestone.Milestone_description}</p>
            <p className="text-yellow-200 mb-6">{currentMilestone.Milestone_reward_message}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm text-blue-200">Your Level</div>
                  <div className="text-2xl font-bold text-white">{player?.Level_Id || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-blue-200">Reward Points</div>
                  <div className="text-2xl font-bold text-green-400">
                    +{currentMilestone.rewardPoints || (currentMilestone.Milestone_Id * 100)}
                  </div>
                </div>
              </div>

              {canClaimCurrent ? (
                <button 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleClaimReward(currentMilestone.Milestone_Id)}
                  disabled={isClaiming}
                >
                  {isClaiming ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Claiming...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      🎁 {currentMilestone.Milestone_Button_CTA}
                    </div>
                  )}
                </button>
              ) : (
                <div className="text-center">
                                     <div className="text-red-400 font-semibold mb-2">
                     {(player?.Level_Id || 0) < currentMilestone.UnlockingLevel 
                       ? `Need Level ${currentMilestone.UnlockingLevel}` 
                       : "Already Claimed"}
                   </div>
                   <div className="text-sm text-blue-200">
                     {(player?.Level_Id || 0) < currentMilestone.UnlockingLevel 
                       ? `${currentMilestone.UnlockingLevel - (player?.Level_Id || 0)} levels to go!`
                       : "Great job! 🎉"
                     }
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* All Available Rewards */}
        {availableRewards.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">All Rewards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRewards.map((reward) => (
                <div 
                  key={reward.Milestone_Id}
                  className={`bg-gradient-to-br rounded-xl p-6 border transition-all duration-300 ${
                    reward.canClaim 
                      ? 'from-green-500/20 to-emerald-500/20 border-green-500/30 hover:scale-105' 
                      : reward.alreadyClaimed 
                        ? 'from-gray-500/20 to-gray-600/20 border-gray-500/30' 
                        : 'from-red-500/20 to-pink-500/20 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">{reward.Milestone_Title}</h4>
                    <div className="text-right">
                      <div className="text-sm text-blue-200">Level {reward.UnlockingLevel}</div>
                      <div className="text-lg font-bold text-green-400">
                        +{reward.rewardPoints || (reward.Milestone_Id * 100)}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-blue-200 mb-4">{reward.Milestone_description}</p>
                  
                  <div className="flex items-center justify-between">
                    {reward.canClaim ? (
                      <button 
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                        onClick={() => handleClaimReward(reward.Milestone_Id)}
                        disabled={isClaiming}
                      >
                        🎁 Claim
                      </button>
                    ) : reward.alreadyClaimed ? (
                      <div className="text-green-400 font-semibold">✅ Claimed</div>
                    ) : (
                      <div className="text-red-400 font-semibold">🔒 Locked</div>
                    )}
                    
                    <div className="text-xs text-blue-200">
                      {reward.canClaim 
                        ? "Ready to claim!" 
                        : reward.alreadyClaimed 
                          ? "Completed" 
                          : `Need Level ${reward.UnlockingLevel}`
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

                 {/* Reward History */}
         <div className="mt-8">
           <RewardHistory 
             rewardHistory={rewardHistory} 
             totalPointsEarned={totalPointsEarned} 
           />
         </div>

         {/* Navigation */}
         <div className="text-center mt-8">
           <button 
             onClick={() => router.push("/quiz")}
             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 mr-4"
           >
             🎮 Back to Quiz
           </button>
           <button 
             onClick={() => router.push("/profile")}
             className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
           >
             👤 View Profile
           </button>
         </div>
      </div>
    </div>
  );
}

export default RewardCopy;
