import React from "react";
import {createStackNavigator} from "@react-navigation/stack"
import {Agregar, Buscar, Eliminar, Modificar, Home} from "../screens"


export type RootStackParams = {
  Home: undefined,
  Agregar: undefined,
  Buscar: undefined,
  Modificar: undefined,
  Eliminar: undefined
} 

const Stack = createStackNavigator();

export const Navigator = () => {
    return(
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
            <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
            <Stack.Screen name="Agregar" component={Agregar} options={{ title: 'Agregar' }} />
            <Stack.Screen name="Buscar" component={Buscar} options={{ title: 'Buscar' }} />
            <Stack.Screen name="Modificar" component={Modificar} options={{ title: 'Modificar' }} />
            <Stack.Screen name="Eliminar" component={Eliminar} options={{ title: 'Eliminar' }} />
        </Stack.Navigator>
    );
};