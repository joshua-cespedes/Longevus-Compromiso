import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import Select from "react-select";
import type { SingleValue } from "react-select";
import { useAuth } from "../../context/AuthContext";
import {
  errorAlert,
  succesAlert,
  confirmExitAlert,
  confirmExpiredProductAlert,
} from "../../js/alerts";
import {
  type Admin,
  type PurchasePayload,
} from "../../services/PurchaseService";

interface Product {
  id: number;
  name: string;
  price: number;
  category?: {
    name: string;
  };
}

interface LocalPurchaseItem {
  productId: number;
  quantity: number;
  expirationDate: string;
}

interface ProductOption {
  value: number;
  label: string;
  category?: string;
}

const isValidDate = (dateString: string): boolean => {
  if (!/^\d{2}-\d{2}-\d{4}$/.test(dateString)) return false;
  const [day, month, year] = dateString.split("-").map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const convertToISODate = (dateString: string): string => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const AddPurchase = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [date, setDate] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });
  const [dateError, setDateError] = useState<string | null>(null);

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [items, setItems] = useState<LocalPurchaseItem[]>([]);
  const [isModified, setIsModified] = useState(false);

  const { hasAuthority } = useAuth();
  const canCreate = hasAuthority("PERMISSION_COMPRAS_CREATE");

  const handleBack = async () => {
    if (isModified) {
      const result = await confirmExitAlert(
        "Tienes cambios sin guardar. ¿Deseas salir?"
      );
      if (!result.isConfirmed) return;
    }
    navigate("/compras");
  };

  useEffect(() => {
    if (!canCreate) return;
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products/list");
        setProducts(response.data.products);
      } catch {
        errorAlert("No se pudieron cargar los productos.");
      }
    };

    const fetchAdmin = async () => {
      try {
        const response = await axios.get<Admin>(
          "http://localhost:8080/admin/getAdmin/1"
        );
        setAdmin(response.data);
      } catch {
        errorAlert("No se pudo obtener el administrador.");
      }
    };

    fetchProducts();
    fetchAdmin();
  }, [canCreate]);

  const selectedProductIds = items.map((item) => item.productId);

  const groupedOptions = Object.entries(
    products.reduce((groups, product) => {
      const category =
        typeof product.category === "string"
          ? product.category
          : product.category?.name ?? "Sin categoría";

      if (!groups[category]) groups[category] = [];
      if (!selectedProductIds.includes(product.id)) {
        groups[category].push({
          value: product.id,
          label: product.name,
          category: category,
        });
      }
      return groups;
    }, {} as Record<string, ProductOption[]>)
  ).map(([label, options]) => ({ label, options }));

  const handleAddProduct = () => {
    const availableProducts = products.filter(
      (p) => !selectedProductIds.includes(p.id)
    );
    if (availableProducts.length === 0) {
      errorAlert("Ya se han agregado todos los productos disponibles.");
      return;
    }
    const today = new Date();
    const formattedToday = `${String(today.getDate()).padStart(
      2,
      "0"
    )}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

    setIsModified(true);
    setItems([
      ...items,
      {
        productId: availableProducts[0].id,
        quantity: 1,
        expirationDate: formattedToday,
      },
    ]);
  };

  const handleChange = async (
    index: number,
    field: keyof LocalPurchaseItem,
    value: string | number
  ) => {
    setIsModified(true);

    if (field === "expirationDate" && typeof value === "string") {
      const selectedDate = parseLocalDate(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        const result = await confirmExpiredProductAlert();
        if (!result.isConfirmed) return;
      }
    }

    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "expirationDate" ? String(value) : Number(value),
            }
          : item
      )
    );
  };

  const handleRemoveProduct = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const getTotal = (): number => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      const quantity = Number(item.quantity);
      const price = product?.price ?? 0;

      if (!isNaN(quantity) && quantity > 0) {
        return sum + price * quantity;
      }
      return sum;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!admin) {
      errorAlert("No se pudo obtener el administrador.");
      return;
    }

    if (products.length === 0) {
      errorAlert(
        "No se puede guardar la compra porque no hay productos disponibles."
      );
      return;
    }

    if (items.some((item) => !isValidDate(item.expirationDate))) {
      errorAlert("Hay una o más fechas inválidas");
      return;
    }

    if (items.some((item) => !item.expirationDate)) {
      errorAlert(
        "Debes seleccionar la fecha de vencimiento de todos los productos."
      );
      return;
    }

    if (items.length === 0) {
      errorAlert("Debes agregar al menos un producto a la compra.");
      return;
    }

    if (dateError) {
      errorAlert("No puedes crear una compra con fecha inválida.");
      return;
    }

    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    const payload: PurchasePayload = {
      date: formattedDate,
      amount: getTotal(),
      admin: { id: admin.id, name: admin.name },
      items: items.map((item) => ({
        idProduct: item.productId,
        name: "",
        quantity: item.quantity,
        expirationDate: convertToISODate(item.expirationDate),
      })),
    };

    try {
      await axios.post("http://localhost:8080/api/purchases/add", payload);
      succesAlert("Éxito", "Compra registrada correctamente");
      navigate("/compras");
    } catch (error) {
      console.error("Error al guardar la compra:", error);
      errorAlert("Ocurrió un error al registrar la compra.");
    }
  };
  
    if (!canCreate) {
      return (
        <div className="container mt-4">
          <div className="alert alert-danger">
            No tienes permiso para registrar compras.
          </div>
        </div>
      );
    }

  return (
    <div className="container mt-4">
      <h2>Agregar Nueva Compra</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Fecha de la compra</label>
          <DatePicker
            selected={date}
            onChange={(selectedDate: Date | null) => {
              if (selectedDate) {
                const today = new Date();
                if (selectedDate > today) {
                  setDateError(
                    "No puedes crear una compra con fecha inválida."
                  );
                } else {
                  setDateError(null);
                  setDate(selectedDate);
                }
              }
            }}
            maxDate={new Date()}
            dateFormat="dd-MM-yyyy"
            className={`form-control ${dateError ? "is-invalid" : ""}`}
            placeholderText="Selecciona una fecha"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            onKeyDown={(e) => e.preventDefault()}
          />
          {dateError && <div className="text-danger mt-1">{dateError}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Encargado</label>
          <input
            type="text"
            className="form-control"
            value={admin?.name ?? ""}
            readOnly
          />
        </div>

        <h5>Productos</h5>
        <table className="table table-bordered">
          <thead className="table-secondary">
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Fecha de Vencimiento</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const product = products.find((p) => p.id === item.productId);
              const price = product?.price ?? 0;

              return (
                <tr key={index}>
                  <td>
                    <Select
                      filterOption={(option, inputValue) => {
                        const input = inputValue.toLowerCase();
                        const label = option.label.toLowerCase();
                        const category =
                          option.data?.category?.toLowerCase() ?? "";

                        return (
                          label.includes(input) || category.includes(input)
                        );
                      }}
                      value={{
                        value: item.productId,
                        label: product?.name || "",
                      }}
                      options={groupedOptions}
                      onChange={(selected: SingleValue<ProductOption>) => {
                        if (selected)
                          handleChange(index, "productId", selected.value);
                      }}
                    />
                  </td>
                  <td>₡{price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td>
                    <DatePicker
                      selected={
                        item.expirationDate
                          ? parseLocalDate(item.expirationDate)
                          : null
                      }
                      onChange={(date: Date | null) => {
                        const formatted = date
                          ? `${String(date.getDate()).padStart(
                              2,
                              "0"
                            )}-${String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            )}-${date.getFullYear()}`
                          : "";
                        handleChange(index, "expirationDate", formatted);
                      }}
                      dateFormat="dd-MM-yyyy"
                      className={`form-control ${
                        !isValidDate(item.expirationDate) ? "is-invalid" : ""
                      }`}
                      placeholderText="Selecciona una fecha"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      onKeyDown={(e) => e.preventDefault()}
                    />
                    {!isValidDate(item.expirationDate) && (
                      <div className="invalid-feedback">
                        Por favor ingrese una fecha válida (DD-MM-AAAA).
                      </div>
                    )}
                  </td>
                  <td>
                    ₡
                    {Number(item.quantity) > 0 && !isNaN(Number(item.quantity))
                      ? (price * item.quantity).toFixed(2)
                      : "0.00"}
                  </td>

                  <td>
                    
                    <button
                      type="button"
                      className="btn btn-danger btn-lg"
                      onClick={() => handleRemoveProduct(index)}
                    >
                     {/* <i className="bi bi-trash-fill"/>  */}
                     Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={handleAddProduct}
          >
            + Agregar Producto
          </button>
        </div>

        <div className="text-end mb-3">
          <strong>Total: ₡{getTotal().toFixed(2)}</strong>
        </div>

        <div className="d-flex justify-content-start gap-2 mt-4 mb-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            Volver
          </button>
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchase;
