import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";

type productoEstructura = {
  nombre: string;
  precio: number;
  cantidad: number;
  categoria: string;
  imagen: string;
};

const initialState: productoEstructura = {
  nombre: "",
  precio: 0.0,
  cantidad: 0,
  categoria: "",
  imagen: "",
};

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre del producto es obligatorio"),
  precio: Yup.number().min(0.0, "Inserta un precio válido").required("Precio obligatorio"),
  cantidad: Yup.number().min(0, "Selecciona una cantidad válida").required("Cantidad del producto obligatorio"),
  categoria: Yup.string().required("La categoría del producto es importante"),
  imagen: Yup.string(),
});

export const Agregar = () => {
  const router = useRouter();
  const [producto, setProducto] = useState<productoEstructura>(initialState);

  const { nombre, precio, cantidad, categoria, imagen } = producto;

  const handleChange = (name: keyof productoEstructura, value: string | number) => {
    if (name === "precio" || name === "cantidad") {
        setProducto({ ...producto, [name]: Number(value) });
    } else {
        setProducto({ ...producto, [name]: value });
    }
  };


  const handleCancelar = () => {
    setProducto(initialState);
    router.push("/home"); // Regresa al Home
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(producto, { abortEarly: false });
      console.log("Producto a agregar: ", producto);

      await axios
        .post("http://10.0.2.2:5000/producto", producto)
        .then((response) => {
          console.log(response);
          notify(response.status, response.data);
        })
        .catch(function (error) {
          console.log(error);
          notify(100, error);
        });
    } catch (err: any) {
      if (err.inner) {
        const mensajes = err.inner.map((e: any) => `- ${e.message}`).join("\n");
        Alert.alert("Error de validación", mensajes);
      } else {
        Alert.alert("Error", err.message);
      }
    }
  };

  const notify = (num: number, msg: string) => {
    if (num == 200) {
      Alert.alert("¡Hecho!", "Producto agregado");
      handleCancelar();
    } else {
      Alert.alert("¡Error!", `¡No se ha podido agregar el producto! ${msg}`);
    }
  };

  const Imagen = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso requerido", "Necesitas dar acceso a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      let base64Img: string | undefined = result.assets[0].base64 ?? undefined;

      if (!base64Img) {
        const uri = result.assets[0].uri;
        base64Img = await FileSystem.readAsStringAsync(uri, {
          encoding: "base64",
        });
      }

      handleChange("imagen", base64Img || "");
    }
  };

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Agregar un producto</Text>

        <TextInput style={styles.input} placeholder="nombre" placeholderTextColor="#888888" onChangeText={(val) => handleChange("nombre", val)} />
        <TextInput style={styles.input} placeholder="precio" placeholderTextColor="#888888" keyboardType="numbers-and-punctuation" onChangeText={(val) => handleChange("precio", val)} />
        <TextInput style={styles.input} placeholder="cantidad" placeholderTextColor="#888888" keyboardType="numeric" onChangeText={(val) => handleChange("cantidad", val)} />
        <TextInput style={styles.input} placeholder="categoria" placeholderTextColor="#888888" onChangeText={(val) => handleChange("categoria", val)} />

        <TouchableOpacity style={styles.boton} onPress={Imagen}>
          <Text style={styles.txtBoton}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        {imagen !== "" && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imagen}` }}
            style={{ width: 200, height: 200, marginTop: 10, alignSelf: "center", borderRadius: 10 }}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ ...styles.button, backgroundColor: "#9c9c9c" }} onPress={handleCancelar}>
          <Text style={{ ...styles.buttonText, color: "#3a3a3a" }}>Regresar al Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Agregar;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#e8f5e9",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#174119",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#ffffff",
    color: "#0f0f0f",
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#042205",
    fontWeight: "bold",
    fontSize: 16,
  },
  boton: {
    backgroundColor: "#a2c8ba",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 10,
  },
  txtBoton: {
    color: "#001600",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
