import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert, Modal, Image, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import { Calendar } from 'react-native-calendars';

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

// Define Todo type
interface Todo {
  id: string;
  title: string;
  description: string;
}

const motivationalQuotes = [
  "Every day is a fresh start!",
  "Dream big, work hard, stay focused!",
  "You are capable of amazing things.",
  "Small steps every day lead to big results.",
  "Make today count!"
];

const getRandomQuote = () => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

const DashboardScreen = ({ navigation }: any) => {
  const [time, setTime] = useState(getFormattedTime());
  const [date, setDate] = useState(getFormattedDate());

  // Calendar and per-day todos
  const [selectedDate, setSelectedDate] = useState<DateType>(new Date());
  const [todosByDate, setTodosByDate] = useState<{ [date: string]: Todo[] }>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userName, setUserName] = useState('Aryan');
  const [userEmail, setUserEmail] = useState('ahpreal@gmail.com');

  const defaultStyles = useDefaultStyles();

  // Format date as yyyy-mm-dd for key
  const getDateKey = (dateObj: DateType) => {
    if (!dateObj) return '';
    const d = new Date(dateObj as Date);
    return d.toISOString().split('T')[0];
  };

  const currentDateKey = getDateKey(selectedDate);
  const todos = todosByDate[currentDateKey] || [];

  // Prepare marked dates for calendar
  const markedDates: { [date: string]: any } = {};
  Object.keys(todosByDate).forEach(dateKey => {
    if (todosByDate[dateKey] && todosByDate[dateKey].length > 0) {
      markedDates[dateKey] = {
        customStyles: {
          container: { backgroundColor: 'green', borderRadius: 8 },
          text: { color: 'white', fontWeight: 'bold' },
        },
      };
    }
  });
  markedDates[getDateKey(selectedDate)] = {
    ...(markedDates[getDateKey(selectedDate)] || {}),
    selected: true,
    selectedColor: '#4f8cff',
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getFormattedTime());
      setDate(getFormattedDate());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Add new to-do
  const handleAddTodo = () => {
    if (!title.trim()) {
      Alert.alert('Title is required');
      return;
    }
    setTodosByDate(prev => {
      const key = currentDateKey;
      const newTodos = [
        ...(prev[key] || []),
        { id: Date.now().toString(), title, description }
      ];
      return { ...prev, [key]: newTodos };
    });
    setTitle('');
    setDescription('');
  };

  // Delete to-do
  const handleDeleteTodo = (id: string) => {
    setTodosByDate(prev => {
      const key = currentDateKey;
      const newTodos = (prev[key] || []).filter(todo => todo.id !== id);
      return { ...prev, [key]: newTodos };
    });
  };

  // Start editing
  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  // Save edit
  const handleEditSave = (id: string) => {
    if (!editTitle.trim()) {
      Alert.alert('Title is required');
      return;
    }
    setTodosByDate(prev => {
      const key = currentDateKey;
      const newTodos = (prev[key] || []).map(todo =>
        todo.id === id ? { ...todo, title: editTitle, description: editDescription } : todo
      );
      return { ...prev, [key]: newTodos };
    });
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  // Cancel edit
  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const renderTodo = ({ item, index }: { item: Todo; index: number }) => (
    <View style={styles.todoItem}>
      {editingId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={editTitle}
            onChangeText={setEditTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={editDescription}
            onChangeText={setEditDescription}
          />
          <View style={styles.todoActions}>
            <TouchableOpacity style={styles.saveButton} onPress={() => handleEditSave(item.id)}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleEditCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.todoContent}>
          <Text style={styles.todoTitle}>{index + 1}. {item.title}</Text>
          {item.description ? <Text style={styles.todoDescription}>{item.description}</Text> : null}
          <View style={styles.todoActions}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEditStart(item)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTodo(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.date}>{date}</Text>
          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => setProfileModalVisible(true)}
          >
            <Image
              source={require('../assets/icon.png')}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={day => setSelectedDate(new Date(day.dateString))}
            markedDates={markedDates}
            markingType={'custom'}
            current={getDateKey(selectedDate)}
            theme={{
              todayTextColor: '#4f8cff',
              arrowColor: '#4f8cff',
            }}
          />
        </View>
        <View style={styles.main}>
          <Text style={styles.greeting}>Welcome back, {userName}!</Text>
          <Text style={styles.tagline}>Your day is under control.</Text>
          {/* To-do input form */}
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Task Description (optional)"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>
          {/* To-do list */}
          {todos.length === 0 ? (
            <Text style={styles.emptyText}>{getRandomQuote()}</Text>
          ) : (
            <FlatList
              data={todos}
              keyExtractor={item => item.id}
              renderItem={renderTodo}
              style={styles.todoList}
            />
          )}
        </View>
        <View style={styles.footer}>
          <Text style={styles.logoutPlaceholder}>Logout (see profile)</Text>
        </View>
        {/* Profile Modal */}
        <Modal
          visible={profileModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setProfileModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Profile</Text>
              <Image source={require('../assets/icon.png')} style={styles.profileImageLarge} />
              <TextInput
                style={styles.input}
                value={userName}
                onChangeText={setUserName}
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                  setProfileModalVisible(false);
                  navigation.replace && navigation.replace('Login');
                }}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
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
  calendarContainer: {
    marginBottom: 24,
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
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4f8cff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  todoList: {
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
  },
  todoItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  todoContent: {
    flexDirection: 'column',
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  todoDescription: {
    fontSize: 15,
    color: '#666',
    marginTop: 2,
    marginBottom: 6,
  },
  todoActions: {
    flexDirection: 'row',
    marginTop: 6,
  },
  editButton: {
    backgroundColor: '#ffb347',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#ff4f4f',
    padding: 8,
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: '#4f8cff',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#bbb',
    padding: 8,
    borderRadius: 6,
  },
  editContainer: {
    flexDirection: 'column',
  },
  emptyText: {
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
  profileCircle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileImageLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#ff4f4f',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#bbb',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
});

export default DashboardScreen; 