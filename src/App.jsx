import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ListaCompras from "./components/ListaCompras";
//import TestForm from "./components/TestForm";



function App() {
  return (
    <div className="App">
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
