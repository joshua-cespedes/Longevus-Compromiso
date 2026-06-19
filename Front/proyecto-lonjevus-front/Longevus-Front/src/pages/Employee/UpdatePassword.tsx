import { useEffect, useState, type ChangeEvent } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { updatePassword } from "../../services/AuthService";
import { errorAlert, succesAlert } from "../../js/alerts";
import { useNavigate } from "react-router-dom";
const UpdatePassword = () => {
    const nav = useNavigate();
    const [formData, setFormData] = useState({
        userEmail: "",
        password: "",
        newPassword: ""
    });



    const handleForm = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { userEmail, password, newPassword } = formData;

        if (!userEmail || !password || !newPassword) {
            errorAlert("Todos los campos son obligatorios");
            return;
        }
        if (password !== newPassword) {
            errorAlert("Las contraseñas no son iguales");
            return;
        }
       try {
            await updatePassword({email: userEmail, password});
            succesAlert('Exito', 'Cambio contraseña efectuado');
            nav('/login');
       } catch (error) {
         errorAlert("Error al actualizar la contraseña");
       }
    }

    return (
        <>
            <Header />
            <div className='cardLogin'>
                <div className='row'>
                    <div className='cardLogin-body text-center'>
                        <h3>Cambiar contraseña</h3>
                        <form onSubmit={submit}>
                            <input type='text' name='userEmail' onChange={handleForm} placeholder='Ingrese su correo' value={formData.userEmail} />
                            <input type='password' name='password' onChange={handleForm} placeholder='Ingrese su nueva contraseña ' value={formData.password} />
                            <input type='password' name='newPassword' onChange={handleForm} placeholder='Confirme su nueva contraseña ' value={formData.newPassword} />

                            <div className='mt-3'>
                                <Link className="btn btn-secondary me-2" to={'/login'}>Volver</Link>
                                <button className='btn btn-primary ' type='submit'> Guardar</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default UpdatePassword;