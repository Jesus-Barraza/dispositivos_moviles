import {Alert, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import {useNavigation, StackActions} from "@react-navigation/native";
import {Picker} from "@react-native-picker/picker"
import {useState} from "react";
import * as Yup from 'yup';
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

const validationSchema = Yup.object().shape({
    matricula: Yup.string()
        .required("La matrícula es obligatoria")
        .matches(/^[0-9]{10}$/i, "Matrícula inválida"),
    aPaterno:Yup.string().required("Apellido paterno obligatorio"),
    aMaterno:Yup.string().required("Apellido materno obligatorio"),
    nombre:Yup.string().required("Nombre obligatorio"),
    sexo:Yup.string().min(1, "Selecciona un sexo válido").required(),
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
});

type botonEstado = {
    btnGuardar: boolean,
    btnCancelar: boolean,
};

const initialStateBtn: botonEstado = {
    btnGuardar: true,
    btnCancelar: true
};

const ModificarScreen = () => {
    const [alumno, setAlumno] = useState<alumnoEstructura>(initialState)
    const [mat, setMat] = useState("")
    const [btns, setBtns] = useState<botonEstado>(initialStateBtn)

    const notify = (num: number) => {
        if (num == 200) {
            Alert.alert("Hecho!", "Alumno Actualizado!");
            handleRegresar();
        } else if (num == 102) {
            Alert.alert("Error!", "La matrícula es incorrecta!")
        } else if (num == 101) {
            Alert.alert("Error!", "No se ha encontrado el alumno!")
        } else if (num == 100) {
            Alert.alert("Error!", "No se ha actualizado el alumno!")
        }
    } 

    const alumnoConsultar = async () => {
        const mat1 = (mat == "") ? "0" : mat
        if (/^[0-9]{10}$/.test(mat1)) {
            const response = await axios.get(`http://10.0.2.2:5000/alumno/traer/${mat1}`).then((response) => {
                if (response.data.status == 200) {
                    console.log(response.data);
                    if (response.data.result.length > 0) {
                        setAlumno(response.data.result[0]);
                        setBtns({
                            btnGuardar: false,
                            btnCancelar: false,
                        });
                    } else {
                        setAlumno(initialState);
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

    const handleMatChange = (value: string) : void => {
        setMat(value)
    };

    const handleChange = (name: keyof alumnoEstructura, value: string|number) => {
        setAlumno({...alumno, [name]:value});
    };

    const handleSubmit = async () => {
        try {
            await validationSchema.validate(alumno, {abortEarly:false});
            console.log("Alumno a enviar:", Object.keys(alumno));
            const response=await axios.post("http://10.0.2.2:5000/alumno/modificar", alumno, {headers: { "Content-Type": "application/json" }}).then((response) => {
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

    const handleCancelar = () => {
        setAlumno(initialState);
        setBtns(initialStateBtn);
        setMat("");
    };

    const handleRegresar = () => {
        handleCancelar()
        navigator.dispatch(StackActions.popToTop());
    };

    const navigator = useNavigation()
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Modificar screen</Text>

            <TextInput style={styles.input} placeholder="Ingresa la matrícula a buscar" value={mat} onChangeText={(val) => handleMatChange(val)} />
            <TouchableOpacity style={styles.button} onPress={alumnoConsultar}>
                <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder="Matrícula" placeholderTextColor="#888" value={alumno.matricula} maxLength={10} onChangeText={(val) => handleChange("matricula", val)}/>
            <TextInput style={styles.input} placeholder="Apellido paterno" placeholderTextColor="#888" value={alumno.aPaterno} onChangeText={(val) => handleChange("aPaterno", val)}/>
            <TextInput style={styles.input} placeholder="Apellido materno" placeholderTextColor="#888" value={alumno.aMaterno} onChangeText={(val) => handleChange("aMaterno", val)}/>
            <TextInput style={styles.input} placeholder="Nombre(s)" placeholderTextColor="#888" value={alumno.nombre} onChangeText={(val) => handleChange("nombre", val)}/>

            <Text style={styles.label}> Sexo </Text>
                <Picker style={styles.picker} selectedValue={alumno.sexo} onValueChange={val => handleChange("sexo", val)}>
                    <Picker.Item label="Selecciona..." value="" />
                    <Picker.Item label="H" value="H" />
                    <Picker.Item label="M" value="M" />
                </Picker>

            <TextInput style={styles.input} placeholder="Calle" placeholderTextColor="#888" value={alumno.dCalle} onChangeText={(val) => handleChange("dCalle", val)}/>
            <TextInput style={styles.input} placeholder="Número" placeholderTextColor="#888" keyboardType="numeric" value={String(alumno.dNumero)} onChangeText={(val) => handleChange("dNumero", Number(val))}/>
            <TextInput style={styles.input} placeholder="Colonia" placeholderTextColor="#888" value={alumno.dColonia} onChangeText={(val) => handleChange("dColonia", val)}/>
            <TextInput style={styles.input} placeholder="Código postal" placeholderTextColor="#888" keyboardType="numeric" value={String(alumno.dCodigoPostal)} onChangeText={(val) => handleChange("dCodigoPostal", Number(val))}/>

            <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor="#888" value={alumno.aTelefono} maxLength={12} keyboardType="phone-pad" onChangeText={(val) => handleChange("aTelefono", val)}/>
            <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#888" value={alumno.aCorreo} keyboardType="email-address" onChangeText={(val) => handleChange("aCorreo", val)}/>
            <TextInput style={styles.input} placeholder="Facebook" placeholderTextColor="#888" value={alumno.aFacebook} onChangeText={(val) => handleChange("aFacebook", val)}/>
            <TextInput style={styles.input} placeholder="Instagram" placeholderTextColor="#888" value={alumno.aInstagram} onChangeText={(val) => handleChange("aInstagram", val)}/>

            <Text style={styles.label}> Tipo de sangre </Text>
                <Picker style={styles.picker} selectedValue={alumno.tipoSangre} onValueChange={val => handleChange("tipoSangre", val)}>
                    <Picker.Item label="Selecciona..." value="" />
                    <Picker.Item label="A+" value="A+" />
                    <Picker.Item label="A-" value="A-" />
                    <Picker.Item label="B+" value="B+" />
                    <Picker.Item label="B-" value="B-" />
                    <Picker.Item label="AB+" value="AB+" />
                    <Picker.Item label="AB-" value="AB-" />
                    <Picker.Item label="O+" value="O+" />
                    <Picker.Item label="O-" value="O-" />
                </Picker>

            <TextInput style={styles.input} placeholder="Nombre del contacto de emergencia" placeholderTextColor="#888" value={alumno.nombreContacto} onChangeText={(val) => handleChange("nombreContacto", val)}/>
            <TextInput style={styles.input} placeholder="Teléfono del contacto" placeholderTextColor="#888" value={alumno.telefonoContacto} maxLength={12} keyboardType="phone-pad" onChangeText={(val) => handleChange("telefonoContacto", val)}/>

            <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#888" value={alumno.contrasenha} onChangeText={(val) => handleChange("contrasenha", val)}/>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCancelar} style={{...styles.boton, backgroundColor:"#4a4a4a"}}>
                <Text style={{... styles.txtBoton, color:"#a4a4a4"}}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{... styles.button, backgroundColor:"#9c9c9c"}} onPress={handleRegresar}>
                <Text style={{... styles.buttonText, color:"#3a3a3a"}}>Regresar al Home</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default ModificarScreen

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#e9e8f5",
        marginBottom: 20,
    },
    title: {
        fontSize:24, 
        fontWeight: "bold",
        color: "#2e557d",
        marginBottom: 20,
        textAlign:"center",
    },
    label: {
        marginTop:15,
        fontWeight:"bold",
        color:"#1e5e69",
    },
    input: {
        borderWidth: 1,
        borderColor: "#aaa5d6",
        borderRadius: 10,
        padding:10,
        marginVertical:5,
        backgroundColor:"#ffffff",  
        color: "#0f0f0f"
    },
    picker: {
        borderWidth: 1,
        borderColor: "#aaa5d6",
        borderRadius: 10,
        backgroundColor: "#ffffff",
        color: "#0f0f0f",
    },
    button: {
        backgroundColor:"#1e6d9a",
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
        backgroundColor:"#a8dee6",
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
        color:"#16224d",
        fontWeight:"600",
        fontSize:16,
        letterSpacing:0.5,
    },
    icons:{
        alignItems:"center",
        alignContent:"center",
    },
})