// app/(tabs)/profile.jsx (Updated)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProfileTab() {
  const router = useRouter();
  const { user, token, logout, updateUser } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [userStats, setUserStats] = useState({
    recipesCreated: 0,
    recipesSaved: 0,
    reviewsWritten: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfileData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch user profile with stats
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        setProfileData(response.data.data);
        setEditedUser(response.data.data);
        
        // Fetch user stats
        const statsResponse = await axios.get(`${API_BASE_URL}/users/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (statsResponse.data.success) {
          setUserStats(statsResponse.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback dummy data
      setProfileData({
        ...user,
        bio: 'Food enthusiast and home cook',
        location: 'New Delhi, India',
        joinedDate: '2024-01-15',
      });
      setUserStats({
        recipesCreated: 12,
        recipesSaved: 24,
        reviewsWritten: 8,
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Call logout directly - it handles everything
            logout();
          }
        },
      ]
    );
  };

  const handleUpdateProfile = async () => {
    if (!editedUser.firstName?.trim() || !editedUser.lastName?.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      setIsUpdating(true);
      
      const response = await axios.put(
        `${API_BASE_URL}/users/profile`,
        editedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        updateUser(editedUser);
        setProfileData(editedUser);
        setEditModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderStatItem = (icon, value, label) => (
    <View style={styles.statItem}>
      <View style={styles.statIconContainer}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderMenuItem = (icon, title, subtitle, onPress, color = '#FF6B6B') => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8F9BB3" />
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authContainer}>
          <Ionicons name="person-outline" size={80} color="#8F9BB3" />
          <Text style={styles.authTitle}>Login Required</Text>
          <Text style={styles.authText}>Please login to view your profile</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Login Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileInitials}>
              {profileData?.firstName?.charAt(0)}{profileData?.lastName?.charAt(0)}
            </Text>
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {profileData?.firstName} {profileData?.lastName}
            </Text>
            <Text style={styles.email}>{profileData?.email}</Text>
            {profileData?.location && (
              <View style={styles.location}>
                <Ionicons name="location-outline" size={14} color="#8F9BB3" />
                <Text style={styles.locationText}>{profileData.location}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Ionicons name="pencil-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Bio */}
        {profileData?.bio && (
          <View style={styles.bioContainer}>
            <Text style={styles.bioTitle}>About Me</Text>
            <Text style={styles.bioText}>{profileData.bio}</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          {renderStatItem('restaurant', userStats.recipesCreated, 'Recipes')}
          {renderStatItem('heart', userStats.recipesSaved, 'Saved')}
          {renderStatItem('chatbubble', userStats.reviewsWritten, 'Reviews')}
          {renderStatItem('calendar', 'Member since', profileData?.joinedDate ? new Date(profileData.joinedDate).getFullYear().toString() : '2024')}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {renderMenuItem(
            'book-outline',
            'My Recipes',
            'View all your created recipes',
            () => router.push('/my-recipes'),
            '#4ECDC4'
          )}
          
          {renderMenuItem(
            'heart-outline',
            'My Favorites',
            'View your saved recipes',
            () => router.push('/(tabs)/favorites'),
            '#FF6B6B'
          )}
          
          {renderMenuItem(
            'calendar-outline',
            'Meal Plans',
            'Manage your weekly meal plans',
            () => router.push('/meal-plans'),
            '#45B7D1'
          )}
          
          {renderMenuItem(
            'notifications-outline',
            'Notifications',
            'Manage your notifications',
            () => router.push('/notifications'),
            '#96CEB4'
          )}
          
          {renderMenuItem(
            'settings-outline',
            'Settings',
            'App preferences and settings',
            () => router.push('/settings'),
            '#8F9BB3'
          )}
          
          {renderMenuItem(
            'help-circle-outline',
            'Help & Support',
            'FAQs and contact support',
            () => router.push('/help'),
            '#FFA726'
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Recipe App v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser.firstName}
                  onChangeText={(text) => setEditedUser({...editedUser, firstName: text})}
                  placeholder="Enter first name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser.lastName}
                  onChangeText={(text) => setEditedUser({...editedUser, lastName: text})}
                  placeholder="Enter last name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editedUser.bio}
                  onChangeText={(text) => setEditedUser({...editedUser, bio: text})}
                  placeholder="Tell us about yourself..."
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser.location}
                  onChangeText={(text) => setEditedUser({...editedUser, location: text})}
                  placeholder="City, Country"
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleUpdateProfile}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginTop: 20,
    marginBottom: 8,
  },
  authText: {
    fontSize: 16,
    color: '#8F9BB3',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8F9BB3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#8F9BB3',
    marginBottom: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#8F9BB3',
    marginLeft: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: '#8F9BB3',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#8F9BB3',
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F9FC',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#8F9BB3',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#8F9BB3',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F9FC',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F7F9FC',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F7F9FC',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8F9BB3',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});