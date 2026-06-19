import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { VisitPayload } from "../../services/VisitService";
import { getVisitById, updateVisit } from "../../services/VisitService";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { loadingAlert, succesAlert, errorAlert} from "../../js/alerts";

const EditVisit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [visitData, setVisitData] = useState<VisitPayload>({
        name: "",
        visitDate: "",
        visitHour: "",
        phoneNumber: "",
        email: "",
        relationship: "",
            resident: {
                id: "",
                name: "",
                numberRoom: ""
            }
        
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            if (id) {
                try {
                    const data = await loadingAlert(() => getVisitById(id));
                    if (data) {
                        const initialData: VisitPayload = {
                            id: String(data.id),
                            name: data.name,
                            visitDate: data.visitDate,
                            visitHour: data.visitHour,
                            phoneNumber: data.phoneNumber,
                            email: data.email,
                            relationship: data.relationship,
                            resident: data.resident
                        };
                        setVisitData(initialData);
                    }else{
                        setError("No se encontraron datos")
                    }                 

                }catch(error){
                     console.error("Error :", error);
                }
            }
        }
            getData();
        }, [id]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setVisitData(prev => ({
              ...prev,
              [name]: value,
            }));
          };

    const HandleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
         e.preventDefault();

        if (id) {
            try {
                await loadingAlert(async () => {
    
                    await updateVisit(visitData);
                });
                let message = "Visita modificada exitosamente"
                succesAlert("Actualizado", message)
                navigate('/residente/visitas')
            } catch (error) {
                let message = "Error al intentar actualizar la visita"
                errorAlert(message)
            }

        } else {
            let message = "Error al actualizar ID no proporcionado"
            errorAlert(message);
            return;
        }
    }

    return (
        <>
            {/* <Header /> */}
                <div className="container mt-5 form-container">
                    <div className="row">
                        <div className="col-12">
                            <h1>Editar Visita</h1>
                            <form onSubmit={HandleFormSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre: </label>
                                    <input className="form-control" 
                                    type="text" name="name" id="name" value={visitData?.name}
                                    onChange={handleChange}
                                    required/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha de Visita: </label>
                                    <input className="form-control" 
                                    type="date" name="visitDate" id="visitDate" value={visitData?.visitDate}
                                    onChange={handleChange}
                                    required/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Hora: </label>
                                    <input className="form-control" 
                                    type="time" name="visitHour" id="visitHour" value={visitData?.visitHour}
                                    onChange={handleChange}
                                    required/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contacto: </label>
                                    <input className="form-control" 
                                    type="text" name="phoneNumber" id="phoneNumber" value={visitData?.phoneNumber}
                                    onChange={handleChange}
                                    required/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Correo: </label>
                                    <input className="form-control" 
                                    type="text" name="email" id="email" value={visitData?.email}
                                    onChange={handleChange}
                                    required/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Parentesco: </label>
                                    <input className="form-control" 
                                    type="text" name="relationship" id="relationship" value={visitData?.relationship}
                                    onChange={handleChange}
                                    required/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Residente : </label>
                                    <input className="form-control" 
                                    type="text" name="relationship" id="relationship" value={visitData?.resident.name}
                                    onChange={handleChange}
                                    readOnly/>
                                </div>
                                <div className="me-3">
                                    <button type="button"className="btn btn-secondary me-2" onClick={()=> navigate("/residente/visitas")}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Guardar</button>
                                
                            </div>
                            </form>

                        </div>

                    </div>

                </div>

            {/* <Footer/> */}
        </>
    )


}
export default EditVisit;