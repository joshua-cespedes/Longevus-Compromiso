import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Table from '../../components/TableBasic';
import type { columnDefinition } from '../../components/TableBasic';
import { useNavigate, useParams } from "react-router-dom";
import { getResidentsByActivityId, addResidentFromActivity } from "../../services/ActivityService";
import { useState, useEffect } from "react";
import { type Resident, getResidents } from "../../services/ResidentService";
import { Link } from "react-router-dom";
import { succesAlert, errorAlert, confirmAlert } from "../../js/alerts";
import { useAuth } from "../../context/AuthContext";
const AddResidentsToActivity = () => {

    const { id } = useParams();

    const navigate = useNavigate();
    const [residentOnActivityData, setResidentOnActivityData] = useState<Resident[]>([]);
    const [residentData, setResidentData] = useState<Resident[]>([]);
    const [residentsOutActivity, setResidentOutActivity] = useState<Resident[]>([]);
    const {hasAuthority} = useAuth();
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

    const selectedIds = Array.from(selectedRows);

    useEffect(() => {
        getResidentsByActivityId(Number(id)).then((data) => {
            console.log(data);
            setResidentOnActivityData(data);
        }).catch((error) => {
            console.error('Error al obtener residentes', error)
        })
    }, []);

    useEffect(() => {
        getResidents().then((data) => {
            console.log(data);
            setResidentData(data);
        }).catch((error) => {
            console.error('Error al obtener residentes', error)
        })
    }, []);

    useEffect(() => {
        const outsideResidents = residentData.filter(
            (resident) => !residentOnActivityData.some(
                (r) => r.id === resident.id
            )
        );
        setResidentOutActivity(outsideResidents);
    }, [residentData, residentOnActivityData]);


    const handleAddSelectedResidents = async () => {
        const selectedIds = Array.from(selectedRows);

        if (selectedIds.length === 0) return;

        const result = await confirmAlert('los residentes seleccionados');

        if (result.isConfirmed) {

            try {
                for (const residentId of selectedIds) {
                    console.log('Agregar residente ID:', residentId);
                    await addResidentFromActivity(Number(id), residentId);
                }
                const updatedOutResidents = residentsOutActivity.filter(
                    (resident) => !selectedRows.has(resident.id)
                );
                setResidentOutActivity(updatedOutResidents);

                setSelectedRows(new Set());

                succesAlert('Agregados', 'Residente(s) agregados con éxito');
            } catch (error) {
                console.error("Error al agregar residentes:", error);
                errorAlert('Error al agregar residentes a la actividad')
            }
        } else {
            return;
        }
    };


    const personColumns: columnDefinition<Resident>[] = [
        { header: '#', accessor: 'id', Cell: (resident, index) => { return (index + 1) } },
        { header: 'Identificacion', accessor: 'identification' },
        { header: 'Nombre', accessor: 'name' },
        { header: 'Edad', accessor: 'age' },
        { header: 'Habitación', accessor: 'numberRoom' },
        {
            header: 'Acciones', accessor: (person) => person,
            Cell: (resident) => (
                <>
                    {hasAuthority('PERMISSION_RESIDENTES_VIEW') && (
                    <a className='btn btn-info me-2' onClick={() => navigate(`/residente/perfil/${resident.id}`)}>
                        <i className='bi bi-eye' />
                    </a>
                    )}
                </>
            )

        }
    ];


    const extendedColumns = selectionMode
        ? [
            {
                header: '',
                Header: () => (
                    <input
                        type="checkbox"
                        checked={selectedRows.size === residentsOutActivity.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                ),
                accessor: (resident: Resident) => resident,
                Cell: (_: any, index: number) => {
                    const resident = residentsOutActivity[index] as Resident;
                    return (
                        <input
                            type="checkbox"
                            checked={selectedRows.has(resident.id)}
                            onChange={() => handleToggleRow(resident.id)}
                        />
                    );
                },
            },
            ...personColumns,
        ]
        : personColumns;



    const handleToggleRow = (rowId: number) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(rowId)) {
            newSelected.delete(rowId);
        } else {
            newSelected.add(rowId);
        }
        setSelectedRows(newSelected);
    };

    const handleSelectAll = (isSelected: boolean) => {
        if (isSelected) {
            const allIds = residentsOutActivity.map((res) => res.id);
            setSelectedRows(new Set(allIds));
        } else {
            setSelectedRows(new Set());
        }
    };



    return (
        <>
            {/* <HeaderA /> */}
            <div className='container'>
                <div className='row'>
                    <div className='card mt-5 mb-5'>
                        <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                            <h4>Lista de residentes disponibles</h4>
                            {hasAuthority('PERMISSION_ACTIVIDADES_VIEW') && (
                            <Link className='btn btn-secondary float-end' to={`/actividad/info/${id}`}> Volver</Link>
                            )}
                        </div>
                        <div className='card-body'>
                            {hasAuthority('PERMISSION_RESIDENTES_VIEW') && (
                            <button
                                className="btn btn-primary mb-3"
                                onClick={() => {
                                    setSelectionMode(!selectionMode);
                                    setSelectedRows(new Set());
                                }}
                            >
                                {selectionMode ? 'Quitar selección' : 'Seleccionar residentes'}
                            </button>
                            )}
                            <Table<Resident>
                                data={residentsOutActivity}
                                columns={extendedColumns}
                                selectedRows={selectionMode ? selectedRows : new Set()}
                                onToggleRow={selectionMode ? handleToggleRow : () => { }}
                                onSelectAll={selectionMode ? handleSelectAll : () => { }}
                            />

                            {selectionMode && (
                                
                                <button
                                    className="btn btn-info mt-3"
                                    disabled={selectedRows.size === 0}
                                    onClick={handleAddSelectedResidents}
                                >
                                    Agregar seleccionados
                                </button>
                            )}
                        </div>
                    </div>

                </div>

            </div>
            {/* <Footer /> */}
        </>



    )
};

export default AddResidentsToActivity;
