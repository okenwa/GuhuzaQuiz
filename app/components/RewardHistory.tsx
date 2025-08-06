"use client";
import React from "react";

type RewardHistoryType = {
  Claim_ID: number;
  Player_ID: number;
  Milestone_Id: number;
  Points_Awarded: number;
  Claimed_At: string;
  Reward_Type: string;
  Reward_Data?: string;
  milestone: {
    Milestone_Id: number;
    Milestone_Title: string;
    Milestone_description: string;
    UnlockingLevel: number;
    Milestone_reward_message: string;
  };
};

interface RewardHistoryProps {
  rewardHistory: RewardHistoryType[];
  totalPointsEarned: number;
}

const RewardHistory: React.FC<RewardHistoryProps> = ({ rewardHistory, totalPointsEarned }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRewardIcon = (rewardType: string) => {
    switch (rewardType) {
      case 'milestone':
        return '🏆';
      case 'streak':
        return '🔥';
      case 'special':
        return '⭐';
      default:
        return '🎁';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Reward History</h3>
        <div className="text-center">
          <div className="text-sm text-blue-200">Total Points Earned</div>
          <div className="text-2xl font-bold text-green-400">{totalPointsEarned.toLocaleString()}</div>
        </div>
      </div>

      {rewardHistory.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-blue-200">No rewards claimed yet. Start playing to earn your first reward!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {rewardHistory.map((reward) => (
            <div 
              key={reward.Claim_ID}
              className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getRewardIcon(reward.Reward_Type)}</span>
                  <div>
                    <h4 className="font-semibold text-white">{reward.milestone.Milestone_Title}</h4>
                    <p className="text-sm text-blue-200">{reward.milestone.Milestone_description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">+{reward.Points_Awarded}</div>
                  <div className="text-xs text-blue-200">{formatDate(reward.Claimed_At)}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-200">Level {reward.milestone.UnlockingLevel}</span>
                <span className="text-blue-200">{reward.Reward_Type}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {rewardHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20 text-center">
          <p className="text-sm text-blue-200">
            Showing last {rewardHistory.length} rewards • 
            <span className="text-green-400 font-semibold"> {totalPointsEarned.toLocaleString()} total points earned</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default RewardHistory; 