import { type ChangeEvent } from 'react';

interface DaySelectorProps {
    selectedDays: string[];
    onDayChange: (day: string, isChecked: boolean) => void;
}

const DaySelector = ({ selectedDays, onDayChange }: DaySelectorProps) => {

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        onDayChange(value, checked);
    };

    return (
        <div className='mb-3'>
            <h6>Días de Trabajo: <i className="bi bi-calendar-week-fill"></i></h6>
            <div className="d-flex flex-wrap gap-3">
                {['L', 'K', 'M', 'J', 'V', 'S', 'D'].map(dayLetter => (
                    <div className="form-check form-check-inline" key={dayLetter}>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`day-${dayLetter}`}
                            value={dayLetter}
                            onChange={handleCheckboxChange}
                            checked={selectedDays.includes(dayLetter)}
                        />
                        <label className="form-check-label" htmlFor={`day-${dayLetter}`}>
                            {dayLetter}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DaySelector;