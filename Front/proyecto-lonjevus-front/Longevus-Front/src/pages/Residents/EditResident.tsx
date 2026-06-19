import React, { useEffect, useState } from 'react';
import EditResidentForm from "../../components/ResidentForm";
import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import type { ResidentData } from '../../services/ResidentService';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { updateResident, getResidentById } from '../../services/ResidentService';
import { succesAlert } from '../../js/alerts';
import { Link } from 'react-router-dom';

const EditResidentPage: React.FC = () => {

    const { id } = useParams();
    const [residentData, setResidentData] = useState<ResidentData | null>(null);
    const navigate = useNavigate();

    console.log("ID RECIBIDO", id)

    useEffect(() => {
        if (id) {
            getResidentById(Number(id))
                .then(res => setResidentData(res))
                .catch(err => console.error("Error al obtener el residente", err));
        }
    }, [id]);

    const handleUpdateResident = (data: ResidentData) => {
        updateResident(data)
            .then(res => {
                console.log("Residente recibido:", res);
                setResidentData(res);
                succesAlert('Editado', 'Residente editado con éxito')
                navigate("/residente/mostrar");
            })
            .catch(err => console.error("Error al actualizar el residente", err));
    };

    return (
        <>
            {/* <HeaderA /> */}
            <div className="container">
                <div className="row">
                    <div className=" border-primary">
                        <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                            <h1 className="fw-bold text-uppercase">Editar Residente</h1>
                            
                        </div>
                        {residentData ? (
                            <EditResidentForm initialData={residentData} onSubmit={handleUpdateResident} />
                        ) : (
                            <p>Cargando datos del residente...</p>
                        )}
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default EditResidentPage;
