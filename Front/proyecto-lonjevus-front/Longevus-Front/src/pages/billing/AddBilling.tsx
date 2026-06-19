import React, { useState, useEffect } from "react";
import { createBilling, getAllResidents } from "../../services/BillingService";
import { useNavigate } from "react-router-dom";
import { succesAlert, errorAlert, infoAlert } from "../../js/alerts";
import type { Resident } from "../../services/BillingService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";
const AddBilling = () => {
  const navigate = useNavigate();
  const { hasAuthority } = useAuth();
  const [date, setDate] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });

  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(
    null
  );
  const [periodMonths, setPeriodMonths] = useState<number | "">("");
  const [periodLabel, setPeriodLabel] = useState("");

  const [errors, setErrors] = useState({
    date: false,
    amount: false,
    paymentMethod: false,
    selectedResidentId: false,
    periodMonths: false,
  });

  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  useEffect(() => {
    const loadResidents = async () => {
      try {
        const data = await getAllResidents();
        setResidents(data);
      } catch (error) {
        console.error("Error cargando residentes:", error);
        errorAlert(
          "Hubo un problema al cargar los residentes. Intente de nuevo."
        );
      }
    };
    loadResidents();
  }, []);

  const calculatePeriodLabel = (
    startDate: Date,
    monthsToAdd: number
  ): string => {
    const startMonth = startDate.getMonth(); // 0-index
    const endMonth = (startMonth + monthsToAdd - 1) % 12;
    return `${months[startMonth]}-${months[endMonth]}`;
  };

  useEffect(() => {
    if (periodMonths && date) {
      const label = calculatePeriodLabel(date, periodMonths);
      setPeriodLabel(label);
    } else {
      setPeriodLabel("");
    }
  }, [periodMonths, date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      date: !date,
      amount: amount <= 0,
      paymentMethod: !paymentMethod,
      selectedResidentId: !selectedResidentId,
      periodMonths: !periodMonths,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      infoAlert(
        "Campos incompletos",
        "Por favor complete todos los campos antes de guardar."
      );
      return;
    }

    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const billing = {
      date: formattedDate,
      amount,
      period: periodLabel,
      paymentMethod,
      administrator: { id: 1 },
      resident: { id: selectedResidentId! },
    };

    try {
      await createBilling(billing);
      await succesAlert(
        "¡Factura agregada!",
        "La factura se ha guardado correctamente."
      );
      navigate("/facturas");
    } catch (error) {
      console.error("Error guardando factura:", error);
      errorAlert("Hubo un problema al guardar la factura. Intente de nuevo.");
    }
  };

  return (
    <>
      <div className="container mt-4">
        <h2>Agregar Nueva Factura</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Fecha:</label>
            <DatePicker
              selected={date}
              onChange={(date: Date | null) => {
                if (date) setDate(date);
              }}
              dateFormat="dd-MM-yyyy"
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Selecciona una fecha"
              onKeyDown={(e) => e.preventDefault()}
              maxDate={new Date()}
            />
          </div>

          <div className="mb-3">
            <label>Monto (₡):</label>
            <div className="input-group">
              <span className="input-group-text">₡</span>
              <input
                type="number"
                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                min="0"
                step="0.01"
                value={amount === 0 ? "" : amount}
                onChange={(e) => {
                  const val = e.target.value;
                  const regex = /^\d+(\.\d{0,2})?$/;
                  if (val === "" || regex.test(val)) {
                    const number = Number(val);
                    if (number <= 1000000) setAmount(number);
                  }
                }}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                }}
                placeholder="Ingrese el monto"
              />
            </div>
          </div>

          <div className="mb-3">
            <label>Cantidad de meses a pagar:</label>
            <select
              className={`form-control ${
                errors.periodMonths ? "is-invalid" : ""
              }`}
              value={periodMonths}
              onChange={(e) => setPeriodMonths(Number(e.target.value))}
            >
              <option value="">Seleccione cantidad de meses</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} mes{n > 1 ? "es" : ""}
                </option>
              ))}
            </select>
          </div>

          {periodLabel && (
            <div className="mb-3">
              <label>Período:</label>
              <input
                type="text"
                className="form-control"
                value={periodLabel}
                readOnly
              />
            </div>
          )}

          <div className="mb-3">
            <label>Método de Pago:</label>
            <select
              className={`form-control ${
                errors.paymentMethod ? "is-invalid" : ""
              }`}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Seleccione...</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Sinpe">Sinpe</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>

          <div className="mb-3">
            <label>Residente:</label>
            <select
              className={`form-control ${
                errors.selectedResidentId ? "is-invalid" : ""
              }`}
              value={selectedResidentId ?? ""}
              onChange={(e) => setSelectedResidentId(Number(e.target.value))}
            >
              <option value="">Seleccionar Residente</option>
              {residents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex justify-content-start gap-2 mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/facturas")}
            >
             
              Volver
            </button>

            {hasAuthority("PERMISSION_FACTURAS_CREATE") && (
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBilling;
