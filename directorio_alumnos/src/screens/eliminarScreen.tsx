import {View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, Alert} from "react-native";
import {useNavigation, StackActions} from "@react-navigation/native";
import React, {useState} from "react";
import axios from "axios";

type alumnoEstructura = {
    matricula:string,
    aPaterno:string,
    aMaterno:string,
    nombre:string,
    sexo:string,
    dCalle:string,
    dNumero:number,
    dColonia:string,
    dCodigoPostal:number,
    aTelefono:string,
    aCorreo:string,
    aFacebook:string,
    aInstagram:string,
    tipoSangre:string,
    nombreContacto:string,
    telefonoContacto:string,
    contrasenha:string,
};

const initialState: alumnoEstructura = {
    matricula:"",
    aPaterno:"",
    aMaterno:"",
    nombre:"",
    sexo:"",
    dCalle:"",
    dNumero:0,
    dColonia:"",
    dCodigoPostal:0,
    aTelefono:"",
    aCorreo:"",
    aFacebook:"",
    aInstagram:"",
    tipoSangre:"",
    nombreContacto:"",
    telefonoContacto:"",
    contrasenha:"",
};

const EliminarScreen = () => {
    const [alumno, setAlumno] = useState<alumnoEstructura>(initialState)
    const [mat, setMat] = useState("")
    const [show, setShow] = useState(false)

    const {
        matricula,
        aPaterno,
        aMaterno,
        nombre,
        sexo,
        dCalle,
        dNumero,
        dColonia,
        dCodigoPostal,
        aTelefono,
        aCorreo,
        aFacebook,
        aInstagram,
        tipoSangre,
        nombreContacto,
        telefonoContacto,
        contrasenha,
    } = alumno;

    const handleChange = (valor: string):void => {
        setMat(valor)
    };

    const handleRegresar = () => {
            handleCancelar()
            navigator.dispatch(StackActions.popToTop());
    };

    const handleCancelar = () => {
        setAlumno(initialState);
        setShow(false);
        setMat("");
    };

    const handleEliminar = async () => {
        console.log(alumno);
        const response = await axios.post("http://10.0.2.2:5000/alumno/borrar", alumno)
        .then(response => {
            console.log(response);
            if (response.data.result.length > 0) {
                notify(response.data.status);
                handleRegresar()
            } else {
                notify(response.data.status);
            }
        });
        //setTimeout(() => navigate("/alumnos"), 1000)
    }

    const alumnoConsultar = async () => {
        const mat1 = (mat == "") ? "0" : mat
        if (/^[0-9]{10}$/.test(mat1)) {
            const response = await axios.get(`http://10.0.2.2:5000/alumno/traer/${mat1}`).then((response) => {
                if (response.data.status == 200) {
                    console.log(response.data);
                    if (response.data.result.length > 0) {
                        setAlumno(response.data.result[0]);
                        setShow(true);
                    } else {
                        setAlumno(initialState);
                        setShow(false);
                        notify(101);
                    }
                } else {
                    console.log("no fue posible traer los datos")
                }
            })
        } else {
            notify(102);
        }
    };

    const notify = (num: number) => {
        if (num == 201) {
            Alert.alert("Hecho!", "Alumno eliminado!");
            handleCancelar();
        } else if (num == 102) {
            Alert.alert("Error!", "La matrícula es incorrecta!")
        } else if (num == 101) {
            Alert.alert("Error!", "No se ha encontrado el alumno!")
        } else if (num == 100) {
            Alert.alert("Error!", "No se ha eliminado el alumno!")
        }
    } 

    const navigator = useNavigation()
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Eliminar screen</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingresa la matrícula"
                value={mat}
                onChangeText={valor => handleChange(valor)}
            />
            <TouchableOpacity onPress={alumnoConsultar} style={styles.btnBuscar}>
                <Text style={styles.btnTextBuscar}>Buscar</Text>
            </TouchableOpacity>

            {show ? (
                <>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLabel}>Matrícula:</Text>
                        <Text style={styles.infoValue}>{matricula}</Text>

                        <Text style={styles.infoLabel}>Nombre:</Text>
                        <Text style={styles.infoValue}>{nombre} {aPaterno} {aMaterno}</Text>

                        <Text style={styles.infoLabel}>Teléfono:</Text>
                        <Text style={styles.infoValue}>{aTelefono}</Text>

                        <Text style={styles.infoLabel}>Correo:</Text>
                        <Text style={styles.infoValue}>{aCorreo}</Text>

                        <Text style={styles.infoLabel}>Nombre Contacto:</Text>
                        <Text style={styles.infoValue}>{nombreContacto}</Text>

                        <Text style={styles.infoLabel}>Teléfono contacto:</Text>
                        <Text style={styles.infoValue}>{telefonoContacto}</Text>
                    </View>
                    <TouchableOpacity onPress={handleEliminar} style={styles.boton}>
                        <Text style={styles.txtBoton}>Eliminar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleCancelar} style={{...styles.boton, backgroundColor:"#4a4a4a"}}>
                        <Text style={{... styles.txtBoton, color:"#a4a4a4"}}>Cancelar</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <></>
            )}
            <TouchableOpacity onPress={handleRegresar} style={{... styles.boton, backgroundColor:"#9c9c9c"}}>
                <Text style={{...styles.txtBoton, color:"#3a3a3a"}}>Regresar al home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default EliminarScreen

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f5e8e8",
        marginBottom: 20,
    },
    title: {
        fontSize:24, 
        fontWeight: "bold",
        color: "#7d2e2e",
        marginBottom: 20,
        textAlign:"center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#d6a5a5",
        borderRadius: 10,
        padding:10,
        marginVertical:5,
        backgroundColor:"#ffffff",  
        color: "#0f0f0f"
    },
    btnBuscar: {
        backgroundColor:"#d3d3d3",
        paddingVertical:12,
        paddingHorizontal:24,
        borderRadius:12,
        elevation:4,
        shadowColor:"#000000",
        shadowOffset: {width:0, height:2},
        shadowOpacity:0.2,
        shadowRadius:4,
        marginBottom:10,
        alignItems:"center",
        width: "50%",
    },
    btnTextBuscar: {
        color: "#4F4F4F",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1,
    },
    infoContainer: {
        backgroundColor: "#f2f2f2",
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: "#000000",
        shadowOffset: {width:0, height:1},
        shadowRadius: 3,
        elevation: 3,
    },
    infoLabel: {
        fontWeight: "600",
        color: "#555555",
        fontSize: 14,
        marginTop: 8,
    },
    infoValue: {
        fontSize:16,
        color: "#333333",
        marginBottom: 4,
    },
    boton: {
        backgroundColor:"#e6a8a8",
        paddingVertical:14,
        paddingHorizontal:30,
        borderRadius:12,
        shadowColor:"#000000",
        shadowOpacity:0.1,
        shadowRadius:6,
        shadowOffset: {width:0, height:3},
        elevation:4,
        marginBottom:10,
    },
    txtBoton:{
        color:"#4d1616",
        fontWeight:"600",
        fontSize:16,
        letterSpacing:0.5,
    },
})