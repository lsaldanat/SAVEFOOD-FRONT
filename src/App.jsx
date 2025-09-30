import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import TestForm from "./components/TestForm";
import ThemeToggle from "./components/ThemeToggle";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListaCompras from "./components/ListaCompras";
import EditarNota from "./components/EditarNota";
import EditarLista from "./components/EditarLista";


 import DetallesLista from "./components/DetallesLista"; // 👈
 import AddDetalle from "./components/AddDetalle"; // 👈 crea este component



function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
        {/* Header con título y toggle de tema */}
        <header className="flex justify-between items-center p-4 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">🛒 Lista de Compras</h1>
          <ThemeToggle />
        </header>

        {/* Rutas de la app */}
        <Routes>
          <Route path="/" element={<ListaCompras />} />
          {/* <Route path="/editar/:id" element={<EditarNota />} />
          <Route path="/editar-lista/:id" element={<EditarLista />} /> 
          <Route path="/ver-detalle/:idLista" element={<DetallesLista />} />
          <Route path="/add-detalle/:idLista" element={<AddDetalle />} />   */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<ListaCompras />} />
//         <Route path="/editar/:id" element={<EditarNota />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


//Funciona solo lista de compras y colores dark light
// function App() {
//   return (
//     <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
//       <header className="flex justify-between items-center p-4 max-w-5xl mx-auto">
//         <h1 className="text-3xl font-bold">🛒 Lista de Compras</h1>
//         <ThemeToggle />
//       </header>
//       <ListaCompras />
//     </div>
//   );
// }


// function App() {
//   return (
//     <div className="App">
//       <TestForm />
//     </div>
//   );
// }

export default App
