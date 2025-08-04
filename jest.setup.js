import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock Audio API
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  currentTime: 0,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock cookies
jest.mock('cookies-next', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
}))

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    player: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    quizSession: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    QuestionProgress: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}))

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}))

// Mock analytics
jest.mock('@/app/components/AnalyticsProvider', () => ({
  useAnalytics: () => ({
    trackQuizStart: jest.fn(),
    trackQuizComplete: jest.fn(),
    trackAnswerSubmit: jest.fn(),
  }),
}))

// Mock badge context
jest.mock('@/app/context/badgeContext', () => ({
  useBadges: () => ({
    userBadges: [],
    checkAndAwardBadges: jest.fn(),
    activePowerUps: [],
    activatePowerUp: jest.fn(),
    usePowerUp: jest.fn(),
  }),
}))

// Mock player context
jest.mock('@/app/context/playerContext', () => ({
  playerContext: {
    Provider: ({ children }) => children,
  },
  useContext: () => ({
    player: null,
    AssignPlayerData: jest.fn(),
    tempScore: 0,
    setTempScore: jest.fn(),
  }),
}))

// Mock auth
jest.mock('@/auth', () => ({
  auth: jest.fn().mockResolvedValue({
    user: {
      memberId: '1',
      firstName: 'Test',
      email: 'test@example.com',
    },
  }),
}))

// Console error suppression for expected warnings
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
}) 