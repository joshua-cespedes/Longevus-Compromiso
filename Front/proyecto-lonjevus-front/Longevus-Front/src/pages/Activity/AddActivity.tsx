import AddActivtyForm from "../../components/ActivityForm";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { type Activity, createActivity } from "../../services/ActivityService";
import { useNavigate } from "react-router-dom";
import { succesAlert, errorAlert } from "../../js/alerts";
import { Link } from "react-router-dom";

const AddActivity: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateActivity = (data: Activity) => {
        createActivity(data)
            .then(() => {
                succesAlert('Agregada', 'La actividad ha sido agregada con éxito');
                navigate("/actividades/mostrar");
            })
            .catch((error) => {
                errorAlert('Error al crear la actividad')
                console.error("Error al crear la actividad", error);
            });
    }

    return (
        <>
            {/* <Header /> */}
            <div className="container">
                <div className="row">
                    <div className=" border-primary">
                        <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                            <h1 className="fw-bold text-uppercase">Agregar Actividad</h1>
                        </div>
                        <AddActivtyForm onSubmit={handleCreateActivity} />              
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
}

export default AddActivity;