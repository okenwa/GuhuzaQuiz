# How to Apply Test Cases to Guhuza Quiz App

## 🎯 Overview

This guide explains how to apply the comprehensive test cases from `COMPREHENSIVE_TEST_CASES_EXPANDED.md` to your Guhuza Quiz App. The test framework is now set up and ready to use.

## ✅ Current Status

- ✅ Jest configuration is working
- ✅ React Testing Library is configured
- ✅ Test files are created and organized
- ✅ Mock components are in place
- ✅ Test runner commands are available

## 📁 Test Structure Created

```
__tests__/
├── quiz/
│   └── quiz-submission.test.tsx      # Quiz functionality tests
├── leaderboard/
│   └── leaderboard.test.tsx          # Leaderboard tests
├── referral/
│   └── referral-system.test.tsx      # Referral system tests
├── integration/
│   └── user-journey.test.tsx         # End-to-end integration tests
├── mobile/
│   └── mobile-responsiveness.test.tsx # Mobile responsiveness tests
└── test-runner.md                    # Test runner guide
```

## 🚀 How to Apply Test Cases

### Step 1: Run Tests to See Current Status

```bash
# Run all tests to see what's working
npm test

# Run specific test suites
npm run test:quiz
npm run test:leaderboard
npm run test:referral
npm run test:integration
npm run test:mobile
```

### Step 2: Add Test IDs to Your Components

The tests expect specific `data-testid` attributes. Add these to your components:

#### Quiz Components
```tsx
// In your quiz question component
<div data-testid="quiz-question">
  <div data-testid="answer-option-1" onClick={handleAnswer}>
    {answer1}
  </div>
  <button data-testid="submit-button" onClick={handleSubmit}>
    Submit
  </button>
  <div data-testid="answer-feedback">
    {feedback}
  </div>
  <div data-testid="time-taken">
    {timeTaken} seconds
  </div>
</div>
```

#### Leaderboard Components
```tsx
// In your leaderboard component
<div data-testid="leaderboard">
  <div data-testid="loading-spinner">Loading...</div>
  <div data-testid="leaderboard-list">
    <div data-testid="user-rank-1">{user.rank}</div>
    <div data-testid="user-score-1">{user.score}</div>
  </div>
  <button data-testid="retry-button">Retry</button>
</div>
```

#### Referral Components
```tsx
// In your referral component
<div data-testid="referral-system">
  <button data-testid="generate-referral-button">
    Generate Referral Link
  </button>
  <input data-testid="referral-link" value={referralLink} readOnly />
  <button data-testid="copy-link-button">Copy Link</button>
</div>
```

### Step 3: Update Component Imports in Tests

Replace the mock components with your actual components:

```tsx
// In test files, update these imports:
import QuizQuestion from '@/app/components/quizQuestion';
import Leaderboard from '@/app/components/leaderBoard';
import ReferralSystem from '@/app/components/referralSystem';
// ... etc
```

### Step 4: Implement Missing Functionality

Based on the test failures, implement the missing features:

#### Quiz Features to Implement:
- Answer validation
- Score calculation
- Progress tracking
- Time tracking
- Quiz completion

#### Leaderboard Features to Implement:
- Data fetching from API
- Real-time updates
- Error handling
- Loading states

#### Referral Features to Implement:
- Referral link generation
- Clipboard functionality
- Social media sharing
- Referral tracking

### Step 5: Run Tests Incrementally

```bash
# Start with critical tests
npm run test:critical

# Then run feature-specific tests
npm run test:quiz
npm run test:leaderboard
npm run test:referral

# Finally run all tests
npm run test:all-features
```

## 📊 Test Categories and Priorities

### Critical Tests (Run First)
- Quiz submission and validation
- User journey integration
- Security features

### High Priority Tests (Run Second)
- Leaderboard functionality
- Referral system
- Mobile responsiveness

### Medium Priority Tests (Run Last)
- Offline functionality
- Performance optimization
- Advanced features

## 🔧 Test Commands Available

```bash
# Basic commands
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report

# Feature-specific commands
npm run test:quiz          # Quiz tests only
npm run test:leaderboard   # Leaderboard tests only
npm run test:referral      # Referral tests only
npm run test:integration   # Integration tests only
npm run test:mobile        # Mobile tests only

# Priority-based commands
npm run test:critical      # Critical priority tests
npm run test:high          # High priority tests
npm run test:all-features  # All feature tests
npm run test:ci            # CI mode (no watch, with coverage)
```

## 🎯 Implementation Strategy

### Phase 1: Core Quiz Functionality (Week 1-2)
1. Implement quiz question display
2. Add answer selection
3. Implement scoring system
4. Add progress tracking
5. Run: `npm run test:quiz`

### Phase 2: Leaderboard System (Week 3-4)
1. Implement leaderboard API
2. Add real-time updates
3. Handle loading states
4. Add error handling
5. Run: `npm run test:leaderboard`

### Phase 3: Referral System (Week 5-6)
1. Implement referral link generation
2. Add clipboard functionality
3. Implement social sharing
4. Add referral tracking
5. Run: `npm run test:referral`

### Phase 4: Integration & Mobile (Week 7-8)
1. Complete user journeys
2. Add mobile responsiveness
3. Implement offline functionality
4. Performance optimization
5. Run: `npm run test:all-features`

## 🐛 Troubleshooting Common Issues

### Issue: Component Not Found
```bash
# Error: Cannot find module '@/app/components/quizQuestion'
# Solution: Update import path in test file to match your structure
```

### Issue: Test ID Not Found
```bash
# Error: Unable to find element with data-testid: "quiz-question"
# Solution: Add the missing data-testid to your component
```

### Issue: Mock Not Working
```bash
# Error: fetch is not mocked
# Solution: Ensure jest.setup.js is properly configured
```

### Issue: Test Failing
```bash
# Run with verbose output to see details
npm test -- --verbose --no-coverage

# Run single test file
npm test -- --verbose __tests__/quiz/quiz-submission.test.tsx
```

## 📈 Quality Gates

### Test Coverage Requirements
- **Unit Test Coverage**: 90%+
- **Integration Test Coverage**: 85%+
- **E2E Test Coverage**: 80%+
- **Security Test Coverage**: 100%
- **Performance Test Coverage**: 75%+
- **Mobile Test Coverage**: 85%+

### Pass/Fail Criteria
1. All Critical tests must pass (Score 8.0+)
2. All High Priority tests must pass (Score 7.0+)
3. Security tests must have 100% pass rate
4. Performance tests must meet SLA requirements
5. Mobile responsiveness tests must pass on all target devices

## 🚀 Next Steps

1. **Start with Critical Tests**: Run `npm run test:critical`
2. **Add Test IDs**: Ensure all components have proper test identifiers
3. **Implement Features**: Build functionality to match test expectations
4. **Update Mocks**: Replace mock components with actual components
5. **Run Full Suite**: Once critical tests pass, run `npm run test:all-features`
6. **Monitor Coverage**: Use `npm run test:coverage` to track test coverage
7. **Set Up CI**: Configure continuous integration to run tests automatically

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Test Runner Guide](__tests__/test-runner.md)
- [Comprehensive Test Cases](COMPREHENSIVE_TEST_CASES_EXPANDED.md)

## 🎉 Success Metrics

You'll know you've successfully applied the test cases when:

- ✅ All critical tests pass
- ✅ All high priority tests pass
- ✅ Test coverage meets requirements
- ✅ CI/CD pipeline runs tests automatically
- ✅ Tests catch regressions before deployment
- ✅ Development velocity increases due to confidence in changes

---

**Remember**: The tests are designed to guide your implementation. Start with the critical tests and work your way through the features systematically. The test failures will show you exactly what functionality needs to be implemented. 