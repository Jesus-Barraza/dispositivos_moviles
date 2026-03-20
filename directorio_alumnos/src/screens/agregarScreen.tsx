import {View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity} from "react-native";
import * as Yup from 'yup';
import {useState} from "react"
import {useNavigation, StackActions} from "@react-navigation/native"


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

const validationSchema = Yup.object().shape({
    matricula: Yup.string()
        .required("La matrícula es obligatoria")
        .matches(/^[0-9]{10}$/i, "Matrícula inválida"),
    aPaterno:Yup.string().required("Apellido paterno obligatorio"),
    aMaterno:Yup.string().required("Apellido materno obligatorio"),
    nombre:Yup.string().required("Nombre obligatorio"),
    sexo:Yup.number().min(1, "Selecciona un sexo válido").required(),
    dCalle:Yup.string().required("Calle obligatoria"),
    dNumero: Yup.number().typeError("Debe ser un número").required("Número obligatorio"),
    dColonia:Yup.string().required("Colonia obligatoria"),
    dCodigoPostal:Yup.number().typeError("Debe ser numérico").required("Código postal obligatorio"),
    aTelefono:Yup.string()
        .matches(/^\(\d{3}\)\d{7}$/, "Formato inválido, usa el formato (XX3)XXXXXX7")
        .required("Teléfono obligatorio"),
    aCorreo:Yup.string().email("Correo inválido").required("Correo obligatorio"),
    aFacebook:Yup.string().required("Facebook obligatorio"),
    aInstagram:Yup.string().required("Instagram obligatorio"),
    tipoSangre:Yup.string().required("Tipo de sangre obligatorio"),
    nombreContacto:Yup.string().required("Nombre de contacto obligatorio"),
    telefonoContacto: Yup.string()
        .matches(/^\(\d{3}\)\d{7}$/, "Teléfono de contacto - Formato inválido, usa el formato (XX3)XXXXXX7")
        .required("Teléfono de contacto obligatorio"),
    contrasenha:Yup.string().min(6, "Mínimo 6 carácteres").required("Contraseña obligatoria"),
})

const agregarScreen = () => {

    const [alumno, setAlumno] = useState<alumnoEstructura>(initialState)

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

    const handleChange = (name: keyof alumnoEstructura, value: string|number) => {
        setAlumno({...alumno, [name]:value});
    };

    const handleCancelar = () => {
        setAlumno(initialState);
        navigator.dispatch(StackActions.popToTop());
    };

    const navigator = useNavigation()
    return (
        <View>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Agregar screen</Text>
                <TextInput style={styles.input} placeholder="Matrícula" maxLength={10} onChangeText={(val) => handleChange("matricula", val)}/>
                <TextInput style={styles.input} placeholder="Apellido paterno" onChangeText={(val) => handleChange("aPaterno", val)}/>
                <TextInput style={styles.input} placeholder="Apellido materno" onChangeText={(val) => handleChange("aMaterno", val)}/>
                <TextInput style={styles.input} placeholder="Nombre(s)" onChangeText={(val) => handleChange("nombre", val)}/>



                <TextInput style={styles.input} placeholder="Calle" onChangeText={(val) => handleChange("dCalle", val)}/>
                <TextInput style={styles.input} placeholder="Número" keyboardType="numeric" onChangeText={(val) => handleChange("dNumero", val)}/>
                <TextInput style={styles.input} placeholder="Colonia" onChangeText={(val) => handleChange("dColonia", val)}/>
                <TextInput style={styles.input} placeholder="Código postal" keyboardType="numeric" onChangeText={(val) => handleChange("dCodigoPostal", val)}/>

                <TextInput style={styles.input} placeholder="Teléfono" maxLength={12} keyboardType="phone-pad" onChangeText={(val) => handleChange("aTelefono", val)}/>
                <TextInput style={styles.input} placeholder="Correo electrónico" keyboardType="email-address" onChangeText={(val) => handleChange("aCorreo", val)}/>
                <TextInput style={styles.input} placeholder="Facebook" onChangeText={(val) => handleChange("aFacebook", val)}/>
                <TextInput style={styles.input} placeholder="Instagram" keyboardType="numeric" onChangeText={(val) => handleChange("aInstagram", val)}/>


                <TextInput style={styles.input} placeholder="Nombre del contacto de emergencia" onChangeText={(val) => handleChange("nombreContacto", val)}/>
                <TextInput style={styles.input} placeholder="Teléfono del contacto" maxLength={12} keyboardType="phone-pad" onChangeText={(val) => handleChange("telefonoContacto", val)}/>

                <TextInput style={styles.input} placeholder="Contraseña" onChangeText={(val) => handleChange("contrasenha", val)}/>

                {/*}<TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>*/}

                <TouchableOpacity style={{... styles.button, backgroundColor:"#9c9c9c"}} onPress={handleCancelar}>
                    <Text style={{... styles.buttonText, color:"#3a3a3a"}}>Regresar al Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
};

export default agregarScreen

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#e8f5e9",
        marginBottom: 20,
    },
    title: {
        fontSize:24, 
        fontWeight: "bold",
        color: "#2E7D32",
        marginBottom: 20,
        textAlign:"center",
    },
    label: {
        marginTop:15,
        fontWeight:"bold",
        color:"#33691E",
    },
    input: {
        borderWidth: 1,
        borderColor: "#A5D6A7",
        borderRadius: 10,
        padding:10,
        marginVertical:5,
        backgroundColor:"#ffffff",   
    },
    picker: {
        backgroundColor:"#FFFFFF",
        borderRadius:10,
        marginVertical:5,
    },
    button: {
        backgroundColor:"#4caf50",
        paddingVertical:12,
        borderRadius:10,
        marginTop:20,
        alignItems:"center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    boton: {
        backgroundColor:"#A8E6CF",
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
        color:"#164d19",
        fontWeight:"600",
        fontSize:16,
        letterSpacing:0.5,
    },
    icons:{
        alignItems:"center",
        alignContent:"center",
    },
})