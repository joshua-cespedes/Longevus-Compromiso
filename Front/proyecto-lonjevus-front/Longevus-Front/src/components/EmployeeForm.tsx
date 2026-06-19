import { useState, type ChangeEvent } from'react';
import Footer  from './Footer';
import HourSelector  from './HourSelector';
import DaySelector from './DaySelector';
import type { IShift } from './HourSelector';
import ShiftTypeSelector from './ShiftTypeSelector';
import { useAuth } from '../context/AuthContext';
import { errorAlert} from '../js/alerts';
export interface EmployeeFormData {
    name: string;
    identification: string;
    email: string;
    password: string; 
    photo: File | null;
    salary: string;
    selectedDays: string[];
    workSchedule: IShift[];
    selectedShifts: string[];
    scheduleId?: number;
    officeContact?: string;
}
export interface EmployeeInitialData{
    id?: string,
    name: string,
    identification: string,
    email: string,
    photoURL?: string,
    salary: number | string,
    selectedDays: string [];
    workSchedule: IShift[];
    selectedShifts?: string [];
    officeContact?: string;
    scheduleId?: number;
}

interface EmployeeFormProps{
    initialData?: EmployeeInitialData,
    onSubmit: (data: EmployeeFormData, employeeId?: string)=>void;
    onCancel: ()=> void;
    showShiftSelector?: boolean;
    showHourSelector?: boolean;
    showOfficeContactField?: boolean;
    showDaySelector?: boolean;
}

const EmployeeForm = ({initialData, onSubmit, onCancel, showShiftSelector = false,
    showHourSelector = false,showOfficeContactField = false,
    showDaySelector = false}: EmployeeFormProps) => {
      
    const {hasAuthority} = useAuth();
    const [formData, setFormData] = useState<EmployeeFormData>(()=>{
        if(initialData){
            return{
                name: initialData.name || "",
                identification: initialData.identification || "",
                email: initialData.email || "",
                password: "", 
                photo: null, 
                salary: String(initialData.salary) || "", 
                selectedDays: initialData.selectedDays || [],
                workSchedule: initialData.workSchedule && initialData.workSchedule.length > 0
                    ? initialData.workSchedule.map((shift, index) => ({ 
                        ...shift,
                        id: `${initialData.scheduleId ?? 'sched'}-${index}`
                      }))
                    : [{ id: crypto.randomUUID(), entryTime: "", exitTime: "" }], 
                selectedShifts: initialData.selectedShifts || [], officeContact:initialData.officeContact || "",
            };
        }else{
            return{
                name: "",
                identification: "",
                email: "",
                password: "",
                photo: null as File | null,
                salary: "" as string,
                selectedDays: [] as string[], 
                workSchedule: [{ id: crypto.randomUUID(), entryTime: "", exitTime: "" }] as IShift[], 
                selectedShifts: [] as string[]
            }
        }
    });
    const isEditing = !!initialData;
    const formTitle = isEditing ? "Editar Personal " : "Agregar Personal ";
    const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData | 'form', string>>>({});

    const validateField = (name: string, value: any) => {
        let errorMsg = "";
        switch (name) {
            case 'name':
                if (!value) errorMsg = "El nombre es requerido.";
                else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) errorMsg = "El nombre solo puede contener letras y espacios.";
                break;
            case 'identification':
                if (!value) errorMsg = "La identificación es requerida.";
                else if (!/^\d{9,12}$/.test(value)) errorMsg = "La identificación debe tener entre 9 y 12 dígitos.";
                break;
            case 'email':
                if (!value) errorMsg = "El correo es requerido.";
                else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = "El formato del correo no es válido.";
                break;
            case 'password':
                if (!isEditing && (!value || value.length < 6)) {
                    errorMsg = "La contraseña es requerida y debe tener al menos 6 caracteres.";
                }
                break;
            case 'salary':
                if (!value) errorMsg = "El salario es requerido.";
                else if (isNaN(Number(value)) || Number(value) <= 0) errorMsg = "El salario debe ser un número positivo.";
                break;
            case 'photo':
                if (!isEditing && !value) {
                    errorMsg = "La fotografía es requerida.";
                }
                break;
        }
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleForm = (e: ChangeEvent<HTMLInputElement>) =>  {
        const { name, value, type, files } = e.target;
        const fieldValue = type === 'file' && files ? files[0] : value;
        if (type === 'file' && files) {
            setFormData(prevForm => ({
                ...prevForm,
                [name]: files[0],
            }));
        } else {
            setFormData(prevForm => ({
                ...prevForm,
                [name]: value,
            }));
        }
        validateField(name, fieldValue);
    };

   
    const handleDayChange = (dayLetter: string, isChecked: boolean) => {
        setFormData(prevForm => {
            const currentShift = prevForm.selectedDays;
            if (isChecked) {
                return { ...prevForm, selectedDays: [...currentShift, dayLetter] };
            } else {
                return { ...prevForm, selectedDays: currentShift.filter(d => d !== dayLetter) };
            }
        });
    };
    const handleShiftTypeChange = (shift: string, isChecked: boolean) => {
        setFormData(prevForm => {
            const currentDays = prevForm.selectedShifts;
            if (isChecked) {
                return { ...prevForm, selectedShifts: [...currentDays, shift] };
            } else {
                return { ...prevForm, selectedShifts: currentDays.filter(d => d !== shift) };
            }
        });
    };

    const handleWorkScheduleChange = (index: number, field: 'entryTime' | 'exitTime', value: string) => {
        setFormData(prevForm => ({
            ...prevForm,
            workSchedule: prevForm.workSchedule.map((shift, i) =>
                i === index ? { ...shift, [field]: value } : shift
            ),
        }));
    };

    
    const addCommonShift = () => {
        setFormData(prevForm => ({
            ...prevForm,
            workSchedule: [...prevForm.workSchedule, { id: crypto.randomUUID(), entryTime: "", exitTime: "" } as IShift],
        }));
    };

    
    const removeCommonShift = (idToRemove: string) => {
        setFormData(prevForm => ({
            ...prevForm,
            workSchedule: prevForm.workSchedule.filter(shift => shift.id !== idToRemove),
        }));
    };

const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof EmployeeFormData | 'form', string>> = {};
        
        // Validaciones de campos de texto
        if (!formData.name) newErrors.name = "El nombre es requerido.";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name)) newErrors.name = "El nombre solo puede contener letras y espacios.";
        
        if (!formData.identification) newErrors.identification = "La identificación es requerida.";
        else if (!/^\d{9,12}$/.test(formData.identification)) newErrors.identification = "La identificación debe tener entre 9 y 12 dígitos.";

        if (!formData.email) newErrors.email = "El correo es requerido.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "El formato del correo no es válido.";
        
        if (!isEditing && (!formData.password || formData.password.length < 6)) newErrors.password = "La contraseña es requerida y debe tener al menos 6 caracteres.";
        
        if (!formData.salary) newErrors.salary = "El salario es requerido.";
        else if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) newErrors.salary = "El salario debe ser un número positivo.";
        
        if (!isEditing && !formData.photo) newErrors.photo = "La fotografía es requerida.";

        // Validaciones de selectores condicionales
        if (showDaySelector && formData.selectedDays.length === 0) newErrors.selectedDays = "Debe seleccionar al menos un día de trabajo.";
        if (showShiftSelector && formData.selectedShifts.length === 0) newErrors.selectedShifts = "Debe seleccionar al menos un tipo de turno.";

        if (showHourSelector) {
            for (const shift of formData.workSchedule) {
                if (!shift.entryTime || !shift.exitTime) {
                    newErrors.workSchedule = "Debe completar todas las horas de entrada y salida.";
                    break;
                }
                if (shift.entryTime >= shift.exitTime) {
                     newErrors.workSchedule = "La hora de salida debe ser posterior a la de entrada.";
                    break;
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            errorAlert("Por favor, corrija los errores en el formulario antes de guardar.");
            return;
        }

        const finalFormData = {
            ...formData,
            scheduleId: initialData?.scheduleId ?? formData.scheduleId,
        };

        onSubmit(finalFormData, initialData?.id);
        console.log("Form Data Submitted:", JSON.stringify(finalFormData, null, 2));
    };
      const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['e','E','+','-'].includes(e.key)) {e.preventDefault();}
  };


    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-12'>
                    <h1>
                        {isEditing ? <i className="bi bi-pencil-square"></i> : <i className="bi bi-person-plus-fill"></i>}
                        {formTitle}
                    </h1>
                    <form onSubmit={handleSubmit} noValidate> 
                        <div className='mb-3'>
                            <label htmlFor='nameInput' className='form-label'><i className="bi bi-person-fill"></i> Nombre:</label>
                            <input type='text' name='name' id='nameInput' onChange={handleForm} value={formData.name} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='identificationInput'><i className="bi bi-person-vcard-fill"></i> Identificación:</label>
                            <input type='text' name='identification' id='identificationInput' onChange={handleForm} value={formData.identification} className={`form-control ${errors.identification ? 'is-invalid' : ''}`} />
                            {errors.identification && <div className="invalid-feedback">{errors.identification}</div>}
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='emailInput'><i className="bi bi-envelope-fill"></i> Correo:</label>
                            <input type='email' name='email' id='emailInput' onChange={handleForm} value={formData.email} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        {!isEditing && (
                            <div className='mb-3'>
                                <label htmlFor='passwordInput'><i className="bi bi-key-fill"></i> Contraseña:</label>
                                <input type='password' name='password' id='passwordInput' onChange={handleForm} value={formData.password} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                        )}

                        <div className='mb-3'>
                            <label htmlFor='photoInput'><i className="bi bi-images"></i> Fotografía:</label>
                            <input type='file' name='photo' id='photoInput' onChange={handleForm} className={`form-control ${errors.photo ? 'is-invalid' : ''}`} accept="image/*" />
                            {errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='salaryInput'>Sueldo:</label>
                            <input type='number' name='salary' id='salaryInput' onChange={handleForm} value={formData.salary} className={`form-control ${errors.salary ? 'is-invalid' : ''}`} onKeyDown={handlePriceKeyDown} />
                            {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
                        </div>
                        
                        {/* Componentes selectores con sus validaciones */}
                        {showShiftSelector && (
                            <>
                                <ShiftTypeSelector
                                    selectedShiftTypes={formData.selectedShifts}
                                    onShiftTypeChange={handleShiftTypeChange}
                                />
                                {errors.selectedShifts && <div className="text-danger small mt-1">{errors.selectedShifts}</div>}
                            </>
                        )}
                        
                        {showDaySelector && (
                             <>
                                <DaySelector
                                    selectedDays={formData.selectedDays}
                                    onDayChange={handleDayChange}
                                />
                                {errors.selectedDays && <div className="text-danger small mt-1">{errors.selectedDays}</div>}
                             </>
                        )}

                        {showHourSelector && (
                            <>
                                <HourSelector
                                    shifts={formData.workSchedule}
                                    onUpdateShift={handleWorkScheduleChange}
                                    onAddShift={addCommonShift}
                                    onRemoveShift={removeCommonShift}
                                />
                                {errors.workSchedule && <div className="text-danger small mt-1">{errors.workSchedule}</div>}
                            </>
                        )}
                        
                        {showOfficeContactField && (
                            <div className='mb-3'>
                                <label htmlFor='officeContact'>Contacto de oficina: <i className="bi bi-telephone-fill"></i></label>
                                <input type='tel' name='officeContact' id='officeContact' onChange={handleForm} value={formData.officeContact || ''} className='form-control' />
                            </div>
                        )}
                        
                        <div className='mb-3'>
                            <button type="button" className='btn btn-secondary me-2' onClick={onCancel}>Volver</button>
                            
                            {(hasAuthority('PERMISSION_ADMINISTRADORES_VIEW') || hasAuthority('PERMISSION_CUIDADORES_VIEW')) && (
                                <input type='submit' value={"Guardar"} className='btn btn-primary ' />
                            )}
                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeForm;