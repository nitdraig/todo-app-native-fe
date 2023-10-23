import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import TaskContent from "./components/TaskContent";
import RegisterScreen from "./screens/RegisterScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Iniciar sesión">
        <Stack.Screen
          name="Iniciar sesión"
          component={LoginScreen}
          options={{ title: "Iniciar sesión" }}
        />
        <Stack.Screen
          name="TaskContent"
          component={TaskContent}
          options={{
            title: "Contenido de Tareas",
          }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: "Registrarse" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
