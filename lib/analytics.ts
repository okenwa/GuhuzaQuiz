// Analytics configuration and tracking functions
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// Google Analytics 4 Configuration
export const GA_CONFIG = {
  measurementId: GA_TRACKING_ID,
  debugMode: process.env.NODE_ENV === 'development',
};

// Custom event tracking for quiz-specific metrics
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Quiz-specific tracking events
export const quizAnalytics = {
  // User engagement
  trackQuizStart: (levelId: string, levelTitle: string) => {
    trackEvent('quiz_start', {
      level_id: levelId,
      level_title: levelTitle,
      timestamp: new Date().toISOString(),
    });
  },

  trackQuizComplete: (levelId: string, score: number, timeSpent: number, correctAnswers: number, totalQuestions: number) => {
    trackEvent('quiz_complete', {
      level_id: levelId,
      score: score,
      time_spent_seconds: timeSpent,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      accuracy_percentage: Math.round((correctAnswers / totalQuestions) * 100),
      timestamp: new Date().toISOString(),
    });
  },

  trackQuizAbandon: (levelId: string, progress: number, timeSpent: number) => {
    trackEvent('quiz_abandon', {
      level_id: levelId,
      progress_percentage: progress,
      time_spent_seconds: timeSpent,
      timestamp: new Date().toISOString(),
    });
  },

  trackAnswerSubmit: (levelId: string, questionIndex: number, isCorrect: boolean, timeToAnswer: number) => {
    trackEvent('answer_submit', {
      level_id: levelId,
      question_index: questionIndex,
      is_correct: isCorrect,
      time_to_answer_seconds: timeToAnswer,
      timestamp: new Date().toISOString(),
    });
  },

  // User behavior
  trackLevelUnlock: (levelId: string, previousLevelScore: number) => {
    trackEvent('level_unlock', {
      level_id: levelId,
      previous_level_score: previousLevelScore,
      timestamp: new Date().toISOString(),
    });
  },

  trackAchievementEarned: (achievementId: string, achievementName: string, achievementType: string) => {
    trackEvent('achievement_earned', {
      achievement_id: achievementId,
      achievement_name: achievementName,
      achievement_type: achievementType,
      timestamp: new Date().toISOString(),
    });
  },

  trackLeaderboardView: (leaderboardType: string) => {
    trackEvent('leaderboard_view', {
      leaderboard_type: leaderboardType,
      timestamp: new Date().toISOString(),
    });
  },

  trackProfileUpdate: (updateType: string) => {
    trackEvent('profile_update', {
      update_type: updateType,
      timestamp: new Date().toISOString(),
    });
  },

  // Performance tracking
  trackPageLoad: (pageName: string, loadTime: number) => {
    trackEvent('page_load', {
      page_name: pageName,
      load_time_ms: loadTime,
      timestamp: new Date().toISOString(),
    });
  },

  trackError: (errorType: string, errorMessage: string, pageName: string) => {
    trackEvent('error', {
      error_type: errorType,
      error_message: errorMessage,
      page_name: pageName,
      timestamp: new Date().toISOString(),
    });
  },

  // Sound and UI interactions
  trackSoundToggle: (isMuted: boolean) => {
    trackEvent('sound_toggle', {
      is_muted: isMuted,
      timestamp: new Date().toISOString(),
    });
  },

  trackShareAction: (platform: string, score: number, levelTitle: string) => {
    trackEvent('share_action', {
      platform: platform,
      score: score,
      level_title: levelTitle,
      timestamp: new Date().toISOString(),
    });
  },
};

// Performance monitoring
export const performanceAnalytics = {
  trackCoreWebVitals: (metric: any) => {
    trackEvent('core_web_vital', {
      name: metric.name,
      value: Math.round(metric.value),
      id: metric.id,
      timestamp: new Date().toISOString(),
    });
  },

  trackQuizPerformance: (levelId: string, renderTime: number, interactionTime: number) => {
    trackEvent('quiz_performance', {
      level_id: levelId,
      render_time_ms: renderTime,
      interaction_time_ms: interactionTime,
      timestamp: new Date().toISOString(),
    });
  },
};

// User session tracking
export const sessionAnalytics = {
  trackSessionStart: (userId?: string) => {
    trackEvent('session_start', {
      user_id: userId || 'anonymous',
      timestamp: new Date().toISOString(),
    });
  },

  trackSessionEnd: (userId?: string, sessionDuration: number) => {
    trackEvent('session_end', {
      user_id: userId || 'anonymous',
      session_duration_seconds: sessionDuration,
      timestamp: new Date().toISOString(),
    });
  },
};

// Initialize analytics
export const initAnalytics = () => {
  if (typeof window !== 'undefined') {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Track initial page load
    const loadTime = performance.now();
    quizAnalytics.trackPageLoad('initial_load', loadTime);
  }
};

// TypeScript declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
} 