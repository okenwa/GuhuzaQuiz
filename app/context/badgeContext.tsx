"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Badge, BADGES } from '../components/badges/BadgeSystem';

type PowerUp = {
  name: string;
  duration: number;
  active: boolean;
  remainingUses: number;
};

type BadgeContextType = {
  userBadges: string[];
  addBadge: (badgeId: string) => void;
  checkAndAwardBadges: (stats: {
    answerTime: number;
    isCorrect: boolean;
    score: number;
    streak: number;
    levelCompleted?: boolean;
    allQuestionsUnder5Seconds?: boolean;
  }) => void;
  activePowerUps: PowerUp[];
  activatePowerUp: (powerUpName: string) => void;
  usePowerUp: (powerUpName: string) => void;
};

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export function BadgeProvider({ children }: { children: React.ReactNode }) {
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<PowerUp[]>([]);

  // Load badges and power-ups from localStorage on mount
  useEffect(() => {
    const savedBadges = localStorage.getItem('userBadges');
    const savedPowerUps = localStorage.getItem('activePowerUps');
    if (savedBadges) {
      setUserBadges(JSON.parse(savedBadges));
    }
    if (savedPowerUps) {
      setActivePowerUps(JSON.parse(savedPowerUps));
    }
  }, []);

  // Save badges and power-ups to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userBadges', JSON.stringify(userBadges));
    localStorage.setItem('activePowerUps', JSON.stringify(activePowerUps));
  }, [userBadges, activePowerUps]);

  const addBadge = (badgeId: string) => {
    if (!userBadges.includes(badgeId)) {
      setUserBadges(prev => [...prev, badgeId]);
      // Add power-up if the badge has one
      const badge = BADGES.find(b => b.id === badgeId);
      if (badge?.powerUp && badge.powerUp.name && badge.powerUp.duration) {
        setActivePowerUps(prev => [...prev, {
          name: badge.powerUp?.name || 'Unknown',
          duration: badge.powerUp?.duration ?? 0,
          active: false,
          remainingUses: 1
        }]);
      }
    }
  };

  const activatePowerUp = (powerUpName: string) => {
    setActivePowerUps(prev => prev.map(powerUp => 
      powerUp.name === powerUpName 
        ? { ...powerUp, active: true, remainingUses: powerUp.remainingUses - 1 }
        : powerUp
    ));
  };

  const usePowerUp = (powerUpName: string) => {
    setActivePowerUps(prev => prev.map(powerUp => 
      powerUp.name === powerUpName 
        ? { ...powerUp, active: false }
        : powerUp
    ));
  };

  const checkAndAwardBadges = (stats: {
    answerTime: number;
    isCorrect: boolean;
    score: number;
    streak: number;
    levelCompleted?: boolean;
    allQuestionsUnder5Seconds?: boolean;
  }) => {
    BADGES.forEach(badge => {
      if (userBadges.includes(badge.id)) return;

      switch (badge.category) {
        case 'speed':
          if (stats.answerTime <= badge.requirement) {
            addBadge(badge.id);
          }
          break;
        case 'accuracy':
          if (stats.score >= badge.requirement) {
            addBadge(badge.id);
          }
          break;
        case 'streak':
          if (stats.streak >= badge.requirement) {
            addBadge(badge.id);
          }
          break;
        case 'achievement':
          if (badge.id === 'level_master' && stats.levelCompleted) {
            addBadge(badge.id);
          }
          if (badge.id === 'speed_master' && stats.allQuestionsUnder5Seconds) {
            addBadge(badge.id);
          }
          break;
      }
    });
  };

  return (
    <BadgeContext.Provider value={{ 
      userBadges, 
      addBadge, 
      checkAndAwardBadges,
      activePowerUps,
      activatePowerUp,
      usePowerUp
    }}>
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadges() {
  const context = useContext(BadgeContext);
  if (context === undefined) {
    throw new Error('useBadges must be used within a BadgeProvider');
  }
  return context;
} 