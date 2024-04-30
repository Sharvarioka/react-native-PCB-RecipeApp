import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen, FirstPage } from "./screens/index";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: "transparent",
  },
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        detachInactiveScreens={true}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="FirstPage" component={FirstPage} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
