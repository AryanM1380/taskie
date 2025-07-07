import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Splash: undefined;
  Dashboard: undefined;
  Register: undefined;
  Login: undefined;
  Tasks: undefined;
};

const SplashScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Splash'>) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Dashboard');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Replace with your logo image source */}
      <Image source={require('../assets/logo.jpg')} style={styles.logo} />
      <Text style={styles.title}>Welcome to Taskie</Text>
      <Text style={styles.loading}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  loading: {
    fontSize: 16,
    color: '#888',
  },
});

export default SplashScreen; 