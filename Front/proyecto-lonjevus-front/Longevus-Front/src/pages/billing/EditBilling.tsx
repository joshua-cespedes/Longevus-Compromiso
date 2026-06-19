import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBillingById,
  updateBilling,
  getAllResidents,
  type Billing,
  type Resident,
} from "../../services/BillingService";
import { succesAlert, errorAlert, confirmEditAlert } from "../../js/alerts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditBilling = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [billing, setBilling] = useState<Billing | null>(null);
  const [loading, setLoading] = useState(true);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [residentId, setResidentId] = useState<number | null>(null);
  const [periodMonths, setPeriodMonths] = useState<number | "">("");
  const [periodLabel, setPeriodLabel] = useState("");

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

  const estimateMonthsFromPeriod = (period: string): number => {
    const [start, end] = period.split("-");
    const startIndex = months.indexOf(start);
    const endIndex = months.indexOf(end);
    if (startIndex === -1 || endIndex === -1) return 1;
    let diff = endIndex - startIndex + 1;
    if (diff <= 0) diff += 12;
    return diff;
  };
  const calculatePeriodLabel = (
    startDate: Date,
    monthsToAdd: number
  ): string => {
    const startMonth = startDate.getMonth();
    const endMonth = (startMonth + monthsToAdd - 1) % 12;
    return `${months[startMonth]}-${months[endMonth]}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllResidents();
        setResidents(res);

        if (id) {
          const data = await getBillingById(parseInt(id));
          const exists = res.some((r) => r.id === data.resident.id);
          if (!exists) {
            errorAlert(
              "No se puede editar la factura porque el residente asociado ya no existe."
            );
            navigate("/facturas");
            return;
          }
          setBilling(data);
          const [year, month, day] = data.date.split("-").map(Number);
          const billingDate = new Date(year, month - 1, day);
          setDate(billingDate);
          setAmount(data.amount);
          setPaymentMethod(data.paymentMethod);
          setResidentId(data.resident.id);

          const monthsCount = estimateMonthsFromPeriod(data.period);
          setPeriodMonths(monthsCount);
          setPeriodLabel(calculatePeriodLabel(billingDate, monthsCount));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar la factura:", error);
        errorAlert("Hubo un error al cargar la factura.");
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (date && periodMonths) {
      const label = calculatePeriodLabel(date, periodMonths);
      setPeriodLabel(label);
    }
  }, [date, periodMonths]);

  const [errors, setErrors] = useState({
    date: false,
    amount: false,
    paymentMethod: false,
    residentId: false,
    periodMonths: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = {
      date: !date,
      amount: amount <= 0,
      paymentMethod: !paymentMethod,
      residentId: !residentId,
      periodMonths: !periodMonths,
    };
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
      errorAlert("Campos incompletos. Por favor complete todos los campos.");
      return;
    }

    const result = await confirmEditAlert(
      "Esta acción actualizará la factura."
    );
    if (!result.isConfirmed) return;

    const formattedDate = `${date!.getFullYear()}-${String(
      date!.getMonth() + 1
    ).padStart(2, "0")}-${String(date!.getDate()).padStart(2, "0")}`;

    const updatedBilling: Billing = {
      ...billing!,
      date: formattedDate,
      amount,
      paymentMethod,
      period: periodLabel,
      resident: { id: residentId! },
    };

    try {
      await updateBilling(updatedBilling.id!, updatedBilling);
      await succesAlert(
        "Factura actualizada",
        "La factura se actualizó correctamente."
      );
      navigate("/facturas");
    } catch (error) {
      console.error("Error al actualizar la factura:", error);
      errorAlert("Hubo un problema al actualizar la factura.");
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando factura...</p>;
  if (!billing)
    return <p className="text-center mt-4">Factura no encontrada</p>;

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="m-0">Editar Factura</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Fecha:</label>
            <DatePicker
              selected={date}
              onChange={(d) => d && setDate(d)}
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
            <label className="form-label">Monto (₡):</label>
            <div className="input-group">
              <span className="input-group-text">₡</span>
              <input
                type="number"
                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
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
                min="0"
                step="0.01"
                placeholder="Ingrese el monto"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Período (meses):</label>
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
              <label className="form-label">Período generado:</label>
              <input
                type="text"
                className="form-control"
                value={periodLabel}
                readOnly
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Método de Pago:</label>
            <select
              className={`form-select ${
                errors.paymentMethod ? "is-invalid" : ""
              }`}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Seleccione</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Sinpe">Sinpe</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Residente:</label>
            <select
              className={`form-select ${errors.residentId ? "is-invalid" : ""}`}
              value={residentId ?? ""}
              onChange={(e) => setResidentId(Number(e.target.value))}
            >
              <option value="">Seleccionar Residente</option>
              {residents.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.name}
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
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditBilling;
