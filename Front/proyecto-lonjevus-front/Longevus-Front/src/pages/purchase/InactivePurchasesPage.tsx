import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorAlert } from "../../js/alerts";

import {
  getInactivePurchases,
  type Purchase,
} from "../../services/PurchaseService";

const formatDate = (isoString: string): string => {
  if (!isoString) return "";
  const [year, month, day] = isoString.split("-");
  return `${day}/${month}/${year}`;
};

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const InactivePurchasesPage = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [allPurchases, setAllPurchases] = useState<Purchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigate = useNavigate();

  const loadInactive = async () => {
    try {
      const data = await getInactivePurchases();
      setAllPurchases(data);
      setPurchases(data);
    } catch (error) {
      console.error("Error al cargar compras inactivas:", error);
      errorAlert("No se pudieron cargar las compras canceladas.");
    }
  };

  const handleFilter = () => {
    if (!selectedYear) {
      setPurchases(allPurchases);
      return;
    }

    const filtered = allPurchases.filter((purchase) => {
      const date = new Date(purchase.date);
      const matchesYear = String(date.getFullYear()) === selectedYear;
      const matchesMonth = selectedMonth
        ? String(date.getMonth() + 1).padStart(2, "0") === selectedMonth
        : true;
      return matchesYear && matchesMonth;
    });

    setPurchases(filtered);
  };

  const handleClearFilters = () => {
    setSelectedYear("");
    setSelectedMonth("");
    setPurchases(allPurchases);
  };

  useEffect(() => {
    loadInactive();
  }, []);

  const availableYears = [
    ...new Set(allPurchases.map((p) => new Date(p.date).getFullYear())),
  ].sort();

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Compras Canceladas</h2>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">
            <select
              className="form-control"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Año</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-control"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={!selectedYear}
            >
              <option value="">Mes</option>
              {monthNames.map((name, index) => (
                <option key={index} value={String(index + 1).padStart(2, "0")}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <button className="btn btn-primary" onClick={handleFilter}>
              Buscar
            </button>
          </div>

          <div className="col-md-3 text-end">
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Limpiar Filtros
            </button>
          </div>
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Administrador</th>
                <th>Ver</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length > 0 ? (
                purchases.map((purchase, index) => (
                  <tr key={purchase.id}>
                    <td>{index + 1}</td>
                    <td>{formatDate(purchase.date)}</td>
                    <td>₡{purchase.amount.toFixed(2)}</td>
                    <td>{purchase.admin?.name ?? "No asignado"}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => setSelectedPurchase(purchase)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No hay compras canceladas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
                      {selectedPurchase.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            {item.productName || `Producto #${item.idProduct}`}
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

      <div className="mb-3 d-flex justify-content-start ps-5">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/compras")}
        >

          Volver
        </button>
      </div>
    </>
  );
};

export default InactivePurchasesPage;
