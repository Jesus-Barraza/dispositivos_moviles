import {View, Text, Alert, SafeAreaView, TextInput, TouchableOpacity, FlatList, Modal, ScrollView, StyleSheet, Image} from "react-native";
import {useNavigation, StackActions} from "@react-navigation/native";
import React, {useState, useEffect} from "react";
import { useRouter } from "expo-router";
import axios from "axios";

type productoEstructura = {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    categoria: string;
    imagen: string;
};

const initialState: productoEstructura = {
    id: 0,
    nombre: "",
    precio: 0.0,
    cantidad: 0,
    categoria: "",
    imagen: "",
};

export const Buscar = () => {
    const router = useRouter();

    const [producto, setProducto] = useState<productoEstructura>(initialState);
    const [productos, setProductos] = useState<productoEstructura[]>([]);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");

    const { id, nombre, precio, cantidad, categoria, imagen } = producto;

    const productoConsultaNombre = async () => {
        const nombre1 = (name == "") ? "_" : name
        const response = await axios.get(`http://10.0.2.2:5000/producto/${nombre1}`).then((response) => {
            if (response.data.status == 200) {
                if (response.data.result.length > 0) {
                    const first = response.data.result[0];
                    console.log("Tipo imagen (frontend):", typeof first.imagen);
                    console.log("Primeros 50 chars base64:", first.imagen?.slice(0, 50));
                    console.log("Longitud base64:", first.imagen?.length);

                    // Construir la data URI que se pasa al <Image />
                    const uri = `data:image/jpeg;base64,${first.imagen}`;
                    console.log("Data URI preview (slice):", uri.slice(0, 100));
                    setProductos(response.data.result);
                    setShow(true);
                } else {
                    setProducto(initialState);
                    setShow(false);
                    notify(101);
                }
            } else {
                console.log(`No fue posible traer los datos, ${response.data.message}`)
            }
        });
    };

    const productoConsultaId = async (ide:string) => {
        const ide1 = (ide == "") ? "0" : ide
        const response = await axios.get(`http://10.0.2.2:5000/producto/detalle/${ide1}`).then((response) => {
            if (response.data.status == 200) {
                console.log(response.data);
                if (response.data.result.length > 0) {
                    setProducto(response.data.result[0]);
                    setShow(true);
                } else {
                    notify(101);
                }
            } else {
                console.log(`No fue posible traer los datos, ${response.data.message}`)
            }
        });
    };

    const notify = (num: number) => {
        if (num == 101) {
            Alert.alert("¡Error!", "No se ha encontrado el producto");
        }
    };

    const handleChange = (valor: string):void => {
        setName(valor)
    };

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

    useEffect(() => {
        productoConsultaNombre();
    }, []);

    const renderItem = ({item}: {item: productoEstructura}) => (
        <View style={styles.card}>
            <Text style={styles.text}>{item.id}</Text>
            <Text style={styles.label}>Nombre: </Text>
            <Text style={styles.text}>{item.nombre}</Text>
            <Text style={styles.label}>Precio: </Text>
            <Text style={styles.text}>{item.precio}</Text>
            {item.imagen ? (
                <Image
                    source={{
                    uri: `data:image/${
                        item.imagen.startsWith("/9j/") ? "jpeg" :
                        item.imagen.startsWith("iVBORw0K") ? "png" :
                        "jpeg" // fallback
                    };base64,${item.imagen}`,
                    }}
                    style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }}
                    resizeMode="cover"
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

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Búsqueda de productos</Text>

            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Buscar por nombre de producto"
                    placeholderTextColor="#4c60af"
                    value={name}
                    onChangeText={valor => handleChange(valor)}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={handleBuscar}>
                    <Text style={styles.buttonText}>Buscar</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={productos}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />

            <Modal visible={show} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Producto {producto.id}</Text>
                            {renderField("Nombre del producto", producto.nombre)}
                            {renderField("Precio", "$" + producto.precio)}
                            {renderField("Cantidad", `${producto.cantidad}`)}
                            {renderField("Categoría", producto.categoria)}
                            {producto.imagen ? (
                            <Image
                                source={{
                                uri: `data:image/${
                                    producto.imagen.startsWith("/9j/") ? "jpeg" :
                                    producto.imagen.startsWith("iVBORw0K") ? "png" :
                                    "jpeg"
                                };base64,${producto.imagen}`,
                                }}
                                style={{
                                    width: 200,
                                    height: 200,
                                    marginTop: 10,
                                    alignSelf: "center",
                                    borderRadius: 10,
                                }}
                                resizeMode="contain"
                            />
                            ) : null}

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
    )
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
        fontSize:24, 
        fontWeight: "bold",
        color: "#3a2e7d",
        marginVertical: 20,
        textAlign:"center",
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
        paddingHorizontal:10,
        marginRight:8,
        backgroundColor:"#ffffff",  
        color: "#0f0f0f"
    },
    boton: {
        backgroundColor:"#a8b5e6",
        paddingVertical:14,
        paddingHorizontal:30,
        borderRadius:12,
        shadowColor:"#000000",
        shadowOpacity:0.1,
        shadowRadius:6,
        shadowOffset: {width:0, height:3},
        elevation:4,
        marginBottom:15,
        marginTop:5,
        width:"90%",
    },
    txtBoton:{
        color:"#1a164d",
        fontWeight:"600",
        fontSize:16,
        letterSpacing:0.5,
    },
    button: {
        backgroundColor:"#218189",
        paddingVertical:12,
        paddingHorizontal:16,
        borderRadius:8,
        alignItems:"center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    listContainer: {
        paddingHorizontal:16,
    },
    card: {
        backgroundColor: "#c8e4e6",
        padding:16,
        borderRadius:12,
        marginBottom:16,
        elevation:3,
    },
    label: {
        marginTop:15,
        fontWeight:"bold",
        color:"#1e2169",
    },
    text: {
        fontSize: 16,
        marginBottom: 8,
        color: "#7d7c2e"
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
        maxHeight:"90%",
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
        color: "#372e7d"
    },
});
