# Test Runner Guide - How to Apply Test Cases

## Overview
This guide explains how to apply and run the comprehensive test cases for the Guhuza Quiz App.

## Test Structure

### Directory Organization
```
__tests__/
├── quiz/                    # Quiz functionality tests
│   └── quiz-submission.test.tsx
├── leaderboard/            # Leaderboard tests
│   └── leaderboard.test.tsx
├── referral/               # Referral system tests
│   └── referral-system.test.tsx
├── integration/            # End-to-end integration tests
│   └── user-journey.test.tsx
├── mobile/                 # Mobile responsiveness tests
│   └── mobile-responsiveness.test.tsx
└── utils/                  # Utility function tests
```

## Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (no watch, with coverage)
npm run test:ci
```

### Feature-Specific Commands
```bash
# Run quiz-related tests only
npm run test:quiz

# Run leaderboard tests only
npm run test:leaderboard

# Run referral system tests only
npm run test:referral

# Run integration tests only
npm run test:integration

# Run mobile responsiveness tests only
npm run test:mobile

# Run all feature tests together
npm run test:all-features
```

### Priority-Based Commands
```bash
# Run critical priority tests only
npm run test:critical

# Run high priority tests only
npm run test:high
```

## Test Execution Strategy

### Phase 1: Critical Tests (Week 1-2)
Run these tests first as they cover core functionality:
```bash
npm run test:critical
npm run test:quiz
npm run test:integration
```

### Phase 2: High Priority Tests (Week 3-4)
Run these tests after critical tests pass:
```bash
npm run test:high
npm run test:leaderboard
npm run test:referral
npm run test:mobile
```

### Phase 3: All Tests (Week 5-6)
Run the complete test suite:
```bash
npm run test:all-features
npm run test:coverage
```

## Test Categories

### 1. Quiz Submission Tests
- **File**: `__tests__/quiz/quiz-submission.test.tsx`
- **Focus**: Answer validation, scoring, progress tracking
- **Priority**: Critical
- **Command**: `npm run test:quiz`

### 2. Leaderboard Tests
- **File**: `__tests__/leaderboard/leaderboard.test.tsx`
- **Focus**: Data fetching, real-time updates, user rankings
- **Priority**: High
- **Command**: `npm run test:leaderboard`

### 3. Referral System Tests
- **File**: `__tests__/referral/referral-system.test.tsx`
- **Focus**: Link generation, tracking, bonuses
- **Priority**: High
- **Command**: `npm run test:referral`

### 4. Integration Tests
- **File**: `__tests__/integration/user-journey.test.tsx`
- **Focus**: Complete user journeys, error handling
- **Priority**: Critical
- **Command**: `npm run test:integration`

### 5. Mobile Tests
- **File**: `__tests__/mobile/mobile-responsiveness.test.tsx`
- **Focus**: Responsive design, touch interactions, performance
- **Priority**: High
- **Command**: `npm run test:mobile`

## Test Configuration

### Jest Configuration
The tests use the following configuration from `jest.config.js`:
- **Environment**: jsdom (for DOM testing)
- **Setup**: `jest.setup.js` (for global mocks)
- **Coverage**: Collects from `app/**/*.{js,jsx,ts,tsx}`
- **Test Patterns**: Matches files in `__tests__/` and `*.test.*` files

### Global Mocks
The `jest.setup.js` file provides mocks for:
- Next.js router and components
- Browser APIs (localStorage, sessionStorage, fetch)
- Prisma database client
- Authentication
- Analytics and contexts

## Applying Test Cases to Your Components

### Step 1: Add Test IDs
Add `data-testid` attributes to your components:
```tsx
// Example: Quiz Question Component
<div data-testid="quiz-question">
  <div data-testid="answer-option-1" onClick={handleAnswer}>
    {answer1}
  </div>
  <button data-testid="submit-button" onClick={handleSubmit}>
    Submit
  </button>
</div>
```

### Step 2: Update Component Imports
Update the mock imports in test files to match your actual component structure:
```tsx
// In test files, update these imports:
import QuizQuestion from '@/app/components/quizQuestion';
import Leaderboard from '@/app/components/leaderBoard';
// ... etc
```

### Step 3: Run Tests and Fix Issues
```bash
# Run specific test suite
npm run test:quiz

# Fix any failing tests by updating:
# 1. Component structure to match test expectations
# 2. Test mocks to match actual component behavior
# 3. Test assertions to match actual component output
```

## Quality Gates

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

## Troubleshooting

### Common Issues

1. **Component Not Found**
   ```bash
   # Error: Cannot find module '@/app/components/quizQuestion'
   # Solution: Update import path in test file to match your structure
   ```

2. **Test ID Not Found**
   ```bash
   # Error: Unable to find element with data-testid: "quiz-question"
   # Solution: Add the missing data-testid to your component
   ```

3. **Mock Not Working**
   ```bash
   # Error: fetch is not mocked
   # Solution: Ensure jest.setup.js is properly configured
   ```

### Debug Commands
```bash
# Run single test file with verbose output
npm test -- --verbose __tests__/quiz/quiz-submission.test.tsx

# Run tests with detailed error messages
npm test -- --verbose --no-coverage

# Run tests and show console output
npm test -- --verbose --silent=false
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:coverage
```

## Next Steps

1. **Run Critical Tests First**: Start with `npm run test:critical`
2. **Fix Failing Tests**: Update components to match test expectations
3. **Add Missing Test IDs**: Ensure all components have proper test identifiers
4. **Update Mocks**: Adjust mocks to match your actual component behavior
5. **Run Full Suite**: Once critical tests pass, run `npm run test:all-features`
6. **Monitor Coverage**: Use `npm run test:coverage` to track test coverage
7. **Set Up CI**: Configure continuous integration to run tests automatically

## Support

If you encounter issues:
1. Check the Jest documentation: https://jestjs.io/docs/getting-started
2. Review React Testing Library docs: https://testing-library.com/docs/react-testing-library/intro/
3. Check the test setup files for mock configurations
4. Ensure all dependencies are properly installed 