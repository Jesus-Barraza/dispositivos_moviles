import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {HomeScreen, AgregarScreen, ConsultarScreen, EliminarScreen, ModificarScreen} from "../screens"

export type RootStackParams = {
  Home: undefined,
  Agregar: undefined,
  Consultar: undefined,
  Modificar: undefined,
  Eliminar: undefined
} 

const Stack = createStackNavigator();

export const StackNavigator = () => {
  return (
    <Stack.Navigator 
    initialRouteName="Home"
    screenOptions= {{
      headerShown:false,
      headerStyle:{
        elevation:0,
        shadowColor:"transparent",
      }
    }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="Agregar" component={AgregarScreen} options={{ title: 'Agregar' }} />
      <Stack.Screen name="Consultar" component={ConsultarScreen} options={{ title: 'Consultar' }} />
      <Stack.Screen name="Modificar" component={ModificarScreen} options={{ title: 'Modificar' }} />
      <Stack.Screen name="Eliminar" component={EliminarScreen} options={{ title: 'Eliminar' }} />
    </Stack.Navigator>
  );
};
