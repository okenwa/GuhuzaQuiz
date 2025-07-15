import { useAnalytics } from '../components/AnalyticsProvider';

export const useQuizAnalytics = () => {
  const analytics = useAnalytics();

  const trackQuizStart = (levelId: string, levelTitle: string) => {
    analytics.trackQuizStart(levelId, levelTitle);
  };

  const trackAnswerSubmit = (levelId: string, questionIndex: number, isCorrect: boolean, timeToAnswer: number) => {
    analytics.trackAnswerSubmit(levelId, questionIndex, isCorrect, timeToAnswer);
  };

  const trackQuizComplete = (levelId: string, score: number, timeSpent: number, correctAnswers: number, totalQuestions: number) => {
    analytics.trackQuizComplete(levelId, score, timeSpent, correctAnswers, totalQuestions);
  };

  const trackQuizAbandon = (levelId: string, progress: number, timeSpent: number) => {
    analytics.trackQuizAbandon(levelId, progress, timeSpent);
  };

  const trackLevelUnlock = (levelId: string, previousLevelScore: number) => {
    analytics.trackLevelUnlock(levelId, previousLevelScore);
  };

  const trackAchievementEarned = (achievementId: string, achievementName: string, achievementType: string) => {
    analytics.trackAchievementEarned(achievementId, achievementName, achievementType);
  };

  const trackSoundToggle = (isMuted: boolean) => {
    analytics.trackSoundToggle(isMuted);
  };

  const trackShareAction = (platform: string, score: number, levelTitle: string) => {
    analytics.trackShareAction(platform, score, levelTitle);
  };

  return {
    trackQuizStart,
    trackAnswerSubmit,
    trackQuizComplete,
    trackQuizAbandon,
    trackLevelUnlock,
    trackAchievementEarned,
    trackSoundToggle,
    trackShareAction,
  };
}; 