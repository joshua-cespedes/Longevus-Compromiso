import {type ChangeEvent} from 'react';


interface IShiftType{
    selectedShiftTypes: string[];
    onShiftTypeChange: (type: string, isChecked: boolean) => void; 
}

const ShiftTypeSelector = ({ selectedShiftTypes, onShiftTypeChange }: IShiftType) => {

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;      
        if (value === 'M' || value === 'T' || value === 'N') {
            onShiftTypeChange(value as string, checked);
        }
    };



    return (
        <div className='mb-3'>
            <h6><i className="bi bi-calendar-week-fill">Tipo de Turno</i></h6> 
            <div className="d-flex flex-wrap gap-3">
                {['M', 'T', 'N'].map(type => (
                    <div className="form-check form-check-inline" key={type}>
                        <input
                            className="form-check-input"
                            type="checkbox" 
                            id={`shift-type-${type}`}
                            value={type}
                            onChange={handleCheckboxChange}
                            checked={selectedShiftTypes.includes(type)} 
                        />
                        <label className="form-check-label" htmlFor={`shift-type-${type}`}>
                            {type} 
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShiftTypeSelector;