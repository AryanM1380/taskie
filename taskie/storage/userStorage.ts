import * as FileSystem from 'expo-file-system';

const fileUri = FileSystem.documentDirectory + 'users.json';

// Load users from the JSON file
export async function loadUsersFromFile() {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      // Create an empty file if it doesn't exist
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([]));
      return [];
    }

    const content = await FileSystem.readAsStringAsync(fileUri);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Save a new user to the JSON file
export async function saveUserToFile(newUser: { email: string; password: string }) {
  try {
    const users = await loadUsersFromFile();
    users.push(newUser);
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user:', error);
  }
}
