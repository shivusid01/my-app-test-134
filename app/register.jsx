import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { COLORS } from '../constants/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    username: '',
    bio: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);
    
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      alert(result.message || 'Registration failed');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our cooking community</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameInput}>
              <Input
                label="First Name"
                value={formData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
                placeholder="John"
                error={errors.firstName}
              />
            </View>
            <View style={styles.nameInput}>
              <Input
                label="Last Name"
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
                placeholder="Doe"
                error={errors.lastName}
              />
            </View>
          </View>

          <Input
            label="Username"
            value={formData.username}
            onChangeText={(text) => handleInputChange('username', text)}
            placeholder="johndoe"
            autoCapitalize="none"
            error={errors.username}
            icon={<Ionicons name="person" size={20} color={COLORS.gray} />}
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            placeholder="john@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            icon={<Ionicons name="mail" size={20} color={COLORS.gray} />}
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            placeholder="At least 6 characters"
            secureTextEntry
            error={errors.password}
            icon={<Ionicons name="lock-closed" size={20} color={COLORS.gray} />}
          />

          <Input
            label="Bio (Optional)"
            value={formData.bio}
            onChangeText={(text) => handleInputChange('bio', text)}
            placeholder="Tell us about your cooking experience"
            multiline
            numberOfLines={3}
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button
            title="Sign In"
            variant="outline"
            onPress={() => router.push('/login')}
            style={styles.signInButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  nameRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: 16,
  },
  nameInput: {
    flex: 1,
    marginHorizontal: 6,
  },
  registerButton: {
    marginTop: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: COLORS.gray,
    fontSize: 16,
    marginBottom: 16,
  },
  signInButton: {
    width: '100%',
  },
});