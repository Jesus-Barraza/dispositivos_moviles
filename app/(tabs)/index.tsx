import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="agregar" options={{ title: 'Agregar' }} />
      <Tabs.Screen name="buscar" options={{ title: 'Buscar' }} />
      <Tabs.Screen name="modificar" options={{ title: 'Modificar' }} />
      <Tabs.Screen name="eliminar" options={{ title: 'Eliminar' }} />
    </Tabs>
  );
}
