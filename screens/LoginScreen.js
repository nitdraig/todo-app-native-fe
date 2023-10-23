import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import Axios from "axios";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      // Datos que se enviarán al servidor para la autenticación
      const data = {
        email,
        password,
      };

      // Cambia la URL a la dirección de tu servidor Express para la autenticación
      const url = "http://192.168.1.8:3000/auth/login"; // Asegúrate de usar la URL correcta

      const response = await Axios.post(url, data);

      // Verificar la respuesta del servidor y realizar acciones apropiadas
      if (response.status === 200) {
        // Autenticación exitosa
        console.log("Autenticación exitosa");
        navigation.navigate("TaskContent");
      } else {
        // Autenticación fallida
        Alert.alert("Error", "Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      Alert.alert(
        "Error",
        "Error al iniciar sesión. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Para navegar a la pantalla de registro (RegisterScreen)
  const handleRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  return (
    <View style={styles.container}>
      <Text>Iniciar Sesión</Text>
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Registrarse"
          onPress={handleRegister}
          disabled={isLoading}
          color="#34C759" // Cambia el color según tus preferencias
        />
        <Button
          title="Iniciar Sesión"
          onPress={handleLogin}
          disabled={isLoading}
          color="#007AFF" // Cambia el color según tus preferencias
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row", // Alinea los botones en fila
    justifyContent: "space-between", // Espacio entre los botones
    width: "100%",
  },
});

export default LoginScreen;
