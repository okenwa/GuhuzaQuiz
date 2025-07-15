# React Native Migration Guide for Guhuza Quiz App

## 🚀 Quick Start

### 1. Install Expo CLI
```bash
npm install -g @expo/cli
```

### 2. Create New Expo Project
```bash
npx create-expo-app@latest GuhuzaQuizMobile --template blank-typescript
cd GuhuzaQuizMobile
```

### 3. Install Dependencies
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install expo-auth-session expo-crypto expo-web-browser
npm install @react-native-async-storage/async-storage
npm install expo-av expo-haptics
npm install react-native-svg react-native-svg-transformer
npm install @expo/vector-icons
npm install react-native-reanimated react-native-gesture-handler
npm install expo-linear-gradient
npm install expo-notifications
npm install expo-device expo-constants
```

## 📱 Component Migration Map

### Current Next.js → React Native

| Next.js Component | React Native Equivalent | Migration Notes |
|------------------|------------------------|-----------------|
| `div` | `View` | Basic container |
| `button` | `TouchableOpacity` / `Pressable` | Touch interactions |
| `img` | `Image` | Image display |
| `input` | `TextInput` | Text input |
| `p`, `span`, `h1-h6` | `Text` | Text display |
| `Link` | `TouchableOpacity` + navigation | Navigation |
| `form` | `View` | Form container |

### Key Components to Migrate

#### 1. Navigation Structure
```typescript
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Quiz" component={QuizScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

#### 2. Quiz Components
```typescript
// QuizQuestion.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function QuizQuestion({ question, onAnswer }) {
  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question.text}</Text>
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => onAnswer(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

#### 3. Authentication
```typescript
// auth.ts
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signIn = async () => {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'guhuzaquiz'
  });
  
  const result = await AuthSession.startAsync({
    authUrl: `https://your-auth-provider.com/auth?redirect_uri=${redirectUri}`,
  });
  
  if (result.type === 'success') {
    await AsyncStorage.setItem('userToken', result.params.access_token);
  }
};
```

#### 4. Styling Migration
```typescript
// Convert Tailwind to StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

## 🎯 Migration Priority

### Phase 1: Core Features (Week 1-2)
1. **Navigation Setup** - Basic app structure
2. **Authentication** - Login/signup flow
3. **Quiz Engine** - Basic quiz functionality
4. **Database Integration** - API calls to your existing backend

### Phase 2: Enhanced Features (Week 3-4)
1. **Leaderboard** - Real-time rankings
2. **Profile System** - User profiles and achievements
3. **Sound Effects** - Audio integration
4. **Animations** - Smooth transitions

### Phase 3: Polish (Week 5-6)
1. **Offline Support** - Local storage
2. **Push Notifications** - Engagement features
3. **Performance Optimization** - Smooth 60fps
4. **App Store Preparation** - Icons, screenshots, descriptions

## 🔧 Development Setup

### 1. Environment Configuration
```typescript
// app.config.ts
export default {
  expo: {
    name: 'Guhuza Quiz',
    slug: 'guhuza-quiz',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#3b82f6'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.guhuza.quiz'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#3b82f6'
      },
      package: 'com.guhuza.quiz'
    },
    web: {
      favicon: './assets/favicon.png'
    }
  }
};
```

### 2. API Integration
```typescript
// api.ts
const API_BASE_URL = 'https://your-backend.com/api';

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
```

## 📊 Performance Considerations

### 1. Image Optimization
- Use `expo-image` for better performance
- Implement lazy loading for quiz images
- Cache frequently used assets

### 2. State Management
- Use React Context for global state
- Implement proper memoization
- Avoid unnecessary re-renders

### 3. Navigation Performance
- Use `react-native-screens` for better performance
- Implement proper screen preloading
- Optimize navigation animations

## 🚀 Deployment

### 1. Build for Production
```bash
# iOS
expo build:ios

# Android
expo build:android

# Or use EAS Build
eas build --platform all
```

### 2. App Store Submission
- Create App Store Connect account
- Prepare app metadata and screenshots
- Submit for review

## 🔄 Code Sharing Strategy

### Shared Logic
- API calls and data fetching
- Authentication logic
- Quiz game logic
- State management

### Platform-Specific
- UI components and styling
- Navigation patterns
- Platform-specific features

## 📱 Testing Strategy

### 1. Development Testing
- Use Expo Go app for quick testing
- Test on multiple device sizes
- Test offline functionality

### 2. Production Testing
- Internal testing with TestFlight/Play Console
- Beta testing with real users
- Performance monitoring

## 🎯 Next Steps

1. **Set up Expo project** with the provided configuration
2. **Migrate core components** one by one
3. **Test on real devices** using Expo Go
4. **Implement authentication** flow
5. **Add offline support** for better UX
6. **Prepare for app store** submission

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Expo SDK](https://docs.expo.dev/versions/latest/)

## 🆘 Common Issues & Solutions

### Issue: Navigation not working
**Solution**: Ensure `react-native-screens` and `react-native-safe-area-context` are installed

### Issue: Images not loading
**Solution**: Use `expo-image` instead of React Native's Image component

### Issue: Sound not playing
**Solution**: Check audio permissions and use `expo-av` properly

### Issue: Performance issues
**Solution**: Use React DevTools and Flipper for debugging 