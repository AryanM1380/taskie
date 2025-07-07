import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const getFormattedDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getFormattedTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const DashboardScreen = () => {
  const [time, setTime] = useState(getFormattedTime());
  const [date, setDate] = useState(getFormattedDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getFormattedTime());
      setDate(getFormattedDate());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.main}>
        <Text style={styles.greeting}>Welcome back, Aryan!</Text>
        <Text style={styles.tagline}>Your day is under control.</Text>
        <TouchableOpacity style={styles.button} disabled>
          <Text style={styles.buttonText}>+ Add Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} disabled>
          <Text style={styles.buttonText}>View Tasks</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.logoutPlaceholder}>Logout (coming soon)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 48,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  time: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  main: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  tagline: {
    fontSize: 16,
    color: '#888',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#4f8cff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 8,
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutPlaceholder: {
    color: '#bbb',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default DashboardScreen; 