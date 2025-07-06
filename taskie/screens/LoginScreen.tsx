import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { loadUsersFromFile } from '../storage/userStorage';

type User = {
  email: string;
  password: string;
};

type LoginScreenProps = {
  navigation: any;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const users: User[] = (await loadUsersFromFile()) || [];

      if (!Array.isArray(users)) {
        Alert.alert('Error', 'User data corrupted');
        return;
      }

      const found = users.find((u) => u.email === email && u.password === password);

      if (!found) {
        Alert.alert('Error', 'Invalid email or password');
        return;
      }

      Alert.alert('Success', 'Login successful');
      navigation.navigate('Tasks');
    } catch (error) {
      Alert.alert('Error', 'Failed to login');
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
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
};
