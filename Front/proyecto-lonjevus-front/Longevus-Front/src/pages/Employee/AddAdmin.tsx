import EmployeeForm from '../../components/EmployeeForm';
import type { EmployeeFormData } from '../../components/EmployeeForm';
import { createAdmin } from '../../services/AdminService';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/HeaderAdmin';
import Footer  from '../../components/Footer';
import { errorAlert, succesAlert, confirmEditAlert } from '../../js/alerts';
const AddAdmin = ()=>{
    const navigate = useNavigate();
    const handleFormSubmit = async  (formData: EmployeeFormData) => {
        console.log("Datos para crear nuevo empleado:", formData);
        try{
            await createAdmin(formData);
            succesAlert("Amin registrado","Administrador creado exitosamente!"); 
            navigate('/perfil');
        }catch(error){
            errorAlert("Error al crear admin");
        }
    };
    const handleCancel = () => {
        console.log("Operación de añadir cancelada");
        navigate('/perfil');
    };

    return(
        <>
            {/* <Header/> */}
            <EmployeeForm       
            onSubmit={handleFormSubmit} 
            onCancel={handleCancel}
            showShiftSelector={false}
            showDaySelector={true}
            showHourSelector={true}
            showOfficeContactField={true}
            /> 
            {/* <Footer />   */}
        </>
        
    )

}
export default AddAdmin;