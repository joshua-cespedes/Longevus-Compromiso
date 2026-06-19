import type { FormData } from "./VisitorForms"
import type { Resident } from "./AppoitmentResidentSelector"

interface AppointmentSummaryProps {
    selectedDate: string
    selectedTime: string
    formData: FormData
    onSubmit: () => void
    isFormValid: boolean
    residentOptions: Resident[];
}

const AppointmentSummary = ({
    selectedDate,
    selectedTime,
    formData,
    onSubmit,
    isFormValid,
    residentOptions,
}: AppointmentSummaryProps) => {
    if (!selectedDate || !selectedTime || !formData.resident) {
        return null
    }

    const selectedResidentObject = residentOptions.find(
        (r) => r.value === formData.resident
    );

    const parts = selectedDate.split('-').map(part => parseInt(part, 10));
    const correctedDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const displayDate = correctedDate.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <>
            <div className="card shadow-sm border-dark-subtle">
                <div className="card-header bg-dark text-white">
                    <h5 className="card-title mb-0">Resumen de la Cita</h5>
                </div>
                <div className="card-body">
                    <div className="d-flex flex-wrap gap-2 mb-4">
                        <span className="badge bg-primary fs-6">
                            <i className="bi bi-person-fill me-1"></i>
                            {selectedResidentObject?.label}
                        </span>
                        <span className="badge fs-6" style={{background: '#202042'}}>
                            <i className="bi bi-calendar-event-fill me-1"></i>
                            {new Date(selectedDate).toLocaleDateString("es-ES", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                            })}
                        </span>
                        <span className="badge fs-6" style={{background: '#422C20'}}>
                            <i className="bi bi-clock-fill me-1"></i>
                            {selectedTime}
                        </span>
                        {formData.relationship && (
                            <span className="badge text-dark fs-6" style={{background: '#A8C3A0'}}>
                                <i className="bi bi-people-fill me-1"></i>
                                {formData.relationship}
                            </span>
                        )}
                    </div>

                    <button type="button" className="btn btn-success btn-lg w-100" disabled={!isFormValid} onClick={onSubmit}>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Confirmar Cita
                    </button>
                    {!isFormValid && <p className="text-muted small mt-2 mb-0">Complete todos los campos</p>}
                </div>
            </div>
        </>
    )
}
export default AppointmentSummary;