import HeaderA from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Table from '../../components/TableBasic';
import type { columnDefinition } from '../../components/TableBasic';
import { useNavigate, useParams } from "react-router-dom";
import { getResidentsByActivityId, deleteResidentFromActivity } from "../../services/ActivityService";
import { useState, useEffect } from "react";
import type { Resident } from "../../services/ResidentService";
import { Link } from "react-router-dom";
import { confirmDeleteAlert, succesAlert, errorAlert } from "../../js/alerts";

const ResidentsFromActivity = () => {

    const { id } = useParams();

    console.log("ID RECIBIDO", id)

    const navigate = useNavigate();
    const [residentData, setResidentData] = useState<Resident[]>([]);

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

    const selectedIds = Array.from(selectedRows);

    useEffect(() => {
        getResidentsByActivityId(Number(id)).then((data) => {
            console.log(data);
            setResidentData(data);
        }).catch((error) => {
            console.error('Error al obtener residentes', error)
        })
    }, []);


    const handleDeleteSelectedResidents = async () => {
        const selectedIds = Array.from(selectedRows);

        if (selectedIds.length === 0) return;

        const result = await confirmDeleteAlert('los residentes seleccionados')


        if (result.isConfirmed) {

            try {
                for (const residentId of selectedIds) {
                    await deleteResidentFromActivity(Number(id), residentId);
                }
                const updatedResidents = residentData.filter(resident => !selectedRows.has(resident.id));
                setResidentData(updatedResidents);
                setSelectedRows(new Set());
                succesAlert('Eliminados','Residentes eliminados de la actividad exitosamente')
            } catch (error) {
                console.error("Error al eliminar residentes:", error);
                errorAlert('Ocurrió un error al eliminar los residentes seleccionados')
            }
        } else {
            return
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
                    <a className='btn btn-info me-2' onClick={() => navigate(`/residente/perfil/${resident.id}`)}>
                        <i className='bi bi-eye' />
                    </a>
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
                        checked={selectedRows.size === residentData.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                ),
                accessor: (resident: Resident) => resident,
                Cell: (_: any, index: number) => {
                    const resident = residentData[index] as Resident;
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
            const allIds = residentData.map((res) => res.id);
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
                            <h4>Lista de residentes asignados a la actividad</h4>
                            <Link className='btn btn-secondary float-end' to={`/actividad/info/${id}`}> Volver</Link>
                        </div>
                        <div className='card-body'>
                        
                            <button
                                className="btn btn-primary mb-3"
                                onClick={() => {
                                    setSelectionMode(!selectionMode);
                                    setSelectedRows(new Set());
                                }}
                            >
                                {selectionMode ? 'Quitar selección' : 'Seleccionar residentes'}
                            </button>
                            <Table<Resident>
                                data={residentData}
                                columns={extendedColumns}
                                selectedRows={selectionMode ? selectedRows : new Set()}
                                onToggleRow={selectionMode ? handleToggleRow : () => { }}
                                onSelectAll={selectionMode ? handleSelectAll : () => { }}
                            />

                            {selectionMode && (
                                <button
                                    className="btn btn-danger mt-3"
                                    disabled={selectedRows.size === 0}
                                    onClick={handleDeleteSelectedResidents}
                                >
                                    Eliminar seleccionados
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

export default ResidentsFromActivity;
