import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Simulación de productos disponibles
const allProducts = [
  { id: 1, name: 'Vitamina C', price: 25 },
  { id: 2, name: 'Alcohol', price: 100 },
  { id: 3, name: 'Café', price: 30 },
];

// Simulación de compra existente
const mockPurchase = {
  id: 1,
  date: '2024-05-01',
  managerName: 'Carlos Pérez',
  items: [
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 },
  ],
};

const EditPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [managerName, setManagerName] = useState('');
  const [items, setItems] = useState<{ productId: number; quantity: number }[]>([]);
  const [initialData, setInitialData] = useState('');

  useEffect(() => {
    setDate(mockPurchase.date);
    setManagerName(mockPurchase.managerName);
    setItems(mockPurchase.items);
    setInitialData(JSON.stringify({
      date: mockPurchase.date,
      managerName: mockPurchase.managerName,
      items: mockPurchase.items,
    }));
  }, []);

  const handleProductChange = (index: number, newProductId: number) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, productId: newProductId } : item
      )
    );
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity } : item
      )
    );
  };

  const getTotal = () => {
    return items.reduce((sum, item) => {
      const product = allProducts.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos guardados:", {
      id,
      date,
      managerName,
      items
    });
    setInitialData(JSON.stringify({ date, managerName, items }));
  };

  const handleBack = () => {
    const currentData = JSON.stringify({ date, managerName, items });
    if (currentData !== initialData) {
      const confirmExit = window.confirm("Tienes cambios sin guardar. ¿Deseas salir sin guardar?");
      if (!confirmExit) return;
    }
    navigate('/compras');
  };

  return (
    <div className="container mt-4">
      <h2>Editar Compra #{id}</h2>

      <div className="mb-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleBack}
        >
          ← Volver a Compras
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Encargado</label>
          <input
            type="text"
            className="form-control"
            value={managerName}
            onChange={e => setManagerName(e.target.value)}
          />
        </div>

        <h5>Productos</h5>
        <table className="table table-bordered">
          <thead className="table-secondary">
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const selectedProduct = allProducts.find(p => p.id === item.productId);
              const price = selectedProduct?.price || 0;

              return (
                <tr key={index}>
                  <td>
                    <select
                      className="form-select"
                      value={item.productId}
                      onChange={e => handleProductChange(index, parseInt(e.target.value))}
                    >
                      {allProducts.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>${price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={item.quantity}
                      min={1}
                      onChange={e => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                    />
                  </td>
                  <td>${(item.quantity * price).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="text-end mb-3">
          <strong>Total:</strong> ${getTotal().toFixed(2)}
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditPurchase;
