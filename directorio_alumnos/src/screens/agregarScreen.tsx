import {View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, Alert} from "react-native";
import * as Yup from 'yup';
import {Picker} from "@react-native-picker/picker"
import {useState} from "react"
import axios from "axios";
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

const AgregarScreen = () => {

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

    const handleSubmit = async () => {
        try {
            await validationSchema.validate(alumno, {abortEarly:false});
            console.log("Alumno a enviar:", alumno);
            const response=await axios.post(
                "http://10.0.2.2:5000/alumno/agregar", alumno).then((response) => {
                    console.log(response);
                    notify(response.status);
                }).catch(function (error) {
                    console.log(error);
                    notify(100);
                }
            );
        } catch (err: any) {
            if (err.inner) {
                const mensajes = err.inner.map((e: any) => `- ${e.message}`).join("\n")
                Alert.alert("Errores de validación", mensajes)
            } else {
                Alert.alert("Error", err.message)
            }
        }
    };

    const notify = (num: number) => {
        if (num == 200) {
            Alert.alert("Hecho!", "Alumno agregado!");
            handleCancelar();
        } else if (num == 100) {
            Alert.alert("Error!", "No se ha agregado el alumno!")
        }
    }

    const navigator = useNavigation()
    return (
        <View>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Agregar screen</Text>
                <TextInput style={styles.input} placeholder="Matrícula" placeholderTextColor="#888" maxLength={10} onChangeText={(val) => handleChange("matricula", val)}/>
                <TextInput style={styles.input} placeholder="Apellido paterno" placeholderTextColor="#888" onChangeText={(val) => handleChange("aPaterno", val)}/>
                <TextInput style={styles.input} placeholder="Apellido materno" placeholderTextColor="#888" onChangeText={(val) => handleChange("aMaterno", val)}/>
                <TextInput style={styles.input} placeholder="Nombre(s)" placeholderTextColor="#888" onChangeText={(val) => handleChange("nombre", val)}/>

                <Text style={styles.label}> Sexo </Text>
                    <Picker style={styles.picker} selectedValue={alumno.sexo} onValueChange={val => handleChange("sexo", val)}>
                        <Picker.Item label="Selecciona..." value={0} />
                        <Picker.Item label="H" value={1} />
                        <Picker.Item label="M" value={2} />
                    </Picker>

                <TextInput style={styles.input} placeholder="Calle" placeholderTextColor="#888" onChangeText={(val) => handleChange("dCalle", val)}/>
                <TextInput style={styles.input} placeholder="Número" placeholderTextColor="#888" keyboardType="numeric" onChangeText={(val) => handleChange("dNumero", val)}/>
                <TextInput style={styles.input} placeholder="Colonia" placeholderTextColor="#888" onChangeText={(val) => handleChange("dColonia", val)}/>
                <TextInput style={styles.input} placeholder="Código postal" placeholderTextColor="#888" keyboardType="numeric" onChangeText={(val) => handleChange("dCodigoPostal", val)}/>

                <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor="#888" maxLength={12} keyboardType="phone-pad" onChangeText={(val) => handleChange("aTelefono", val)}/>
                <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#888" keyboardType="email-address" onChangeText={(val) => handleChange("aCorreo", val)}/>
                <TextInput style={styles.input} placeholder="Facebook" placeholderTextColor="#888" onChangeText={(val) => handleChange("aFacebook", val)}/>
                <TextInput style={styles.input} placeholder="Instagram" placeholderTextColor="#888" onChangeText={(val) => handleChange("aInstagram", val)}/>

                <Text style={styles.label}> Tipo de sangre </Text>
                    <Picker style={styles.picker} selectedValue={alumno.sexo} onValueChange={val => handleChange("tipoSangre", val)}>
                        <Picker.Item label="Selecciona..." value={0} />
                        <Picker.Item label="A+" value={1} />
                        <Picker.Item label="A-" value={2} />
                        <Picker.Item label="B+" value={1} />
                        <Picker.Item label="B-" value={2} />
                        <Picker.Item label="AB+" value={1} />
                        <Picker.Item label="AB-" value={2} />
                        <Picker.Item label="O+" value={1} />
                        <Picker.Item label="O-" value={2} />
                    </Picker>

                <TextInput style={styles.input} placeholder="Nombre del contacto de emergencia" placeholderTextColor="#888" onChangeText={(val) => handleChange("nombreContacto", val)}/>
                <TextInput style={styles.input} placeholder="Teléfono del contacto" placeholderTextColor="#888" maxLength={12} keyboardType="phone-pad" onChangeText={(val) => handleChange("telefonoContacto", val)}/>

                <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#888" onChangeText={(val) => handleChange("contrasenha", val)}/>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{... styles.button, backgroundColor:"#9c9c9c"}} onPress={handleCancelar}>
                    <Text style={{... styles.buttonText, color:"#3a3a3a"}}>Regresar al Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
};

export default AgregarScreen

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
        color: "#0f0f0f"
    },
    picker: {
        borderWidth: 1,
        borderColor: "#A5D6A7",
        borderRadius: 10,
        backgroundColor: "#ffffff",
        color: "#0f0f0f",
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