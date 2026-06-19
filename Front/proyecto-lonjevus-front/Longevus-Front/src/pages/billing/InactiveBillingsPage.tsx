import React, { useEffect, useState } from "react";
import { getInactiveBillings } from "../../services/BillingService";
import { useNavigate } from "react-router-dom";
import type { Billing } from "../../services/BillingService";

const formatDate = (isoString: string): string => {
  const [year, month, day] = isoString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const formattedDay = String(date.getDate()).padStart(2, "0");
  const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
  return `${formattedDay}-${formattedMonth}-${date.getFullYear()}`;
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

const InactiveBillingsPage = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [allBillings, setAllBillings] = useState<Billing[]>([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const navigate = useNavigate();

  const loadInactive = async () => {
    const data = await getInactiveBillings();
    setAllBillings(data);
    setBillings(data);
  };

  const handleFilter = () => {
    if (!selectedYear) {
      setBillings(allBillings);
      return;
    }

    const filtered = allBillings.filter((b) => {
      const date = new Date(b.date);
      const matchesYear = String(date.getFullYear()) === selectedYear;
      const matchesMonth = selectedMonth
        ? String(date.getMonth() + 1).padStart(2, "0") === selectedMonth
        : true;
      return matchesYear && matchesMonth;
    });

    setBillings(filtered);
  };

  const handleClearFilters = () => {
    setSelectedYear("");
    setSelectedMonth("");
    setBillings(allBillings);
  };

  useEffect(() => {
    loadInactive();
  }, []);

  const availableYears = [
    ...new Set(allBillings.map((b) => b.date.split("-")[0])),
  ].sort();

  return (
    <>
      <div className="container mt-4">
        <h2>Facturas Canceladas</h2>

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
          <table className="table table-bordered table-striped text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Consecutivo</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((billing, index) => (
                <tr key={billing.id}>
                  <td>{index + 1}</td>
                  <td>{billing.consecutive}</td>
                  <td>{formatDate(billing.date)}</td>
                  <td>₡{billing.amount.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-info p-2"
                      onClick={() => setSelectedBilling(billing)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {billings.length === 0 && (
                <tr>
                  <td colSpan={5}>No hay facturas canceladas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mb-3">
          <button
            className="btn btn-secondary ms-2"
            onClick={() => navigate("/facturas")}
          >
            
            Volver
          </button>
        </div>

        {selectedBilling && (
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalle de Factura</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedBilling(null)}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Consecutivo:</strong> {selectedBilling.consecutive}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {formatDate(selectedBilling.date)}
                  </p>
                  <p>
                    <strong>Monto:</strong> ₡{selectedBilling.amount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Método de Pago:</strong>{" "}
                    {selectedBilling.paymentMethod}
                  </p>
                  <p>
                    <strong>Periodo:</strong> {selectedBilling.period}
                  </p>
                  <hr />
                  <p>
                    <strong>Administrador:</strong>{" "}
                    {selectedBilling.administrator?.name}
                  </p>
                  <p>
                    <strong>Residente:</strong> {selectedBilling.resident?.name}
                  </p>
                </div>
                <div className="modal-footer d-flex justify-content-start">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedBilling(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InactiveBillingsPage;
