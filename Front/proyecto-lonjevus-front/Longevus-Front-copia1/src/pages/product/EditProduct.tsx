import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  fechaVencimiento: string;
  categoria: string;
  unidad: string;
  proveedor: string;
  fotoUrl: string;
}

const categoriasDisponibles = ["Salud", "Limpieza", "Alimento", "Otro"];

const mockProduct: Product = {
  id: 1,
  nombre: "Vitamina C",
  precio: 25,
  fechaVencimiento: "2024-12-01",
  categoria: "Salud",
  unidad: "Unitario",
  proveedor: "Farmacia Central",
  fotoUrl: "https://picsum.photos/100",
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product>(mockProduct);

  useEffect(() => {
    // Simulación de carga desde base de datos
    setProduct(mockProduct);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Producto actualizado:", product);
    navigate("/productos");
  };

  return (
    <div className="container mt-4">
      <h2>Editar Producto #{id}</h2>

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
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select
            name="categoria"
            className="form-select"
            value={product.categoria}
            onChange={handleChange}
          >
            {categoriasDisponibles.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Unidad</label>
          <input
            name="unidad"
            type="text"
            className="form-control"
            value={product.unidad}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Proveedor</label>
          <input
            name="proveedor"
            type="text"
            className="form-control"
            value={product.proveedor}
            onChange={handleChange}
          />
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

        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditProduct;
