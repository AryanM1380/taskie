import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { saveUserToFile, loadUsersFromFile } from '../storage/userStorage';

type User = {
  email: string;
  password: string;
};

type RegisterScreenProps = {
  navigation: any; 
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const users: User[] = (await loadUsersFromFile()) || [];

    const exists = Array.isArray(users) && users.find((u) => u.email === email);
    if (exists) {
      Alert.alert('Error', 'User already exists');
      return;
    }

    await saveUserToFile({ email, password });
    Alert.alert('Success', 'User registered');
    navigation.navigate('Login');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Register</Text>
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
        <Button title="Register" onPress={handleRegister} />
        <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />    
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
