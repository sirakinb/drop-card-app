import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BusinessCard from '../../components/cards/BusinessCard';
import QRCodeDisplay from '../../components/cards/QRCodeDisplay';
import { getWebProfileUrl } from '../../utils/contactUtils';

export default function CardDisplayScreen({ navigation, route }) {
  const { cardData = {}, avatar: initialAvatar, editMode = false, source } = route.params || {};
  const [avatar, setAvatar] = useState(initialAvatar || null);

  // Handle missing card data case
  if (!cardData || Object.keys(cardData).length === 0) {
    Alert.alert('Error', 'No card data available', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
    return null;
  }

  const handleEdit = () => {
    navigation.navigate('CreateCard', { 
      userName: cardData?.name,
      editMode: true,
      cardData,
      avatar 
    });
  };

  const handleShare = () => {
    navigation.navigate('MainTabs', { 
      screen: 'Share', 
      params: { cardData, avatar } 
    });
  };

  const handlePreview = async () => {
    try {
      const url = getWebProfileUrl(cardData.id);
      if (!url) {
        Alert.alert('Error', 'No web profile URL available.');
        return;
      }

      // Check if URL can be opened
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(
          'Profile Syncing', 
          'Your profile update is still syncing with the web app. Please check back in a few minutes.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Try to open the URL
      await Linking.openURL(url);
    } catch (error) {
      console.log('Preview error:', error);
      Alert.alert(
        'Profile Syncing', 
        'Your profile update is still syncing with the web app. Please check back in a few minutes.',
        [
          { text: 'Try Again', onPress: () => handlePreview() },
          { text: 'OK', style: 'cancel' }
        ]
      );
    }
  };

  const handleBackToCards = () => {
    if (source === 'CreateCard') {
      navigation.goBack(); // Go back to Create Card screen
    } else {
      navigation.navigate('MainTabs', { screen: 'Cards' });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Your Card</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Business Card Preview */}
        <View style={styles.cardSection}>
          <BusinessCard 
            cardData={cardData}
            avatar={avatar}
            themeColor={cardData.theme_color}
            style={styles.businessCard}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={20} color="#374151" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handlePreview}>
            <Ionicons name="eye-outline" size={20} color="#374151" />
            <Text style={styles.actionText}>Preview</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="#374151" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <Text style={styles.sectionTitle}>QR Code</Text>
          <QRCodeDisplay 
            cardData={cardData}
            size={200}
            showActions={true}
            style={styles.qrDisplay}
            profileUrl={getWebProfileUrl(cardData.id)}
          />
        </View>

        {/* Card Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Card Details</Text>
          <View style={styles.infoGrid}>
            {(() => {
              const infoItems = [
                { label: 'Name', value: cardData.name || 'Not set', required: true },
                { label: 'Title', value: cardData.title },
                { label: 'Company', value: cardData.company },
                { label: 'Email', value: cardData.email },
                { label: 'Phone', value: cardData.phone },
                { label: 'Website', value: cardData.website },
                { label: 'LinkedIn', value: cardData.linkedin },
                { label: 'Twitter', value: cardData.twitter },
                { label: 'Instagram', value: cardData.instagram },
                { label: 'TikTok', value: cardData.tiktok },
                { label: 'YouTube', value: cardData.youtube },
              ].filter(item => item.required || item.value);

              return infoItems.map((item, index) => (
                <View 
                  key={item.label} 
                  style={[
                    styles.infoItem, 
                    index === infoItems.length - 1 && styles.lastInfoItem
                  ]}
                >
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ));
            })()}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleBackToCards}>
          <Text style={styles.primaryButtonText}>
            {source === 'CreateCard' ? 'Back to Create Card' : 'Back to Cards'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  cardSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  businessCard: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    minWidth: 80,
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginTop: 4,
  },
  qrSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  qrDisplay: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  infoGrid: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
  },
  infoItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  bottomAction: {
    padding: 32,
    alignItems: 'center',
  },
  primaryButton: {
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  lastInfoItem: {
    borderBottomWidth: 0,
  },
}); 