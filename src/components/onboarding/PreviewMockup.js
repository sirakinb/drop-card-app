import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const PreviewMockup = ({ content, currentIndex }) => {
  const renderMockupContent = () => {
    switch (content.type) {
      case 'scanner':
        return (
          <View style={styles.fullImageContainer}>
            <Image 
              source={require('../../screens/onboarding/screen-one.png')}
              style={styles.fullScreenImageLarge}
              resizeMode="contain"
            />
          </View>
        );
      
      case 'create':
        return (
          <View style={styles.mockupScreen}>
            <View style={styles.createContent}>
              <View style={styles.createHeader}>
                <Text style={styles.createTitle}>Create Card</Text>
                <Text style={styles.closeButton}>×</Text>
              </View>
              
              <View style={styles.profileSection}>
                <View style={styles.profileImageContainer}>
                  <View style={styles.profileImage}>
                    <Image 
                      source={require('../../screens/onboarding/black-woman.png')}
                      style={styles.profilePhoto}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.addPhotoButton}>
                    <Text style={styles.plusIcon}>+</Text>
                  </View>
                </View>
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <View style={styles.inputField}>
                  <Text style={styles.inputText}>Jane Doe</Text>
                </View>
                
                <Text style={styles.fieldLabel}>Title</Text>
                <View style={styles.inputField}>
                  <Text style={styles.inputText}>Software Developer</Text>
                </View>
              </View>
            </View>
          </View>
        );
      
      case 'share':
        return (
          <View style={styles.fullImageContainerSmaller}>
            <Image 
              source={require('../../screens/onboarding/screen-3ree.png')}
              style={styles.fullScreenImageLarge}
              resizeMode="contain"
            />
          </View>
        );
      
      case 'contacts':
        return (
          <View style={styles.mockupScreen}>
            <View style={styles.contactsContent}>
              <View style={styles.contactsHeader}>
                <Text style={styles.contactsTitle}>Contacts</Text>
                <Text style={styles.addContactButton}>+</Text>
              </View>
              
              <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                  <Text style={styles.searchIcon}>🔍</Text>
                  <Text style={styles.searchPlaceholder}>Search contacts...</Text>
                </View>
              </View>
              
              <View style={styles.contactsList}>
                <View style={styles.contactItem}>
                  <View style={styles.contactAvatar}>
                    <Image 
                      source={{ uri: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face' }}
                      style={styles.contactAvatarImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>Amara Williams</Text>
                    <Text style={styles.contactTitle}>Product Manager</Text>
                  </View>
                </View>
                
                <View style={styles.contactItem}>
                  <View style={styles.contactAvatar}>
                    <Image 
                      source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }}
                      style={styles.contactAvatarImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>Carlos{'\n'}Rodriguez</Text>
                    <Text style={styles.contactTitle}>Designer</Text>
                  </View>
                </View>
                
                <View style={styles.contactItem}>
                  <View style={styles.contactAvatar}>
                    <Image 
                      source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }}
                      style={styles.contactAvatarImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>Sarah{'\n'}Thompson</Text>
                    <Text style={styles.contactTitle}>Marketing Director</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  // Use different container styles based on content type
  const isImageScreen = content.type === 'scanner' || content.type === 'share';
  
  return (
    <View style={styles.phoneContainer}>
      {isImageScreen ? (
        renderMockupContent()
      ) : (
        <View style={styles.phoneMockup}>
          {renderMockupContent()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  phoneContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneMockup: {
    width: width * 0.65,
    height: height * 0.5,
    backgroundColor: '#000000',
    borderRadius: 35,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 31,
    overflow: 'hidden',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  mockupScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 29,
    overflow: 'hidden',
  },
  mockupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  timeText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signalDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C0C0C0',
    marginRight: 2,
  },
  activeDot: {
    backgroundColor: '#000000',
  },
  wifiIcon: {
    marginLeft: 4,
  },
  iconText: {
    fontSize: 12,
    color: '#000000',
  },
  battery: {
    width: 24,
    height: 12,
    backgroundColor: '#000000',
    borderRadius: 3,
    marginLeft: 4,
  },

  // Scanner Styles
  scannerContent: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  scannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 30,
  },
  scannerFrame: {
    width: 200,
    height: 200,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCornerContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  qrCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#8B5CF6',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  qrCodeDisplay: {
    width: 140,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrPattern: {
    width: '100%',
    height: '100%',
  },
  qrRow: {
    flexDirection: 'row',
    flex: 1,
  },
  qrBlock: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 0.5,
  },
  filled: {
    backgroundColor: '#000000',
  },

  // Create Card Styles
  createContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  createHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  createTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  closeButton: {
    fontSize: 24,
    color: '#8B5CF6',
    fontWeight: '300',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DDD',
  },
  personEmoji: {
    fontSize: 40,
    color: '#999999',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  addPhotoText: {
    fontSize: 16,
    color: '#666666',
  },
  formSection: {
    paddingHorizontal: 4,
    flex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
    marginTop: 8,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
  },
  inputText: {
    fontSize: 16,
    color: '#000000',
  },

  // Share Card Styles
  shareContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  shareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  shareTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  skipText: {
    fontSize: 16,
    color: '#8B5CF6',
  },
  businessCard: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
  },
  cardContent: {
    alignItems: 'center',
  },
  cardProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  qrCodeSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  // Contacts Styles
  contactsContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  contactsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  addContactButton: {
    fontSize: 24,
    color: '#8B5CF6',
    fontWeight: '300',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#999999',
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    overflow: 'hidden',
  },
  contactAvatarImage: {
    width: '100%',
    height: '100%',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
    lineHeight: 18,
  },
  contactTitle: {
    fontSize: 14,
    color: '#666666',
  },

  // New styles for full image container - Properly sized and positioned
  fullImageContainer: {
    width: width * 1.5,
    height: height * 1.7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 80,
  },
  // Smaller container specifically for screen 3 (share screen)
  fullImageContainerSmaller: {
    width: width * 1.3,
    height: height * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 80,
  },
  fullScreenImageLarge: {
    width: '100%',
    height: '100%',
  },
  forceUpdateStyle: {
    color: 'transparent',
  },
});

export default PreviewMockup;

// Force update