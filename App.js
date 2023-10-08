import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Tasks from "./components/Task";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AddTask from "./components/AddTask";

export default function App() {
  const [todo, setTodos] = useState([]);
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);

  function clearTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }
  async function toggleTodo(id) {
    try {
      const response = await axios.put(
        `http://192.168.1.9:3000/todo-app/tasks/${id}`
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
  function fetchUpdatedTasks() {
    axios
      .get("http://192.168.1.9:3000/todo-app/tasks")
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
        "http://192.168.1.9:3000/todo-app/tasks"
      );
      setTodos(response.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <SafeAreaView>
          <FlatList
            data={todo}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <Tasks
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
            ListHeaderComponent={() => <Text style={styles.title}>Today</Text>}
            contentContainerStyle={styles.contentContainerStyle}
          />
        </SafeAreaView>
        <StatusBar style="auto" />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddTaskVisible(!isAddTaskVisible)}
        >
          <Ionicons name="add-circle-outline" size={60} color="black" />
        </TouchableOpacity>

        {isAddTaskVisible && (
          <AddTask setTodos={setTodos} toggleVisibility={setIsAddTaskVisible} />
        )}
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E9EF",
  },
  contentContainerStyle: {
    padding: 15,
  },
  title: {
    fontWeight: "800",
    fontSize: 28,
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
});
