import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllResidents, getResidentsByRoomId, getRoomById, updateRoom } from '../../services/RoomService';
import Header from '../../components/HeaderAdmin';
import Footer from '../../components/Footer';
import { confirmEditAlert, succesAlert } from '../../js/alerts';

interface IRoomForm {
  id: number;
  statusRoom: string;
  roomType: string;
  bedCount: number;
  isActive: boolean;
  roomNumber: number;
}

export default function EditRoom() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<IRoomForm>({
    id: 0,
    statusRoom: '',
    roomType: '',
    bedCount: 1,
    isActive: true,
    roomNumber: 1,
  });

  const [residentCount, setResidentCount] = useState<number>(0);
  const residents =  getAllResidents();


  //cargar datos de la habitación
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const room = await getRoomById(Number(id));
        //const residents = await getResidentsByRoomId(Number(id));
        setFormData({
          id: room.id,
          statusRoom: room.statusRoom,
          roomType: room.roomType,
          bedCount: room.bedCount,
          isActive: Boolean(room.isActive), 
          roomNumber: room.roomNumber,
        });
      } catch (error) {
        console.error('Error al cargar datos de la habitación:', error);
      }
    })();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;
    let value: string | number | boolean;
    if (target.type === 'checkbox') {
      value = (target as HTMLInputElement).checked;
    } else if (target.type === 'number') {
      value = Number(target.value);
    } else {
      value = target.value;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  const response = await confirmEditAlert(`La habitación: ${formData.roomNumber.toString()}`);

    if(response.isConfirmed){

    try {
      
      await updateRoom(formData);
      succesAlert("Actualizado","Habitacion actualizada");
      navigate('/habitaciones');
    } catch (error) {
      console.error('Error al actualizar la habitación:', error);
    }
  }
};

  return (
    <>
      {/* <Header /> */}
      <div className="container mt-5 form-container">
        <div className="row">
          <div className="col-12">
            <center>
              <h1 className="mt-2">Editar Habitación #{formData.id}</h1>
            </center>
            <form onSubmit={handleSubmit}>

              <input type="hidden" name="id" value={formData.id} />
              <input
                type="hidden"
                name="isActive"
                value={formData.isActive ? 'true' : 'false'}
              />

              <div className="mb-3">
                <label htmlFor="statusRoom" className="form-label">
                  <i className="bi bi-door-closed-fill"></i> Estado de la habitación:
                </label>
                <select
                  id="statusRoom"
                  name="statusRoom"
                  value={formData.statusRoom}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccione el estado</option>
                  <option value="Disponible">Disponible</option>
                  <option value="No Disponible">No Disponible</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="roomType" className="form-label">
                  <i className="bi bi-lamp-fill"></i>Tipo de habitación:
                </label>
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="Individual">Individual</option>
                  <option value="Grupal">Grupal</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="bedCount" className="form-label">
                  <i className="bi bi-usb-mini-fill"></i> Número de camas:
                </label>
                <input
                  type="number"
                  id="bedCount"
                  name="bedCount"
                  value={formData.bedCount}
                  onChange={handleChange}
                  className="form-control"
                  min={1}
                  max={formData.roomType === 'Individual' ? 1 : 100}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="roomNumber" className="form-label">
                  <i className="bi bi-hash"></i> Número de habitación:
                </label>
                <input
                  type="number"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className="form-control"
                  min={1}
                  required
                />
              </div>

              <div className="mb-3">
                <a href="/habitaciones" className="btn btn-secondary m-1">
                  Volver
                </a>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}