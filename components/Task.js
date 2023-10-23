import React, { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  PanResponder,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import axios from "axios";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import TodoModalContent from "./TodoModalContent";

function CheckMark({ _id, completed, toggleTodo, description }) {
  async function toggle() {
    try {
      const response = await axios.put(
        `http://192.168.1.8:3000/todo-app/tasks/${_id}`,
        {
          completed: !completed, // Cambia el valor de completed
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toggleTodo(_id); // Llama a toggleTodo con el _id correcto
      } else {
        console.error(
          "Error al cambiar el estado de la tarea:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la tarea:", error);
    }
  }

  return (
    <Pressable
      onPress={toggle}
      style={[
        styles.CheckMark,
        { backgroundColor: completed ? "#0ea5e9" : "#e9e9ef" }, // Cambia el color según el estado
      ]}
    ></Pressable>
  );
}

export default function Tasks({
  _id,
  title,
  completed,
  description,
  toggleTodo,
  setTodos,
  drag,
}) {
  const [isDeleteActive, setIsDeleteActive] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const sharedBottomSheetRef = useRef(null);
  const snapPoints = ["25%", "48%", "75%"];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }

  async function handleTaskUpdate(editedTitle, editedDescription) {
    try {
      const response = await axios.put(
        `http://192.168.1.8:3000/todo-app/tasks/${_id}`,
        {
          title: editedTitle,
          description: editedDescription,
        }
      );

      if (response.status === 200) {
        const updatedTask = {
          _id,
          title: editedTitle,
          description: editedDescription,
          completed,
        };
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo._id === _id ? updatedTask : todo))
        );
        Alert.alert("Task Updated", "The task has been updated successfully.");
        bottomSheetModalRef.current?.close(); // Cierra el modal después de la actualización
      } else {
        console.error("Error al actualizar la tarea:", response.status);
      }
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  }
  async function deleteTodo() {
    try {
      if (!_id) {
        console.error("El valor del ID es indefinido.");
        return;
      }

      const response = await axios.delete(
        `http://192.168.1.8:3000/todo-app/tasks/${_id}`
      );

      if (response.status === 200) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== _id));
      } else {
        console.error("Error al eliminar la tarea:", response.status);
      }
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  }

  return (
    <TouchableOpacity
      onLongPress={() => setIsDeleteActive(true)}
      onPress={() => setIsDeleteActive(false)}
      activeOpacity={0.8}
      style={[styles.container]}
    >
      <View style={styles.contentTextCheckBox} {...drag}>
        <CheckMark _id={_id} completed={completed} toggleTodo={toggleTodo} />
        <Text style={styles.textTitle}>{title}</Text>
        <View style={styles.contentTextDesc}>
          <Text style={styles.textDesc}>{description}</Text>
        </View>
      </View>

      <Ionicons
        onPress={handlePresentModal}
        name="pencil"
        size={20}
        color="black"
      />
      {isDeleteActive && (
        <Pressable onPress={deleteTodo} style={styles.deleteButton}>
          <Feather name="x" size={24} color="red" />
        </Pressable>
      )}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={2}
        snapPoints={snapPoints}
        backgroundStyle={{ borderRadius: 50, borderWidth: 4 }}
      >
        <TodoModalContent
          _id={_id}
          title={title}
          description={description}
          onUpdate={handleTaskUpdate}
          onCancel={() => bottomSheetModalRef.current?.close()}
        />
      </BottomSheetModal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 21,
    marginBottom: 10,
    backgroundColor: "white",
  },
  containerTextCheckBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
  },
  contentTextDesc: {
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  title: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 16,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#383839",
    letterSpacing: -0.011 * 16, // 16 = baseFontSize
    flexShrink: 1,
    marginHorizontal: 8,
  },
  textDesc: {
    fontSize: 14,
    fontWeight: "400",
    color: "#383839",
    letterSpacing: -0.011 * 16, // 16 = baseFontSize
    flexShrink: 1,
    marginHorizontal: 8,
  },
  CheckMark: {
    width: 20,
    height: 20,
    borderRadius: 7,
  },
  deleteButton: {
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  title: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 16,
  },
  subtitle: {
    color: "#101318",
    fontSize: 14,
    fontWeight: "bold",
  },
  description: {
    color: "#56636F",
    fontSize: 13,
    fontWeight: "normal",
    width: "100%",
  },
});
