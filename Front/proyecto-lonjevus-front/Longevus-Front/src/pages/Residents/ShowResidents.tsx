import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Table from '../../components/TableBasic';
import type { columnDefinition } from '../../components/TableBasic';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getResidents, deleteResident, filterResidents } from "../../services/ResidentService";
import type { Resident } from "../../services/ResidentService";
import { confirmDeleteAlert, succesAlert, errorAlert } from "../../js/alerts";
import { useAuth } from "../../context/AuthContext";

const Residents = () => {
    const { hasAuthority } = useAuth();
    const navigate = useNavigate();
    const [residentData, setResidentData] = useState<Resident[]>([]);

    useEffect(() => {
        getResidents().then((data) => {
            console.log(data);
            setResidentData(data);
        }).catch((error) => {
            console.error('Error al obtener residentes', error)
        })
    }, []);


    const handleDeleteResident = async (resident: Resident) => {
        const result = await confirmDeleteAlert(resident?.name ?? "");

        if (result.isConfirmed) {
            deleteResident(resident.id)
                .then(() => {
                    setResidentData(prev => prev.filter(r => r.id !== resident.id));
                    succesAlert('Eliminado', `Residente ${resident.name}`)
                })
                .catch(error => {
                    console.error("Error al eliminar el residente", error);
                    errorAlert('Error al eliminar el residente')
                });
        } else
            return
    }

    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        const fetchAndFilter = async () => {
            try {
                const allResidents = await getResidents();

                if (searchInput.trim() === "") {
                    setResidentData(allResidents);
                    return;
                }

                const filtered = filterResidents(allResidents, searchInput, searchInput);
                setResidentData(filtered);
            } catch (error) {
                console.error("Error al buscar residentes", error);
            }
        };

        fetchAndFilter();
    }, [searchInput]);


    

    const personColumns: columnDefinition<Resident>[] = [
        { header: '#', accessor: 'id', Cell: (resident, index) => { return (index + 1) } },
        { header: 'Identificacion', accessor: 'identification' },
        { header: 'Nombre', accessor: 'name' },
        { header: 'Edad', accessor: 'age' },
        { header: 'Habitación', accessor: 'numberRoom', Cell: ({ numberRoom }) => numberRoom === 0 ? 'N/D' : numberRoom },
        {
            header: 'Acciones', accessor: (person) => person,
            Cell: (resident) => (
                <>  {hasAuthority('PERMISSION_RESIDENTES_VIEW') && (
                    <a className='btn btn-info me-2' onClick={() => navigate(`/residente/perfil/${resident.id}`)}>
                        <i className='bi bi-eye' />
                    </a>
                )}
                    {hasAuthority('PERMISSION_RESIDENTES_UPDATE') && (
                        <a className='btn btn-warning me-2' onClick={() => navigate(`/residente/editar/${resident.id}`)}>
                            <i className='bi bi-pencil-square' />
                        </a>
                    )}
                    {hasAuthority('PERMISSION_INVENTARIO_VIEW') && (
                        <a className='btn btn-success me-2' onClick={() => navigate(`/residente/${resident.id}/condiciones`)} title="Condiciones Medicas">
                            <i className='bi bi-heart-pulse' />
                        </a>
                    )}
                    {hasAuthority('PERMISSION_RESIDENTES_DELETE') && (
                        <a className='btn btn-danger me-2' onClick={() => handleDeleteResident(resident)}>
                            <i className="bi bi-trash" />
                        </a>
                    )}

                </>
            )

        }
    ];


    return (
        <>
            {/* <HeaderA /> */}
            <div className='container'>
                <div className='row'>
                    <div className='card mt-5 mb-5'>
                        <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                            <h4>Lista de residentes</h4>
                            {hasAuthority('PERMISSION_RESIDENTES_CREATE') && (
                                <Link className='btn btn-success' to='/residente/agregar'><i className='bi bi-person-plus-fill' /></Link>
                            )}
                        </div>
                        <div className='card-body'>
                            <input className="mb-3" type="text" placeholder="Buscar..." id="userSearch" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                         
                            <Table<Resident> data={residentData} columns={personColumns} selectedRows={new Set()} onToggleRow={() => { }} onSelectAll={() => { }} />
                        </div>
                    </div>

                </div>

            </div>
            {/* <Footer /> */}
        </>



    )
};

export default Residents;