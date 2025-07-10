import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, Animated, StyleSheet } from 'react-native';
import { loadUsersFromFile, saveUserToFile } from '../storage/userStorage';

type User = {
  email: string;
  password: string;
};

type LoginScreenProps = {
  navigation: any;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  // Auto-fill credentials for testing
  const [email, setEmail] = useState('ahpreal@gmail.com');
  const [password, setPassword] = useState('1234');
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showAnimation = (type: 'success' | 'error') => {
    setFeedback(type);
    fadeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(800),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setFeedback(null));
  };

  useEffect(() => {
    async function ensureDefaultUser() {
      const users = await loadUsersFromFile();
      if (!users || users.length === 0) {
        await saveUserToFile({ email: 'ahpreal@gmail.com', password: '1234' });
      }
    }
    ensureDefaultUser();
  }, []);

  const handleLogin = async () => {
    try {
      const users: User[] = (await loadUsersFromFile()) || [];
      if (!Array.isArray(users)) {
        showAnimation('error');
        return;
      }
      const found = users.find((u) => u.email === email && u.password === password);
      if (!found) {
        showAnimation('error');
        return;
      }
      showAnimation('success');
      setTimeout(() => navigation.replace('Dashboard'), 1200);
    } catch (error) {
      showAnimation('error');
      console.error(error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
      {feedback && (
        <Animated.View
          style={[
            styles.feedback,
            feedback === 'success' ? styles.success : styles.error,
            { opacity: fadeAnim },
          ]}
        >
          <Text style={styles.feedbackText}>
            {feedback === 'success' ? 'Login Successful!' : 'Invalid email or password'}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  feedback: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 10,
  },
  success: {
    backgroundColor: '#4BB543',
  },
  error: {
    backgroundColor: '#FF3333',
  },
  feedbackText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
