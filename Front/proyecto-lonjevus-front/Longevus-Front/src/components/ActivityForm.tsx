import { useEffect, useState } from "react";
import type { Activity } from "../services/ActivityService";
import { getAllCaregivers, type CaregiverApiResponse } from "../services/CaregiverService";
import { errorAlert } from "../js/alerts";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
interface ActivityProps {
    onSubmit: (data: Activity) => void;
    initialData?: Activity;
}

const ActivityForm: React.FC<ActivityProps> = ({ onSubmit, initialData }) => {
    const [data, setData] = useState<Activity>(
        initialData !== null && initialData !== undefined ? initialData : {
            id: 0,
            name: '',
            description: '',
            type: '',
            date: '',
            startTime: '',
            endTime: '',
            location: '',
            status: '',
            caregiverId: 0
        });

    const isEditing = !!initialData;
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { hasAuthority } = useAuth();
    useEffect(() => {
        if (initialData) {
            console.log("Cargando initialData en form:", initialData);
            setData({
                ...initialData,
                caregiverId: initialData.caregiver?.id ?? 0
            });
        }
    }, [initialData]);

    const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const target = e.target as HTMLInputElement;
        const { name, type, value } = target;

        let isValid = true;

        switch (type) {
            case "text":
                isValid = value.trim() !== "";
                break;

            case "date":
                isValid = value !== "";
                break;

            case "select":
                isValid = value !== "";
                break;

            default:
                isValid = true;
        }

        if (errors[name] && isValid) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        if ((name === "name" || name === "description") && value !== "" && value.trim() === "") {
            return;
        }
        setData(prev => ({
            ...prev, //version anterior del form
            [name]: type === 'number' ? Number(value) : value,
        }))
    };



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        if (!data.name || data.name.trim() === "") {
            newErrors.name = "El nombre es obligatorio";
        }

        if (!data.description || data.description.trim() === "") {
            newErrors.description = "La descripción es obligatoria";
        }

        if (!data.type) {
            newErrors.type = "Debe ingresar el tipo de la actividad";
        }

        if (!data.date) {
            newErrors.date = "Debe seleccionar una fecha";
        }

        if (!data.startTime) {
            newErrors.startTime = "Debe seleccionar una hora de inicio";
        }

        if (!data.endTime) {
            newErrors.endTime = "Debe seleccionar una hora de fin";
        }

        if (!data.location) {
            newErrors.location = "Debe seleccionar una localización";
        }

        if (!data.status) {
            newErrors.status = "Debe seleccionar el estado de la actividad";
        }

        if (!data.caregiverId) {
            newErrors.caregiverId = "Debe seleccionar un encargado";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(data);
        console.log(data);
    };

    const [caregivers, setCaregivers] = useState<CaregiverApiResponse[]>([]);

    useEffect(() => {
        getAllCaregivers()
            .then(res => setCaregivers(res))
            .catch(err => console.error("Error al obtener cuidadores", err));

    }, []);

    const getNext30Min = (time: string): string => {
        const [hour, minute] = time.split(":").map(Number);
        let newHour = hour;
        let newMinute = minute + 30;

        if (newMinute >= 60) {
            newMinute = 0;
            newHour += 1;
        }

        if (newHour > 22) {
            return "22:00";
        }

        return `${newHour.toString().padStart(2, "0")}:${newMinute
            .toString()
            .padStart(2, "0")}`;
    };

    const generateTimeOptions = (start: string, end: string): string[] => {
        const options: string[] = [];
        let [hour, minute] = start.split(":").map(Number);
        const [endHour, endMinute] = end.split(":").map(Number);

        while (hour < endHour || (hour === endHour && minute <= endMinute)) {
            const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
            options.push(time);

            minute += 30;
            if (minute >= 60) {
                minute = 0;
                hour++;
            }
        }

        return options;
    };


    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded">

            <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleForm}
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}

            </div>

            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                    type="text"
                    name="description"
                    value={data.description}
                    onChange={handleForm}
                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}

            </div>

            <div className="mb-3">
                <label className="form-label">Tipo</label>
                <select name="type" value={data.type}
                    onChange={handleForm} className={`form-select ${errors.type ? "is-invalid" : ""}`}>
                    <option value="">Seleccione un tipo</option>
                    <option value="Recreativa">Cognitiva</option>
                    <option value="Física">Física</option>
                    <option value="Educativa">Educativa</option>
                    <option value="Médica">Médica</option>
                    <option value="Social">Social</option>
                </select>
                {errors.type && <div className="invalid-feedback">{errors.type}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Fecha</label>
                <input
                    type="date"
                    name="date"
                    value={data.date}
                    onChange={handleForm}
                    className={`form-control ${errors.date ? "is-invalid" : ""}`}
                />
                {errors.date && <div className="invalid-feedback">{errors.date}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Hora de inicio</label>
                <select
                    name="startTime"
                    value={data.startTime}
                    onChange={handleForm}
                    className={`form-select ${errors.startTime ? "is-invalid" : ""}`}
                >
                    <option value="">Selecciona una hora</option>
                    {generateTimeOptions("07:00", "21:30").map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
                {errors.startTime && <div className="invalid-feedback">{errors.startTime}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Hora de fin</label>
                <select
                    name="endTime"
                    value={data.endTime}
                    onChange={handleForm}
                    className={`form-select ${errors.endTime ? "is-invalid" : ""}`}
                    disabled={!data.startTime}
                >
                    <option value="">Selecciona una hora</option>
                    {data.startTime &&
                        generateTimeOptions(getNext30Min(data.startTime), "22:00").map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                </select>
                {errors.endTime && <div className="invalid-feedback">{errors.endTime}</div>}
            </div>


            <div className="mb-3">
                <label className="form-label">Localización</label>
                <input
                    type="text"
                    name="location"
                    value={data.location}
                    onChange={handleForm}
                    className={`form-control ${errors.location ? "is-invalid" : ""}`}
                />
                {errors.location && <div className="invalid-feedback">{errors.location}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Estado</label>
                <select
                    name="status"
                    value={data.status}
                    onChange={handleForm}
                    className={`form-select ${errors.status ? "is-invalid" : ""}`}
                >
                    <option value="">Seleccione el estado de la actividad</option>
                    <option value="Pendiente">Pendiente</option>
                    <option
                        value="En progreso"
                        disabled={
                            (() => {
                                const selectedDateValue = data.date;
                                if (!selectedDateValue) {
                                    return false;
                                }

                                const selectedDate = new Date(selectedDateValue + 'T00:00:00Z');

                                const today = new Date();
                                const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

                                const isDisabled = selectedDate.getTime() !== todayUTC.getTime();

                                return isDisabled;
                            })()
                        }
                    >
                        En progreso
                    </option>
                    <option value="Finalizada">Finalizada</option>
                </select>
                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
            </div>


            <div className="mb-3">
                <label className="form-label">Encargado(a)</label>
                <select name="caregiverId" value={data.caregiverId} onChange={handleForm}
                    className={`form-select ${errors.caregiverId ? "is-invalid" : ""}`}>
                    <option value="">Seleccione el encargado</option>
                    {caregivers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                {errors.caregiverId && <div className="invalid-feedback">{errors.caregiverId}</div>}
            </div>

            <div className="mt-3 d-flex gap-2  gap-2">
                <Link className='btn btn-secondary float-end' to="/actividades/mostrar">Volver</Link>
                {hasAuthority('PERMISSION_ACTIVIDADES_CREATE') && (
                    <button type="submit" className="btn btn-primary float-end float-end">Guardar</button>
                )}
            </div>
        </form>
    );
};

export default ActivityForm;