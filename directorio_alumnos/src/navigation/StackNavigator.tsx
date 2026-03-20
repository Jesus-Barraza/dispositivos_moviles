import { createStackNavigator } from '@react-navigation/stack';
import {homeScreen, agregarScreen, consultarScreen, eliminarScreen, modificarScreen} from "../screens"

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
      <Stack.Screen name="Home" component={homeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="Agregar" component={agregarScreen} options={{ title: 'Agregar' }} />
      <Stack.Screen name="Consultar" component={consultarScreen} options={{ title: 'Consultar' }} />
      <Stack.Screen name="Modificar" component={modificarScreen} options={{ title: 'Modificar' }} />
      <Stack.Screen name="Eliminar" component={eliminarScreen} options={{ title: 'Eliminar' }} />
    </Stack.Navigator>
  );
};
