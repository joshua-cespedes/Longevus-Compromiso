
export interface DateOption {
    value: string
    label: string
}

export const generateDates = (): DateOption[] => {
    const dates = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = 1; i <= 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        dates.push({
            value: date.toISOString().split("T")[0],
            label: date.toLocaleDateString("es-ES", {
                weekday: "short",
                day: "numeric",
                month: "short",
            }),
        })
    }
    return dates
}

interface DateSelectorProps {
    selectedDate: string
    selectedResident: string
    onDateChange: (date: string) => void
}

const DateSelector = ({ selectedResident,selectedDate, onDateChange }: DateSelectorProps) => {
    const dates = generateDates()

    return (
        <>
            <div className="card shadow-sm border-dark-subtle">
                <div className="card-header  text-white" style={{background: '#202042'}}>
                    <h5 className="card-title mb-0">
                        <i className="bi bi-calendar-event-fill me-2"></i>
                        Seleccionar Fecha
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-2">
                        {dates.map((date) => (
                            <div key={date.value} className="col-6">
                                <button
                                    type="button"
                                    className={`btn w-100 ${selectedDate === date.value ? "btn-date-selected" : "btn-date-outline"}`}
                                    onClick={() => onDateChange(date.value)}
                                    disabled={!selectedResident}
                                >
                                    <div className="text-center">
                                        <div >{date.label}</div>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                    {!selectedResident && <p className="text-muted small mt-2 mb-0">Primero selecciona un Residente</p>}
                </div>
            </div>
        </>
    )
}
export default DateSelector;