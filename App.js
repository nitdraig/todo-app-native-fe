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
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios"; // Importa Axios
import Tasks from "./components/Task";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import AddTask from "./components/AddTask";

export default function App() {
  const [todo, setTodos] = useState([]);
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false); // Nuevo estado

  function clearTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }
  async function toggleTodo(id) {
    try {
      const response = await axios.put(
        `http://192.168.1.9:3000/todo-app/tasks/${id}`
      );
      const updatedTask = response.data;

      // Actualiza el estado local con la tarea actualizada
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
    // Realiza una solicitud GET al servidor para obtener las tareas actualizadas
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
    const intervalId = setInterval(fetchUpdatedTasks, 5000); // 5000 ms = 5 segundos

    return () => {
      clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
    };
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(
        "http://192.168.1.9:3000/todo-app/tasks"
      ); // Utiliza Axios
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
            keyExtractor={(item) => item._id.toString()} // Usar _id como clave
            renderItem={({ item }) => (
              <Tasks
                _id={item._id}
                title={item.title}
                description={item.description}
                completed={item.completed}
                clearTodo={clearTodo}
                user={item.user}
                toggleTodo={toggleTodo}
                setTodos={setTodos} // Asegúrate de pasar setTodos aquí
              />
            )}
            ListHeaderComponent={() => <Text style={styles.title}>Today</Text>}
            contentContainerStyle={styles.contentContainerStyle}
          />
        </SafeAreaView>
        <StatusBar style="auto" />
        {/* Botón flotante para mostrar/ocultar el componente AddTask */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddTaskVisible(!isAddTaskVisible)}
        >
          <Ionicons name="add-circle-outline" size={60} color="black" />
        </TouchableOpacity>

        {/* Renderiza el componente AddTask si isAddTaskVisible es true */}
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
