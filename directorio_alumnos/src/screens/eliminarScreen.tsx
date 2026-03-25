import {View, Text} from "react-native";
import {useState} from "react";

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
    const [alumno, setAlumno] = useState(initialState)
    const [mat, setMat] = useState("")
    const [show, setShow] = useState(false)
    
    return (
        <View>
            <Text>Eliminar screen</Text>
        </View>
    )
}

export default EliminarScreen