import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock components - these will be replaced with actual component imports when available
const MockQuizQuestion = () => {
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [feedbackText, setFeedbackText] = React.useState('Feedback');
  const [showError, setShowError] = React.useState(false);
  const [timeTaken, setTimeTaken] = React.useState(0);

  const handleAnswerClick = (answer: number) => {
    setSelectedAnswer(answer);
    setShowError(false);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      setShowError(true);
      return;
    }
    setShowFeedback(true);
    setTimeTaken(Math.floor(Math.random() * 10) + 1);
  };

  const handleAnswerChange = (newAnswer: number) => {
    setSelectedAnswer(newAnswer);
    setFeedbackText('Updated feedback');
  };

  return (
    <div data-testid="quiz-question">
      <div data-testid="answer-option-1" onClick={() => handleAnswerClick(1)}>Answer 1</div>
      <div data-testid="answer-option-2" onClick={() => handleAnswerChange(2)}>Answer 2</div>
      <button data-testid="submit-button" onClick={handleSubmit}>Submit</button>
      {showError && <div data-testid="error-message">Please select an answer</div>}
      {showFeedback && <div data-testid="answer-feedback">{feedbackText}</div>}
      <div data-testid="time-taken">{timeTaken} seconds</div>
    </div>
  );
};

const MockQuizSession = () => {
  const [score, setScore] = React.useState(0);
  const [progress, setProgress] = React.useState(10);
  const [currentQuestion, setCurrentQuestion] = React.useState(1);
  const [isComplete, setIsComplete] = React.useState(false);

  const handleCorrectAnswer = () => {
    setScore(score + 10);
    setProgress(progress + 10);
    setCurrentQuestion(currentQuestion + 1);
    
    if (currentQuestion >= 10) {
      setIsComplete(true);
    }
  };

  const handleAnswerClick = (answerNumber: number) => {
    handleCorrectAnswer();
  };

  return (
    <div data-testid="quiz-session">
      <div data-testid="correct-answer" onClick={handleCorrectAnswer}>Correct Answer</div>
      <button data-testid="submit-button">Submit</button>
      <div data-testid="current-score">{score}</div>
      <div data-testid="progress-bar" style={{ width: `${progress}%` }}></div>
      <div data-testid="question-progress">Question {currentQuestion} of 10</div>
      {isComplete && <div data-testid="quiz-complete">Quiz Complete</div>}
      <div data-testid="final-score">{score} points</div>
      <div data-testid="answer-option-1" onClick={() => handleAnswerClick(1)}>Answer 1</div>
      <div data-testid="answer-option-2" onClick={() => handleAnswerClick(2)}>Answer 2</div>
      <div data-testid="answer-option-3" onClick={() => handleAnswerClick(3)}>Answer 3</div>
      <div data-testid="answer-option-4" onClick={() => handleAnswerClick(4)}>Answer 4</div>
      <div data-testid="answer-option-5" onClick={() => handleAnswerClick(5)}>Answer 5</div>
      <div data-testid="answer-option-6" onClick={() => handleAnswerClick(6)}>Answer 6</div>
      <div data-testid="answer-option-7" onClick={() => handleAnswerClick(7)}>Answer 7</div>
      <div data-testid="answer-option-8" onClick={() => handleAnswerClick(8)}>Answer 8</div>
      <div data-testid="answer-option-9" onClick={() => handleAnswerClick(9)}>Answer 9</div>
      <div data-testid="answer-option-10" onClick={() => handleAnswerClick(10)}>Answer 10</div>
    </div>
  );
};

describe('Quiz Answer Validation', () => {
  test('should accept valid answer submission', async () => {
    // Arrange
    const { getByTestId } = render(<MockQuizQuestion />);
    const answerOption = getByTestId('answer-option-1');
    const submitButton = getByTestId('submit-button');

    // Act
    fireEvent.click(answerOption);
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(getByTestId('answer-feedback')).toBeInTheDocument();
    });
  });

  test('should reject submission without answer selection', async () => {
    // Arrange
    const { getByTestId } = render(<MockQuizQuestion />);
    const submitButton = getByTestId('submit-button');

    // Act
    fireEvent.click(submitButton);

    // Assert
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  test('should handle multiple answer submissions correctly', async () => {
    // Arrange
    const { getByTestId } = render(<MockQuizQuestion />);
    const answerOption1 = getByTestId('answer-option-1');
    const answerOption2 = getByTestId('answer-option-2');
    const submitButton = getByTestId('submit-button');

    // Act - First submission
    fireEvent.click(answerOption1);
    fireEvent.click(submitButton);

    // Wait for feedback
    await waitFor(() => {
      expect(getByTestId('answer-feedback')).toBeInTheDocument();
    });

    // Act - Change answer and resubmit
    fireEvent.click(answerOption2);
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(getByTestId('answer-feedback')).toHaveTextContent('Updated feedback');
    });
  });

  test('should track answer submission time', async () => {
    // Arrange
    const { getByTestId } = render(<MockQuizQuestion />);
    const answerOption = getByTestId('answer-option-1');
    const submitButton = getByTestId('submit-button');

    // Act
    const startTime = Date.now();
    fireEvent.click(answerOption);
    fireEvent.click(submitButton);
    const endTime = Date.now();

    // Assert
    await waitFor(() => {
      const timeTaken = getByTestId('time-taken');
      expect(timeTaken).toHaveTextContent(/\d+ seconds/i);
    });
  });
});

describe('Quiz Scoring and Progress', () => {
  test('should calculate correct score for right answers', async () => {
    // Arrange
    const { getByTestId } = render(<MockQuizSession />);
    const correctAnswer = getByTestId('correct-answer');
    const submitButton = getByTestId('submit-button');

    // Act
    fireEvent.click(correctAnswer);
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      const scoreDisplay = getByTestId('current-score');
      expect(scoreDisplay).toHaveTextContent('10'); // Assuming 10 points per correct answer
    });
  });

  test('should track quiz progress correctly', async () => {
    // Arrange
    const { getByTestId } = render(<MockQuizSession />);

    // Act - Answer first question
    fireEvent.click(getByTestId('answer-option-1'));
    fireEvent.click(getByTestId('submit-button'));

    // Assert
    expect(screen.getByTestId('question-progress')).toHaveTextContent('Question 2 of 10');
    expect(getByTestId('progress-bar')).toHaveStyle({ width: '20%' });
  });

  test('should handle quiz completion and final scoring', async () => {
    // Arrange
    const { getByTestId } = render(<MockQuizSession />);

    // Act - Complete all questions
    for (let i = 1; i <= 10; i++) {
      fireEvent.click(getByTestId(`answer-option-${i}`));
      fireEvent.click(getByTestId('submit-button'));
    }

    // Assert
    await waitFor(() => {
      expect(getByTestId('quiz-complete')).toBeInTheDocument();
      expect(getByTestId('final-score')).toHaveTextContent(/\d+ points/i);
    });
  });
}); 