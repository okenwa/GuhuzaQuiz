"use client";
import React from 'react';
import Image from 'next/image';

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'streak' | 'achievement';
  requirement: number;
  powerUp?: {
    name: string;
    description: string;
    duration: number;
  };
};

export const BADGES: Badge[] = [
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Answer a question in under 5 seconds',
    icon: '/badges/speed-demon.svg',
    category: 'speed',
    requirement: 5
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% on any level',
    icon: '/badges/perfect-score.svg',
    category: 'accuracy',
    requirement: 100
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Answer 5 questions correctly in a row',
    icon: '/badges/streak-master.svg',
    category: 'streak',
    requirement: 5
  },
  {
    id: 'quick_thinker',
    name: 'Quick Thinker',
    description: 'Average response time under 8 seconds',
    icon: '/badges/quick-thinker.svg',
    category: 'speed',
    requirement: 8
  },
  {
    id: 'level_master',
    name: 'Level Master',
    description: 'Complete all questions in a level',
    icon: '/badges/level-master.svg',
    category: 'achievement',
    requirement: 1,
    powerUp: {
      name: 'Time Freeze',
      description: 'Freeze the timer for 5 seconds in your next quiz',
      duration: 5
    }
  },
  {
    id: 'speed_master',
    name: 'Speed Master',
    description: 'Answer all questions in a level under 5 seconds each',
    icon: '/badges/speed-master.svg',
    category: 'achievement',
    requirement: 1,
    powerUp: {
      name: 'Double Points',
      description: 'Double your points for the next 3 questions',
      duration: 3
    }
  }
];

type BadgeSystemProps = {
  userBadges: string[];
  onBadgeEarned?: (badge: Badge) => void;
  activePowerUps?: {
    timeFreeze: boolean;
    doublePoints: boolean;
  };
};

export default function BadgeSystem({ userBadges, onBadgeEarned, activePowerUps }: BadgeSystemProps) {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {BADGES.map((badge) => (
        <div
          key={badge.id}
          className={`relative p-2 rounded-lg border-2 ${
            userBadges.includes(badge.id)
              ? 'border-yellow-400 bg-yellow-50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="w-16 h-16 relative">
            <Image
              src={badge.icon}
              alt={badge.name}
              fill
              className={`${!userBadges.includes(badge.id) && 'grayscale opacity-50'}`}
            />
          </div>
          <div className="mt-2 text-center">
            <h3 className="font-semibold text-sm">{badge.name}</h3>
            <p className="text-xs text-gray-600">{badge.description}</p>
            {badge.powerUp && userBadges.includes(badge.id) && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <p className="text-xs font-semibold text-blue-600">Power-up: {badge.powerUp.name}</p>
                <p className="text-xs text-blue-500">{badge.powerUp.description}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 