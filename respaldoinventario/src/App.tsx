import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {Navigator} from "./navigation"

console.log('Navigator import:', Navigator)

function App() {
  return (
    <NavigationContainer>
      <Navigator/>
    </NavigationContainer>
  );
}

export default App;