import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import StandardTable, { type Column } from "../../components/StandardTable";
import { useNavigate, useLocation } from "react-router-dom";
import {succesAlert,errorAlert,confirmDeleteAlert,confirmEditAlert,} from "../../js/alerts";
import {getAllPurchases,deletePurchase,type Purchase,} from "../../services/PurchaseService";
import { useAuth } from "../../context/AuthContext";

registerLocale("es", es);

const formatDate = (isoString: string): string => {
  if (!isoString) return "";
  const [year, month, day] = isoString.split("-");
  return `${day}/${month}/${year}`;
};

type CustomInputProps = {
  value?: string;
  onClick?: () => void;
};


const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick }, ref) => (
    <input
      type="text"
      className="form-control"
      value={value}
      onClick={onClick}
      ref={ref}
      placeholder="Mes/Año"
      readOnly
    />
  )
);

CustomInput.displayName = "CustomInput";

const PurchasePage = () => {
  const {hasAuthority,} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const loadPurchases = async () => {
    try {
      const data = await getAllPurchases();
      let filtered = data;

      if (selectedDate) {
        filtered = data.filter((item) => {
          const itemDate = new Date(item.date);
          return (
            itemDate.getMonth() === selectedDate.getMonth() &&
            itemDate.getFullYear() === selectedDate.getFullYear()
          );
        });
      }

      setPurchases(filtered);
    } catch (error) {
      console.error("Error al obtener compras:", error);
      errorAlert("No se pudieron cargar las compras.");
    }
  };

  useEffect(() => {
    
    loadPurchases();
  }, [location, selectedDate]);

  const columns: Column<Purchase>[] = [
    { header: "#", accessor: "date", render: (_item, index) => index + 1 },
    { header: "ID Compra", accessor: "id" },
    {
      header: "Fecha",
      accessor: "date",
      render: (item) => formatDate(item.date),
    },
    {
      header: "Monto",
      accessor: "amount",
      render: (item) => `₡${item.amount.toFixed(2)}`,
    },
    {
      header: "Administrador",
      accessor: "admin",
      render: (item) => item.admin?.name ?? "No asignado",
    },
  ];

  const handleEdit = (purchase: Purchase) => {
    confirmEditAlert("Esta compra").then((result) => {
      if (result.isConfirmed) {
        navigate(`/compras/editar/${purchase.id}`);
      }
    });
  };

  const handleDelete = async (id: string) => {
    const result = await confirmDeleteAlert("la compra");
    if (result.isConfirmed) {
      try {
        await deletePurchase(id);
        setPurchases((prev) => prev.filter((p) => p.id !== id));
        succesAlert("Eliminado", "Compra eliminada correctamente.");
      } catch (error) {
        console.error("Error al eliminar la compra:", error);
        errorAlert("No se pudo eliminar la compra.");
      }
    }
  };

  const handleView = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
  };

  return (
    <>
      {/* <Header /> */}
      <div className="container mt-4">
        <h2>Listado de Compras</h2>
        <div className="d-flex justify-content-end gap-2 mb-3">
          <button
            className="btn btn-success"
            onClick={() => navigate("/compras/agregar")}
            title="Agregar Compra"
          >
            <i className="bi bi-cart-plus fs-5"></i>
          </button>
          <button
            className="btn btn-outline-dark"
            onClick={() => navigate("/compras/inactivas")}
          >
            Ver Compras Canceladas
          </button>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Filtrar por mes y año:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              locale="es"
              customInput={<CustomInput />}
            />

            {selectedDate && (
              <button
                className="btn btn-secondary mt-2"
                onClick={() => setSelectedDate(null)}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        </div>

        <StandardTable<Purchase>
          data={purchases}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(item) => handleDelete(item.id!)}
          renderActions={(item) => (
            <div className="d-flex flex-row gap-1">
              {hasAuthority('PERMISSION_COMPRAS_VIEW')&& (
              <button
                className="btn btn-info p-2"
                onClick={() => handleView(item)}
                title="Ver"
              >
                <i className="bi bi-eye"></i>
              </button>
              )}
              {hasAuthority('PERMISSION_COMPRAS_UPDATE')&& (
              <button
                className="btn btn-warning p-2"
                onClick={() => handleEdit(item)}
                title="Editar"
              >
                <i className="bi bi-pencil-square"></i>
              </button>
              )}
              {hasAuthority('PERMISSION_COMPRAS_DELETE')&& (
              <button
                className="btn btn-danger p-2"
                onClick={() => handleDelete(item.id!)}
                title="Eliminar"
              >
                <i className="bi bi-trash"></i>
              </button>
              )}
            </div>
          )}
        />

        {selectedPurchase && (
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalle de Compra</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedPurchase(null)}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Encargado:</strong> {selectedPurchase.admin?.name}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {formatDate(selectedPurchase.date)}
                  </p>
                  <p>
                    <strong>Monto Total:</strong> ₡
                    {selectedPurchase.amount.toFixed(2)}
                  </p>
                  <table className="table table-bordered mt-3">
                    <thead className="table-secondary">
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Fecha de Vencimiento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPurchase.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {item.productName ?? "Producto no disponible"}
                          </td>
                          <td>{item.quantity}</td>
                          <td>{formatDate(item.expirationDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer d-flex justify-content-start">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedPurchase(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default PurchasePage;
