import React, { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { ResidentData } from "../services/ResidentService";
import { errorAlert } from "../js/alerts";
import { getRooms, type IRoom } from "../services/RoomService";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface ResidentProps {
  onSubmit: (data: ResidentData) => void;
  initialData?: ResidentData;
}

const ResidentForm: React.FC<ResidentProps> = ({ onSubmit, initialData }) => {
  const [data, setData] = useState<ResidentData>(
    initialData !== null && initialData !== undefined ? initialData : {
      id: 0,
      identification: '',
      name: '',
      birthdate: '',
      age: 0,
      healthStatus: '',
      numberRoom: 0,
      photo: null,
    });

  const isEditing = !!initialData;
  const { hasAuthority } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredRooms, setFilteredRooms] = useState<IRoom[]>([]);


  useEffect(() => {
    if (initialData) {
      console.log("Cargando initialData en form:", initialData);
      setData(initialData);
    }
  }, [initialData]);


  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const allRooms = await getRooms();
        const availableRooms = allRooms.filter(
          (room) => room.statusRoom.toLowerCase() === "disponible"
        );
        setFilteredRooms(availableRooms);
      } catch (err) {
        console.error("Error al cargar habitaciones", err);
      }
    };

    fetchRooms();
  }, []);


  const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    const target = e.target as HTMLInputElement;
    const { name, type, value, checked, files } = target;

    let isValid = true;

    switch (type) {
      case "text":
        isValid = value.trim() !== "";
        break;

      case "date":
        isValid = value !== "";
        break;

      case "select-one":
        isValid = value !== "";
        break;

      case "file":
        isValid = !!(files && files.length > 0);
        break;

      default:
        isValid = true;
    }

    if (errors[name] && isValid) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }


    if (name === "name" && value !== "" && value.trim() === "") {
      return;
    }

    if (name === "name" && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      return;
    }

    if (name === "identification") {
      if (!/^\d*$/.test(value)) {
        return;
      }

      if (value.length > 0 && (value.length < 9 || value.length > 12)) {
        setErrors(prev => ({
          ...prev, identification: "La identificación debe tener entre 9 y 12 digitos"
        }));
      } else {
        setErrors(prev => ({
          ...prev, identification: ""
        }));
      }
    }


    setData(prev => ({
      ...prev,
      [name]: type === 'file' && files ? files[0]
        : type === 'checkbox' ? checked
          : type === 'number' ? Number(value) : value,
    }));


  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!data.name || data.name.trim() === "") {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!data.identification || !/^\d{9,12}$/.test(data.identification)) {
      newErrors.identification = "La identificación debe tener entre 9 y 12 dígitos";
    }

    if (!data.birthdate) {
    newErrors.birthdate = "Debe ingresar su fecha de nacimiento";
  } else {
    const birthDate = new Date(data.birthdate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (birthDate > today) {
      newErrors.birthdate = "La fecha de nacimiento no puede ser posterior a hoy";
    }
  }

    if (!data.healthStatus) {
      newErrors.healthStatus = "Debe seleccionar un estado de salud";
    }

    if (!data.numberRoom) {
      newErrors.numberRoom = "Debe seleccionar una habitación";
    }

    if (!data.photo && !isEditing) {
      newErrors.photo = "Debe seleccionar una foto";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    onSubmit(data);
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">

      <div className="mb-3">
        <label className="form-label">Identificación</label>
        <input
          type="text"
          name="identification"
          value={data.identification}
          placeholder="ej: 703230654"
          onChange={handleForm}
          className={`form-control ${errors.identification ? "is-invalid" : ""}`}
        />
        {errors.identification && <div className="invalid-feedback">{errors.identification}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          name="name"
          placeholder="ej: María Gómez"
          value={data.name}
          onChange={handleForm}
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Fecha de nacimiento</label>
        <input
          type="date"
          name="birthdate"
          value={data.birthdate}
          onChange={handleForm}
          className={`form-control ${errors.birthdate ? "is-invalid" : ""}`}
        />
        {errors.birthdate && <div className="invalid-feedback">{errors.birthdate}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Estado de Salud</label>
        <select name="healthStatus" value={data.healthStatus}
          onChange={handleForm} className={`form-select ${errors.healthStatus ? "is-invalid" : ""}`}>
          <option value="">Seleccione el estado de salud</option>
          <option value="Bueno">Bueno</option>
          <option value="Regular">Regular</option>
          <option value="Malo">Malo</option>
        </select>
        {errors.healthStatus && <div className="invalid-feedback">{errors.healthStatus}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Habitación</label>
        <select name="numberRoom" value={data.numberRoom} onChange={handleForm} 
        className={`form-select ${errors.numberRoom ? "is-invalid" : ""}`}>
          <option value="">Seleccione una habitación</option>
          {filteredRooms.map((room) => (
            <option key={room.id} value={room.id}>
              Habitación #{room.roomNumber} - {room.roomType}
            </option>
          ))}
        </select>
        {errors.numberRoom && <div className="invalid-feedback">{errors.numberRoom}</div>}

      </div>

      <div className="mb-3">
        <label className="form-label">Foto</label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleForm}
          className={`form-control ${errors.photo ? "is-invalid" : ""}`}
        />
        {errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
      </div>


      <div className="mt-3 d-flex gap-2  gap-2">
        <Link className="btn btn-secondary" to="/residente/mostrar"> Volver</Link>

        {hasAuthority('PERMISSION_RESIDENTES_CREATE') && (
          <button type="submit" className="btn btn-primary float-end">Guardar</button>
        )}
      </div>
    </form>
  );
};

export default ResidentForm;


