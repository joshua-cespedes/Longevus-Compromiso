export interface FormData {
    resident: string
    name: string
    email: string
    phone: string
    relationship: string
}

interface VisitorFormProps {
    formData: FormData
    onInputChange: (field: keyof FormData, value: string) => void
}

const VisitorForm = ({ formData, onInputChange }: VisitorFormProps) => {
    return (
        <>
            <div className="card shadow-sm border-dark-subtle">
                <div className="card-header  text-dark" style={{background: '#A8C3A0'}}>
                    <h5 className="card-title mb-0">
                        <i className="bi bi-person-badge-fill me-2"></i>
                        Información del Visitante
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label fw-bold">
                                Nombre Completo *
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Tu nombre completo"
                                value={formData.name}
                                onChange={(e) => onInputChange("name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label fw-bold">
                                Email *
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="usuario@email.com"
                                value={formData.email}
                                onChange={(e) => onInputChange("email", e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="phone" className="form-label fw-bold">
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                placeholder="8888 8888"
                                value={formData.phone}
                                onChange={(e) => onInputChange("phone", e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="relationship" className="form-label fw-bold">
                                Parentesco *
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="relationship"
                                placeholder="Ej: Hermano, Hijo(a), Amigo..."
                                value={formData.relationship}
                                onChange={(e) => onInputChange("relationship", e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default VisitorForm;