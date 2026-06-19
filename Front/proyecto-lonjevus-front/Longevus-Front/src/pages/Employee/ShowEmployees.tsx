import Table from '../../components/TableBasic';
import type { columnDefinition } from '../../components/TableBasic';
import Footer from '../../components/Footer';
import Header from '../../components/HeaderAdmin';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllCaregivers, deleteCaregiver } from '../../services/CaregiverService';
import { confirmDeleteAlert, succesAlert, errorAlert } from '../../js/alerts';
import { useAuth } from '../../context/AuthContext';
interface IPerson {
    id: number;
    name: string;
    identification: string;
    email: string;
    salary: string;
}
const ShowEmployee = () => {
    const { hasAuthority } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<IPerson[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const formateadorCRC = new Intl.NumberFormat('es-CR', { 
        style: 'currency',
        currency: 'CRC',
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const caregivers = await getAllCaregivers();
                setUserData(caregivers);
            } catch (error) {
                console.error("Error al cargar los cuidadores:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = userData.filter(user => {
        const term = searchTerm.toLowerCase();
        return (
            user.name.toLowerCase().includes(term) ||
            user.identification.includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.salary.toString().toLowerCase().includes(term)
        );
    });
    const handleDeleteCaregiver = async (caregiverId: number, caregiverName:string) => {
        const response = await confirmDeleteAlert(caregiverName);

        if(response.isConfirmed){
            setLoading(true);
            setError(null);

        try {
            await deleteCaregiver(caregiverId);
            let message = `Cuidador ${caregiverName} eliminado exitosamente`;
            succesAlert("Eliminado", message);
            setUserData(prevUsers => prevUsers.filter(user => user.id !== caregiverId));
        } catch (err) {
            console.error(`Error al eliminar el cuidador ${caregiverId}:`, err);
            let errorMessage = "Error al intentar eliminar el cuidador.";
            setError(errorMessage);
            errorAlert(errorMessage);
        } finally {
            setLoading(false);
        }
        }else{
            return;
        }
    };

    const personColumns: columnDefinition<IPerson>[] = [
        { header: '#', accessor: 'id', Cell: (person, index) => { return (index + 1) } },
        { header: 'Nombre', accessor: 'name' },
        { header: 'Identificacion', accessor: 'identification' },
        { header: 'Correo', accessor: 'email' },
        { header: 'Salario', accessor: 'salary', 
            Cell: (row: IPerson) => {
                const salary = Number(row.salary);
                if (!salary) return '';
                try {
                    return formateadorCRC.format(salary); 
                } catch (e) {
                    console.error("Error formateando salario:", e);
                    return salary;
                }
            }
        },
        {
            header: 'Acciones', accessor: (person) => person,
            Cell: (person) => (
                <>
                    {hasAuthority('PERMISSION_CUIDADORES_VIEW') && (
                        <a className='btn btn-info me-2' onClick={() => navigate(`/empleado/perfil/${person.id}`)}>
                            <i className='bi bi-eye' />
                        </a>
                    )}
                    {hasAuthority('PERMISSION_CUIDADORES_UPDATE') && (
                        <a className='btn btn-warning me-2' onClick={() => navigate(`/empleado/editar/${person.id}`)}>
                            <i className='bi bi-pencil-square' />
                        </a>
                    )}

                   {hasAuthority('PERMISSION_CUIDADORES_DELETE') && (
                        <a className='btn btn-danger me-2' onClick={() => handleDeleteCaregiver(person.id, person.name)}>
                            <i className="bi bi-trash" />
                        </a>
                    )}

                </>
            )

        }
    ];
    if (loading) return <div className="container mt-5">Cargando cuidadores...</div>;
    return (
        <>
            {/* <Header /> */}
            <div className='container'>
                <div className='row'>
                    <div className='card mt-5 mb-5'>
                        <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                            <h4>Lista de empleados</h4>
                            {hasAuthority('PERMISSION_CUIDADORES_CREATE') && (
                            <Link className='btn btn-success' to='/empleado/agregar'><i className='bi bi-person-plus-fill' /></Link>
                            )}
                        </div>
                        <div className='card-body'>
                            <input className='mb-3' type="text" placeholder="Buscar..." id="userSearch" value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} />
        
                            <Table<IPerson> data={filteredUsers} columns={personColumns} selectedRows={new Set()} onToggleRow={() => { }} onSelectAll={() => { }} />
                        </div>
                    </div>

                </div>

            </div>
            {/* <Footer /> */}
        </>

    )



}
export default ShowEmployee;
