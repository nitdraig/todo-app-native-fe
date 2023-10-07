import axios from "axios";
import React, { useState } from "react";
import { Keyboard, View, Text, StyleSheet, Button, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function TodoModalContent({
  _id,
  title,
  description,
  onUpdate,
}) {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `http://192.168.1.9:3000/todo-app/tasks/${_id}`,
        {
          title: editedTitle,
          description: editedDescription,
        }
      );

      if (response.status === 200) {
        // Llama a la función onUpdate para actualizar el estado local de la tarea
        onUpdate(_id, editedTitle, editedDescription);
        Alert.alert("Task Updated", "The task has been updated successfully.");
      } else {
        console.error("Error al actualizar la tarea:", response.status);
      }
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <Text style={[styles.title, { marginBottom: 20 }]}>Edit Task</Text>
      <TextInput
        value={editedTitle}
        onChangeText={(text) => setEditedTitle(text)}
        style={[styles.input, { marginBottom: 20 }]}
        placeholder="Task Title"
      />
      <TextInput
        value={editedDescription}
        onChangeText={(text) => setEditedDescription(text)}
        style={styles.input}
        placeholder="Task Description"
        multiline
        numberOfLines={4}
      />
      <Button
        onPress={handleSubmit}
        title="Save Changes"
        disabled={editedTitle.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  title: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "#00000020",
    padding: 15,
    borderRadius: 15,
    marginVertical: 15,
  },
});
