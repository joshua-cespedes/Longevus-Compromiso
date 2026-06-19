import EmployeeForm from '../../components/EmployeeForm';
import type { EmployeeFormData } from '../../components/EmployeeForm';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/HeaderAdmin';
import { useState } from 'react';
import { createCaregiver } from '../../services/CaregiverService';
import Footer from '../../components/Footer';
import { succesAlert, errorAlert } from '../../js/alerts';
const AddEmployee = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormSubmit = async (formData: EmployeeFormData) => {
        console.log("Datos para crear nuevo empleado:", formData);
        setIsLoading(true);
        setError(null);

        try {
            const response = await createCaregiver(formData);

            console.log("Empleado creado exitosamente:", response);
            succesAlert("Nuevo empleado","Empleado agregado exitosamente!");
            navigate('/empleado/mostrar');

        } catch (err: any) {
            console.error("Error al crear el empleado:", err);
            setError(err.response?.data?.message || err.message || "Ocurrió un error desconocido al crear el empleado.");
            errorAlert("Error al intentar crear el empleado");
        } finally {
            setIsLoading(false);
        }
    };

    // Función para manejar la cancelación (Volver)
    const handleCancel = () => {
        console.log("Operación de añadir cancelada");
        navigate('/empleado/mostrar');
    };

    return (
        <>
            {/* <Header /> */}
            <div className="container mt-4">

                {isLoading && (
                    <div className="alert alert-info" role="alert">
                        Guardando empleado...
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}
                <EmployeeForm
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    showShiftSelector={true}
                    showDaySelector={true}
                    showHourSelector={true}
                    showOfficeContactField={false} />
            </div>
            {/* <Footer /> */}
        </>

    )
}

export default AddEmployee