import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ListaCompras from "./components/ListaCompras";
//import TestForm from "./components/TestForm";
import ThemeToggle from "./components/ThemeToggle";



function App() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
      <header className="flex justify-between items-center p-4 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold">🛒 Lista de Compras</h1>
        <ThemeToggle />
      </header>
      <ListaCompras />
    </div>
  );
}


// function App() {
//   return (
//     <div className="App">
//       <TestForm />
//     </div>
//   );
// }

export default App
