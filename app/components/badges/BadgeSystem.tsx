"use client";
import React, { useState } from 'react';
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

const CATEGORY_ICONS: Record<string, string> = {
  speed: '⚡',
  accuracy: '🎯',
  streak: '🔥',
  achievement: '🏆',
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

export default function BadgeSystem({ userBadges }: BadgeSystemProps) {
  // For mobile tap flip
  const [flipped, setFlipped] = useState<{ [id: string]: boolean }>({});

  const handleFlip = (id: string) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-row gap-4 overflow-x-auto py-2 px-1 w-full hide-scrollbar">
      <style>{`
        .badge-flip {
          perspective: 800px;
        }
        .badge-inner {
          transition: transform 0.5s cubic-bezier(.4,2,.6,1);
          transform-style: preserve-3d;
        }
        .badge-flipped .badge-inner {
          transform: rotateY(180deg);
        }
        .badge-front, .badge-back {
          backface-visibility: hidden;
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .badge-back {
          transform: rotateY(180deg);
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {BADGES.map((badge) => {
        const earned = userBadges.includes(badge.id);
        const isFlipped = flipped[badge.id];
        return (
          <div
            key={badge.id}
            className={`badge-flip relative w-36 h-48 flex-shrink-0 select-none ${earned ? 'scale-105 ring-2 ring-yellow-300' : 'opacity-70'} ${isFlipped ? 'badge-flipped' : ''}`}
            tabIndex={0}
            onClick={() => handleFlip(badge.id)}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleFlip(badge.id)}
            onMouseLeave={() => setFlipped((prev) => ({ ...prev, [badge.id]: false }))}
            aria-label={badge.name}
            role="button"
          >
            <div className="badge-inner w-full h-full">
              {/* Front */}
              <div className={`badge-front absolute w-full h-full rounded-xl border-2 shadow flex flex-col items-center justify-center bg-white ${earned ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="text-2xl mb-1">{CATEGORY_ICONS[badge.category]}</div>
                <div className="w-16 h-16 relative mb-2">
                  <Image
                    src={badge.icon}
                    alt={badge.name}
                    fill
                    className={`${!earned ? 'grayscale opacity-50' : ''}`}
                  />
                </div>
                <h3 className={`font-bold text-base text-center ${earned ? 'text-yellow-700' : 'text-gray-700'}`}>{badge.name}</h3>
                <span className="text-xs text-gray-400 mt-1">{earned ? 'Unlocked' : 'Locked'}</span>
                <span className="mt-2 text-xs text-blue-500">Tap or hover to flip</span>
              </div>
              {/* Back */}
              <div className="badge-back absolute w-full h-full rounded-xl border-2 shadow flex flex-col items-center justify-center bg-white p-3 ${earned ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`">
                <div className="font-semibold text-sm mb-1 text-blue-700">{badge.name}</div>
                <div className="text-xs text-gray-700 mb-2 text-center">{badge.description}</div>
                <div className="text-xs text-gray-500 mb-2">Requirement: <span className="font-semibold">{badge.requirement}</span></div>
                {badge.powerUp && (
                  <div className="mt-1 p-2 bg-blue-50 rounded shadow text-xs w-full text-center">
                    <span className="font-semibold text-blue-600">Power-up: {badge.powerUp.name}</span>
                    <div className="text-blue-500">{badge.powerUp.description}</div>
                  </div>
                )}
                <span className="mt-2 text-xs text-gray-400">Click or tap to flip back</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 