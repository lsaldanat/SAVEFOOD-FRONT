import { useState } from "react";

export default function TestForm() {
  const [form, setForm] = useState({ nombre: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("handleSubmit ejecutado 🚀");
    console.log("🚀 handleSubmit disparado");
    console.log("Payload que envío al backend:", { ...form });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
