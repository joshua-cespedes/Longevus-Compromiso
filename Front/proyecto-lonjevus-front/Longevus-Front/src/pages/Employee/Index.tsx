import { useEffect,useState, type ChangeEvent, type FormEvent } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { succesAlert, errorAlert } from '../../js/alerts';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Index = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, loginSuccess } = useAuth();
    const [formData, setFormData] = useState({
        userEmail: "",
        password: ""
    });

    useEffect(() => {
        if (loginSuccess) {    
            succesAlert("Login exitoso!","Puede ingresar").
            then(()=>{
                 navigate('/perfil');
            });     
           
        }
    }, [loginSuccess, navigate]);

    const handleForm = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    }

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
    console.log("CREDENCIALES" , formData);
       try {
         await login({
            email: formData.userEmail,
            password: formData.password
         });
         
            
             console.log("Puede ingresar");
             
             //navigate("/perfil")
             
         
       } catch (error) {
            errorAlert("Credenciales incorrectas")
       }
    }


    return (
        <>
            <Header/>
            <div className='cardLogin'>
                <div className='row'>
                    <div className='cardLogin-body text-center'>
                        <h3>Inicio de Sesion</h3>
                        <form onSubmit={submit}>
                            <input type='text' name='userEmail' onChange={handleForm} placeholder='Ingrese su correo' value={formData.userEmail} />
                            <input type='password' name='password' onChange={handleForm} placeholder='Ingrese su contraseña ' value={formData.password} />
                            <button className='btn btn-success btn-fload-end' type='submit'> <i className="bi bi-box-arrow-in-right" /> Iniciar sesion</button>
                        </form>
                        <div className='card-footer'>
                            <Link to={'/password'}>Olvide mi contraseña</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Index


