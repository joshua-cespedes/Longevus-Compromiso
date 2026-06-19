import {type ChangeEvent} from 'react';


interface ShiftType{
    selectedShiftTypes: String[];
    onShiftTypeChange: (type: String, isChecked: boolean) => void; 
}

const ShiftTypeSelector = ({ selectedShiftTypes, onShiftTypeChange }: ShiftType) => {

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        // Asegurarse de que el valor sea uno de los tipos esperados
        if (value === 'M' || value === 'T' || value === 'N') {
            onShiftTypeChange(value as String, checked);
        }
    };



    return (
        <div className='mb-3'>
            <h6>Tipo de Turno <i className="bi bi-calendar-week-fill"></i></h6> {/* Icono similar o ajustar */}
            <div className="d-flex flex-wrap gap-3">
                {['M', 'T', 'N'].map(type => (
                    <div className="form-check form-check-inline" key={type}>
                        <input
                            className="form-check-input"
                            type="checkbox" // Usamos checkbox para selección múltiple
                            id={`shift-type-${type}`}
                            value={type}
                            onChange={handleCheckboxChange}
                            checked={selectedShiftTypes.includes(type)} 
                        />
                        <label className="form-check-label" htmlFor={`shift-type-${type}`}>
                            {type} {/* Muestra M, T, o N */}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShiftTypeSelector;