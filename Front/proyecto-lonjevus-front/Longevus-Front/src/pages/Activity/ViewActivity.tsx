import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { type Activity, getActivityById, getResidentsByActivityId } from "../../services/ActivityService";
import { type Resident } from "../../services/ResidentService";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const ViewActivity: React.FC = () => {
    const { id } = useParams();
    const [activityData, setActivityData] = useState<Activity | null>(null);
    const [residentsData, setResidentsData] = useState<Resident[]>([]);
    const {hasAuthority} = useAuth();
    useEffect(() => {
        if (id) {
            getActivityById(Number(id))
                .then(res => setActivityData(res))
                .catch(err => console.error("Error al obtener actividad", err));
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            getResidentsByActivityId(Number(id))
                .then(res => setResidentsData(res))
                .catch(err => console.error("Error al obtener residentes", err));
        }
    }, [id]);

    function formatDate(isoDate: string): string {
        const [year, month, day] = isoDate.split("-");
        return `${day}/${month}/${year}`;
    }

    return (
        <>
            {/* <Header /> */}
            <div className="container mt-5 mb-5">
                <div className="card shadow p-4">
                    <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                        <h2 className="mb-4">Información de la Actividad</h2>
                        <Link className='btn btn-secondary float-end' to="/actividades/mostrar">Volver</Link>
                    </div>

                    <p><strong>Nombre:</strong> {activityData?.name}</p>
                    <p><strong>Descripcion:</strong> {activityData?.description}</p>
                    <p><strong>Tipo:</strong> {activityData?.type}</p>
                    <p><strong>Fecha:</strong> {formatDate(activityData?.date ?? '')}</p>
                    <p><strong>Hora inicio:</strong> {activityData?.startTime}</p>
                    <p><strong>Hora fin:</strong> {activityData?.endTime}</p>
                    <p><strong>Localización:</strong> {activityData?.location}</p>
                    <p><strong>Estado:</strong> {activityData?.status}</p>
                    <p><strong>Encargado(a):</strong> {activityData?.caregiver?.name ?? 'No asignado'}</p>

                    <center>
                        {hasAuthority('PERMISSION_ACTIVIDADES_CREATE') && (
                        <Link className="btn btn-info mt-3 ms-2" to={`/actividad/info/residentes/agregar/${activityData?.id}`}>
                            Agregar residentes
                        </Link>
                        )}
                        {hasAuthority('PERMISSION_RESIDENTES_VIEW') && (
                        <Link className="btn btn-info mt-3 ms-2" to={`/actividad/info/residentes/${activityData?.id}`}>
                            Ver residentes
                        </Link>
                        )}
                    </center>

                </div>
            </div>
            {/* <Footer /> */}
        </>
    );

};

export default ViewActivity;