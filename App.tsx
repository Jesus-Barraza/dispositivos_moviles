import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, Text, FlatList, TextInput, TouchableOpacity, 
  StyleSheet, SafeAreaView, Image, Alert, ActivityIndicator 
} from 'react-native';

const Stack = createStackNavigator();

// --- COMPONENTE REUTILIZABLE: TropaCard ---
// (Cumple Criterio 3: Componente reutilizable)
const TropaCard = ({ item, onDelete }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.imagen }} style={styles.tropaImg} />
    <View style={styles.info}>
      <Text style={styles.nombreTropa}>{item.nombre}</Text>
      <Text style={styles.detalleTropa}>{item.categoria} | Stock: {item.cantidad}</Text>
      <Text style={styles.precioTropa}>{parseFloat(item.precio).toFixed(2)} Elixir</Text>
    </View>
    <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.btnDelete}>
      <Text style={styles.btnTextWhite}>🗑️</Text>
    </TouchableOpacity>
  </View>
);

// --- PANTALLA 1: CUARTEL (LISTADO Y BUSCADOR) ---
function CuartelScreen({ navigation }) {
  const [tropas, setTropas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  // Leer datos de XAMPP (READ de CRUD)
  const obtenerTropas = async () => {
    try {
      const response = await fetch('http://10.0.2.2/clash_api/get_tropas.php');
      const data = await response.json();
      setTropas(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      obtenerTropas();
    });
    return unsubscribe;
  }, [navigation]);

  const eliminarTropa = (id) => {
    Alert.alert("Eliminar Tropa", "¿Seguro que quieres borrarla del inventario?", [
      { text: "No" },
      { text: "Sí, borrar", onPress: () => {
        // Aquí podrías agregar un fetch a un archivo eliminar.php
        setTropas(tropas.filter(t => t.id !== id));
      }}
    ]);
  };

  const listaFiltrada = tropas.filter(t => 
    t.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput 
        style={styles.buscador} 
        placeholder="🔍 Buscar en el cuartel..." 
        placeholderTextColor="#666"
        onChangeText={setFiltro}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : (
        <FlatList 
          data={listaFiltrada}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <TropaCard item={item} onDelete={eliminarTropa} />}
        />
      )}

      <TouchableOpacity 
        style={styles.btnAgregar} 
        onPress={() => navigation.navigate('Formulario')}
      >
        <Text style={styles.btnTextWhite}>+ ENTRENAR NUEVA TROPA</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// --- PANTALLA 2: FORMULARIO (CREAR) ---
function FormularioScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState('');

  const guardarTropa = async () => {
    if (!nombre || !precio || !cantidad) {
      Alert.alert("Error", "Los campos Nombre, Precio y Cantidad son obligatorios");
      return;
    }

    try {
      // (CREATE de CRUD)
      const response = await fetch('http://10.0.2.2/clash_api/insertar_tropa.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre, precio, cantidad, categoria, imagen: imagen || 'https://static.wikia.nocookie.net/clashofclans/images/7/7d/Giant-home.png'
        })
      });
      
      if (response.ok) {
        Alert.alert("¡Éxito!", "Tropa enviada al cuartel");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con XAMPP");
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Nombre de la Tropa:</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Ej. Bárbaro" />
      
      <Text style={styles.label}>Coste Elixir:</Text>
      <TextInput style={styles.input} value={precio} onChangeText={setPrecio} keyboardType="numeric" />
      
      <Text style={styles.label}>Cantidad:</Text>
      <TextInput style={styles.input} value={cantidad} onChangeText={setCantidad} keyboardType="numeric" />
      
      <Text style={styles.label}>Categoría (Tier):</Text>
      <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} placeholder="Ej. Guerrero" />

      <Text style={styles.label}>URL de Imagen:</Text>
      <TextInput style={styles.input} value={imagen} onChangeText={setImagen} placeholder="https://..." />

      <TouchableOpacity style={styles.btnGuardar} onPress={guardarTropa}>
        <Text style={styles.btnTextWhite}>GUARDAR EN BASE DE DATOS</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- NAVEGADOR ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ 
        headerStyle: { backgroundColor: '#D35400' }, 
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' } 
      }}>
        <Stack.Screen name="Cuartel" component={CuartelScreen} options={{ title: '⚔️ MI ALDEA' }} />
        <Stack.Screen name="Formulario" component={FormularioScreen} options={{ title: '🛡️ ENTRENAR' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FF8C00', padding: 15 },
  formContainer: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  buscador: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16, color: '#000' },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, flexDirection: 'row', marginBottom: 12, alignItems: 'center', elevation: 3 },
  tropaImg: { width: 65, height: 65, borderRadius: 10, marginRight: 15 },
  info: { flex: 1 },
  nombreTropa: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  detalleTropa: { color: '#666', fontSize: 14 },
  precioTropa: { color: '#D35400', fontWeight: 'bold', fontSize: 16 },
  btnDelete: { backgroundColor: '#FF4444', padding: 10, borderRadius: 8 },
  btnAgregar: { backgroundColor: '#28B463', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnGuardar: { backgroundColor: '#D35400', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  btnTextWhite: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  input: { borderBottomWidth: 1, borderColor: '#DDD', marginBottom: 15, fontSize: 16, paddingVertical: 5, color: '#000' },
  label: { fontWeight: 'bold', color: '#555', fontSize: 14 }
});