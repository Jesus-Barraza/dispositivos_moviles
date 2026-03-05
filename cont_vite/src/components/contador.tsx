import { useState } from "react";
import { useColorScheme, View, Text, Button, TouchableOpacity } from 'react-native';
import { lightStyles, darkStyles, cambio } from "../theme"
import { useContador } from "../hooks";

function Contador() {
  const DarkMode = useColorScheme();
  const [mode, setMode] = useState(DarkMode)
  const {contador, handleIncrementar, handleDecrementar, handleCero } = useContador(0);

  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light')); 
  };

  const themeStyles = mode === 'dark' ? darkStyles : lightStyles;

  return (
    <View style={themeStyles.container}>
      <View style={ cambio.buttonTopRight }>
        <Button title={`Cambiar a modo ${mode === 'dark' ? 'claro' : 'oscuro'}`} onPress={toggleTheme}></Button>
      </View>
      <View style={themeStyles.caja01}>
        <Text style={themeStyles.title}>Contador: {contador}</Text>
      </View>
      <View style={themeStyles.caja02}>
        <View style={themeStyles.caja03}>
          <TouchableOpacity style={{... themeStyles.boton, backgroundColor: mode === "dark" ? "#4ba259" : "#a2de9b"}} onPress={handleIncrementar}>
            <Text style={themeStyles.textboton}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{... themeStyles.boton, backgroundColor: mode === "dark" ? "#a24b4b" : "#de9b9b"}} onPress={handleDecrementar}>
            <Text style={themeStyles.textboton}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{... themeStyles.boton, backgroundColor: mode === "dark" ? "#a2a04b" : "#dedb9b"}} onPress={handleCero}>
            <Text style={themeStyles.textboton}>0</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Contador;