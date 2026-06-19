import Table from '../../components/TableBasic'
import type { columnDefinition } from '../../components/TableBasic';
import Footer from '../../components/Footer';
import Header from '../../components/HeaderAdmin';
import { getAllVisits, deleteVisit } from '../../services/VisitService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmDeleteAlert, succesAlert, errorAlert } from '../../js/alerts';
import { useAuth } from '../../context/AuthContext';
interface IVisitData {
    id: number,
    name: string,
    visitDate: string,
    visitHour: string,
    phoneNumber: string,
    email: string,
    relationship: string,
    resident: {
        id: number,
        name: string,
        numberRoom: number
    }
}

const showVisits = () => {
    const {hasAuthority} = useAuth();
    const navigate = useNavigate();
    const [visitData, setVisitData] = useState<IVisitData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const caregivers = await getAllVisits();
                setVisitData(caregivers);
            } catch (error) {
                console.error("Error al cargar los cuidadores:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredVisits = visitData.filter(visit => {
        const term = searchTerm.toLowerCase();
        return (
            visit.name.toLowerCase().includes(term) ||
            visit.visitDate.includes(term) ||
            visit.email.toLowerCase().includes(term) ||
            visit.resident.name.toLowerCase().includes(term) ||
            visit.resident.numberRoom.toString().toLowerCase().includes(term)
        );
    });
    const handleDeleteVisit = async (visitId: number, visitorName: string) => {
        const result = await confirmDeleteAlert(visitorName)

        if (result.isConfirmed) {
            setLoading(true)
            setError(null)

            try {
                 await deleteVisit(visitId);
                 let message = `Visita de ${visitorName} ha sido eliminada`
                succesAlert('Eliminado',message )
                setVisitData(prevVisits => prevVisits.filter(visit => visit.id !== visitId))
            } catch (error) {
                console.log('Error al eliminar la visita', error);
                let errorMessage = 'Error al intentar eliminar la visita'
                setError(errorMessage);
                errorAlert(errorMessage);
            } finally {
                setLoading(false);
            }
        }else{
            return;
        }



    }

    const visitColumns: columnDefinition<IVisitData>[] = [
        { header: '#', accessor: 'id', Cell: (visit, index) => { return (index + 1) } },
        { header: 'Nombre', accessor: 'name' },
        {
            header: 'Fecha Visita', accessor: 'visitDate',
            Cell: (row: IVisitData) => {
                const dateString = row.visitDate;
                if (!dateString) return '';
                try {
                    const parts = dateString.split('-');
                    if (parts.length === 3) {
                        return `${parts[2]}/${parts[1]}/${parts[0]}`;
                    }
                } catch (e) {
                    console.error("Error formateando fecha:", e);
                    return dateString;
                }
                return dateString;
            }
        },

        {
            header: 'Hora visita', accessor: 'visitHour',
            Cell: (row: IVisitData) => {
                const timeString = row.visitHour;
                if (!timeString) return '';
                try {
                    return timeString.substring(0, 5);
                } catch (e) {
                    console.error("Error formateando hora:", e);
                    return timeString;
                }
            }
        },
        { header: 'Contacto', accessor: 'phoneNumber' },
        { header: 'Correo', accessor: 'email' },
        { header: 'Parentesco', accessor: 'relationship' },
        { header: 'Residente', accessor: (row: IVisitData) => row.resident?.name ?? 'No disponible' },
        { header: 'Habitacion', accessor: (row: IVisitData) => 
            {
                if(row.resident?.numberRoom!==0){
                    return row.resident.numberRoom
                }
                return 'N/D';
            }
        },
            {
            header: 'Acciones', accessor: (visit) => visit,
            Cell: (visit) => (
                <>
                    {hasAuthority('PERMISSION_VISITAS_UPDATE')&&(
                    <a className='btn btn-warning me-2' onClick={() => navigate(`/residente/visitas/editar/${visit.id}`)}>
                        <i className='bi bi-pencil-square' />
                    </a>
                    )}
                    {hasAuthority('PERMISSION_VISITAS_DELETE')&&(
                    <a className='btn btn-danger me-2' onClick={() => handleDeleteVisit(visit.id, visit.name)}>
                        <i className="bi bi-trash" />
                    </a>
                    )}

                </>
            )

        }


    ]

    if (loading) return <div className="container mt-5">Cargando visitas...</div>;
    return (
        <>
            {/* <Header /> */}
            <div className='container'>
                <div className='row'>
                    <div className='card mt-5 mb-5'>
                        <div className='card-title  mt-3'><h4>Visitas registradas</h4></div>
                        <div className='card-body'>
                            <input className="mb-3"type="text" placeholder="Buscar..." id="visitSearch" value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} />
                            <Table<IVisitData> data={filteredVisits}
                                columns={visitColumns} selectedRows={new Set()}
                                onToggleRow={() => { }} onSelectAll={() => { }}></Table>
                        </div>
                    </div>
                </div>

            </div>

            {/* <Footer /> */}
        </>
    )

}
export default showVisits;

