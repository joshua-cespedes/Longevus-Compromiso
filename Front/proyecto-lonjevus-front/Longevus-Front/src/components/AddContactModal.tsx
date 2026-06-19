
import { useAuth } from '../context/AuthContext';
import type { Contact } from "../services/ContactService";
import { useState, useEffect } from "react";
import { errorAlert } from "../js/alerts";

interface AddContactProps {
    show: boolean;
    onClose: () => void;
    residentName?: string;
    residentId: number | undefined;
    onAddContact: (contact: Contact) => void;
    editingContact?: Contact;
}

const AddContactModal: React.FC<AddContactProps> = ({ show, onClose, residentName, residentId, onAddContact, editingContact }) => {
    if (!show)
        return null
    const { hasAuthority } = useAuth();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [relationShip, setRelationship] = useState("");

    useEffect(() => {
        if (editingContact) {
            setName(editingContact.name);
            setPhone(editingContact.phoneNumber);
            setRelationship(editingContact.relationShip);
        } else {
            setName("");
            setPhone("");
            setRelationship("");
        }
    }, [editingContact, show])

    const handleSubmit = () => {

        if (!name || !phone || !relationShip) {
            errorAlert('Completa todos lo campos');
            return;
        }

        const newContact: Contact = {
            id: editingContact?.id ?? 0,
            name,
            phoneNumber: phone,
            relationShip,
            resident: editingContact?.resident ?? { id: residentId! }
        };

        onAddContact(newContact);
        onClose();
        setName("");
        setPhone("");
        setRelationship("");
    };

    return (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">   
                        <h5 className="modal-title">Agregar contacto para {residentName}</h5>
                        {/* //{hasAuthority('PERMISSION_CONTACTOS_CREATE') && ( */}
                        <button type="button" className="btn-close" onClick={onClose}></button>
                        {/* //)} */}
                    </div>

                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Nombre del contacto</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value !== "" && value.trim() === "") return;
                                    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
                                        setName(value);
                                    }
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                className="form-control"
                                value={phone}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setPhone(value);
                                    }
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Parentesco</label>
                            <input
                                type="text"
                                className="form-control"
                                value={relationShip}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value !== "" && value.trim() === "") return;
                                    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
                                        setRelationship(value);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="modal-footer d-flex justify-content-start">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        {hasAuthority('PERMISSION_CONTACTOS_CREATE') && (
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Guardar
                        </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddContactModal;