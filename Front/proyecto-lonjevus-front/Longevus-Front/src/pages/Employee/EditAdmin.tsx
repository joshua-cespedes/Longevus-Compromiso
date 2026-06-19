import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeForm from '../../components/EmployeeForm';
import type { EmployeeFormData, EmployeeInitialData } from '../../components/EmployeeForm';
import { getAdminById, updateAdmin } from '../../services/AdminService';
import { errorAlert, succesAlert, confirmEditAlert } from '../../js/alerts';


const EditAdmin = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState<EmployeeInitialData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {

            getAdminById(id)
                .then(data => {
                    if (data) {
                        const initialData: EmployeeInitialData = {
                            id: id,
                            name: data.name,
                            identification: data.identification,
                            email: data.email,
                            photoURL: data.photoUrl || "",
                            salary: data.salary,
                            selectedDays: data.schedule?.days ? data.schedule.days.split(',') : [],
                            workSchedule: [
                                {
                                    id: data.schedule?.id,
                                    entryTime: data.schedule?.entryTime1 || "",
                                    exitTime: data.schedule?.exitTime1 || ""
                                }
                            ],

                            officeContact: data.officeContact || "",
                            scheduleId: data.schedule?.id || undefined

                        };
                        console.log("ID recibido para edición:", initialData?.scheduleId);

                        if (data.schedule?.entryTime2 && data.schedule?.exitTime2) {
                            initialData.workSchedule.push({

                                id: data.schedule?.id,
                                entryTime: data.schedule.entryTime2,
                                exitTime: data.schedule.exitTime2
                            });
                        }

                        setEmployeeData(initialData);
                    } else {
                        setError("Administrador no encontrado");
                        errorAlert("Administrador no encontrado")
                        
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error loading admin:", err);
                    setError("Error al cargar los datos del administrador.");
                    errorAlert('Error al cargar los datos del administrador')
                    setLoading(false);
                });
        } else {
            setError("ID de administrador no proporcionado en la URL.");
            errorAlert("ID de administrador no proporcionado en la URL.")
            setLoading(false);
        }
    }, [id]);

    const handleFormSubmit = async (formData: EmployeeFormData) => {
        if (!id) {
            errorAlert("Intentando actualizar sin ID de administrador.");
            return;
        }

        try {
            
            await updateAdmin(id, formData);
            succesAlert("Datos actualizados","Administrador actualizado exitosamente!");
            navigate('/roles_permisos');
        } catch (error) {
            errorAlert("Error al actualizar administrador, intente nuevamente");
            
        }
    };
    const handleCancel = () => {
        console.log("Operación de edición cancelada");
        navigate('/roles_permisos');
    };
        if (loading) {
            return <div className="container mt-5">Cargando...</div>;
        }

        if (error) {
            return <div className="container mt-5 text-danger">Error: {error}</div>;
        }

        if (!employeeData) {
            return <div className="container mt-5">No se encontraron datos para editar.</div>;
        }
        const contactfieldVisible = true;
        const daySelectorVisible = true;
        const hourSelectorVisible = true;
    

        return (
            <>

                <EmployeeForm
                    initialData={employeeData}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    showShiftSelector={false}
                    showDaySelector={daySelectorVisible}
                    showHourSelector={hourSelectorVisible}
                    showOfficeContactField={contactfieldVisible}
                />
            </>
        );

};

    export default EditAdmin