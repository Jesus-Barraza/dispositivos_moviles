import { Slot } from 'expo-router';
import React from 'react';

// Aquí puedes envolver con providers globales si los necesitas
// Ejemplo: ReduxProvider, ThemeProvider, etc.
export default function RootLayout() {
  return (
    <Slot />
  );
}
