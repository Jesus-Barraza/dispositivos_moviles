import {StyleSheet} from "react-native";

export const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c3e1f7',
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: 600,
    color: "#000000",
  },

  textboton: {
    fontSize: 25,
    fontWeight: 500,
    color: "#000000"
  },

  boton: {
    backgroundColor: "#222222",
    width:50,
    maxWidth:100,
    height:35,
    margin:3,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:10,
  },

  caja01: {
    flex:1,
    width:"100%",
    // backgroundColor:"red",
    justifyContent:"flex-end",
    alignItems:"center",
    borderRadius:10,
  },

  caja02: {
    flex:1,
    width:"100%",
    // backgroundColor:"orange",
    justifyContent:"flex-start",
    alignItems:"center",
  },

  caja03: {
    flex:1,
    flexDirection:"row",
  },
});