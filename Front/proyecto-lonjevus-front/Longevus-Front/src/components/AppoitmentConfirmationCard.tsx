import type { Resident } from "./AppoitmentResidentSelector"
import type { FormData } from "./VisitorForms"
import Header from "./Header"
import Footer from "./Footer"
import { Link } from "react-router-dom"
interface ConfirmationScreenProps {
    selectedDate: string
    selectedTime: string
    formData: FormData
    onNewAppointment: () => void
    residentOptions: Resident[];
}

const ConfirmationScreen = ({
    selectedDate,
    selectedTime,
    formData,
    onNewAppointment,
    residentOptions
}: ConfirmationScreenProps) => {
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
            {/* <Header/> */}
            <div className="min-vh-100">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card shadow-lg border-dark-subtle">
                                <div className="card-body text-center p-5">
                                    <div className="mb-4">
                                        <div
                                            className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center"
                                            style={{ width: "80px", height: "80px" }}
                                        >
                                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "2.5rem" }}></i>
                                        </div>
                                    </div>
                                    <h2 className="text-success mb-3">¡Visita Agendada!</h2>
                                    <p className="text-muted mb-4">Tu cita ha sido programada exitosamente</p>

                                    <div className="bg-light p-4 rounded mb-4">
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-person-fill  me-2"></i>
                                                    <strong>Residente:</strong>
                                                    <span className="ms-2">{selectedResidentObject?.label}</span>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-calendar-fill  me-2"></i>
                                                    <strong>Fecha:</strong>
                                                    <span className="ms-2">
                                                        {displayDate}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-clock-fill me-2"></i>
                                                    <strong>Hora:</strong>
                                                    <span className="ms-2">{selectedTime}</span>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-person-badge-fill  me-2"></i>
                                                    <strong>Visitante:</strong>
                                                    <span className="ms-2">{formData.name}</span>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-people-fill  me-2"></i>
                                                    <strong>Parentesco:</strong>
                                                    <span className="ms-2">{formData.relationship}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-muted small mb-4">Recibirás un email de confirmación en {formData.email}</p>

                                    <button className="btn btn-outline-primary me-2" onClick={onNewAppointment}>
                                        Agendar Nueva Visita
                                    </button>
                                    <Link  className="btn btn-outline-secondary" to={'../'} >Volver</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer/> */}
        </>
    )
}
export default ConfirmationScreen;