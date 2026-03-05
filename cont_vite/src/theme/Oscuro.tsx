import { StyleSheet } from "react-native";

export const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212030",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: 300,
    color: "#ffffff"
  },

  textboton: {
    fontSize: 25,
    fontWeight: 500,
    color: "#000000"
  },

  boton: {
    backgroundColor: "#DDDDDD",
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