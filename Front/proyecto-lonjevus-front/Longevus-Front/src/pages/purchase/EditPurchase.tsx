import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

import {
  getPurchaseById,
  updatePurchase,
  deletePurchase,
  type Purchase,
  type PurchaseItem,
} from "../../services/PurchaseService";
import { getProducts, type IProduct } from "../../services/ProductService";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";
import {
  succesAlert,
  errorAlert,
  confirmExitAlert,
  confirmDeletePurchaseAlert,
  confirmExpiredProductAlert,
} from "../../js/alerts";
import { getAllInventory } from "../../services/InventoryService";

registerLocale("es", es);

const isValidDate = (dateString: string): boolean => {
  if (!/\d{4}-\d{2}-\d{2}/.test(dateString)) return false;
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const parseLocalISODate = (isoString: string): Date => {
  const [year, month, day] = isoString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const EditPurchase = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [managerName, setManagerName] = useState("");
  const [items, setItems] = useState<
    { productId: number; quantity: number; expirationDate: string }[]
  >([]);
  const [deletedItems, setDeletedItems] = useState<
    { productId: number; quantity: number; expirationDate: string }[]
  >([]);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [initialData, setInitialData] = useState("");
  const [invalidIndexes, setInvalidIndexes] = useState<number[]>([]);
  const [hasInactiveProducts, setHasInactiveProducts] = useState(false);
  const [expiredAlertShownIndexes, setExpiredAlertShownIndexes] = useState<
    number[]
  >([]);
  const [inventoryFlag, setInventoryFlag] = useState(false);
  const [deletedProductsFlag, setDeletedProductsFlag] = useState(false);
  const { hasAuthority } = useAuth();
  const canEdit = hasAuthority("PERMISSION_COMPRAS_UPDATE");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, purchase, inventory] = await Promise.all([
          getProducts(),
          getPurchaseById(id!),
          getAllInventory(),
        ]);

        setAllProducts(products);
        setDate(purchase.date);
        setManagerName(purchase.admin.name || "No asignado");

        const mappedItems = purchase.items.map((item: PurchaseItem) => ({
          productId: item.idProduct,
          quantity: item.quantity,
          expirationDate: item.expirationDate ?? "",
        }));

        const missingFromInventory = mappedItems.filter((item) => {
          const matchingInventoryCount = inventory.filter(
            (inv) => inv.product.id === item.productId && inv.purchase.id === id
          ).length;
          return matchingInventoryCount < item.quantity;
        });

        if (missingFromInventory.length > 0) {
          setInventoryFlag(true);
          setHasInactiveProducts(true);
        }

        const missingProducts = purchase.items.filter(
          (item) => !products.some((p) => p.id === item.idProduct)
        );

        if (missingProducts.length > 0) {
          setDeletedProductsFlag(true);
          setHasInactiveProducts(true);
        }

        const fakeProducts: IProduct[] = missingProducts.map((item) => ({
          id: item.idProduct,
          name: item.productName ?? "Producto eliminado",
          price: item.price ?? 0,
          expirationDate: "",
          category: "Desconocido",
          unit: "N/A",
          supplier: "N/A",
          photoURL: "",
          isActive: false,
        }));

        setAllProducts((prev) => [...prev, ...fakeProducts]);
        setItems(mappedItems);
        setInitialData(
          JSON.stringify({ date: purchase.date, items: mappedItems })
        );
      } catch (err) {
        console.error("Error al cargar la compra o los productos", err);
        errorAlert("Ocurrió un error al cargar los datos.");
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChangeItem = async (
    index: number,
    field: "productId" | "quantity" | "expirationDate",
    value: string | number
  ) => {
    if (field === "expirationDate" && typeof value === "string") {
      const selectedDate = parseLocalISODate(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today && !expiredAlertShownIndexes.includes(index)) {
        const result = await confirmExpiredProductAlert();
        if (!result.isConfirmed) return;
        setExpiredAlertShownIndexes((prev) => [...prev, index]);
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
    setInvalidIndexes((prev) => prev.filter((i) => i !== index));
  };

  const handleRemoveItem = (index: number) => {
    const removed = items[index];
    setDeletedItems((prev) => [...prev, removed]);
    setItems((prev) => prev.filter((_, i) => i !== index));
    setInvalidIndexes((prev) => prev.filter((i) => i !== index));
  };

  const handleUndoRemove = () => {
    const lastDeleted = deletedItems[deletedItems.length - 1];
    if (!lastDeleted) return;
    setItems((prev) => [...prev, lastDeleted]);
    setDeletedItems((prev) => prev.slice(0, -1));
  };

  const getTotal = () => {
    return items.reduce((sum, item) => {
      const product = allProducts.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasInactiveProducts) {
      errorAlert(
        "No se puede guardar esta compra porque contiene productos eliminados."
      );
      return;
    }

    const invalids: number[] = [];
    items.forEach((item, i) => {
      if (!isValidDate(item.expirationDate)) invalids.push(i);
    });

    if (invalids.length > 0) {
      setInvalidIndexes(invalids);
      return;
    }

    if (items.length === 0) {
      const result = await confirmDeletePurchaseAlert();
      if (result.isConfirmed && id) {
        try {
          await deletePurchase(id);
          succesAlert(
            "Compra eliminada",
            "La compra fue eliminada correctamente."
          );
          navigate("/compras");
        } catch (error) {
          console.error("Error al eliminar la compra:", error);
          errorAlert("Ocurrió un error al eliminar la compra.");
        }
      }
      return;
    }

    const payload: Purchase = {
      id: id!,
      date: format(parseLocalISODate(date), "yyyy-MM-dd"),
      amount: getTotal(),
      admin: { id: 1, name: "" },
      items: items.map((i) => ({
        idProduct: i.productId,
        name: "",
        quantity: i.quantity,
        expirationDate: i.expirationDate,
      })),
    };

    try {
      await updatePurchase(id!, payload);
      succesAlert("Actualización exitosa", "Compra actualizada correctamente.");
      navigate("/compras");
    } catch (err) {
      console.error("Error al actualizar", err);
      errorAlert("Ocurrió un error al actualizar la compra.");
    }
  };

  const handleBack = async () => {
    const hasChanges = JSON.stringify({ date, items }) !== initialData;
    if (hasChanges) {
      const result = await confirmExitAlert(
        "Tienes cambios sin guardar. ¿Deseas salir?"
      );
      if (!result.isConfirmed) return;
    }
    navigate("/compras");
  };

  if (!canEdit) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          No tienes permiso para editar compras.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Editar Compra</h2>

      {hasInactiveProducts && (
        <>
          {inventoryFlag && (
            <div className="alert alert-danger">
              <strong>
                Algún producto de esta compra ya no pertenece al inventario, por
                lo tanto no se puede editar.
              </strong>
            </div>
          )}
          {deletedProductsFlag && (
            <div className="alert alert-danger">
              <strong>
                Esta compra contiene productos inexistentes asociados, por lo
                tanto no se puede editar.
              </strong>
            </div>
          )}
        </>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={hasInactiveProducts}>
          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <DatePicker
              selected={date ? parseLocalISODate(date) : null}
              onChange={(date: Date | null) =>
                setDate(date ? date.toISOString().split("T")[0] : "")
              }
              dateFormat="dd/MM/yyyy"
              locale="es"
              placeholderText="dd/mm/aaaa"
              className="form-control"
              onKeyDown={(e) => e.preventDefault()}
              maxDate={new Date()}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Encargado</label>
            <input
              type="text"
              className="form-control"
              value={managerName}
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
                const product = allProducts.find(
                  (p) => p.id === item.productId
                );
                const price = product?.price || 0;
                const showInvalid = invalidIndexes.includes(index);

                return (
                  <tr key={index}>
                    <td>
                      <select
                        className="form-select"
                        value={item.productId}
                        onChange={(e) =>
                          handleChangeItem(
                            index,
                            "productId",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {allProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>₡{price.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.quantity}
                        min={1}
                        onChange={(e) =>
                          handleChangeItem(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                    </td>
                    <td style={{ position: "relative" }}>
                      <DatePicker
                        selected={
                          isValidDate(item.expirationDate)
                            ? parseLocalISODate(item.expirationDate)
                            : null
                        }
                        onChange={async (date: Date | null) => {
                          if (date) {
                            const iso = date.toISOString().split("T")[0];
                            handleChangeItem(index, "expirationDate", iso);
                          }
                        }}
                        dateFormat="dd/MM/yyyy"
                        locale="es"
                        placeholderText="dd/mm/aaaa"
                        className={`form-control ${
                          showInvalid ? "is-invalid" : ""
                        }`}
                        onKeyDown={(e) => e.preventDefault()}
                      />
                      {showInvalid && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            zIndex: 1000,
                            backgroundColor: "#f8d7da",
                            color: "#721c24",
                            border: "1px solid #f5c6cb",
                            borderRadius: "0.25rem",
                            padding: "0.4rem 0.6rem",
                            fontSize: "0.875rem",
                            marginTop: "4px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ⚠ Por favor ingrese una fecha válida del calendario.
                        </div>
                      )}
                    </td>
                    <td>₡{(item.quantity * price).toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {deletedItems.length > 0 && (
            <button
              type="button"
              className="btn btn-secondary btn-sm mb-3"
              onClick={handleUndoRemove}
            >
              Deshacer
            </button>
          )}

          <div className="text-end mb-3">
            <strong>Total:</strong> ₡{getTotal().toFixed(2)}
          </div>
        </fieldset>

        <div className="d-flex justify-content-start gap-3 mt-4 mb-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            <i className="bi bi-reply me-1"></i>
            Volver
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={hasInactiveProducts}
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPurchase;
