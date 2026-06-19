import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Table from '../../components/TableBasic';
import type { columnDefinition } from '../../components/TableBasic';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getActivitiesByDate, deleteActivity, getActivitiesByMonth, getActivitiesByYear, type Activity } from "../../services/ActivityService";
import { confirmDeleteAlert, succesAlert, errorAlert } from "../../js/alerts";
import { useAuth } from "../../context/AuthContext";

const Activities = () => {
    const navigate = useNavigate();
    const [activitiesData, setActivitiesData] = useState<Activity[]>([]);
    const [activitiesDate, setActivitiesDate] = useState<string>("");
    const {hasAuthority} = useAuth();
    const [searchType, setSearchType] = useState<string>("mensual");
    const [searchValue, setSearchValue] = useState<string>("");

    useEffect(() => {
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0]; 

        console.log("Cargando actividades de hoy:", todayStr);

        getActivitiesByDate(todayStr)
            .then(data => {
                setActivitiesData(data);
            })
            .catch(error => {
                console.error("Error al cargar actividades del día", error);
            });
    }, []);

    const handleSearch = () => {
        if (!searchValue) return;

        if (searchType === "date") {
            getActivitiesByDate(searchValue)
                .then(data => setActivitiesData(data))
                .catch(err => errorAlert("Error al buscar por fecha"));
        }

        if (searchType === "monthly") {
            const [yearStr, monthStr] = searchValue.split("-");
            const year = parseInt(yearStr);
            const month = parseInt(monthStr);

            getActivitiesByMonth(month)
                .then(data => {
                    const filtered = data.filter(a => {
                        const [aYear] = a.date.split("-").map(Number);
                        return aYear === year;
                    });
                    setActivitiesData(filtered);
                })
                .catch(err => errorAlert("Error al buscar por mes"));
        }

        if (searchType === "year") {
            const year = parseInt(searchValue.trim());

            if (isNaN(year) || year < 2000 || year > 2100) {
                errorAlert("Debe ingresar un año válido entre 2000 y 2100.");
                return;
            }

            console.log("Búsqueda por año:", year);

            getActivitiesByYear(year)
                .then(data => {
                    console.log("Actividades encontradas:", data.length);
                    setActivitiesData(data);
                })
                .catch(err => {
                    console.error("Error al buscar por año:", err);
                    errorAlert("Error al buscar por año");
                });
        }

    };



    const handleDeleteActivity = async (activity: Activity) => {
        const result = await confirmDeleteAlert(activity.name);

        if (result.isConfirmed) {
            deleteActivity(activity.id)
                .then(() => {
                    succesAlert('Eliminada', 'Actividad eliminada con éxito');
                    setActivitiesData(prev => prev.filter(r => r.id !== activity.id));
                })
                .catch(error => {
                    console.error("Error al eliminar la actividad", error);
                    errorAlert('Error al eliminar la actividad');
                });
        } else {
            return;
        }
    }

    const formatTime = (time: string) => {
        if (!time) return '';
        const [hour, minute] = time.split(':');
        return `${hour}:${minute}`;
    };

    function formatDate(isoDate: string): string {
        const [year, month, day] = isoDate.split("-");
        return `${day}/${month}/${year}`;
    }


    const activityColumns: columnDefinition<Activity>[] = [
        { header: '#', accessor: 'id', Cell: (activity, index) => { return (index + 1) } },
        { header: 'Nombre', accessor: 'name' },
        { header: 'Fecha', accessor: 'date', Cell: (actity) => formatDate(actity.date)},
        { header: 'Tipo', accessor: 'type' },
        { header: 'Inicio', accessor: 'startTime', Cell: (activity) => formatTime(activity.startTime) },
        { header: 'Fin', accessor: 'endTime', Cell: (activity) => formatTime(activity.endTime) },
        { header: 'Estado', accessor: 'status' },
        {
            header: 'Acciones', accessor: (activity) => activity,
            Cell: (activity) => (
                <>  
                {hasAuthority('PERMISSION_ACTIVIDADES_VIEW') && (
                    <a className='btn btn-info me-2' onClick={() => navigate(`/actividad/info/${activity.id}`)}>
                        <i className='bi bi-eye' />
                    </a>
                )}
                {hasAuthority('PERMISSION_ACTIVIDADES_UPDATE') && (
                    <a className='btn btn-warning me-2' onClick={() => navigate(`/actividad/editar/${activity.id}`)}>
                        <i className='bi bi-pencil-square' />
                    </a>
                )}
                {hasAuthority('PERMISSION_ACTIVIDADES_DELETE') && (
                    <a className='btn btn-danger me-2' onClick={() => handleDeleteActivity(activity)}>
                        <i className="bi bi-trash" />
                    </a>
                )}

                </>
            )

        }
    ];

    return (
        <>
            {/* <Header /> */}

            <div className="d-flex justify-content-center mt-4">
                <div className="input-group w-auto">
                    <label className="input-group-text bg-white border-end-0 fw-semibold">
                        Tipo de búsqueda
                    </label>
                    <select className="form-select" value={searchType} onChange={(e) => {
                        setSearchType(e.target.value);
                        setSearchValue("");
                    }}>
                        <option >Seleccione el tipo de búsqueda</option>
                        <option value="date">Por fecha</option>
                        <option value="monthly">Mensual</option>
                        <option value="year">Anual</option>
                    </select>
                </div>
            </div>

            <div className="d-flex justify-content-center mt-3">
                <div className="input-group w-auto">
                    <label className="input-group-text bg-white border-end-0 fw-semibold">
                        {searchType === "monthly" && "Seleccione mes"}
                        {searchType === "date" && "Seleccione fecha"}
                        {searchType === "year" && "Seleccione año"}
                    </label>

                    {searchType === "monthly" && (
                        <input
                            type="month"
                            className="form-control"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    )}

                    {searchType === "date" && (
                        <input
                            type="date"
                            className="form-control"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    )}

                    {searchType === "year" && (
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Ingrese un año"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            min="2000"
                            max="2100"
                        />

                    )}

                    {(searchType === "date" || searchType === "monthly" || searchType === "year") && (
                        <button className="btn btn-primary" onClick={handleSearch}>
                            Buscar
                        </button>
                    )}
                </div>
            </div>



            <div className='container'>
                <div className='row'>
                    <div className='card mt-5 mb-5'>
                        <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                            <h4>Lista de actividades</h4>
                            {hasAuthority('PERMISSION_ACTIVIDADES_CREATE') && (
                            <Link className='btn btn-success' to='/actividad/agregar'><i className='bi bi-calendar-plus' /> </Link>
                            )}
                        </div>
                        <div className='card-body'>
                            {activitiesData.length === 0 ? (
                                <p className="text-center text-muted">No hay actividades para la fecha seleccionada.</p>
                            ) : (
                                <Table<Activity>
                                    data={activitiesData}
                                    columns={activityColumns}
                                    selectedRows={new Set()}
                                    onToggleRow={() => { 1 }}
                                    onSelectAll={() => { }}
                                />
                            )}
                        </div>
                    </div>

                </div>

            </div>
            {/* <Footer /> */}
        </>
    )
}

export default Activities;