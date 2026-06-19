import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { createProduct, getUnits, type IUnit } from "../../services/ProductService";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { getSuppliers, type ISupplier } from "../../services/SupplierService";
import { succesAlert, errorAlert } from '../../js/alerts';

const categories = ["Salud", "Limpieza", "Alimento", "Otro"];

const AddProduct = () => {

  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [units,setUnits] = useState<IUnit[]>([]);

  const [loadingSuppliers, setLoadingSuppliers] = useState<boolean>(true);
  const [errorSuppliers, setErrorSuppliers] = useState<string | null>(null);

  const [loadingUnits, setLoadingUnits] = useState<boolean>(true);
  const [errorUnits, setErrorUnits] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    expirationDate: '',
    category: '',
    unitId: '',
    supplierId: '',
    photoUrl: '',
    isActive: true,
  });

    useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const supplierList = await getSuppliers();
        setSuppliers(supplierList);
      } catch (err) {
        setErrorSuppliers(err instanceof Error ? err.message : "Error desconocido al cargar proveedores");
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

      useEffect(() => {
    const fetchUnits = async () => {
      try {
        const units = await getUnits();
        setUnits(units);
      } catch (err) {
        setErrorUnits(err instanceof Error ? err.message : "Error desconocido al cargar proveedores");
      } finally {
        setLoadingUnits(false);
      }
    };
    fetchUnits();
    
  }, []);

  //manejar que adan no intente meter la letra 'e' en el input de tipo numero
  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['e','E','+','-'].includes(e.key)) {e.preventDefault();}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFormData({
        ...formData,
        photoUrl: URL.createObjectURL(file), // opcional, para previsualizar
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('expirationDate', formData.expirationDate);
      data.append('category', formData.category);
      data.append('unitId', formData.unitId);
      data.append('supplierId', formData.supplierId);
      data.append('isActive', formData.isActive.toString());

      if (selectedFile) {
        data.append('photo', selectedFile); //el archivo real
      }


      await createProduct(data);
      succesAlert("Agregado","Producto agregado correctamente");
      navigate('/productos');
    } catch (error) {
      console.error('Error al guardar prodcuto:', error);
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
          <div className="col-12">
             <center>
              <h1 className='mt-2'>Agregar Productos</h1>
             </center>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre:</label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.name && errors.name && (
                  <div className="invalid-feedback">
                    {errors.name}
                  </div>
                )}

              </div>

              <div className="mb-3">
                <label className="form-label">Precio en ₡:</label>
                <input
                  name="price"
                  id="price"
                  type="number"
                  className={`form-control ${touched.price && errors.price ? 'is-invalid' : ''}`}
                  value= {formData.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handlePriceKeyDown} 
                  min={0}
                  required
                 
                />

                {touched.price && errors.price && (
                  <div className="invalid-feedback">
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de Vencimiento:</label>
                <input
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                  className={`form-control ${touched.date && errors.date ? 'is-invalid' : ''}`}
                  value={formData.expirationDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
               {touched.price && errors.price && (
                  <div className="invalid-feedback">
                    {errors.date}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Categoría:</label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una categoría:</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Unidad de Medida:</label>
                <select
                  id="unitId"
                  name="unitId"
                  className="form-select"
                  value={parseInt(formData.unitId)}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una unidad:</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>{unit.unitType}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="supplier" className="form-label">
                  Proveedor
                </label>
                <select
                  id="supplierId"
                  name="supplierId"
                  className="form-select"
                  value={parseInt(formData.supplierId)}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un proveedor:</option>
                  {suppliers.map((prov) => (
                    // Aquí hacemos que el value sea el id, pero lo que se muestre sea el name
                    <option key={prov.id} value={prov.id}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="photoUrl" className="form-label">
                  Foto:
                </label>
                <input
                  id="photoUrl"
                  name="photoUrl"
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  
                />
                <small className="text-muted">
                  La foto es obligatoria
                </small>
              </div>
              <div className="mb-3">
                  <a href='/productos' className="btn btn-secondary m-1">Volver</a>
                  <button type="submit" className="btn btn-primary">Guardar</button>
              </div> 
            </form>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default AddProduct;
