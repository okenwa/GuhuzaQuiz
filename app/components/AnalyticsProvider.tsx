'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  initAnalytics, 
  quizAnalytics, 
  performanceAnalytics, 
  sessionAnalytics,
  trackEvent 
} from '@/lib/analytics';

interface AnalyticsContextType {
  trackQuizStart: (levelId: string, levelTitle: string) => void;
  trackQuizComplete: (levelId: string, score: number, timeSpent: number, correctAnswers: number, totalQuestions: number) => void;
  trackQuizAbandon: (levelId: string, progress: number, timeSpent: number) => void;
  trackAnswerSubmit: (levelId: string, questionIndex: number, isCorrect: boolean, timeToAnswer: number) => void;
  trackLevelUnlock: (levelId: string, previousLevelScore: number) => void;
  trackAchievementEarned: (achievementId: string, achievementName: string, achievementType: string) => void;
  trackLeaderboardView: (leaderboardType: string) => void;
  trackProfileUpdate: (updateType: string) => void;
  trackSoundToggle: (isMuted: boolean) => void;
  trackShareAction: (platform: string, score: number, levelTitle: string) => void;
  trackError: (errorType: string, errorMessage: string, pageName: string) => void;
  trackPageLoad: (pageName: string, loadTime: number) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize analytics
    initAnalytics();
    setIsInitialized(true);

    // Track session start
    sessionAnalytics.trackSessionStart(session?.user?.id);

    // Track page load performance
    const trackPageLoadPerformance = () => {
      const loadTime = performance.now();
      quizAnalytics.trackPageLoad(window.location.pathname, loadTime);
    };

    // Track Core Web Vitals
    const trackCoreWebVitals = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            performanceAnalytics.trackCoreWebVitals(entry);
          }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      }
    };

    // Track errors
    const trackErrors = (event: ErrorEvent) => {
      quizAnalytics.trackError('javascript_error', event.message, window.location.pathname);
    };

    // Track unhandled promise rejections
    const trackPromiseRejections = (event: PromiseRejectionEvent) => {
      quizAnalytics.trackError('promise_rejection', event.reason?.message || 'Unknown error', window.location.pathname);
    };

    // Add event listeners
    window.addEventListener('load', trackPageLoadPerformance);
    window.addEventListener('error', trackErrors);
    window.addEventListener('unhandledrejection', trackPromiseRejections);
    trackCoreWebVitals();

    // Track session end when user leaves
    const trackSessionEnd = () => {
      const sessionDuration = (Date.now() - performance.timing.navigationStart) / 1000;
      sessionAnalytics.trackSessionEnd(sessionDuration, session?.user?.id);
    };

    window.addEventListener('beforeunload', trackSessionEnd);

    return () => {
      window.removeEventListener('load', trackPageLoadPerformance);
      window.removeEventListener('error', trackErrors);
      window.removeEventListener('unhandledrejection', trackPromiseRejections);
      window.removeEventListener('beforeunload', trackSessionEnd);
    };
  }, [session?.user?.id]);

  const analyticsContext: AnalyticsContextType = {
    trackQuizStart: quizAnalytics.trackQuizStart,
    trackQuizComplete: quizAnalytics.trackQuizComplete,
    trackQuizAbandon: quizAnalytics.trackQuizAbandon,
    trackAnswerSubmit: quizAnalytics.trackAnswerSubmit,
    trackLevelUnlock: quizAnalytics.trackLevelUnlock,
    trackAchievementEarned: quizAnalytics.trackAchievementEarned,
    trackLeaderboardView: quizAnalytics.trackLeaderboardView,
    trackProfileUpdate: quizAnalytics.trackProfileUpdate,
    trackSoundToggle: quizAnalytics.trackSoundToggle,
    trackShareAction: quizAnalytics.trackShareAction,
    trackError: quizAnalytics.trackError,
    trackPageLoad: quizAnalytics.trackPageLoad,
  };

  return (
    <AnalyticsContext.Provider value={analyticsContext}>
      {children}
    </AnalyticsContext.Provider>
  );
} 