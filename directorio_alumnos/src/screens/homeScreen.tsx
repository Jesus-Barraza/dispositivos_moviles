import {useNavigation, NavigationProp} from "@react-navigation/native";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import {RootStackParams} from "../navigation/StackNavigator";
import Icon from "@react-native-vector-icons/ionicons"

const HomeScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>()
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Agregar screen</Text>
            <TouchableOpacity onPress={()=>navigation.navigate("Agregar")} style={styles.boton}>
                <Icon name="add-circle-outline" size={30} color="#164d19"/>
                <Text style={styles.txtBoton}>Agregar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate("Consultar")} style={{... styles.boton, backgroundColor:"#cec476"}}>
                <Icon name="search-circle-outline" size={30} color="#71691d"/>
                <Text style={{... styles.txtBoton, color:"#71691d",}}>Consultar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate("Modificar")} style={{... styles.boton, backgroundColor:"#818de7"}}>
                <Icon name="sync-circle-outline" size={30} color="#1d2471"/>
                <Text style={{... styles.txtBoton, color:"#1d2471",}}>Modificar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate("Eliminar")} style={{... styles.boton, backgroundColor:"#e78181"}}>
                <Icon name="remove-circle-outline" size={30} color="#561717"/>
                <Text style={{... styles.txtBoton, color:"#561717",}}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:"center",
        marginTop:30,
    },
    titulo:{
        width:"98%",
        fontSize:28,
        fontWeight:"700",
        color:"#4A90E2",
        backgroundColor: "#D0EFFF",
        paddingVertical:10,
        paddingHorizontal:20,
        borderRadius:12,
        overflow:"hidden",
        textAlign:"center",
        elevation:3,
        shadowColor:"#000000",
        shadowOpacity:0.1,
        shadowRadius:4,
        shadowOffset:{width: 0, height: 2},
        marginBottom:30,
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