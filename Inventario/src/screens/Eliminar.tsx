import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

export const Eliminar = () => {
    const router = useRouter();
    const [id, setId] = useState("");

    // 🗑️ Eliminar producto
    const eliminarProducto = async () => {
        if (!id.trim()) {
            Alert.alert("Error", "Ingresa un ID válido");
            return;
        }

        try {
            const response = await axios.delete(
                `http://10.0.2.2:5000/producto/${id}`
            );

            if (response.status === 200) {
                Alert.alert("Éxito", "Producto eliminado correctamente");
                setId("");
            } else {
                Alert.alert("Error", "No se pudo eliminar");
            }
        } catch (error: any) {
            console.log(error);

            if (error?.response?.status === 404) {
                Alert.alert("Error", "Producto no encontrado");
            } else {
                Alert.alert("Error", "No se pudo conectar al servidor");
            }
        }
    };

    // ⚠️ Confirmación antes de eliminar
    const confirmarEliminacion = () => {
        Alert.alert(
            "Confirmar",
            `¿Seguro que deseas eliminar el producto con ID ${id}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: eliminarProducto },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Eliminar producto</Text>

            <TextInput
                placeholder="ID del producto"
                value={id}
                onChangeText={setId}
                keyboardType="numeric"
                style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={confirmarEliminacion}>
                <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: "#aaa" }}
                onPress={() => router.push("/home")}
            >
                <Text style={{ ...styles.buttonText, color: "#333" }}>
                    Regresar al Home
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Eliminar;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fdeaea",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#7d1e1e",
    },
    input: {
        borderWidth: 1,
        borderColor: "#e0a1a1",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
        color: "#000",
    },
    button: {
        backgroundColor: "#d9534f",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});