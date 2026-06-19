import { useState } from "react";
import AddContactModal from "./AddContactModal";
import type { Resident } from "../services/ResidentService";
import type { Contact } from "../services/ContactService";
import { useAuth } from "../context/AuthContext";
interface ContactProps {
    show: boolean;
    onClose: () => void;
    residentName?: string;
    contactsList: Contact[];
    onDeleteContact: (id: number) => void; 
    onEditContact: (contact: Contact) => void; 
}

const ViewContactModal: React.FC<ContactProps> = ({ show, onClose, residentName, contactsList, onDeleteContact, onEditContact }) => {

    const [showEditContactModal, setEditContactModal] = useState<Contact | null>(null);
    const {hasAuthority} = useAuth();
    if (!show)
        return null;
    return (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            Contactos de {residentName ?? "Residente"}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        {contactsList.length === 0 ? (
                            <p>No hay contactos registrados.</p>
                        ) : (
                            <ul className="list-group">
                                {contactsList.map((contact) => (
                                    <li key={contact.id} className="list-group-item">
                                        <p className="mb-1"><strong>Nombre:</strong> {contact.name}</p>
                                        <p className="mb-1"><strong>Teléfono:</strong> {contact.phoneNumber}</p>
                                        <p className="mb-2"><strong>Relación:</strong> {contact.relationShip}</p>
                                        <div className="d-flex gap-2">
                                            {hasAuthority('PERMISSION_CONTACTOS_UPDATE') && (
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => {
                                                    console.log("Editing contact:", contact);
                                                    console.log("Resident exists:", !!contact.resident);
                                                    console.log("Contacto a editar:", contact);
                                                    setEditContactModal(contact)
                                                }}
                                            >
                                                <i className="bi bi-pencil-square"/>
                                            </button>
                                            )}
                                            {hasAuthority('PERMISSION_CONTACTOS_DELETE') && (
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => onDeleteContact(contact.id)}
                                            >
                                                <i className="bi bi-trash-fill"/>
                                            </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="modal-footer justify-content-start">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>

                </div>
            </div>
            {showEditContactModal && (
                <AddContactModal
                    show={true}
                    onClose={() => setEditContactModal(null)}
                    residentName={residentName}
                    residentId={showEditContactModal.resident.id}
                    onAddContact={(updatedContact) => {
                        onEditContact(updatedContact);
                    }}
                    editingContact={showEditContactModal}
                />
            )}
        </div>
    )
}

export default ViewContactModal;