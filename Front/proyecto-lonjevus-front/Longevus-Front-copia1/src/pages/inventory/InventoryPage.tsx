import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StandardTable from '../../components/StandardTable';
import type { Column } from '../../components/StandardTable';
import CategoryFilter from '../../components/CategoryFilter';
import DateFilter from '../../components/DateFilter';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';


interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  expirationDate: string;
  supplierName: string;
  purchaseId: string;
  photoUrl: string;
  category: string;
}

const inventoryData: InventoryItem[] = [
  {
    id: 1,
    name: "Vitamina C",
    quantity: 100,
    expirationDate: "2025-12-31",
    supplierName: "Proveedor Salud", 
    purchaseId: "COMP-001",
    photoUrl: "https://picsum.photos/60/60",
    category: "Salud",
  }
];


const InventoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const columns: Column<InventoryItem>[] = [
    { header: "#", accessor: "id" },
    { header: "Producto", accessor: "name" },
    { header: "Cantidad", accessor: "quantity" },
    { header: "Fecha de Vencimiento", accessor: "expirationDate" },
    { header: "Proveedor", accessor: "supplierName" },
    { header: "Id de la compra", accessor: "purchaseId" },
    {
      header: "Fotografía",
      accessor: "photoUrl",
      render: (item: InventoryItem) => (
        <img
          src={item.photoUrl}
          alt={item.name}
          className="img-thumbnail"
          width="60"
          height="60"
          style={{ objectFit: "cover" }}
        />
      ),
    },
  ];

  const navigate = useNavigate();
  
  const handleEdit = (item: InventoryItem) => {
    navigate(`/inventario/editar/${item.id}`);
  };

  const handleDelete = (id: number) => {
    console.log("Eliminar", id);
  };

  

  const categoryOptions = Array.from(
    new Set(inventoryData.map((item) => item.category).filter((cat) => cat))
  );

  const filteredData = inventoryData.filter((item) => {
    const categoryMatch =
      selectedCategory === 'Todos' || item.category === selectedCategory;
    const dateMatch =
      !selectedDate || item.expirationDate === selectedDate;
    return categoryMatch && dateMatch;
  });

  return (
    <>
    <Header/>
      <div className="container mt-4">
        <h1>Inventario</h1>
        <div className="row mb-3">
          <div className="col-md-6">
            <CategoryFilter
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
            />
          </div>
          <div className="mb-4">
            <DateFilter
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
        </div>
        <StandardTable<InventoryItem>
          data={filteredData}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <Footer />
    </>
  );
};

export default InventoryPage;