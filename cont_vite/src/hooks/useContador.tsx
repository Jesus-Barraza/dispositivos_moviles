import { useState } from "react";

export const useContador = (initialValue:number) => {
    const [contador, setContador] = useState(initialValue)

    const handleIncrementar = () => {
        let valor = contador;
        setContador(++valor);
    };
    
    const handleDecrementar = () => {
        let valor = contador;
        if (valor > 0) {
          setContador(--valor);
        }
    };
    
    const handleCero = () => {
        setContador(0);
    };

    return {
        contador, 
        handleIncrementar,
        handleDecrementar,
        handleCero,
    };
};