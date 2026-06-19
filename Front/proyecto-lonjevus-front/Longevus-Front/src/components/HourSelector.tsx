import { type ChangeEvent } from 'react';

 export interface IShift {
    id: string;
    entryTime: string;
    exitTime: string;
}
interface IDayScheduleEditorProps {
    shifts: IShift[]; 
    onUpdateShift: (index: number, field: 'entryTime' | 'exitTime', value: string) => void; 
    onAddShift: () => void; 
    onRemoveShift: (id: string) => void; 
}


const HourSelector = ({ shifts, onUpdateShift, onAddShift, onRemoveShift }: IDayScheduleEditorProps) => {

    return (
        <div className='mb-3 border p-3 rounded bg-light'> 
            <h4 className="mb-3"><i className="bi bi-clock-fill"></i>Definir Horario </h4>
            {shifts.map((shift, index) => (
                <div key={shift.id} className="border p-3 mb-3 rounded bg-light">
                    <h6 className="mb-3 d-block">Turno {index + 1}</h6>
                    <div className="row g-3">
                        <div className="col-sm-6">
                            <label htmlFor={`entryTime-${shift.id}`} className="form-label">Hora Entrada:</label>
                            <input
                                type='time'
                                name='entryTime'
                                id={`entryTime-${shift.id}`}
                                value={shift.entryTime}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateShift(index, 'entryTime', e.target.value)}
                                className='form-control'
                                required
                            />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor={`exitTime-${shift.id}`} className="form-label">Hora Salida:</label>
                            <input
                                type='time'
                                name='exitTime'
                                id={`exitTime-${shift.id}`}
                                value={shift.exitTime}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateShift(index, 'exitTime', e.target.value)}
                                className='form-control'
                                required
                            />
                        </div>
                    </div>                   
                    {shifts.length > 1 && (
                        <button
                            type="button"
                            className="btn btn-danger btn-sm mt-3"
                            onClick={() => onRemoveShift(shift.id)}
                        >
                            Eliminar Turno
                        </button>
                    )}
                </div>
            ))}
            {shifts.length<2 &&(
            <button type="button" className="btn btn-success btn-sm" onClick={onAddShift}>
                Agregar Otro Turno
            </button>
            )}
        </div>
    );
};

export default HourSelector;