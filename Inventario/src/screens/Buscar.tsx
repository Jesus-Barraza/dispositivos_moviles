// Buscar.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

type productoEstructura = {
  id: number;
  nombre: string;
  precio: number | string;
  cantidad: number | string;
  categoria: string;
  imagen?: string | null;
};

const initialState: productoEstructura = {
  id: 0,
  nombre: "",
  precio: 0.0,
  cantidad: 0,
  categoria: "",
  imagen: "",
};

const API_BASE = "http://10.0.2.2:5000";

export const Buscar = () => {
  const router = useRouter();

  const [producto, setProducto] = useState<productoEstructura>(initialState);
  const [productos, setProductos] = useState<productoEstructura[]>([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const notify = (num: number) => {
    if (num === 101) {
      Alert.alert("¡Error!", "No se ha encontrado el producto");
    }
  };

  const normalizeImagen = (raw?: any) => {
    if (!raw && raw !== "") return null;
    try {
      const s = String(raw ?? "").replace(/\r?\n|\r|\s+/g, "");
      if (s === "") return null;
      // si viene con data: URI, extraer la parte base64
      if (s.startsWith("data:")) return s.split(",")[1];
      return s;
    } catch {
      return null;
    }
  };

  const productoConsultaNombre = async () => {
    try {
      setLoading(true);
      // Mantener la lógica simple que funcionaba: si name vacío, pasar "" para que el servidor haga LIKE '%%'
      const nombre1 = name.trim() === "" ? "_" : name.trim();
      const url = `${API_BASE}/producto/${nombre1}`;
      console.log("GET ->", url);
      const response = await axios.get(url, { timeout: 10000 });

      if (response.data?.status === 200) {
        if (response.data.result.length > 0) {
          // normalizar imagenes (quitar saltos)
          const normalized = response.data.result.map((p: any) => ({
            ...p,
            imagen: normalizeImagen(p.imagen),
          }));
          setProductos(normalized);
          setShow(true);
        } else {
          setProducto(initialState);
          setProductos([]);
          setShow(false);
          notify(101);
        }
      } else {
        console.warn("Error en respuesta:", response.data);
        Alert.alert("Error", "Respuesta inesperada del servidor");
      }
    } catch (error: any) {
      console.error("ERROR AXIOS (buscar nombre):", {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert("Error", "No se pudo conectar al servidor: " + (error.message || "desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const productoConsultaId = async (ide: string) => {
    try {
      setLoadingId(Number(ide));
      const ide1 = ide === "" ? "0" : ide;
      const url = `${API_BASE}/producto/detalle/${ide1}`;
      console.log("GET ->", url);
      const response = await axios.get(url, { timeout: 10000 });

      if (response.data?.status === 200) {
        if (response.data.result.length > 0) {
          const p = response.data.result[0];
          setProducto({ ...p, imagen: normalizeImagen(p.imagen) });
          setShow(true);
        } else {
          notify(101);
        }
      } else {
        console.warn("Error en respuesta detalle:", response.data);
        Alert.alert("Error", "Respuesta inesperada del servidor");
      }
    } catch (error: any) {
      console.error("ERROR AXIOS (detalle id):", {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert("Error", "No se pudo conectar al servidor: " + (error.message || "desconocido"));
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    productoConsultaNombre();
  }, []); // carga inicial

  const buildImageUri = (item: productoEstructura) => {
    // Si el backend devolvió base64 en imagen -> construir data URI
    if (item.imagen && item.imagen.length > 0) {
      const s = item.imagen;
      const mime = s.startsWith("/9j/") ? "jpeg" : s.startsWith("iVBORw0K") ? "png" : "jpeg";
      return `data:image/${mime};base64,${s}`;
    }
    // Si no hay base64, usar endpoint que sirve bytes
    return `${API_BASE}/producto/${item.id}/image`;
  };

  const renderItem = ({ item }: { item: productoEstructura }) => (
    <View style={styles.card}>
      <Text style={styles.text}>{item.id}</Text>
      <Text style={styles.label}>Nombre: </Text>
      <Text style={styles.text}>{item.nombre}</Text>
      <Text style={styles.label}>Precio: </Text>
      <Text style={styles.text}>{item.precio}</Text>

      {item.imagen || item.id ? (
        <Image
          source={{ uri: buildImageUri(item) }}
          style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8, backgroundColor: "#ddd" }}
          resizeMode="cover"
          onError={(e) => {
            console.warn("Image load error:", e.nativeEvent, "uri:", buildImageUri(item));
          }}
        />
      ) : null}

      <TouchableOpacity style={styles.boton} onPress={() => productoConsultaId(String(item.id))}>
        <Text style={styles.txtBoton}>Consultar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderField = (label: string, value: string) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  const handleBuscar = () => {
    productoConsultaNombre();
  };

  const handleClose = () => {
    setProducto(initialState);
    setShow(false);
  };

  const handleRegresar = () => {
    handleClose();
    router.push("/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Búsqueda de productos</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar por nombre de producto"
          placeholderTextColor="#4c60af"
          value={name}
          onChangeText={(valor) => setName(valor)}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={handleBuscar}
        />
        <TouchableOpacity style={styles.button} onPress={handleBuscar} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Buscar</Text>}
        </TouchableOpacity>
      </View>

      <FlatList data={productos} keyExtractor={(item) => String(item.id)} renderItem={renderItem} contentContainerStyle={styles.listContainer} />

      <Modal visible={show} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Producto {producto.id}</Text>
              {renderField("Nombre del producto", producto.nombre)}
              {renderField("Precio", "$" + producto.precio)}
              {renderField("Cantidad", `${producto.cantidad}`)}
              {renderField("Categoría", producto.categoria)}

              {producto.imagen || producto.id ? (
                <Image
                  source={{ uri: producto.imagen && producto.imagen.length > 0 ? `data:image/${producto.imagen.startsWith("/9j/") ? "jpeg" : producto.imagen.startsWith("iVBORw0K") ? "png" : "jpeg"};base64,${producto.imagen}` : `${API_BASE}/producto/${producto.id}/image` }}
                  style={{
                    width: 200,
                    height: 200,
                    marginTop: 10,
                    alignSelf: "center",
                    borderRadius: 10,
                    backgroundColor: "#eee",
                  }}
                  resizeMode="contain"
                  onError={(e) => {
                    console.warn("Modal image error", e.nativeEvent);
                    Alert.alert("Error", "No se pudo cargar la imagen");
                  }}
                />
              ) : null}

              {loadingId ? <ActivityIndicator style={{ marginTop: 12 }} /> : null}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={handleRegresar} style={styles.boton}>
        <Text style={styles.txtBoton}>Regresar al Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Buscar;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#e8f4f5",
    marginBottom: 20,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3a2e7d",
    marginVertical: 20,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#a9a5d6",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: "#ffffff",
    color: "#0f0f0f",
  },
  boton: {
    backgroundColor: "#a8b5e6",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 15,
    marginTop: 5,
    width: "90%",
    alignSelf: "center",
  },
  txtBoton: {
    color: "#1a164d",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#218189",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#c8e4e6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  label: {
    marginTop: 15,
    fontWeight: "bold",
    color: "#1e2169",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "#7d7c2e",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#eae9f8",
    width: "90%",
    borderRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#372e7d",
    textAlign: "center",
    marginBottom: 16,
  },
  field: {
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: "#81bac7",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: "center",
  },
  value: {
    fontSize: 16,
    color: "#372e7d",
  },
});
