import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

type Producto = {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    categoria: string;
    imagen: string;
};

const initialState: Producto = {
    id: 0,
    nombre: "",
    precio: 0,
    cantidad: 0,
    categoria: "",
    imagen: "",
};

export const Modificar = () => {
    const router = useRouter();

    const [producto, setProducto] = useState<Producto>(initialState);
    const [idBuscar, setIdBuscar] = useState("");

    const handleChange = (name: keyof Producto, value: string | number) => {
        if (name === "precio" || name === "cantidad" || name === "id") {
            setProducto({ ...producto, [name]: Number(value) });
        } else {
            setProducto({ ...producto, [name]: value });
        }
    };

    // 🔍 Buscar producto por ID
    const buscarProducto = async () => {
        try {
            const response = await axios.get(
                `http://10.0.2.2:5000/producto/detalle/${idBuscar}`
            );

            if (response.data.result.length > 0) {
                setProducto(response.data.result[0]);
            } else {
                Alert.alert("Error", "Producto no encontrado");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo consultar");
        }
    };

    // ✏️ Modificar producto
    const modificarProducto = async () => {
        try {
            await axios.put(
                `http://10.0.2.2:5000/producto/${producto.id}`,
                producto
            );

            Alert.alert("Éxito", "Producto actualizado");
            router.push("/home");
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Modificar producto</Text>

            {/* Buscar */}
            <TextInput
                placeholder="ID del producto"
                style={styles.input}
                keyboardType="numeric"
                onChangeText={setIdBuscar}
            />

            <TouchableOpacity style={styles.button} onPress={buscarProducto}>
                <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>

            {/* Formulario */}
            <TextInput
                style={styles.input}
                value={producto.nombre}
                placeholder="Nombre"
                onChangeText={(val) => handleChange("nombre", val)}
            />

            <TextInput
                style={styles.input}
                value={String(producto.precio)}
                placeholder="Precio"
                keyboardType="numeric"
                onChangeText={(val) => handleChange("precio", val)}
            />

            <TextInput
                style={styles.input}
                value={String(producto.cantidad)}
                placeholder="Cantidad"
                keyboardType="numeric"
                onChangeText={(val) => handleChange("cantidad", val)}
            />

            <TextInput
                style={styles.input}
                value={producto.categoria}
                placeholder="Categoría"
                onChangeText={(val) => handleChange("categoria", val)}
            />

            {/* Imagen */}
            {producto.imagen ? (
                <Image
                    source={{
                        uri: `data:image/jpeg;base64,${producto.imagen}`,
                    }}
                    style={{ width: 200, height: 200, marginTop: 10, alignSelf: "center" }}
                />
            ) : null}

            {/* Botón modificar */}
            <TouchableOpacity style={styles.button} onPress={modificarProducto}>
                <Text style={styles.buttonText}>Guardar cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: "#aaa" }}
                onPress={() => router.push("/home")}
            >
                <Text style={{ ...styles.buttonText, color: "#333" }}>Regresar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Modificar;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#eef5ff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#1c2b4a",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#4a6fa5",
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});