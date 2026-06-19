
export const TIME_SLOTS = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00"
]

interface TimeSelectorProps {
    selectedTime: string
    selectedDate: string
    onTimeChange: (time: string) => void
}

const TimeSelector = ({ selectedTime, selectedDate, onTimeChange }: TimeSelectorProps) => {
    return (
        <>
            <div className="card shadow-sm border-dark-subtle">
                <div className="card-header text-white" style={{background: '#422C20'}}>
                    <h5 className="card-title mb-0">
                        <i className="bi bi-clock-fill me-2"></i>
                        Seleccionar Hora
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-2">
                        {TIME_SLOTS.map((time) => (
                            <div key={time} className="col-4">
                                <button
                                    type="button"
                                    className={`btn btn-sm w-100 ${selectedTime === time ? "btn-time-selected" : "btn-time-outline"}`}
                                    onClick={() => onTimeChange(time)}
                                    disabled={!selectedDate}
                                >
                                    {time}
                                </button>
                            </div>
                        ))}
                    </div>
                    {!selectedDate && <p className="text-muted small mt-2 mb-0">Primero selecciona una fecha</p>}
                </div>
            </div>
        </>
    )
}
export default TimeSelector;
