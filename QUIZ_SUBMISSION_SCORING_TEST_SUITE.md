# Quiz Submission and Scoring Test Suite

## Overview
This test suite covers the complete quiz submission and scoring functionality for the Guhuza Quiz App, including answer validation, scoring calculation, session management, and real-time features.

## Test Categories

### 1. Answer Submission and Validation Tests

#### TC-601: Answer Selection and Validation
**Priority**: Critical (Score: 8.5)  
**Test Objective**: Verify answer selection and validation functionality

```typescript
describe('Answer Selection and Validation', () => {
  test('should allow user to select an answer', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    const answerOption = getByTestId('answer-option-1');

    // Act
    fireEvent.click(answerOption);

    // Assert
    expect(answerOption).toHaveClass('selected');
    expect(getByTestId('check-answer-btn')).not.toBeDisabled();
  });

  test('should prevent submission without answer selection', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);

    // Assert
    expect(getByTestId('check-answer-btn')).toBeDisabled();
  });

  test('should validate correct answer submission', async () => {
    // Arrange
    const { getByTestId, getByText } = render(<QuizPageSection />);
    const correctAnswer = getByTestId('answer-option-2'); // Assuming option 2 is correct
    const checkButton = getByTestId('check-answer-btn');

    // Act
    fireEvent.click(correctAnswer);
    fireEvent.click(checkButton);

    // Assert
    await waitFor(() => {
      expect(getByText('Next Question')).toBeInTheDocument();
      expect(getByTestId('score-display')).toHaveTextContent('30'); // Base score for correct answer
    });
  });

  test('should handle incorrect answer submission', async () => {
    // Arrange
    const { getByTestId, getByText } = render(<QuizPageSection />);
    const wrongAnswer = getByTestId('answer-option-1'); // Assuming option 1 is wrong
    const checkButton = getByTestId('check-answer-btn');

    // Act
    fireEvent.click(wrongAnswer);
    fireEvent.click(checkButton);

    // Assert
    await waitFor(() => {
      expect(getByText('Retry')).toBeInTheDocument();
      expect(getByText('Display Answer')).toBeInTheDocument();
      expect(getByTestId('score-display')).toHaveTextContent('0'); // No points for wrong answer
    });
  });

  test('should allow answer change before submission', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    const firstAnswer = getByTestId('answer-option-1');
    const secondAnswer = getByTestId('answer-option-2');

    // Act
    fireEvent.click(firstAnswer);
    fireEvent.click(secondAnswer);

    // Assert
    expect(firstAnswer).not.toHaveClass('selected');
    expect(secondAnswer).toHaveClass('selected');
  });
});
```

#### TC-602: Timer Functionality
**Priority**: Critical (Score: 8.7)  
**Test Objective**: Verify timer functionality and time-based scoring

```typescript
describe('Timer Functionality', () => {
  test('should start timer when quiz begins', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    
    // Act - Start quiz
    fireEvent.click(getByTestId('start-quiz-btn'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('timer-display')).toHaveTextContent('15');
    });
  });

  test('should countdown timer correctly', async () => {
    // Arrange
    jest.useFakeTimers();
    const { getByTestId } = render(<QuizPageSection />);
    
    // Act
    fireEvent.click(getByTestId('start-quiz-btn'));
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(5000); // 5 seconds
    });

    // Assert
    expect(getByTestId('timer-display')).toHaveTextContent('10');
    
    jest.useRealTimers();
  });

  test('should auto-submit when timer reaches zero', async () => {
    // Arrange
    jest.useFakeTimers();
    const { getByTestId, getByText } = render(<QuizPageSection />);
    
    // Act
    fireEvent.click(getByTestId('start-quiz-btn'));
    
    // Fast-forward to timer end
    act(() => {
      jest.advanceTimersByTime(15000); // 15 seconds
    });

    // Assert
    await waitFor(() => {
      expect(getByText('Retry')).toBeInTheDocument();
      expect(getByTestId('score-display')).toHaveTextContent('0'); // No points for timeout
    });
    
    jest.useRealTimers();
  });

  test('should play sound effects at appropriate times', async () => {
    // Arrange
    const mockAudio = {
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      currentTime: 0
    };
    global.Audio = jest.fn(() => mockAudio);
    
    const { getByTestId } = render(<QuizPageSection />);
    
    // Act
    fireEvent.click(getByTestId('start-quiz-btn'));
    
    // Assert
    expect(mockAudio.play).toHaveBeenCalled(); // Tick sound should play
  });
});
```

### 2. Scoring System Tests

#### TC-603: Basic Scoring Calculation
**Priority**: Critical (Score: 8.8)  
**Test Objective**: Verify basic scoring calculation for correct and incorrect answers

```typescript
describe('Basic Scoring Calculation', () => {
  test('should award 30 points for correct answer', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    const correctAnswer = getByTestId('answer-option-2');
    const checkButton = getByTestId('check-answer-btn');

    // Act
    fireEvent.click(correctAnswer);
    fireEvent.click(checkButton);

    // Assert
    await waitFor(() => {
      expect(getByTestId('score-display')).toHaveTextContent('30');
    });
  });

  test('should award 0 points for incorrect answer', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    const wrongAnswer = getByTestId('answer-option-1');
    const checkButton = getByTestId('check-answer-btn');

    // Act
    fireEvent.click(wrongAnswer);
    fireEvent.click(checkButton);

    // Assert
    await waitFor(() => {
      expect(getByTestId('score-display')).toHaveTextContent('0');
    });
  });

  test('should accumulate score across multiple questions', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    
    // Answer first question correctly
    fireEvent.click(getByTestId('answer-option-2'));
    fireEvent.click(getByTestId('check-answer-btn'));
    
    await waitFor(() => {
      expect(getByTestId('score-display')).toHaveTextContent('30');
    });

    // Move to next question
    fireEvent.click(getByTestId('next-question-btn'));
    
    // Answer second question correctly
    fireEvent.click(getByTestId('answer-option-1'));
    fireEvent.click(getByTestId('check-answer-btn'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('score-display')).toHaveTextContent('60');
    });
  });
});
```

#### TC-604: Retry Scoring System
**Priority**: High (Score: 7.5)  
**Test Objective**: Verify retry scoring system with reduced points

```typescript
describe('Retry Scoring System', () => {
  test('should award 10 points on first retry', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    const wrongAnswer = getByTestId('answer-option-1');
    const checkButton = getByTestId('check-answer-btn');

    // Act - Submit wrong answer
    fireEvent.click(wrongAnswer);
    fireEvent.click(checkButton);
    
    await waitFor(() => {
      expect(getByText('Retry')).toBeInTheDocument();
    });

    // Retry with correct answer
    fireEvent.click(getByTestId('retry-btn'));
    fireEvent.click(getByTestId('answer-option-2'));
    fireEvent.click(checkButton);

    // Assert
    await waitFor(() => {
      expect(getByTestId('score-display')).toHaveTextContent('10');
    });
  });

  test('should award 5 points on second retry', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    
    // First wrong attempt
    fireEvent.click(getByTestId('answer-option-1'));
    fireEvent.click(getByTestId('check-answer-btn'));
    fireEvent.click(getByTestId('retry-btn'));
    
    // Second wrong attempt
    fireEvent.click(getByTestId('answer-option-3'));
    fireEvent.click(getByTestId('check-answer-btn'));
    fireEvent.click(getByTestId('retry-btn'));
    
    // Third attempt (correct)
    fireEvent.click(getByTestId('answer-option-2'));
    fireEvent.click(getByTestId('check-answer-btn'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('score-display')).toHaveTextContent('5');
    });
  });

  test('should disable retry after using display answer', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    const wrongAnswer = getByTestId('answer-option-1');
    const checkButton = getByTestId('check-answer-btn');

    // Act - Submit wrong answer and use display answer
    fireEvent.click(wrongAnswer);
    fireEvent.click(checkButton);
    fireEvent.click(getByTestId('display-answer-btn'));

    // Assert
    expect(getByTestId('retry-btn')).toBeDisabled();
  });
});
```

#### TC-605: Power-up Scoring System
**Priority**: High (Score: 7.8)  
**Test Objective**: Verify power-up scoring system (Double Points, Time Freeze)

```typescript
describe('Power-up Scoring System', () => {
  test('should award 60 points with Double Points power-up', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    const correctAnswer = getByTestId('answer-option-2');
    const checkButton = getByTestId('check-answer-btn');

    // Activate Double Points power-up
    fireEvent.click(getByTestId('activate-double-points-btn'));

    // Act
    fireEvent.click(correctAnswer);
    fireEvent.click(checkButton);

    // Assert
    await waitFor(() => {
      expect(getByTestId('score-display')).toHaveTextContent('60');
      expect(getByTestId('power-up-notification')).toHaveTextContent('Double Points Active!');
    });
  });

  test('should freeze timer with Time Freeze power-up', async () => {
    // Arrange
    jest.useFakeTimers();
    const { getByTestId } = render(<QuizPageSection />);
    
    // Activate Time Freeze power-up
    fireEvent.click(getByTestId('activate-time-freeze-btn'));
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(10000); // 10 seconds
    });

    // Assert
    expect(getByTestId('timer-display')).toHaveTextContent('15'); // Timer should remain frozen
    expect(getByTestId('time-frozen-indicator')).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('should consume power-up after use', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    
    // Activate Double Points
    fireEvent.click(getByTestId('activate-double-points-btn'));
    
    // Use power-up
    fireEvent.click(getByTestId('answer-option-2'));
    fireEvent.click(getByTestId('check-answer-btn'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('double-points-uses')).toHaveTextContent('0 uses left');
    });
  });
});
```

### 3. Session Management Tests

#### TC-606: Quiz Session Creation and Management
**Priority**: Critical (Score: 8.3)  
**Test Objective**: Verify quiz session creation and progress tracking

```typescript
describe('Quiz Session Management', () => {
  test('should create new quiz session on start', async () => {
    // Arrange
    const mockFetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sessionId: 123 })
      })
    );
    global.fetch = mockFetch;

    const { getByTestId } = render(<QuizPageSection />);

    // Act
    fireEvent.click(getByTestId('start-quiz-btn'));

    // Assert
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/quiz/session', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('levelNumber')
      }));
    });
  });

  test('should save progress after each question', async () => {
    // Arrange
    const mockFetch = jest.fn(() => Promise.resolve({ ok: true }));
    global.fetch = mockFetch;

    const { getByTestId } = render(<QuizPageSection />);
    
    // Answer a question
    fireEvent.click(getByTestId('answer-option-2'));
    fireEvent.click(getByTestId('check-answer-btn'));

    // Assert
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/quiz/question-progress', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('questionIndex')
      }));
    });
  });

  test('should restore session progress on reload', async () => {
    // Arrange
    const mockSession = {
      Session_ID: 123,
      Current_Question: 2,
      Score: 60,
      questionProgress: [
        { Question_Index: 0, Selected_Answer: 2, Is_Correct: true },
        { Question_Index: 1, Selected_Answer: 2, Is_Correct: true }
      ]
    };

    const mockFetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSession)
      })
    );
    global.fetch = mockFetch;

    // Act
    const { getByTestId } = render(<QuizPageSection sessionId="123" />);

    // Assert
    await waitFor(() => {
      expect(getByTestId('question-counter')).toHaveTextContent('3/10');
      expect(getByTestId('score-display')).toHaveTextContent('60');
    });
  });
});
```

#### TC-607: Session Completion and Score Submission
**Priority**: Critical (Score: 8.6)  
**Test Objective**: Verify session completion and final score submission

```typescript
describe('Session Completion and Score Submission', () => {
  test('should complete session and submit final score', async () => {
    // Arrange
    const mockFetch = jest.fn(() => Promise.resolve({ ok: true }));
    global.fetch = mockFetch;

    const { getByTestId } = render(<QuizPageSection />);
    
    // Complete all questions
    for (let i = 0; i < 10; i++) {
      fireEvent.click(getByTestId(`answer-option-2`));
      fireEvent.click(getByTestId('check-answer-btn'));
      if (i < 9) {
        fireEvent.click(getByTestId('next-question-btn'));
      }
    }

    // Assert
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/quiz/session', expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('finalScore')
      }));
      expect(getByTestId('quiz-complete-screen')).toBeInTheDocument();
    });
  });

  test('should update player score and level after completion', async () => {
    // Arrange
    const mockFetch = jest.fn(() => Promise.resolve({ ok: true }));
    global.fetch = mockFetch;

    const { getByTestId } = render(<QuizPageSection />);
    
    // Complete quiz
    fireEvent.click(getByTestId('save-score-btn'));

    // Assert
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/updateScore', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('finalScore')
      }));
    });
  });

  test('should handle session completion for new users', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection player={{}} />);
    
    // Complete quiz as new user
    fireEvent.click(getByTestId('save-score-btn'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('temp-score-cookie')).toBeInTheDocument();
    });
  });
});
```

### 4. Real-time Features Tests

#### TC-608: Live Leaderboard Integration
**Priority**: High (Score: 7.4)  
**Test Objective**: Verify real-time leaderboard updates

```typescript
describe('Live Leaderboard Integration', () => {
  test('should update leaderboard after score submission', async () => {
    // Arrange
    const mockLeaderboardData = [
      { Player_ID: 1, Player_name: '@user1', Playerpoint: 950, Level_Id: 5 },
      { Player_ID: 2, Player_name: '@user2', Playerpoint: 920, Level_Id: 4 }
    ];

    const mockFetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockLeaderboardData)
      })
    );
    global.fetch = mockFetch;

    const { getByTestId } = render(<QuizPageSection />);

    // Act
    fireEvent.click(getByTestId('refresh-leaderboard-btn'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('leaderboard-row-1')).toHaveTextContent('@user1');
      expect(getByTestId('leaderboard-row-1')).toHaveTextContent('950');
    });
  });

  test('should highlight current user in leaderboard', async () => {
    // Arrange
    const currentPlayer = { Player_ID: 2, Player_name: '@currentuser' };
    const { getByTestId } = render(<QuizPageSection player={currentPlayer} />);

    // Assert
    expect(getByTestId('leaderboard-row-2')).toHaveClass('current-user-highlight');
    expect(getByTestId('leaderboard-row-2')).toHaveTextContent('(You)');
  });

  test('should auto-refresh leaderboard periodically', async () => {
    // Arrange
    jest.useFakeTimers();
    const mockFetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
    global.fetch = mockFetch;

    render(<QuizPageSection />);

    // Act
    act(() => {
      jest.advanceTimersByTime(30000); // 30 seconds
    });

    // Assert
    expect(mockFetch).toHaveBeenCalledWith('/api/leaderboard');
    
    jest.useRealTimers();
  });
});
```

#### TC-609: Score Notifications and Feedback
**Priority**: Medium (Score: 6.8)  
**Test Objective**: Verify score notifications and user feedback

```typescript
describe('Score Notifications and Feedback', () => {
  test('should show score update notification', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    const correctAnswer = getByTestId('answer-option-2');

    // Act
    fireEvent.click(correctAnswer);
    fireEvent.click(getByTestId('check-answer-btn'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('score-notification')).toHaveTextContent('+30 points!');
      expect(getByTestId('score-notification')).toHaveClass('animate-bounce');
    });
  });

  test('should show mascot feedback based on answer', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    const wrongAnswer = getByTestId('answer-option-1');

    // Act
    fireEvent.click(wrongAnswer);
    fireEvent.click(getByTestId('check-answer-btn'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('mascot-image')).toHaveAttribute('src', '/mascot/sadMascot.svg');
    });
  });

  test('should show progress saving indicator', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    
    // Act - Trigger save
    fireEvent.click(getByTestId('answer-option-2'));
    fireEvent.click(getByTestId('check-answer-btn'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('saving-indicator')).toHaveTextContent('Saving progress...');
    });

    await waitFor(() => {
      expect(getByTestId('saved-indicator')).toHaveTextContent('Progress saved');
    });
  });
});
```

### 5. Performance and Edge Cases Tests

#### TC-610: Performance and Load Testing
**Priority**: Medium (Score: 6.5)  
**Test Objective**: Verify performance under load and edge cases

```typescript
describe('Performance and Edge Cases', () => {
  test('should handle rapid answer submissions', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    const answerOption = getByTestId('answer-option-2');
    const checkButton = getByTestId('check-answer-btn');

    // Act - Rapid clicks
    fireEvent.click(answerOption);
    fireEvent.click(checkButton);
    fireEvent.click(checkButton);
    fireEvent.click(checkButton);

    // Assert
    await waitFor(() => {
      expect(getByTestId('score-display')).toHaveTextContent('30'); // Should only count once
    });
  });

  test('should handle network interruptions gracefully', async () => {
    // Arrange
    const mockFetch = jest.fn(() => Promise.reject(new Error('Network error')));
    global.fetch = mockFetch;

    const { getByTestId } = render(<QuizPageSection />);
    
    // Act
    fireEvent.click(getByTestId('answer-option-2'));
    fireEvent.click(getByTestId('check-answer-btn'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('error-notification')).toHaveTextContent('Failed to save progress');
    });
  });

  test('should handle concurrent quiz sessions', async () => {
    // Arrange
    const { getByTestId } = render(<QuizPageSection />);
    
    // Simulate multiple tabs/windows
    const session1 = { Session_ID: 1, Score: 30 };
    const session2 = { Session_ID: 2, Score: 60 };

    // Act
    fireEvent.click(getByTestId('answer-option-2'));
    fireEvent.click(getByTestId('check-answer-btn'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('session-id')).toHaveTextContent('1');
      expect(getByTestId('score-display')).toHaveTextContent('30');
    });
  });
});
```

## Test Execution Plan

### Phase 1: Critical Tests (Week 1)
- **TC-601**: Answer Selection and Validation
- **TC-602**: Timer Functionality  
- **TC-603**: Basic Scoring Calculation
- **TC-606**: Quiz Session Management

### Phase 2: High Priority Tests (Week 2)
- **TC-604**: Retry Scoring System
- **TC-605**: Power-up Scoring System
- **TC-607**: Session Completion and Score Submission
- **TC-608**: Live Leaderboard Integration

### Phase 3: Medium Priority Tests (Week 3)
- **TC-609**: Score Notifications and Feedback
- **TC-610**: Performance and Edge Cases

## Test Environment Setup

### Required Test Data
```typescript
const mockQuizData = {
  test: {
    question: [
      {
        question: "What is the capital of France?",
        comment: "Geography question",
        test_answer: 2,
        answers: ["London", "Paris", "Berlin", "Madrid"]
      },
      {
        question: "Which planet is closest to the Sun?",
        comment: "Science question", 
        test_answer: 1,
        answers: ["Mercury", "Venus", "Earth", "Mars"]
      }
    ]
  }
};

const mockPlayer = {
  Player_ID: 1,
  Player_name: "@testuser",
  Playerpoint: 100,
  Level_Id: 2
};
```

### Mock API Responses
```typescript
// Session creation
const mockSessionResponse = {
  Session_ID: 123,
  Current_Question: 0,
  Score: 0,
  Completed: false
};

// Leaderboard data
const mockLeaderboardResponse = [
  { Player_ID: 1, Player_name: "@user1", Playerpoint: 950, Level_Id: 5 },
  { Player_ID: 2, Player_name: "@user2", Playerpoint: 920, Level_Id: 4 }
];
```

## Success Criteria

### Functional Requirements
- ✅ All answer submissions are validated correctly
- ✅ Scoring calculation works accurately for all scenarios
- ✅ Timer functionality operates correctly
- ✅ Session management handles all states
- ✅ Real-time features update properly
- ✅ Power-ups function as expected

### Performance Requirements
- ✅ Answer submission response time < 500ms
- ✅ Score calculation response time < 200ms
- ✅ Leaderboard updates within 30 seconds
- ✅ Session saves within 1 second

### Quality Requirements
- ✅ 100% test coverage for scoring logic
- ✅ 95% test coverage for session management
- ✅ 90% test coverage for real-time features
- ✅ Zero critical bugs in scoring system

## Risk Mitigation

### High Risk Areas
1. **Timer Synchronization**: Multiple timers running simultaneously
2. **Score Calculation**: Complex scoring with power-ups and retries
3. **Session State**: Maintaining consistency across page reloads
4. **Real-time Updates**: Network latency affecting leaderboard updates

### Mitigation Strategies
1. **Timer Management**: Use centralized timer service
2. **Score Validation**: Server-side score verification
3. **Session Recovery**: Robust session restoration logic
4. **Caching**: Implement client-side caching for real-time data

This comprehensive test suite ensures thorough validation of the quiz submission and scoring functionality, covering all critical user interactions and edge cases. 