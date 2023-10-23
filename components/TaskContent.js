import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import axios from "axios";
import Tasks from "./Task";
import { Ionicons } from "@expo/vector-icons";
import AddTask from "./AddTask";

export default function TaskContent() {
  const [todo, setTodos] = useState([]);
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);

  function clearTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }
  async function toggleTodo(id) {
    try {
      const response = await axios.put(
        `http://192.168.1.8:3000/todo-app/tasks/${id}`
      );
      const updatedTask = response.data;

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === updatedTask._id ? updatedTask : todo
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado de la tarea:", error);
    }
  }
  function MotivationalQuote() {
    const [motivationalQuote, setMotivationalQuote] = useState("");

    useEffect(() => {
      axios
        .get("http://192.168.1.8:3000/todo-app/motivational-quote")
        .then((response) => {
          setMotivationalQuote(response.data.quote.text);
        })
        .catch((error) => {
          console.error("Error al obtener la frase motivacional:", error);
        });
    }, []);

    return <Text style={styles.motivationalQuote}>{motivationalQuote}</Text>;
  }
  function fetchUpdatedTasks() {
    axios
      .get("http://192.168.1.8:3000/todo-app/tasks")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener tareas actualizadas:", error);
      });
  }
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const intervalId = setInterval(fetchUpdatedTasks, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(
        "http://192.168.1.8:3000/todo-app/tasks"
      );
      setTodos(response.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }

  const [user, setUser] = useState(null);
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Realiza una solicitud para obtener el nombre de usuario desde la API
        const response = await axios.get("http://192.168.1.8:3000/user"); // Reemplaza con la URL correcta
        setUser(response.data.username);
      } catch (error) {
        console.error("Error al obtener el nombre de usuario:", error);
      }
    }

    fetchUserData();
  }, []);

  const TaskMemo = React.memo(Tasks);
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Bienvenido, {user || "Cargando..."}</Text>
        </View>
        <MotivationalQuote />
        <FlatList
          data={todo}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TaskMemo
              _id={item._id}
              title={item.title}
              description={item.description}
              completed={item.completed}
              clearTodo={clearTodo}
              user={item.user}
              toggleTodo={toggleTodo}
              setTodos={setTodos}
            />
          )}
          ListHeaderComponent={() => null}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </SafeAreaView>
      <StatusBar style="auto" />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddTaskVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={60} color="black" />
      </TouchableOpacity>

      <Modal
        isVisible={isAddTaskVisible}
        style={styles.addTaskModal}
        onBackdropPress={() => setIsAddTaskVisible(false)}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriver={true}
      >
        <AddTask
          setTodos={setTodos}
          toggleVisibility={() => setIsAddTaskVisible(false)} // Pasa la función para controlar la visibilidad del modal
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E9EF",
    padding: 10,
  },
  contentContainerStyle: {
    padding: 15,
  },
  titleSection: {
    margin: 15,
  },
  title: {
    fontWeight: "800",
    fontSize: 25,
    marginTop: 30,
    marginBottom: 15,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  motivationalQuote: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    color: "#000EF9",
    margin: 20,
    marginTop: -14,
    marginVertical: 10,
  },
});
