import { useEffect, useState } from "react";
import type { ResidentData } from "../../services/ResidentService";
import ViewContactModal from "../../components/ViewContactModal";
import AddContactModal from "../../components/AddContactModal";
import type { Contact } from "../../services/ContactService";
import { useParams } from "react-router-dom";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { Link } from 'react-router-dom';
import { getResidentById } from "../../services/ResidentService";
import { getContactsByResidentId, addContact, updateContact, deleteContact } from "../../services/ContactService";
import { confirmDeleteAlert, succesAlert, errorAlert } from "../../js/alerts";
import { useAuth } from "../../context/AuthContext";
const ViewResident: React.FC = () => {
    const {hasAuthority} = useAuth();
    const { id } = useParams();
    const [residentData, setResidentData] = useState<ResidentData | null>(null);
    const [contactsData, setContactsData] = useState<Contact[]>([]);

    useEffect(() => {
        if (id) {
            getResidentById(Number(id))
                .then(res => setResidentData(res))
                .catch(err => console.error("Error al obtener el residente", err));
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            getContactsByResidentId(Number(id))
                .then(res => setContactsData(res))
                .catch(err => console.error("Error al obtener contactos", err));
        }
    }, [id]);


    const [showContactModal, setShowContactModal] = useState(false);
    const [showAddContactModal, setShowAddContactModal] = useState(false);

    const handleAddContact = (contact: Contact) => {
        addContact(contact)
            .then(() => {
                console.log("Contacto agregado");
                succesAlert('Agregado', 'Contacto agregado con éxito');
                setContactsData(prev => [...prev, contact]);
            })
            .catch((error) => {
                console.error("Error al guardar el contacto", error);
                errorAlert('Error al guardar contacto');
            });
    }

    const handleEditContact = (updatedContact: Contact) => {
        updateContact(updatedContact)
            .then(() => {
                console.log("Contacto actualizado");
                succesAlert('Editado', 'Contacto actualizado con éxito');
                setContactsData(prev =>
                    prev.map(contact =>
                        contact.id === updatedContact.id ? updatedContact : contact
                    )
                );
            })
            .catch((error) => {
                console.error("Error al actualizar contacto", error);
                errorAlert('Error al actualizar contacto');
            });
    };

    const handleDeleteContact = async (contactId: number) => {
        const result = await confirmDeleteAlert('este contacto')

        if (result.isConfirmed) {
            deleteContact(contactId).then(() => {
                    console.log("Contacto eliminado");
                    setContactsData(prev =>
                        prev.filter(contact => contact.id !== contactId)
                    );
                }).catch((error) => {
                    console.error("Error al eliminar contacto", error);
                });
        }else{
            return;
        }
    };

    return (
        <>
            {/* <Header /> */}
            <div className="container mt-5 mb-5">
                <div className="card shadow p-4">
                    <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                        <h2 className="mb-4">Información del Residente</h2>
                        <Link className='btn btn-secondary float-end' to="/residente/mostrar">Volver</Link>
                    </div>
                    {residentData?.photo && (
                        <div className=" mb-3">
                            <img
                                src={`http://localhost:8080/${residentData.photo}`}
                                alt="Foto del residente"
                                width="150"
                                className="img-thumbnail"
                            />
                        </div>
                    )}
                    <p><strong>Identificación:</strong> {residentData?.identification}</p>
                    <p><strong>Nombre:</strong> {residentData?.name}</p>
                    <p><strong>Edad:</strong> {residentData?.age} años</p>
                    <p><strong>Estado de salud:</strong> {residentData?.healthStatus}</p>
                    <p><strong>Número de habitación:</strong> {residentData?.numberRoom}</p>

                    <center>
                        
                        {hasAuthority('PERMISSION_CONTACTOS_VIEW') && (
                        <button className="btn btn-primary mt-3 me-2" onClick={() => setShowContactModal(true)}>
                            Ver contactos
                        </button>
                        )}
                        {hasAuthority('PERMISSION_CONTACTOS_CREATE') && (
                        <button className="btn btn-success mt-3" onClick={() => setShowAddContactModal(true)}>
                            Agregar contactos
                        </button>
                        )}
                    </center>

                </div>

                <ViewContactModal
                    show={showContactModal}
                    onClose={() => setShowContactModal(false)}
                    residentName={residentData?.name}
                    contactsList={contactsData}
                    onDeleteContact={handleDeleteContact}
                    onEditContact={handleEditContact}
                />

                <AddContactModal
                    show={showAddContactModal}
                    onClose={() => setShowAddContactModal(false)}
                    residentName={residentData?.name}
                    residentId={residentData?.id}
                    onAddContact={handleAddContact}
                />
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default ViewResident;