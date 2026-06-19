import React, { useState } from "react";
import StandardTable, { type Column } from "../../components/StandardTable";
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryFilter from "../../components/CategoryFilter";
import { useNavigate } from 'react-router-dom';

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

const allProducts: Product[] = [
  {
    id: 1,
    nombre: "Vitamina C",
    precio: 25,
    fechaVencimiento: "2024-12-01",
    categoria: "Salud",
    unidad: "Unitario",
    proveedor: "Farmacia Central",
    fotoUrl: "https://picsum.photos/60/60?1",
  },
  {
    id: 2,
    nombre: "Alcohol",
    precio: 15,
    fechaVencimiento: "2025-01-01",
    categoria: "Limpieza",
    unidad: "ml",
    proveedor: "Distribuidora Salud",
    fotoUrl: "https://picsum.photos/60/60?2",
  },
];

const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [filter, setFilter] = useState("Todos");

  const filteredProducts = filter === "Todos"
    ? products
    : products.filter(p => p.categoria === filter);

  const uniqueCategories = [...new Set(products.map(p => p.categoria))];

  const handleEdit = (product: Product) => {
    navigate(`/productos/editar/${product.id}`);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`);
    if (confirmDelete) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const columns: Column<Product>[] = [
    { header: "#", accessor: "id" },
    { header: "Nombre", accessor: "nombre" },
    {
      header: "Precio",
      accessor: "precio",
      render: (item) => `$${item.precio.toFixed(2)}`
    },
    { header: "Fecha Vencimiento", accessor: "fechaVencimiento" },
    { header: "Categoría", accessor: "categoria" },
    { header: "Unidad", accessor: "unidad" },
    { header: "Proveedor", accessor: "proveedor" },
    {
      header: "Foto",
      accessor: "fotoUrl",
      render: (item) => (
        <img
          src={item.fotoUrl}
          alt={item.nombre}
          className="img-thumbnail"
          width="60"
          height="60"
          style={{ objectFit: "cover" }}
        />
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Productos</h2>
        <button className="btn btn-success" onClick={() => navigate("/productos/agregar")}>
          + Agregar Producto
        </button>
      </div>

      <CategoryFilter
        value={filter}
        onChange={setFilter}
        options={uniqueCategories}
      />

      <StandardTable<Product>
        data={filteredProducts}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProductPage;
