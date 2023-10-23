import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function TodoModalContent({
  _id,
  title,
  description,
  onUpdate,
  onCancel,
}) {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);

  const handleUpdate = () => {
    onUpdate(editedTitle, editedDescription);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar tarea</Text>
      <TextInput
        style={styles.input}
        value={editedTitle}
        onChangeText={setEditedTitle}
        placeholder="Task Title"
      />
      <TextInput
        style={styles.input}
        value={editedDescription}
        onChangeText={setEditedDescription}
        placeholder="Task Description"
      />
      <Button title="Actualizar tarea" onPress={handleUpdate} />
      <Button title="Cancelar" onPress={onCancel} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});
