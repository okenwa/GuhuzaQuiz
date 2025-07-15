import db from "@/lib/db";

export interface QuizSessionData {
  Player_ID: number;
  Level_Id: number;
  Current_Question: number;
  Score: number;
  Total_Questions: number;
  Time_Spent: number;
  Correct_Answers: number;
  Wrong_Answers: number;
  Streak: number;
  Used_Hints: number;
  Retry_Count: number;
}

export interface QuestionProgressData {
  Session_ID: number;
  Question_Index: number;
  Selected_Answer?: number;
  Is_Correct?: boolean;
  Time_Taken?: number;
  Used_Hint: boolean;
  Retry_Count: number;
  Answer_Checked: boolean;
}

// Create or get existing quiz session
export const getOrCreateQuizSession = async (
  Player_ID: number,
  Level_Id: number,
  Total_Questions: number
) => {
  try {
    // Check if session exists
    let session = await db.quizSession.findUnique({
      where: {
        Player_ID_Level_Id: {
          Player_ID,
          Level_Id,
        },
      },
      include: {
        questionProgress: {
          orderBy: {
            Question_Index: 'asc',
          },
        },
      },
    });

    if (!session) {
      // Create new session
      session = await db.quizSession.create({
        data: {
          Player_ID,
          Level_Id,
          Total_Questions,
          Current_Question: 0,
          Score: 0,
          Time_Spent: 0,
          Correct_Answers: 0,
          Wrong_Answers: 0,
          Streak: 0,
          Used_Hints: 0,
          Retry_Count: 0,
        },
        include: {
          questionProgress: {
            orderBy: {
              Question_Index: 'asc',
            },
          },
        },
      });
    } else {
      // Update last activity
      await db.quizSession.update({
        where: { Session_ID: session.Session_ID },
        data: { Last_Activity: new Date() },
      });
    }

    return session;
  } catch (error) {
    console.error('Error getting/creating quiz session:', error);
    throw error;
  }
};

// Save question progress
export const saveQuestionProgress = async (progressData: QuestionProgressData) => {
  try {
    const progress = await db.questionProgress.upsert({
      where: {
        Session_ID_Question_Index: {
          Session_ID: progressData.Session_ID,
          Question_Index: progressData.Question_Index,
        },
      },
      update: {
        Selected_Answer: progressData.Selected_Answer,
        Is_Correct: progressData.Is_Correct,
        Time_Taken: progressData.Time_Taken,
        Used_Hint: progressData.Used_Hint,
        Retry_Count: progressData.Retry_Count,
        Answer_Checked: progressData.Answer_Checked,
      },
      create: progressData,
    });

    return progress;
  } catch (error) {
    console.error('Error saving question progress:', error);
    throw error;
  }
};

// Update session progress
export const updateSessionProgress = async (
  Session_ID: number,
  updateData: Partial<QuizSessionData>
) => {
  try {
    const session = await db.quizSession.update({
      where: { Session_ID },
      data: {
        ...updateData,
        Last_Activity: new Date(),
      },
      include: {
        questionProgress: {
          orderBy: {
            Question_Index: 'asc',
          },
        },
      },
    });

    return session;
  } catch (error) {
    console.error('Error updating session progress:', error);
    throw error;
  }
};

// Complete quiz session
export const completeQuizSession = async (
  Session_ID: number,
  finalScore: number
) => {
  try {
    const session = await db.quizSession.update({
      where: { Session_ID },
      data: {
        Completed: true,
        Score: finalScore,
        Last_Activity: new Date(),
      },
    });

    return session;
  } catch (error) {
    console.error('Error completing quiz session:', error);
    throw error;
  }
};

// Get user's active sessions
export const getUserActiveSessions = async (Player_ID: number) => {
  try {
    const sessions = await db.quizSession.findMany({
      where: {
        Player_ID,
        Completed: false,
      },
      include: {
        level: true,
        questionProgress: {
          orderBy: {
            Question_Index: 'asc',
          },
        },
      },
      orderBy: {
        Last_Activity: 'desc',
      },
    });

    return sessions;
  } catch (error) {
    console.error('Error getting user active sessions:', error);
    throw error;
  }
};

// Clean up old sessions (optional - for maintenance)
export const cleanupOldSessions = async (daysOld: number = 7) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const deletedSessions = await db.quizSession.deleteMany({
      where: {
        Last_Activity: {
          lt: cutoffDate,
        },
        Completed: true,
      },
    });

    return deletedSessions;
  } catch (error) {
    console.error('Error cleaning up old sessions:', error);
    throw error;
  }
};

// Get session statistics
export const getSessionStats = async (Player_ID: number) => {
  try {
    const stats = await db.quizSession.groupBy({
      by: ['Level_Id'],
      where: {
        Player_ID,
        Completed: true,
      },
      _count: {
        Session_ID: true,
      },
      _avg: {
        Score: true,
        Time_Spent: true,
        Correct_Answers: true,
      },
      _max: {
        Score: true,
      },
    });

    return stats;
  } catch (error) {
    console.error('Error getting session stats:', error);
    throw error;
  }
}; 