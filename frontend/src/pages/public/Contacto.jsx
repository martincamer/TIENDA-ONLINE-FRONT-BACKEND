import { useState } from "react";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar el formulario
    console.log("Datos del formulario:", formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Contáctanos</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Información de Contacto */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Información de Contacto
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800">Dirección</h3>
              <p className="text-gray-600">Av. Principal #123</p>
              <p className="text-gray-600">Ciudad, País</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800">Teléfono</h3>
              <p className="text-gray-600">+1 (234) 567-8900</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
