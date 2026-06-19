import React, { useEffect, useState } from "react";
import type { Billing, Resident } from "../../services/BillingService";
import Select from "react-select";
import type { SingleValue } from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";

import {
  getAllBillings,
  deleteBilling,
  getAllResidents,
  getBillingsByResident,
  getBillingsByInactiveResidents,
} from "../../services/BillingService";
import { useNavigate } from "react-router-dom";
import {
  succesAlert,
  errorAlert,
  confirmDeleteAlert,
  infoAlert,
  confirmEditAlert,
} from "../../js/alerts";

const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split("-").map(Number);
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

const BillingPage = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [allBillings, setAllBillings] = useState<Billing[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const navigate = useNavigate();
  const { hasAuthority } = useAuth();

  const loadBillings = async () => {
    try {
      const data = await getAllBillings();
      setAllBillings(data);
      setBillings(data);
    } catch (error) {
      console.error("Error cargando facturas:", error);
      errorAlert("No se pudieron cargar las facturas.");
    }
  };

  const loadResidents = async () => {
    try {
      const data = await getAllResidents();
      const enriched = data.map((r) => ({
        id: r.id,
        name: r.name ?? "Sin nombre",
        active: true,
      }));
      setResidents(enriched);
    } catch (error) {
      console.error("Error cargando residentes:", error);
      errorAlert("No se pudieron cargar los residentes.");
    }
  };
  const residentOptions = [
    { label: "Residentes inactivos", value: -1 },
    ...residents
      .filter((r) => r.active)
      .map((r) => ({
        label: r.name,
        value: r.id,
      })),
  ];

  useEffect(() => {
    loadBillings();
    loadResidents();
  }, []);

  const handleFilter = async () => {
    if (selectedResidentId === null) {
      infoAlert("Atención", "Debe seleccionar un residente para buscar.");
      return;
    }

    let data: Billing[] = [];

    if (selectedResidentId === -1) {
      data = (await getBillingsByInactiveResidents()).filter((b) => b.isActive);
    } else {
      data = await getBillingsByResident(selectedResidentId);
    }

    if (selectedYear) {
      data = data.filter((b) => {
        const date = new Date(b.date);
        const yearMatch = String(date.getFullYear()) === selectedYear;
        const monthMatch = selectedMonth
          ? String(date.getMonth() + 1).padStart(2, "0") === selectedMonth
          : true;
        return yearMatch && monthMatch;
      });
    }

    setBillings(data);
  };

  const handleClearFilters = async () => {
    setSelectedResidentId(null);
    setSelectedYear("");
    setSelectedMonth("");
    await loadBillings();
  };

  const handleDelete = async (id: number) => {
    const result = await confirmDeleteAlert("la factura");
    if (result.isConfirmed) {
      try {
        await deleteBilling(id);
        await loadBillings();
        succesAlert(
          "Factura eliminada",
          "La factura fue eliminada exitosamente."
        );
      } catch (error) {
        console.error("Error al eliminar factura:", error);
        errorAlert("No se pudo eliminar la factura");
      }
    }
  };

  const availableYears = [
    ...new Set(allBillings.map((b) => new Date(b.date).getFullYear())),
  ]
    .map(String)
    .sort();

  return (
    <>
      <div className="container mt-4">
        <h2>Facturas</h2>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <Select
              options={residentOptions}
              value={
                residentOptions.find(
                  (opt) => opt.value === selectedResidentId
                ) || null
              }
              onChange={(
                option: SingleValue<{
                  label: string | undefined;
                  value: number;
                }>
              ) => setSelectedResidentId(option ? option.value : null)}
              placeholder="Seleccione un residente"
              isClearable
            />
          </div>

          {selectedResidentId !== null && !isNaN(selectedResidentId) && (
            <>
              <div className="col-md-3">
                <select
                  className="form-control"
                  value={selectedYear}
                  onChange={async (e) => {
                    setSelectedYear(e.target.value);
                    await handleFilter();
                  }}
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
                  onChange={async (e) => {
                    setSelectedMonth(e.target.value);
                    await handleFilter();
                  }}
                  disabled={!selectedYear}
                >
                  <option value="">Mes</option>
                  {monthNames.map((name, index) => (
                    <option
                      key={index}
                      value={String(index + 1).padStart(2, "0")}
                    >
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleFilter}
                >
                  Buscar
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mb-3 text-end">
          <button
            className="btn btn-secondary me-2"
            onClick={handleClearFilters}
          >
            Limpiar Filtros
          </button>
          {hasAuthority("PERMISSION_FACTURAS_CREATE") && (
            <button
              className="btn btn-success"
              onClick={() => navigate("/facturas/nueva")}
            >
              <i className="bi bi-journal-plus"></i>
              Nueva
            </button>
          )}

          {hasAuthority("PERMISSION_FACTURAS_VIEW") && (
            <button
              className="btn btn-outline-dark ms-2"
              onClick={() => navigate("/facturas/inactivas")}
            >
              Facturas Canceladas
            </button>
          )}
        </div>

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
                <td className="d-flex flex-row justify-content-center gap-1">
                  <button
                    className="btn btn-info p-2"
                    onClick={() => setSelectedBilling(billing)}
                    title="Ver"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  {hasAuthority("PERMISSION_FACTURAS_UPDATE") && (
                    <button
                      className="btn btn-warning p-2"
                      onClick={async () => {
                        const result = await confirmEditAlert("Esta factura");
                        if (result.isConfirmed) {
                          navigate(`/facturas/editar/${billing.id}`);
                        }
                      }}
                      title="Editar"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  )}
                  {hasAuthority("PERMISSION_FACTURAS_DELETE") && (
                    <button
                      className="btn btn-danger p-2"
                      onClick={() => handleDelete(billing.id!)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {billings.length === 0 && (
              <tr>
                <td colSpan={5}>No hay facturas encontradas.</td>
              </tr>
            )}
          </tbody>
        </table>

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

export default BillingPage;
