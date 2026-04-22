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
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";
import * as Yup from 'yup';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

type productoEstructura = {
  id: string;
  nombre: string;
  precio: number | string;
  cantidad: number | string;
  categoria: string;
  imagen?: string | null;
};

const initialState: productoEstructura = {
    id: "",
    nombre: "",
    precio: 0,
    cantidad: 0,
    categoria: "",
    imagen: "",
};

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre del producto es obligatorio"),
  precio: Yup.number().min(0.0, "Inserta un precio válido").required("Precio obligatorio"),
  cantidad: Yup.number().min(0, "Selecciona una cantidad válida").required("Cantidad del producto obligatorio"),
  categoria: Yup.string().required("La categoría del producto es importante"),
  imagen: Yup.string()
});


export const Modificar = () => {
    const router = useRouter();

    const [producto, setProducto] = useState<productoEstructura>(initialState);
    const [idBuscar, setIdBuscar] = useState("");
    const [btnGuardar, setBtnGuardar] = useState(true);

    const notify = (num: number) => {
        if (num == 200) {
            Alert.alert("Hecho!", "Producto Actualizado!");
            handleRegresar();
        } else if (num == 102) {
            Alert.alert("Error!", "La ID es incorrecta!")
        } else if (num == 101) {
            Alert.alert("Error!", "No se ha encontrado el producto!")
        } else if (num == 100) {
            Alert.alert("Error!", "No se ha actualizado el producto!")
        }
    };

    const normalizeBase64 = (raw?: any) => {
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
    
    const handleIDChange = (value: string) => {
        setIdBuscar(value);
    };

    const handleRegresar = () => {
        handleCancelar()
        router.push("/home"); // Regresa al Home
    };

    const handleCancelar = () => {
        setProducto(initialState);
        setBtnGuardar(true);
        setIdBuscar("");
    };

    const handleChange = (name: keyof productoEstructura, value: string | number) => {
        if (name === "precio" || name === "cantidad") {
            setProducto({ ...producto, [name]: Number(value) });
        } else {
            setProducto({ ...producto, [name]: value });
        }
    };

    // 🔍 Buscar producto por ID
    const buscarProductoID = async () => {
        try {
            const response = await axios.get(
                `http://10.0.2.2:5000/producto/detalle/${Number(idBuscar)}`
            );

            if (response.data.result.length > 0) {
                setProducto(response.data.result[0]);
                setBtnGuardar(false);
            } else {
                Alert.alert("Error", "Producto no encontrado");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo consultar");
        }
    };

    // ✏️ Modificar producto
    const modificarProducto = async () => {
        console.log("PUT id:", producto.id)
        try {
            console.log("PUT body:", producto)
            await axios.put(
                `http://10.0.2.2:5000/producto/${producto.id}`,
                producto
            );

            Alert.alert("Éxito", "Producto actualizado");
            router.push("/home");
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar");
            if (error instanceof AxiosError) {
                console.error("modificarProducto error:", error.response?.status, error.response?.data)
            } else {
                console.error("modificarProducto error:", error)
            }
        }
    };

    //La imagen del producto
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
            if (base64Img != undefined) {
            console.log('Decoded once startsWith:', base64Img.slice(0,50));
            } else {
            console.log("La imagen es vacía")
            }

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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Modificar producto</Text>

            {/* Buscar */}
            <TextInput
                placeholder="ID del producto"
                style={styles.input}
                keyboardType="numeric"
                onChangeText={(val) => handleIDChange(val)}
            />

            <TouchableOpacity style={styles.button} onPress={buscarProductoID}>
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

            <TouchableOpacity style={styles.boton} onPress={Imagen}>
                <Text style={styles.txtBoton}>Seleccionar Imagen</Text>
            </TouchableOpacity>

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
            <TouchableOpacity style={styles.button} onPress={modificarProducto} disabled={btnGuardar}>
                <Text style={styles.buttonText}>Guardar cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: "#aaa" }}
                onPress={handleRegresar}
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
        backgroundColor: "#fffdee",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#4a301c",
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
        backgroundColor: "#696f28",
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    boton: {
        backgroundColor: "#bec590",
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
        color: "#131600",
        fontWeight: "600",
        fontSize: 16,
        letterSpacing: 0.5,
    },
});