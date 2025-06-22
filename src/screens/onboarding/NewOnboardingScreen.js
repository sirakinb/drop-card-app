import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import NavigationDots from '../../components/onboarding/NavigationDots';
import PreviewMockup from '../../components/onboarding/PreviewMockup';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Capture Contacts Instantly',
    subtitle: 'Scan QR codes or Business Cards to save contacts',
    description: 'Simply point your camera at someone\'s QR code or business card to instantly save their contact information.',
    type: 'scanner',
    backgroundColor: '#F7F7F7',
  },
  {
    id: 2,
    title: 'Design Your Digital Card',
    subtitle: 'Build your professional profile',
    description: 'Design a beautiful digital business card with your photo, contact details, and professional information. Customize it to match your style.',
    type: 'create',
    backgroundColor: '#F7F7F7',
  },
  {
    id: 3,
    title: 'Share with a Single Tap',
    subtitle:
      'Effortlessly exchange contact information with anyone, anywhere.',
    type: 'share',
    backgroundColor: '#F7F7F7',
  },
  {
    id: 4,
    title: 'Organize Your Network',
    subtitle:
      'Keep all your contacts in one place, sorted and easy to access.',
    type: 'contacts',
    backgroundColor: '#F7F7F7',
  },
];

export default function NewOnboardingScreen({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  console.log('🎯 NewOnboardingScreen rendered, currentIndex:', currentIndex);

  const handleNext = () => {
    console.log('⏭️ Moving to next page:', currentIndex + 1);
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    console.log('⏮️ Moving to previous page:', currentIndex - 1);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleGetStarted = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    try {
      console.log('User skipped onboarding');
      if (onComplete) {
        await onComplete();
      }
    } catch (error) {
      Alert.alert('Error', 'Could not complete onboarding.');
    } finally {
      setIsCompleting(false);
    }
  };
  
  const currentData = onboardingData[currentIndex];
  const isLastSlide = currentIndex === onboardingData.length - 1;
  const isFirstSlide = currentIndex === 0;
  
  // Conditional styling for screens 2 and 4 (indices 1 and 3)
  const shouldMoveDown = currentIndex === 1 || currentIndex === 3;
  
  return (
    <View style={[styles.container, { backgroundColor: currentData.backgroundColor }]}>
      <View style={[
        styles.contentContainer,
        shouldMoveDown && styles.contentContainerMoved
      ]}>
        <PreviewMockup content={currentData} />
      </View>
  
      <View style={styles.navigationContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentData.title}</Text>
          <Text style={styles.subtitle}>{currentData.subtitle}</Text>
          {currentData.description && (
            <Text style={styles.description}>{currentData.description}</Text>
          )}
        </View>

        <View style={styles.dotsContainer}>
          <NavigationDots data={onboardingData} currentIndex={currentIndex} />
        </View>
  
        <View style={styles.buttonContainer}>
          {isLastSlide ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.prevButton]}
                onPress={handlePrevious}
              >
                <Text style={[styles.buttonText, styles.prevButtonText]}>
                  Previous
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.getStartedButton]}
                onPress={handleGetStarted}
                disabled={isCompleting}
              >
                <Text style={styles.buttonText}>
                  {isCompleting ? 'Loading...' : 'Get Started'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {!isFirstSlide && (
                <TouchableOpacity
                  style={[styles.button, styles.prevButton]}
                  onPress={handlePrevious}
                >
                  <Text style={[styles.buttonText, styles.prevButtonText]}>
                    Previous
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.button, 
                  styles.nextButton,
                  isFirstSlide && styles.nextButtonFullWidth
                ]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  navigationContainer: {
    flex: 0.4,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  dotsContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButton: {
    backgroundColor: '#6A5AED',
  },
  prevButton: {
    backgroundColor: '#E8E6FC',
  },
  getStartedButton: {
    backgroundColor: '#6A5AED',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  prevButtonText: {
    color: '#6A5AED',
  },
  contentContainerMoved: {
    marginTop: 40,
  },
  nextButtonFullWidth: {
    marginHorizontal: 0,
  },
});