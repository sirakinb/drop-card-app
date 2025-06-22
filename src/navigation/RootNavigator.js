import React, { useState, useEffect, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main app screens
import NewOnboardingScreen from '../screens/onboarding/NewOnboardingScreen';
import CreateCardScreen from '../screens/main/CreateCardScreen';
import CardDisplayScreen from '../screens/main/CardDisplayScreen';
import AddContactScreen from '../screens/main/AddContactScreen';
import ContactDetailScreen from '../screens/main/ContactDetailScreen';
import MainTabs from './MainTabs';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [checkingFirstTime, setCheckingFirstTime] = useState(true);

  useEffect(() => {
    checkFirstTimeUser();
  }, [user]);

  const checkFirstTimeUser = async () => {
    if (!user) {
      setCheckingFirstTime(false);
      return;
    }

    try {
      console.log('🔍 Checking onboarding status for user:', user.id);
      
      // Get all AsyncStorage keys to check for any existing onboarding data
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('🔍 All AsyncStorage keys:', allKeys);
      
      const onboardingCompleted = await AsyncStorage.getItem(
        `onboarding_completed_${user.id}`
      );
      console.log('🔍 Onboarding completion data:', onboardingCompleted);
      
      // If we have completion data, let's parse and log it
      if (onboardingCompleted) {
        try {
          const parsed = JSON.parse(onboardingCompleted);
          console.log('🔍 Parsed completion data:', parsed);
          console.log('🔍 Debug ID:', parsed.debugId);
          console.log('🔍 Session ID:', parsed.sessionId);
        } catch (parseError) {
          console.log('🔍 Completion data is not JSON:', onboardingCompleted);
        }
      }
      
      // Check if this is a truly new user by checking if they have any backend data
      // If they don't have completion data, we consider them a first-time user
      const firstTime = onboardingCompleted === null;
      console.log('🔍 Is first time user:', firstTime);
      
      // If this is a first-time user, clear any orphaned onboarding data from other users
      // This handles the case where a user was deleted but their AsyncStorage data remains
      if (firstTime) {
        const onboardingKeys = allKeys.filter(key => 
          key.startsWith('onboarding_completed_') && key !== `onboarding_completed_${user.id}`
        );
        
        if (onboardingKeys.length > 0) {
          console.log('🧹 Clearing orphaned onboarding data for deleted users:', onboardingKeys);
          await AsyncStorage.multiRemove(onboardingKeys);
        }
      }
      
      setIsFirstTime(firstTime);
    } catch (error) {
      console.error('Error checking first time user:', error);
      setIsFirstTime(false); // Default to not first time if error
    } finally {
      setCheckingFirstTime(false);
    }
  };

  const handleOnboardingComplete = useCallback(async () => {
    if (!user) return;

    try {
      console.log('✅ Onboarding complete for user:', user.id);
      const completionData = {
        completedAt: new Date().toISOString(),
        debugId: 'onboarding-flow-v1',
        sessionId: Math.random().toString(36).substring(2, 15),
      };
      
      await AsyncStorage.setItem(
        `onboarding_completed_${user.id}`,
        JSON.stringify(completionData)
      );
      
      console.log('✅ Onboarding status saved to AsyncStorage');
      setIsFirstTime(false);
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
      // Optionally, show an alert to the user
    }
  }, [user]);

  if (loading || checkingFirstTime) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        // Main App Stack
        <>
          {isFirstTime && (
            <Stack.Screen 
              name="Onboarding" 
              options={{ 
                gestureEnabled: false,
                animationEnabled: true 
              }}
            >
              {(props) => <NewOnboardingScreen {...props} onComplete={handleOnboardingComplete} />}
            </Stack.Screen>
          )}
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="CreateCard" component={CreateCardScreen} />
          <Stack.Screen name="CardDisplay" component={CardDisplayScreen} />
          <Stack.Screen name="AddContact" component={AddContactScreen} />
          <Stack.Screen name="ContactDetail" component={ContactDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
} 