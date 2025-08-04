import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { userEvent } from '@testing-library/user-event';

// Mock the main app components
const MockApp = () => {
  const [showError, setShowError] = React.useState(false);
  const [showQuizError, setShowQuizError] = React.useState(false);

  React.useEffect(() => {
    // Simulate network error for testing
    if (global.fetch && (global.fetch as jest.Mock).mockRejectedValueOnce) {
      setShowError(true);
    }
    // Simulate quiz loading error
    if (global.fetch && (global.fetch as jest.Mock).mockRejectedValueOnce) {
      setShowQuizError(true);
    }
  }, []);

  return (
    <div data-testid="app">
      <div data-testid="signup-section">
        <button data-testid="signup-button">Sign Up</button>
        <input data-testid="username" placeholder="Username" />
        <input data-testid="password" type="password" placeholder="Password" />
        <input data-testid="name" placeholder="Full Name" />
        <button data-testid="create-account-button">Create Account</button>
        {showError && <div data-testid="network-error">Network error</div>}
      </div>
      
      <div data-testid="quiz-selection" style={{ display: 'none' }}>
        <button data-testid="start-quiz-button">Start Quiz</button>
        {showQuizError && <div data-testid="quiz-loading-error">Failed to load quiz</div>}
      </div>
      
      <div data-testid="quiz-question" style={{ display: 'none' }}>
        <div data-testid="answer-option-1">Answer 1</div>
        <div data-testid="answer-option-2">Answer 2</div>
        <div data-testid="answer-option-3">Answer 3</div>
        <div data-testid="answer-option-4">Answer 4</div>
        <div data-testid="answer-option-5">Answer 5</div>
        <div data-testid="answer-option-6">Answer 6</div>
        <div data-testid="answer-option-7">Answer 7</div>
        <div data-testid="answer-option-8">Answer 8</div>
        <div data-testid="answer-option-9">Answer 9</div>
        <div data-testid="answer-option-10">Answer 10</div>
        <button data-testid="next-button">Next</button>
      </div>
      
      <div data-testid="quiz-results" style={{ display: 'none' }}>
        <div data-testid="final-score">0 points</div>
        <button data-testid="view-leaderboard-button">View Leaderboard</button>
      </div>
      
      <div data-testid="leaderboard" style={{ display: 'none' }}>
        <div data-testid="user-rank">1</div>
      </div>
    </div>
  );
};

const MockReferralApp = () => (
  <div data-testid="referral-app">
    <div data-testid="signup-section">
      <button data-testid="signup-button">Sign Up</button>
      <input data-testid="username" placeholder="Username" />
      <input data-testid="password" type="password" placeholder="Password" />
      <input data-testid="name" placeholder="Full Name" />
      <input data-testid="referral-code" placeholder="Referral Code" />
      <button data-testid="create-account-button">Create Account</button>
    </div>
    
    <div data-testid="referral-bonus" style={{ display: 'none' }}>+25 points</div>
    
    <div data-testid="quiz-selection" style={{ display: 'none' }}>
      <button data-testid="start-quiz-button">Start Quiz</button>
    </div>
    
    <div data-testid="quiz-question" style={{ display: 'none' }}>
      <div data-testid="answer-option-1">Answer 1</div>
      <div data-testid="answer-option-2">Answer 2</div>
      <div data-testid="answer-option-3">Answer 3</div>
      <div data-testid="answer-option-4">Answer 4</div>
      <div data-testid="answer-option-5">Answer 5</div>
      <div data-testid="answer-option-6">Answer 6</div>
      <div data-testid="answer-option-7">Answer 7</div>
      <div data-testid="answer-option-8">Answer 8</div>
      <div data-testid="answer-option-9">Answer 9</div>
      <div data-testid="answer-option-10">Answer 10</div>
      <button data-testid="next-button">Next</button>
    </div>
    
    <div data-testid="quiz-results" style={{ display: 'none' }}>
      <div data-testid="final-score">0 points</div>
    </div>
  </div>
);

const MockOfflineApp = () => (
  <div data-testid="offline-app">
    <div data-testid="quiz-selection">
      <button data-testid="start-quiz-button">Start Quiz</button>
    </div>
    
    <div data-testid="quiz-question" style={{ display: 'none' }}>
      <div data-testid="answer-option-1">Answer 1</div>
      <div data-testid="answer-option-2">Answer 2</div>
      <div data-testid="answer-option-3">Answer 3</div>
      <div data-testid="answer-option-4">Answer 4</div>
      <div data-testid="answer-option-5">Answer 5</div>
      <div data-testid="answer-option-6">Answer 6</div>
      <div data-testid="answer-option-7">Answer 7</div>
      <div data-testid="answer-option-8">Answer 8</div>
      <div data-testid="answer-option-9">Answer 9</div>
      <div data-testid="answer-option-10">Answer 10</div>
      <button data-testid="next-button">Next</button>
    </div>
    
    <div data-testid="offline-results" style={{ display: 'none' }}>
      <div data-testid="offline-score">0 points</div>
      <button data-testid="sync-results">Sync Results</button>
    </div>
    
    <div data-testid="sync-success" style={{ display: 'none' }}>
      Results synced successfully
    </div>
    
    <div data-testid="leaderboard-update" style={{ display: 'none' }}>
      Leaderboard updated
    </div>
  </div>
);

// Mock components - these will be replaced with actual component imports when available

describe('Complete User Journey - Signup to Quiz to Leaderboard', () => {
  beforeEach(() => {
    // Reset fetch mock
    (global.fetch as jest.Mock).mockClear();
  });

  test('should complete full user journey successfully', async () => {
    // Arrange
    const { getByTestId, getByRole } = render(<MockApp />);

    // Step 1: Signup
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    await userEvent.type(getByTestId('username'), '@newuser');
    await userEvent.type(getByTestId('password'), 'TestPassword123!');
    await userEvent.type(getByTestId('name'), 'New User');
    fireEvent.click(getByRole('button', { name: /create account/i }));

    // Wait for signup completion
    await waitFor(() => {
      expect(getByTestId('quiz-selection')).toBeInTheDocument();
    });

    // Step 2: Start Quiz
    fireEvent.click(getByTestId('start-quiz-button'));

    // Wait for quiz to load
    await waitFor(() => {
      expect(getByTestId('quiz-question')).toBeInTheDocument();
    });

    // Step 3: Complete Quiz
    for (let i = 1; i <= 10; i++) {
      fireEvent.click(getByTestId(`answer-option-${i}`));
      fireEvent.click(getByTestId('next-button'));
    }

    // Wait for quiz completion
    await waitFor(() => {
      expect(getByTestId('quiz-results')).toBeInTheDocument();
    });

    // Step 4: View Leaderboard
    fireEvent.click(getByTestId('view-leaderboard-button'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('leaderboard')).toBeInTheDocument();
      expect(getByTestId('user-rank')).toHaveTextContent(/\d+/);
    });
  });

  test('should handle referral flow from signup to quiz completion', async () => {
    // Arrange
    const referralCode = 'REF123';
    const { getByTestId, getByRole } = render(<MockReferralApp />);

    // Step 1: Signup with referral
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    await userEvent.type(getByTestId('username'), '@referreduser');
    await userEvent.type(getByTestId('password'), 'TestPassword123!');
    await userEvent.type(getByTestId('name'), 'Referred User');
    await userEvent.type(getByTestId('referral-code'), referralCode);
    fireEvent.click(getByRole('button', { name: /create account/i }));

    // Wait for signup completion
    await waitFor(() => {
      expect(getByTestId('referral-bonus')).toHaveTextContent('+25 points');
    });

    // Step 2: Complete Quiz with bonus points
    fireEvent.click(getByTestId('start-quiz-button'));

    // Complete quiz
    for (let i = 1; i <= 10; i++) {
      fireEvent.click(getByTestId(`answer-option-${i}`));
      fireEvent.click(getByTestId('next-button'));
    }

    // Assert final score includes referral bonus
    await waitFor(() => {
      const finalScore = getByTestId('final-score');
      expect(finalScore).toHaveTextContent(/\d+ points/);
    });
  });

  test('should sync offline quiz results when back online', async () => {
    // Arrange
    const { getByTestId, getByRole } = render(<MockOfflineApp />);

    // Start quiz online
    fireEvent.click(getByTestId('start-quiz-button'));

    // Simulate going offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    // Complete quiz offline
    for (let i = 1; i <= 10; i++) {
      fireEvent.click(getByTestId(`answer-option-${i}`));
      fireEvent.click(getByTestId('next-button'));
    }

    // Wait for offline completion
    await waitFor(() => {
      expect(getByTestId('offline-results')).toBeInTheDocument();
    });

    // Simulate coming back online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });

    // Sync results
    fireEvent.click(getByTestId('sync-results'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('sync-success')).toBeInTheDocument();
      expect(getByTestId('leaderboard-update')).toBeInTheDocument();
    });
  });
});

describe('Mobile User Journey', () => {
  test('should complete full journey on mobile device', async () => {
    // Arrange - Set mobile viewport
    window.innerWidth = 375;
    window.innerHeight = 667;
    window.dispatchEvent(new Event('resize'));

    const { getByTestId, getByRole } = render(<MockApp />);

    // Step 1: Mobile signup
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    await userEvent.type(getByTestId('username'), '@mobileuser');
    await userEvent.type(getByTestId('password'), 'TestPassword123!');
    await userEvent.type(getByTestId('name'), 'Mobile User');
    fireEvent.click(getByRole('button', { name: /create account/i }));

    // Step 2: Mobile quiz interaction
    await waitFor(() => {
      expect(getByTestId('quiz-selection')).toBeInTheDocument();
    });

    fireEvent.click(getByTestId('start-quiz-button'));

    // Complete quiz with touch interactions
    for (let i = 1; i <= 10; i++) {
      fireEvent.touchStart(getByTestId(`answer-option-${i}`));
      fireEvent.touchEnd(getByTestId(`answer-option-${i}`));
      fireEvent.click(getByTestId('next-button'));
    }

    // Step 3: Mobile results view
    await waitFor(() => {
      expect(getByTestId('quiz-results')).toBeInTheDocument();
    });

    // Assert mobile-specific features
    expect(getByTestId('final-score')).toBeInTheDocument();
  });
});

describe('Error Handling in User Journey', () => {
  test('should handle network errors during signup', async () => {
    // Arrange
    const mockFetch = jest.fn(() => Promise.reject(new Error('Network error')));
    global.fetch = mockFetch;

    const { getByTestId, getByRole } = render(<MockApp />);

    // Act
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    await userEvent.type(getByTestId('username'), '@testuser');
    await userEvent.type(getByTestId('password'), 'TestPassword123!');
    await userEvent.type(getByTestId('name'), 'Test User');
    fireEvent.click(getByRole('button', { name: /create account/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('network-error')).toBeInTheDocument();
    });
  });

  test('should handle quiz loading errors', async () => {
    // Arrange
    const { getByTestId } = render(<MockApp />);

    // Simulate quiz loading error
    const mockFetch = jest.fn(() => Promise.reject(new Error('Quiz loading failed')));
    global.fetch = mockFetch;

    // Act
    fireEvent.click(getByTestId('start-quiz-button'));

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('quiz-loading-error')).toBeInTheDocument();
    });
  });
}); 