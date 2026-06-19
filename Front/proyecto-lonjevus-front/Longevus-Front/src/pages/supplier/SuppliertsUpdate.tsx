import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/HeaderAdmin';
import Footer from '../../components/Footer';
import { updateSupplier, getSupplierById } from '../../services/SupplierService'
import { confirmEditAlert, succesAlert } from '../../js/alerts';

interface SupplierData {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  photoUrl: string;
  isActive: boolean;
}

export default function SuppliersEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

    //manejar inputs vacios
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<SupplierData>({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    photoUrl: '',
    isActive: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Cargar datos del proveedor al llamar
  useEffect(() => {
    async function fetchSupplier() {
      try {
        const response = getSupplierById(id);
        const data = await response;
        setFormData({
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          address: data.address,
          photoUrl: data.photo,
          isActive: data.isActive,
        });
      } catch (error) {
        console.error('Error fetching supplier:', error);
      }
    }
    if (id) fetchSupplier();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFormData({
        ...formData,
        photoUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('id', id!)
      data.append('name', formData.name);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('email', formData.email);
      data.append('address', formData.address);
      if (selectedFile) {
        data.append('photo', selectedFile);
      }
      data.append('isActive', formData.isActive.toString());

      const response = await confirmEditAlert(formData.name);

      if (response.isConfirmed) {

        await updateSupplier(data);
        succesAlert("Actualizado", `Proveedor actualizado exitosamente`);
        navigate("/proveedores")
      } else {
        console.log("No se actualizo el proveedor");
      }
    } catch (error) {
      console.error('Error updating supplier: ', error);
    }

  };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setTouched(target => ({ ...target, [name]: true }));
  
  
      setErrors(err => ({
        ...err,
        [name]: value.trim() ? '' : 'Este campo es obligatorio'}));
    };

  

  return (
    <>
      {/* <Header /> */}
      <div className='container mt-5 form-container'>
        <div className='row'>
          <div className='col-12'>
            <center>
              <h1 className='mt-2'>Editar Proveedor</h1>
            </center>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label htmlFor='name' className='form-label'><i className="bi bi-person-fill"></i>Nombre:</label>
                <input type='text' id='name' name='name' value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`} required />
                {touched.name && errors.name && (
                  <div className="invalid-feedback">
                    {errors.name}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label htmlFor='phoneNumber' className='form-label'><i className="bi bi-telephone-plus-fill"></i>Teléfono:</label>
                <input type='text' id='phoneNumber' name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} onBlur={handleBlur} className={`form-control ${touched.phoneNumber && errors.phoneNumber ? 'is-invalid' : ''}`} required />
                {touched.phoneNumber && errors.phoneNumber && (
                  <div className="invalid-feedback">
                    {errors.phoneNumber}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label htmlFor='email' className='form-label'><i className="bi bi-envelope-fill"></i>Correo:</label>
                <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`} required />
                {touched.email && errors.email && (
                  <div className="invalid-feedback">
                    {errors.email}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label htmlFor='address' className='form-label'><i className="bi bi-compass"></i>Dirección:</label>
                <input type='text' id='address' name='address' value={formData.address} onChange={handleChange} onBlur={handleBlur} className={`form-control ${touched.address && errors.address ? 'is-invalid' : ''}`} required />
                {touched.address && errors.address && (
                  <div className="invalid-feedback">
                    {errors.address}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label htmlFor='photo' className='form-label'><i className="bi bi-image"></i>Fotografía:</label>
                <input type='file' id='photo' name='photo' onChange={handleFileChange} className='form-control' accept='image/*' />
              </div>
              <div className='mb-3'>
                <button type='button' className='btn btn-secondary m-1' onClick={() => navigate('/proveedores')}>Cancelar</button>
                <button type='submit' className='btn btn-primary'>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}