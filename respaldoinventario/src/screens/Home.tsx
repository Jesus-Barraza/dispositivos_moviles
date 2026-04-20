import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@react-native-vector-icons/ionicons";

export const Home = () => {
  const router = useRouter();

  const [colorAgregar, setColorAgregar] = useState("#A8E6CF");
  const [colorModificar, setColorModificar] = useState("#CEC476");
  const [colorBuscar, setColorBuscar] = useState("#818DE7");
  const [colorEliminar, setColorEliminar] = useState("#E78181");

  const pressAgregar = () => {
    setColorAgregar(prev => (prev === "#A8E6CF" ? "#539a53" : "#A8E6CF"));
    router.push("/agregar");
  };

  const pressModificar = () => {
    setColorModificar(prev => (prev === "#CEC476" ? "#867e40" : "#CEC476"));
    router.push("/modificar");
  };

  const pressBuscar = () => {
    setColorBuscar(prev => (prev === "#818DE7" ? "#3c4695" : "#818DE7"));
    router.push("/buscar");
  };

  const pressEliminar = () => {
    setColorEliminar(prev => (prev === "#E78181" ? "#882e2e" : "#E78181"));
    router.push("/eliminar");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sistema de inventario</Text>

      <TouchableOpacity onPress={pressAgregar} style={{ ...styles.boton, backgroundColor: colorAgregar }}>
        <Icon name="add-circle-outline" size={30} color="#164d19" />
        <Text style={{ ...styles.txtBoton, color: "#164d19" }}>Agregar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pressBuscar} style={{ ...styles.boton, backgroundColor: colorBuscar }}>
        <Icon name="search-circle-outline" size={30} color="#1d2471" />
        <Text style={{ ...styles.txtBoton, color: "#1d2471" }}>Buscar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pressModificar} style={{ ...styles.boton, backgroundColor: colorModificar }}>
        <Icon name="sync-circle-outline" size={30} color="#71691d" />
        <Text style={{ ...styles.txtBoton, color: "#71691d" }}>Modificar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pressEliminar} style={{ ...styles.boton, backgroundColor: colorEliminar }}>
        <Icon name="remove-circle-outline" size={30} color="#561717" />
        <Text style={{ ...styles.txtBoton, color: "#561717" }}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "#3a3a3a",
  },
  titulo: {
    width: "98%",
    fontSize: 28,
    fontWeight: "700",
    color: "#b9bbbc",
    backgroundColor: "#2d2d2d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
    textAlign: "center",
    elevation: 3,
    shadowColor: "#ffffff",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 30,
  },
  boton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  txtBoton: {
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
