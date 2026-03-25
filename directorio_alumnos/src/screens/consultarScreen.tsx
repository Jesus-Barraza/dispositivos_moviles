import {View, Text, Alert, SafeAreaView, TextInput, TouchableOpacity, FlatList, Modal, ScrollView, StyleSheet} from "react-native";
import {useNavigation, StackActions} from "@react-navigation/native";
import {useState} from "react";
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

const ConsultarScreen = () => {
    const [alumno, setAlumno] = useState<alumnoEstructura>(initialState)
    const [alumnos, setAlumnos] = useState<alumnoEstructura[]>([])
    const [show, setShow] = useState(false)
    const [name, setName] = useState("")

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

    const alumnoConsultar = async () => {
        const nombre1 = (name == "") ? "_" : name
        const response = await axios.get(`http://10.0.2.2:5000/alumno/buscar/${nombre1}`).then((response) => {
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
            <Text style={styles.header}>Consultar screen</Text>

            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Buscar por nombre del alumno"
                    placeholderTextColor="#afa24c"
                    value={name}
                    onChangeText={valor => handleChange(valor)}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={handleBuscar}>
                    <Text style={styles.buttonText}>Buscar</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={alumnos}
                keyExtractor={(item) => item.matricula}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />

            <Modal visible={show} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Detalles del Alumno</Text>
                            {renderField("Matrícula", alumno.matricula)}
                            {renderField("Nombre", alumno.nombre + " " + alumno.aPaterno + " " + alumno.aMaterno)}
                            {renderField("Sexo", alumno.sexo)}
                            {renderField("Dirección", alumno.dCalle + " " + alumno.dNumero + " " + alumno.dColonia + " " + alumno.dCodigoPostal)}
                            {renderField("Teléfono", alumno.aTelefono)}
                            {renderField("Correo electrónico", alumno.aCorreo)}
                            {renderField("Facebook", alumno.aFacebook)}
                            {renderField("Instagram", alumno.aInstagram)}
                            {renderField("Tipo de sangre", alumno.tipoSangre)}
                            {renderField("Nombre del contacto de emergencia", alumno.nombreContacto)}
                            {renderField("Teléfono contacto", alumno.telefonoContacto)}
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
}

export default ConsultarScreen

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f5f4e8",
        marginBottom: 20,
        flex: 1,
    },
    header: {
        fontSize:24, 
        fontWeight: "bold",
        color: "#2e557d",
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
        borderColor: "#d4d6a5",
        borderRadius: 8,
        paddingHorizontal:10,
        marginRight:8,
        backgroundColor:"#ffffff",  
        color: "#0f0f0f"
    },
    boton: {
        backgroundColor:"#e6dfa8",
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
        color:"#4d3d16",
        fontWeight:"600",
        fontSize:16,
        letterSpacing:0.5,
    },
    button: {
        backgroundColor:"#949a1e",
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
        backgroundColor: "#e6ddc8",
        padding:16,
        borderRadius:12,
        marginBottom:16,
        elevation:3,
    },
    label: {
        marginTop:15,
        fontWeight:"bold",
        color:"#69681e",
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
        backgroundColor: "#f8f7e9",
        width: "90%",
        borderRadius: 20,
        padding: 20,
        maxHeight:"90%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#797d2e",
        textAlign: "center",
        marginBottom: 16,
    },
    field: {
        marginBottom: 12,
    },
    closeButton: {
        backgroundColor: "#c7bf81",
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignSelf: "center",
    },
    value: {
        fontSize: 16,
        color: "#797d2e"
    },
});