import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      // Datos que se enviarán al servidor
      const data = {
        username,
        email,
        password,
      };

      // Cambia la URL a la dirección de tu servidor Express
      const url = "http://192.168.1.8:3000/user/register"; // Asegúrate de usar la URL correcta

      const response = await Axios.post(url, data);

      // Verificar la respuesta del servidor y realizar acciones apropiadas
      if (response.status === 201) {
        // El usuario se registró con éxito
        console.log("Usuario registrado con éxito");
      } else {
        // Error al registrar
        console.error("Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default RegisterScreen;
