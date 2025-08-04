# Detailed Test Cases Implementation for Guhuza Quiz App

## Test Case Implementation Guide

This document provides detailed test case implementations for the Guhuza Quiz App signup functionality, organized by testing strategy and priority level.

---

## 1. Unit Test Cases

### 1.1 Signup Component Unit Tests

#### TC-001: Required Fields Validation
**Priority**: Critical (Score: 7.8)  
**Test Objective**: Verify that all required fields are validated before form submission

```typescript
describe('Required Fields Validation', () => {
  test('should prevent submission with empty username', async () => {
    // Arrange
    const { getByPlaceholderText, getByRole } = render(<SignUp />);
    const usernameInput = getByPlaceholderText('@YourUsername');
    const passwordInput = getByPlaceholderText('Enter Password here');
    const nameInput = getByPlaceholderText('Enter Your Name Here');
    const submitButton = getByRole('button', { name: /sign up/i });

    // Act
    fireEvent.change(passwordInput, { target: { value: 'TestPassword123!' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.click(submitButton);

    // Assert
    expect(usernameInput).toHaveAttribute('required');
    expect(submitButton).toBeDisabled();
  });

  test('should prevent submission with empty password', async () => {
    // Arrange
    const { getByPlaceholderText, getByRole } = render(<SignUp />);
    const usernameInput = getByPlaceholderText('@YourUsername');
    const passwordInput = getByPlaceholderText('Enter Password here');
    const nameInput = getByPlaceholderText('Enter Your Name Here');
    const submitButton = getByRole('button', { name: /sign up/i });

    // Act
    fireEvent.change(usernameInput, { target: { value: '@testuser' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.click(submitButton);

    // Assert
    expect(passwordInput).toHaveAttribute('required');
    expect(submitButton).toBeDisabled();
  });

  test('should prevent submission with empty name', async () => {
    // Arrange
    const { getByPlaceholderText, getByRole } = render(<SignUp />);
    const usernameInput = getByPlaceholderText('@YourUsername');
    const passwordInput = getByPlaceholderText('Enter Password here');
    const nameInput = getByPlaceholderText('Enter Your Name Here');
    const submitButton = getByRole('button', { name: /sign up/i });

    // Act
    fireEvent.change(usernameInput, { target: { value: '@testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword123!' } });
    fireEvent.click(submitButton);

    // Assert
    expect(nameInput).toHaveAttribute('required');
    expect(submitButton).toBeDisabled();
  });
});
```

#### TC-002: Username Format Validation
**Priority**: High (Score: 7.1)  
**Test Objective**: Verify username format validation

```typescript
describe('Username Format Validation', () => {
  test('should accept valid username with @ symbol', () => {
    // Arrange
    const { getByPlaceholderText } = render(<SignUp />);
    const usernameInput = getByPlaceholderText('@YourUsername');

    // Act
    fireEvent.change(usernameInput, { target: { value: '@testuser123' } });

    // Assert
    expect(usernameInput).toHaveValue('@testuser123');
  });

  test('should show error for username without @ symbol', () => {
    // Arrange
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    const usernameInput = getByPlaceholderText('@YourUsername');

    // Act
    fireEvent.change(usernameInput, { target: { value: 'testuser123' } });
    fireEvent.blur(usernameInput);

    // Assert
    expect(getByText(/username must start with @/i)).toBeInTheDocument();
  });

  test('should show error for username with special characters', () => {
    // Arrange
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    const usernameInput = getByPlaceholderText('@YourUsername');

    // Act
    fireEvent.change(usernameInput, { target: { value: '@test@user' } });
    fireEvent.blur(usernameInput);

    // Assert
    expect(getByText(/username contains invalid characters/i)).toBeInTheDocument();
  });

  test('should show error for username that is too long', () => {
    // Arrange
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    const usernameInput = getByPlaceholderText('@YourUsername');

    // Act
    fireEvent.change(usernameInput, { target: { value: '@' + 'a'.repeat(51) } });
    fireEvent.blur(usernameInput);

    // Assert
    expect(getByText(/username must be 50 characters or less/i)).toBeInTheDocument();
  });
});
```

#### TC-003: Password Strength Validation
**Priority**: Critical (Score: 8.0)  
**Test Objective**: Verify password strength requirements

```typescript
describe('Password Strength Validation', () => {
  test('should accept strong password', () => {
    // Arrange
    const { getByPlaceholderText } = render(<SignUp />);
    const passwordInput = getByPlaceholderText('Enter Password here');

    // Act
    fireEvent.change(passwordInput, { target: { value: 'TestPassword123!' } });

    // Assert
    expect(passwordInput).toHaveValue('TestPassword123!');
  });

  test('should show error for weak password (too short)', () => {
    // Arrange
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    const passwordInput = getByPlaceholderText('Enter Password here');

    // Act
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.blur(passwordInput);

    // Assert
    expect(getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  test('should show error for password without uppercase letter', () => {
    // Arrange
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    const passwordInput = getByPlaceholderText('Enter Password here');

    // Act
    fireEvent.change(passwordInput, { target: { value: 'testpassword123!' } });
    fireEvent.blur(passwordInput);

    // Assert
    expect(getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
  });

  test('should show error for password without number', () => {
    // Arrange
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    const passwordInput = getByPlaceholderText('Enter Password here');

    // Act
    fireEvent.change(passwordInput, { target: { value: 'TestPassword!' } });
    fireEvent.blur(passwordInput);

    // Assert
    expect(getByText(/password must contain at least one number/i)).toBeInTheDocument();
  });

  test('should show error for common weak password', () => {
    // Arrange
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    const passwordInput = getByPlaceholderText('Enter Password here');

    // Act
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.blur(passwordInput);

    // Assert
    expect(getByText(/password is too common, please choose a stronger password/i)).toBeInTheDocument();
  });
});
```

#### TC-004: Password Visibility Toggle
**Priority**: Medium (Score: 5.3)  
**Test Objective**: Verify password visibility toggle functionality

```typescript
describe('Password Visibility Toggle', () => {
  test('should toggle password visibility when show/hide button is clicked', () => {
    // Arrange
    const { getByPlaceholderText, getByRole } = render(<SignUp />);
    const passwordInput = getByPlaceholderText('Enter Password here');
    const toggleButton = getByRole('button', { name: /show/i });

    // Act - Initial state
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveTextContent('Show');

    // Act - Toggle to show
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveTextContent('Hide');

    // Act - Toggle to hide
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveTextContent('Show');
  });

  test('should maintain password value when toggling visibility', () => {
    // Arrange
    const { getByPlaceholderText, getByRole } = render(<SignUp />);
    const passwordInput = getByPlaceholderText('Enter Password here');
    const toggleButton = getByRole('button', { name: /show/i });

    // Act
    fireEvent.change(passwordInput, { target: { value: 'TestPassword123!' } });
    fireEvent.click(toggleButton);

    // Assert
    expect(passwordInput).toHaveValue('TestPassword123!');
  });
});
```

#### TC-005: Loading States
**Priority**: High (Score: 7.1)  
**Test Objective**: Verify loading state management during form submission

```typescript
describe('Loading States', () => {
  test('should show loading state during form submission', async () => {
    // Arrange
    const mockFetch = jest.fn(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve({ player: {} }) }), 100))
    );
    global.fetch = mockFetch;

    const { getByPlaceholderText, getByRole } = render(<SignUp />);
    const usernameInput = getByPlaceholderText('@YourUsername');
    const passwordInput = getByPlaceholderText('Enter Password here');
    const nameInput = getByPlaceholderText('Enter Your Name Here');
    const submitButton = getByRole('button', { name: /sign up/i });

    // Act
    fireEvent.change(usernameInput, { target: { value: '@testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword123!' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.click(submitButton);

    // Assert
    expect(submitButton).toHaveTextContent('Signing up...');
    expect(submitButton).toBeDisabled();
    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(nameInput).toBeDisabled();
  });

  test('should return to normal state after successful submission', async () => {
    // Arrange
    const mockFetch = jest.fn(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve({ player: {} }) })
    );
    global.fetch = mockFetch;

    const { getByPlaceholderText, getByRole } = render(<SignUp />);
    const usernameInput = getByPlaceholderText('@YourUsername');
    const passwordInput = getByPlaceholderText('Enter Password here');
    const nameInput = getByPlaceholderText('Enter Your Name Here');
    const submitButton = getByRole('button', { name: /sign up/i });

    // Act
    fireEvent.change(usernameInput, { target: { value: '@testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword123!' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.click(submitButton);

    // Wait for submission to complete
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Sign Up');
    });

    // Assert
    expect(submitButton).not.toBeDisabled();
    expect(usernameInput).not.toBeDisabled();
    expect(passwordInput).not.toBeDisabled();
    expect(nameInput).not.toBeDisabled();
  });
});
```

---

## 2. API Test Cases

### 2.1 Signup API Validation Tests

#### TC-101: API Required Fields Validation
**Priority**: Critical (Score: 8.1)  
**Test Objective**: Verify API validates required fields

```typescript
describe('API Required Fields Validation', () => {
  test('should return 400 when username is missing', async () => {
    // Arrange
    const requestBody = {
      name: 'Test User',
      password: 'TestPassword123!',
      tempScore: 0
    };

    // Act
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // Assert
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toContain('All field are required');
  });

  test('should return 400 when password is missing', async () => {
    // Arrange
    const requestBody = {
      username: '@testuser',
      name: 'Test User',
      tempScore: 0
    };

    // Act
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // Assert
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toContain('All field are required');
  });

  test('should return 400 when name is missing', async () => {
    // Arrange
    const requestBody = {
      username: '@testuser',
      password: 'TestPassword123!',
      tempScore: 0
    };

    // Act
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // Assert
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toContain('All field are required');
  });
});
```

#### TC-102: Password Hashing Verification
**Priority**: Critical (Score: 8.3)  
**Test Objective**: Verify password is properly hashed

```typescript
describe('Password Hashing Verification', () => {
  test('should hash password with bcrypt', async () => {
    // Arrange
    const requestBody = {
      username: '@testuser',
      password: 'TestPassword123!',
      name: 'Test User',
      tempScore: 0
    };

    // Mock bcrypt.hash to verify it's called
    const mockHash = jest.fn(() => Promise.resolve('hashedPassword'));
    jest.mock('bcryptjs', () => ({
      hash: mockHash
    }));

    // Act
    await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // Assert
    expect(mockHash).toHaveBeenCalledWith('TestPassword123!', 10);
  });

  test('should not store plain text password in database', async () => {
    // Arrange
    const requestBody = {
      username: '@testuser',
      password: 'TestPassword123!',
      name: 'Test User',
      tempScore: 0
    };

    // Act
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // Assert
    expect(response.status).toBe(201);

    // Verify password in database is hashed
    const user = await prisma.user.findUnique({
      where: { Username: '@testuser' }
    });
    expect(user.Password).not.toBe('TestPassword123!');
    expect(user.Password).toMatch(/^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/); // bcrypt hash pattern
  });
});
```

#### TC-103: Database Operations Verification
**Priority**: Critical (Score: 8.1)  
**Test Objective**: Verify user and player records are created correctly

```typescript
describe('Database Operations Verification', () => {
  test('should create user and player records with correct data', async () => {
    // Arrange
    const requestBody = {
      username: '@testuser',
      password: 'TestPassword123!',
      name: 'Test User',
      tempScore: 100
    };

    // Act
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // Assert
    expect(response.status).toBe(201);

    // Verify user record
    const user = await prisma.user.findUnique({
      where: { Username: '@testuser' },
      include: { player: true }
    });

    expect(user).toBeTruthy();
    expect(user.Username).toBe('@testuser');
    expect(user.player).toBeTruthy();
    expect(user.player.Player_name).toBe('Test User');
    expect(user.player.Playerpoint).toBe(100);
    expect(user.player.Level_Id).toBe(2); // tempScore > 0
    expect(user.player.Milestone_Id).toBe(1);
    expect(user.player.streak).toBe(0);
    expect(user.player.Temp_Score).toBe(-1);
  });

  test('should set correct level based on tempScore', async () => {
    // Test cases for different tempScore values
    const testCases = [
      { tempScore: 0, expectedLevel: 1 },
      { tempScore: 50, expectedLevel: 2 },
      { tempScore: 100, expectedLevel: 2 }
    ];

    for (const testCase of testCases) {
      // Arrange
      const requestBody = {
        username: `@testuser${testCase.tempScore}`,
        password: 'TestPassword123!',
        name: 'Test User',
        tempScore: testCase.tempScore
      };

      // Act
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      // Assert
      expect(response.status).toBe(201);

      const user = await prisma.user.findUnique({
        where: { Username: `@testuser${testCase.tempScore}` },
        include: { player: true }
      });

      expect(user.player.Level_Id).toBe(testCase.expectedLevel);
    }
  });
});
```

#### TC-104: Cookie Setting Verification
**Priority**: High (Score: 6.9)  
**Test Objective**: Verify secure cookies are set correctly

```typescript
describe('Cookie Setting Verification', () => {
  test('should set LoggedIn cookie with secure settings', async () => {
    // Arrange
    const requestBody = {
      username: '@testuser',
      password: 'TestPassword123!',
      name: 'Test User',
      tempScore: 0
    };

    // Act
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // Assert
    expect(response.status).toBe(201);

    // Verify cookies are set
    const cookies = response.headers.get('set-cookie');
    expect(cookies).toContain('LoggedIn=true');
    expect(cookies).toContain('httpOnly');
    expect(cookies).toContain('secure');
    expect(cookies).toContain('sameSite=strict');
  });

  test('should set PlayerLevel cookie with correct level', async () => {
    // Arrange
    const requestBody = {
      username: '@testuser',
      password: 'TestPassword123!',
      name: 'Test User',
      tempScore: 100
    };

    // Act
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // Assert
    expect(response.status).toBe(201);

    const cookies = response.headers.get('set-cookie');
    expect(cookies).toContain('PlayerLevel=2'); // tempScore > 0
  });
});
```

---

## 3. Integration Test Cases

### 3.1 Component Integration Tests

#### TC-201: Complete Signup Flow
**Priority**: Critical (Score: 8.6)  
**Test Objective**: Verify complete signup flow from form to database

```typescript
describe('Complete Signup Flow', () => {
  test('should complete full signup flow successfully', async () => {
    // Arrange
    const mockPlayerData = {
      Player_ID: 1,
      Player_name: 'Test User',
      Playerpoint: 0,
      Level_Id: 1,
      Milestone_Id: 1,
      streak: 0,
      lastLogin: new Date(),
      Temp_Score: -1,
      user_Id: 1
    };

    const mockFetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ player: mockPlayerData })
      })
    );
    global.fetch = mockFetch;

    const mockRouter = { push: jest.fn() };
    jest.mock('next/navigation', () => ({
      useRouter: () => mockRouter
    }));

    const { getByPlaceholderText, getByRole } = render(
      <PlayerContextProvider>
        <SignUp />
      </PlayerContextProvider>
    );

    // Act
    fireEvent.change(getByPlaceholderText('@YourUsername'), { 
      target: { value: '@testuser' } 
    });
    fireEvent.change(getByPlaceholderText('Enter Password here'), { 
      target: { value: 'TestPassword123!' } 
    });
    fireEvent.change(getByPlaceholderText('Enter Your Name Here'), { 
      target: { value: 'Test User' } 
    });
    fireEvent.click(getByRole('button', { name: /sign up/i }));

    // Assert
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: '@testuser',
          password: 'TestPassword123!',
          name: 'Test User',
          tempScore: 0
        })
      });
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/quiz');
    });
  });
});
```

#### TC-202: API Error Handling
**Priority**: High (Score: 7.6)  
**Test Objective**: Verify graceful handling of API errors

```typescript
describe('API Error Handling', () => {
  test('should handle network errors gracefully', async () => {
    // Arrange
    const mockFetch = jest.fn(() => Promise.reject(new Error('Network error')));
    global.fetch = mockFetch;

    const { getByPlaceholderText, getByRole, getByText } = render(<SignUp />);

    // Act
    fireEvent.change(getByPlaceholderText('@YourUsername'), { 
      target: { value: '@testuser' } 
    });
    fireEvent.change(getByPlaceholderText('Enter Password here'), { 
      target: { value: 'TestPassword123!' } 
    });
    fireEvent.change(getByPlaceholderText('Enter Your Name Here'), { 
      target: { value: 'Test User' } 
    });
    fireEvent.click(getByRole('button', { name: /sign up/i }));

    // Assert
    await waitFor(() => {
      expect(getByText(/network error/i)).toBeInTheDocument();
    });
  });

  test('should handle server errors gracefully', async () => {
    // Arrange
    const mockFetch = jest.fn(() => 
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Internal server error' })
      })
    );
    global.fetch = mockFetch;

    const { getByPlaceholderText, getByRole, getByText } = render(<SignUp />);

    // Act
    fireEvent.change(getByPlaceholderText('@YourUsername'), { 
      target: { value: '@testuser' } 
    });
    fireEvent.change(getByPlaceholderText('Enter Password here'), { 
      target: { value: 'TestPassword123!' } 
    });
    fireEvent.change(getByPlaceholderText('Enter Your Name Here'), { 
      target: { value: 'Test User' } 
    });
    fireEvent.click(getByRole('button', { name: /sign up/i }));

    // Assert
    await waitFor(() => {
      expect(getByText(/internal server error/i)).toBeInTheDocument();
    });
  });

  test('should handle validation errors gracefully', async () => {
    // Arrange
    const mockFetch = jest.fn(() => 
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Username already exists' })
      })
    );
    global.fetch = mockFetch;

    const { getByPlaceholderText, getByRole, getByText } = render(<SignUp />);

    // Act
    fireEvent.change(getByPlaceholderText('@YourUsername'), { 
      target: { value: '@existinguser' } 
    });
    fireEvent.change(getByPlaceholderText('Enter Password here'), { 
      target: { value: 'TestPassword123!' } 
    });
    fireEvent.change(getByPlaceholderText('Enter Your Name Here'), { 
      target: { value: 'Test User' } 
    });
    fireEvent.click(getByRole('button', { name: /sign up/i }));

    // Assert
    await waitFor(() => {
      expect(getByText(/username already exists/i)).toBeInTheDocument();
    });
  });
});
```

---

## 4. End-to-End Test Cases

### 4.1 User Journey Tests

#### TC-301: Successful Signup and Redirect
**Priority**: Critical (Score: 8.8)  
**Test Objective**: Verify complete user journey from signup to quiz page

```typescript
describe('Successful Signup and Redirect', () => {
  test('should complete signup and redirect to quiz page', async () => {
    // Arrange
    await page.goto('http://localhost:3000/signup');

    // Act
    await page.fill('input[placeholder="@YourUsername"]', '@testuser');
    await page.fill('input[placeholder="Enter Password here"]', 'TestPassword123!');
    await page.fill('input[placeholder="Enter Your Name Here"]', 'Test User');
    await page.click('button[type="submit"]');

    // Assert
    await page.waitForURL('**/quiz');
    expect(page.url()).toContain('/quiz');

    // Verify user is logged in
    const cookies = await page.context().cookies();
    const loggedInCookie = cookies.find(cookie => cookie.name === 'LoggedIn');
    expect(loggedInCookie?.value).toBe('true');
  });
});
```

#### TC-302: Duplicate Username Handling
**Priority**: High (Score: 7.4)  
**Test Objective**: Verify handling of duplicate username attempts

```typescript
describe('Duplicate Username Handling', () => {
  test('should show error for duplicate username', async () => {
    // Arrange - Create first user
    await page.goto('http://localhost:3000/signup');
    await page.fill('input[placeholder="@YourUsername"]', '@testuser');
    await page.fill('input[placeholder="Enter Password here"]', 'TestPassword123!');
    await page.fill('input[placeholder="Enter Your Name Here"]', 'Test User 1');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/quiz');

    // Act - Try to create second user with same username
    await page.goto('http://localhost:3000/signup');
    await page.fill('input[placeholder="@YourUsername"]', '@testuser');
    await page.fill('input[placeholder="Enter Password here"]', 'TestPassword456!');
    await page.fill('input[placeholder="Enter Your Name Here"]', 'Test User 2');
    await page.click('button[type="submit"]');

    // Assert
    await page.waitForSelector('text=Username already exists');
    expect(await page.isVisible('text=Username already exists')).toBe(true);
  });
});
```

---

## 5. Security Test Cases

### 5.1 Input Validation Security

#### TC-401: SQL Injection Prevention
**Priority**: Critical (Score: 8.2)  
**Test Objective**: Verify protection against SQL injection attacks

```typescript
describe('SQL Injection Prevention', () => {
  test('should prevent SQL injection in username field', async () => {
    // Arrange
    const sqlInjectionPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      "admin'--",
      "'; INSERT INTO users VALUES ('hacker', 'password'); --"
    ];

    for (const payload of sqlInjectionPayloads) {
      // Act
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: payload,
          password: 'TestPassword123!',
          name: 'Test User',
          tempScore: 0
        })
      });

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain('All field are required');
    }
  });

  test('should prevent SQL injection in password field', async () => {
    // Arrange
    const sqlInjectionPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "admin'--"
    ];

    for (const payload of sqlInjectionPayloads) {
      // Act
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: '@testuser',
          password: payload,
          name: 'Test User',
          tempScore: 0
        })
      });

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain('All field are required');
    }
  });
});
```

#### TC-402: XSS Attack Prevention
**Priority**: Critical (Score: 8.2)  
**Test Objective**: Verify protection against XSS attacks

```typescript
describe('XSS Attack Prevention', () => {
  test('should prevent XSS in username field', async () => {
    // Arrange
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src="x" onerror="alert(\'XSS\')">',
      '"><script>alert("XSS")</script>',
      '"; alert("XSS"); //'
    ];

    for (const payload of xssPayloads) {
      // Act
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: payload,
          password: 'TestPassword123!',
          name: 'Test User',
          tempScore: 0
        })
      });

      // Assert
      expect(response.status).toBe(400);
    }
  });

  test('should escape user input in response', async () => {
    // Arrange
    const { getByPlaceholderText, getByRole } = render(<SignUp />);
    const usernameInput = getByPlaceholderText('@YourUsername');

    // Act
    fireEvent.change(usernameInput, { 
      target: { value: '<script>alert("XSS")</script>' } 
    });

    // Assert
    expect(usernameInput).toHaveValue('<script>alert("XSS")</script>');
    // Verify the script is not executed
    expect(document.querySelector('script')).toBeNull();
  });
});
```

---

## 6. Performance Test Cases

### 6.1 Load Testing

#### TC-501: Concurrent Signup Performance
**Priority**: High (Score: 8.0)  
**Test Objective**: Verify system performance under load

```typescript
describe('Concurrent Signup Performance', () => {
  test('should handle 100 concurrent signups', async () => {
    // Arrange
    const concurrentUsers = 100;
    const signupPromises = [];

    // Act
    const startTime = Date.now();
    
    for (let i = 0; i < concurrentUsers; i++) {
      const promise = fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: `@testuser${i}`,
          password: 'TestPassword123!',
          name: `Test User ${i}`,
          tempScore: 0
        })
      });
      signupPromises.push(promise);
    }

    const responses = await Promise.all(signupPromises);
    const endTime = Date.now();

    // Assert
    const successfulResponses = responses.filter(r => r.status === 201);
    expect(successfulResponses.length).toBe(concurrentUsers);
    
    const totalTime = endTime - startTime;
    const averageTime = totalTime / concurrentUsers;
    expect(averageTime).toBeLessThan(1000); // Less than 1 second per request
  }, 30000); // 30 second timeout
});
```

---

## Test Execution Summary

### Priority-Based Execution Plan

#### Phase 1: Critical Tests (Week 1-2)
- TC-001 to TC-005: Unit tests for form validation and state management
- TC-101 to TC-104: API validation and security tests
- TC-201: Complete signup flow integration test
- TC-301: E2E successful signup test
- TC-401 to TC-402: Security vulnerability tests

#### Phase 2: High Priority Tests (Week 3-4)
- TC-202: API error handling integration tests
- TC-302: Duplicate username E2E test
- TC-501: Performance load testing

#### Phase 3: Medium Priority Tests (Week 5-6)
- Additional accessibility tests
- Cross-browser compatibility tests
- Mobile responsiveness tests

### Test Coverage Metrics
- **Unit Test Coverage**: 90%+
- **Integration Test Coverage**: 85%+
- **E2E Test Coverage**: 80%+
- **Security Test Coverage**: 100%
- **Performance Test Coverage**: 75%+

### Quality Gates
1. All Critical tests must pass (Score 8.0+)
2. All High Priority tests must pass (Score 7.0+)
3. Security tests must have 100% pass rate
4. Performance tests must meet SLA requirements
5. Code coverage must be 85%+

This comprehensive test case implementation ensures thorough validation of the signup functionality across all critical aspects including security, performance, and user experience. 