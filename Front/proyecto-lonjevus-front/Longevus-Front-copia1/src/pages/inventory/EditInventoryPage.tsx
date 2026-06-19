import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditInventoryPage = () => {
  const { id } = useParams(); //Obtiene el id del producto
  const navigate = useNavigate();

  //Ejemplo de inserts
  const initialItem = {
    id: 1,
    name: "Vitamina C",
    quantity: 100,
    expirationDate: "2025-12-31",
    supplierName: "Proveedor Salud",
    purchaseId: "COMP-001",
    photoUrl: "https://picsum.photos/60/60",
    category: "Salud"
  };

  const [formData, setFormData] = useState(initialItem); //Estado del formulario, para poder detectar cambios y asi dar el warning
  const [isDirty, setIsDirty] = useState(false); //Este los detecta

  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(initialItem));
  }, [formData]);

  //Cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //Enviar el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos actualizados:", formData);
    setIsDirty(false);
    //Los voy a enviar al back
  };
 
  //Regresar a Inventario
  const handleBack = () => {
    if (isDirty) {
      const confirmLeave = window.confirm("Tienes cambios sin guardar. ¿Deseas salir sin guardar?");
      if (!confirmLeave) return;
    }
    navigate('/inventario');
  };

  //De aquí comienza la interfaz
  return (
    <div className="container mt-4">
      <h2>Editar Inventario - ID: {id}</h2>

      {/* Botón Volver */}
      <div className="mb-3">
        <button onClick={handleBack} className="btn btn-secondary">
          ← Volver
        </button>
      </div>

      {/* Foto */}
      <div className="mb-4 text-center">
        <img
          src={formData.photoUrl}
          alt={formData.name}
          className="img-thumbnail"
          width="120"
          height="120"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Producto</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de Vencimiento</label>
          <input
            type="date"
            className="form-control"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Proveedor</label>
          <input
            type="text"
            className="form-control"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Alimentos">Alimentos</option>
            <option value="Salud">Salud</option>
            <option value="Limpieza">Limpieza</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditInventoryPage;
