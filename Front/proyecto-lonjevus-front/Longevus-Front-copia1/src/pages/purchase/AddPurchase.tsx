import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Simulación de productos disponibles
const allProducts = [
  { id: 1, name: 'Vitamina C', price: 25 },
  { id: 2, name: 'Alcohol', price: 100 },
  { id: 3, name: 'Café', price: 30 },
];

const AddPurchase = () => {
  const navigate = useNavigate();
  const [managerName, setManagerName] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState<{ productId: number; quantity: number }[]>([
    { productId: allProducts[0].id, quantity: 1 },
  ]);

  const handleAddProduct = () => {
    setItems([...items, { productId: allProducts[0].id, quantity: 1 }]);
  };

  const handleProductChange = (index: number, newProductId: number) => {
    setItems(items.map((item, i) =>
      i === index ? { ...item, productId: newProductId } : item
    ));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setItems(items.map((item, i) =>
      i === index ? { ...item, quantity } : item
    ));
  };

  const getTotal = () => {
    return items.reduce((sum, item) => {
      const product = allProducts.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      managerName,
      date,
      items,
      totalAmount: getTotal(),
    };
    console.log('Compra creada:', data);
    navigate('/compras');
  };

  return (
    <div className="container mt-4">
      <h2>Agregar Nueva Compra</h2>

      <div className="mb-3">
        <button className="btn btn-secondary" onClick={() => navigate('/compras')}>
          ← Volver
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
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Encargado</label>
          <input
            type="text"
            className="form-control"
            value={managerName}
            onChange={e => setManagerName(e.target.value)}
            required
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
              const product = allProducts.find(p => p.id === item.productId);
              const price = product?.price || 0;
              return (
                <tr key={index}>
                  <td>
                    <select
                      className="form-select"
                      value={item.productId}
                      onChange={e => handleProductChange(index, parseInt(e.target.value))}
                    >
                      {allProducts.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>${price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      min={1}
                      value={item.quantity}
                      onChange={e => handleQuantityChange(index, parseInt(e.target.value))}
                    />
                  </td>
                  <td>${(price * item.quantity).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mb-3">
          <button type="button" className="btn btn-outline-success" onClick={handleAddProduct}>
            + Agregar Producto
          </button>
        </div>

        <div className="text-end mb-3">
          <strong>Total: ${getTotal().toFixed(2)}</strong>
        </div>

        <button type="submit" className="btn btn-primary">Guardar Compra</button>
      </form>
    </div>
  );
};

export default AddPurchase;
