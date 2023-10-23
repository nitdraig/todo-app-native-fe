import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

function AddTask({ setTodos, toggleVisibility }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  async function handleAddTask() {
    try {
      const response = await axios.post(
        "http://192.168.1.8:3000/todo-app/tasks",
        {
          title: title,
          description: description,
        }
      );

      if (response.status === 201) {
        setTitle("");
        setDescription("");

        const newTask = response.data;

        bottomSheetModalRef.current?.close();
        setIsModalVisible(false);
      }

      Alert.alert("Nueva tarea agregada", "Muy bien!!");
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título"
        placeholderTextColor="#ffffff"
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción"
        value={description}
        placeholderTextColor="#ffffff"
        onChangeText={(text) => setDescription(text)}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
        <Text style={styles.buttonText}>Agregar Tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#ffffff",
    borderRadius: 5,
    padding: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#0ea5e9",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AddTask;
