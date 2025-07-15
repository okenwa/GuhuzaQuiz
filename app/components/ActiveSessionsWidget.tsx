'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface QuestionProgress {
  Progress_ID: number;
  Session_ID: number;
  Question_Index: number;
  Selected_Answer?: number;
  Is_Correct?: boolean;
  Time_Taken?: number;
  Used_Hint: boolean;
  Retry_Count: number;
  Answer_Checked: boolean;
}

interface QuizSession {
  Session_ID: number;
  Player_ID: number;
  Level_Id: number;
  Current_Question: number;
  Score: number;
  Total_Questions: number;
  Completed: boolean;
  Started_At: string;
  Last_Activity: string;
  Time_Spent: number;
  Correct_Answers: number;
  Wrong_Answers: number;
  Streak: number;
  Used_Hints: number;
  Retry_Count: number;
  level: {
    Level_Id: number;
    Level_Title: string;
    Level_number: number;
  };
  questionProgress: QuestionProgress[];
}

const ActiveSessionsWidget: React.FC = () => {
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/quiz/active-sessions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch active sessions');
      }
      
      const data = await response.json();
      setSessions(data.sessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const continueSession = (session: QuizSession) => {
    router.push(`/quiz/${session.Level_Id}?sessionId=${session.Session_ID}`);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const getProgressPercentage = (session: QuizSession) => {
    return Math.round((session.Current_Question / session.Total_Questions) * 100);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button 
            onClick={fetchActiveSessions}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-2">📚</div>
          <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
          <p className="text-sm">Start a new quiz to begin your learning journey!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Continue Learning</h3>
        <button 
          onClick={fetchActiveSessions}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div 
            key={session.Session_ID}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => continueSession(session)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {session.level.Level_number}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {session.level.Level_Title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Question {session.Current_Question + 1} of {session.Total_Questions}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {session.Score} pts
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(session.Time_Spent)}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{getProgressPercentage(session)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(session)}%` }}
                ></div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex justify-between text-xs text-gray-500">
              <div className="flex space-x-4">
                <span>✅ {session.Correct_Answers}</span>
                <span>❌ {session.Wrong_Answers}</span>
                <span>🔥 {session.Streak}</span>
              </div>
              <span>{formatDate(session.Last_Activity)}</span>
            </div>
            
            {/* Continue Button */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Continue Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {sessions.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            You have {sessions.length} active quiz sessions
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveSessionsWidget; 