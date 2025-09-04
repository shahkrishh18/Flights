import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { login, register } from '../api/api';

const { width, height } = Dimensions.get('window');

export default function AuthScreens() {
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const navigation = useNavigation();

  // form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // handle login/signup
  const handleLogin = async () => {
    try {
      const { user, accessToken } = await login({ email, password });
      Alert.alert("Login Success", `Welcome back`);
      console.log("Token:", accessToken);
      // TODO: Save token in context/state and navigate to Home
      navigation.replace('HomeScreen');
    } catch (err) {
      Alert.alert("Login Failed", err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const { user, accessToken } = await register({ name, email, password });
      Alert.alert("Registration Success", `Welcome ${user.name}`);
      console.log("Token:", accessToken);
      // TODO: Save token in context/state and navigate to Home
      navigation.replace('HomeScreen');
    } catch (err) {
      Alert.alert("Signup Failed", err.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../assets/images/google.png')}
          style={{
            height: 100,
            width: 100,
            alignSelf: 'center'
          }}
          resizeMode="contain"
        />
        {isLoginScreen ? (
          // Login Screen
          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back!</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
                value={email}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#aaa"
                onChangeText={setPassword}
                value={password}
              />
            </View>
            
            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Log In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.textButton} >
              <Text style={styles.textButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => setIsLoginScreen(false)}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Sign Up Screen
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Your Account</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#aaa"
                autoCapitalize="words"
                onChangeText={setName}
                value={name}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
                value={email}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#aaa"
                onChangeText={setPassword}
                value={password}
              />
            </View>
            
            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} >
              <Text style={styles.primaryButtonText}>Sign Up</Text>
            </TouchableOpacity>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => setIsLoginScreen(true)}>
                <Text style={styles.footerLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: width * 0.05,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.04,
    color: '#333',
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: width * 0.04,
    fontSize: width * 0.04,
  },
  primaryButton: {
    backgroundColor: '#4285F4',
    padding: width * 0.04,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  textButton: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  textButtonText: {
    color: '#4285F4',
    fontSize: width * 0.04,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.04,
  },
  footerText: {
    fontSize: width * 0.035,
    color: '#666',
  },
  footerLink: {
    fontSize: width * 0.035,
    color: '#4285F4',
    fontWeight: 'bold',
  },
});