import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getInitials, getAvatarColor, formatLastContact } from '../../utils/contactUtils';
import { contactService, storageService } from '../../services/database';

export default function ContactDetailScreen({ route, navigation }) {
  const { contact } = route.params;
  const [contactData, setContactData] = useState(contact);
  const [memoryPhoto, setMemoryPhoto] = useState(contact.contact_memory_photo || null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  
  // Reload contact data when screen focuses
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const contacts = await contactService.getUserContacts();
        const updatedContact = contacts.data?.find(c => c.id === contact.id);
        if (updatedContact) {
          setContactData(updatedContact);
          setMemoryPhoto(updatedContact.contact_memory_photo);
        }
      } catch (error) {
        console.error('Error reloading contact:', error);
      }
    });
    
    return unsubscribe;
  }, [navigation, contact.id]);

  const handlePhonePress = () => {
    if (contact.phone) {
      Linking.openURL(`tel:${contact.phone}`);
    }
  };

  const handleEmailPress = () => {
    if (contact.email) {
      Linking.openURL(`mailto:${contact.email}`);
    }
  };

  const handleWebsitePress = () => {
    if (contact.website) {
      const url = contact.website.startsWith('http') ? contact.website : `https://${contact.website}`;
      Linking.openURL(url);
    }
  };

  const handleTakeSelfie = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos.');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        
        // Show the local image immediately
        setMemoryPhoto(photoUri);
        
        // Show loading state temporarily
        Alert.alert('Uploading', 'Saving your memory photo...');
        
        // Upload to Supabase Storage and update contact
        await updateContactMemoryPhoto(photoUri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const updateContactMemoryPhoto = async (photoUri) => {
    try {
      let base64Photo = null;
      
      // Only convert if we have a photo URI
      if (photoUri) {
        // Convert to base64 data URI
        base64Photo = await storageService.convertImageToBase64(photoUri);
        console.log('Converted to base64, length:', base64Photo.length);
        // Update the UI immediately
        setMemoryPhoto(base64Photo);
      }
      
      // Update contact in database with the base64 image (or null if deleting)
      const updatedData = {
        ...contactData,
        contact_memory_photo: base64Photo
      };
      
      const result = await contactService.updateContact(contactData.id, updatedData);
      if (result.error) {
        throw new Error(result.error);
      }
      
      setContactData(updatedData);
      Alert.alert('Success', 'Memory photo saved!');
    } catch (error) {
      console.error('Error updating contact photo:', error);
      Alert.alert('Error', 'Failed to save photo. Please try again.');
      // Revert to previous photo if save failed
      setMemoryPhoto(contactData?.contact_memory_photo || null);
    }
  };

  const handlePhotoPress = () => {
    setShowPhotoModal(true);
  };

  const handleDeletePhoto = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this contact memory?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Clear from UI and database
            setMemoryPhoto(null);
            await updateContactMemoryPhoto(null);
            setShowPhotoModal(false);
          }
        }
      ]
    );
  };

  const handleRetakePhoto = async () => {
    setShowPhotoModal(false);
    
    // Take a new selfie (old photo will be overwritten in database)
    handleTakeSelfie();
  };

  const ContactInfoItem = ({ icon, label, value, onPress, isClickable = false }) => {
    if (!value) return null;

    const ItemComponent = isClickable ? TouchableOpacity : View;
    
    return (
      <ItemComponent style={styles.infoItem} onPress={onPress} activeOpacity={isClickable ? 0.7 : 1}>
        <View style={styles.infoIcon}>
          <Ionicons name={icon} size={20} color="#7C3AED" />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={[styles.infoValue, isClickable && styles.clickableValue]}>
            {value}
          </Text>
        </View>
        {isClickable && (
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        )}
      </ItemComponent>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.takeSelfieButton}
            onPress={handleTakeSelfie}
          >
            <Text style={styles.takeSelfieText}>Take Selfie</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('AddContact', {
              editMode: true,
              contactData: contact
            })}
          >
            <Ionicons name="create-outline" size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={[styles.largeAvatar, { backgroundColor: getAvatarColor(contact.name) }]}>
            <Text style={styles.largeAvatarText}>{getInitials(contact.name)}</Text>
          </View>
          
          <Text style={styles.contactName}>{contact.name}</Text>
          
          {(contact.title || contact.company) && (
            <Text style={styles.contactPosition}>
              {contact.title && contact.company 
                ? `${contact.title} at ${contact.company}`
                : contact.title || contact.company
              }
            </Text>
          )}

          <Text style={styles.lastContactDate}>
            Met: {formatLastContact(contact.met_at)}
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.sectionContent}>
            <ContactInfoItem
              icon="mail-outline"
              label="Email"
              value={contact.email}
              isClickable={false}
            />
            <ContactInfoItem
              icon="call-outline"
              label="Phone"
              value={contact.phone}
              isClickable={false}
            />
            <ContactInfoItem
              icon="globe-outline"
              label="Website"
              value={contact.website}
              isClickable={false}
            />
          </View>
        </View>

        {/* Professional Information */}
        {(contact.title || contact.company) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional</Text>
            <View style={styles.sectionContent}>
              <ContactInfoItem
                icon="briefcase-outline"
                label="Title"
                value={contact.title}
              />
              <ContactInfoItem
                icon="business-outline"
                label="Company"
                value={contact.company}
              />
            </View>
          </View>
        )}

        {/* Tags */}
        {contact.tags && contact.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {contact.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Notes */}
        {contact.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{contact.notes}</Text>
            </View>
          </View>
        )}

        {/* Contact Memory */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Memory</Text>
          <View style={styles.memoryContainer}>
            {memoryPhoto ? (
              <TouchableOpacity onPress={handlePhotoPress}>
                <Image source={{ uri: memoryPhoto }} style={styles.memoryPhoto} />
              </TouchableOpacity>
            ) : (
              <View style={styles.noMemoryContainer}>
                <Ionicons name="camera-outline" size={32} color="#9CA3AF" />
                <Text style={styles.noMemoryText}>No memory photo yet</Text>
                <Text style={styles.noMemorySubtext}>Tap "Take Selfie" to add one</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Photo Modal */}
      <Modal
        visible={showPhotoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPhotoModal(false)}
            >
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
            
            {memoryPhoto && (
              <Image source={{ uri: memoryPhoto }} style={styles.modalPhoto} />
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalActionButton, styles.retakeButton]}
                onPress={handleRetakePhoto}
              >
                <Ionicons name="camera" size={20} color="#6A5AED" />
                <Text style={styles.retakeButtonText}>Retake Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalActionButton, styles.deleteButton]}
                onPress={handleDeletePhoto}
              >
                <Ionicons name="trash" size={20} color="#EF4444" />
                <Text style={styles.deleteButtonText}>Delete Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  takeSelfieButton: {
    backgroundColor: '#6A5AED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  takeSelfieText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  largeAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  largeAvatarText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '700',
  },
  contactName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  contactPosition: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  lastContactDate: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  clickableValue: {
    color: '#7C3AED',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  notesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  memoryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    alignItems: 'center',
  },
  memoryPhoto: {
    width: 200,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  noMemoryContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noMemoryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 8,
  },
  noMemorySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  modalPhoto: {
    width: 300,
    height: 225,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    flex: 1,
  },
  retakeButton: {
    backgroundColor: '#F3F4F6',
  },
  retakeButtonText: {
    color: '#6A5AED',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
}); 