import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  nombre: string;
  precio: number;
  fechaVencimiento: string;
  categoria: string;
  unidad: string;
  proveedor: string;
  fotoUrl: string;
}

const categorias = ["Salud", "Limpieza", "Alimento", "Otro"];
const unidades = ["Unitario", "ml", "g", "kg", "Caja"];
const proveedores = ["Farmacia Central", "Distribuidora Salud", "Proveedor X"];

const AddProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product>({
    nombre: "",
    precio: 0,
    fechaVencimiento: "",
    categoria: "",
    unidad: "",
    proveedor: "",
    fotoUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Producto agregado:", product);
    navigate("/productos");
  };

  return (
    <div className="container mt-4">
      <h2>Agregar Nuevo Producto</h2>

      <button className="btn btn-secondary mb-3" onClick={() => navigate("/productos")}>
        ← Volver a Productos
      </button>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            name="nombre"
            type="text"
            className="form-control"
            value={product.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            name="precio"
            type="number"
            className="form-control"
            value={product.precio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de Vencimiento</label>
          <input
            name="fechaVencimiento"
            type="date"
            className="form-control"
            value={product.fechaVencimiento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select
            name="categoria"
            className="form-select"
            value={product.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Unidad de Medida</label>
          <select
            name="unidad"
            className="form-select"
            value={product.unidad}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una unidad</option>
            {unidades.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Proveedor</label>
          <select
            name="proveedor"
            className="form-select"
            value={product.proveedor}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">URL de la Foto</label>
          <input
            name="fotoUrl"
            type="text"
            className="form-control"
            value={product.fotoUrl}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">Agregar Producto</button>
      </form>
    </div>
  );
};

export default AddProduct;
