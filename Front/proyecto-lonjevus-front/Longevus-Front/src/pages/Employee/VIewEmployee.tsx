import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ViewTasksModal from '../../components/ViewTaskModal';
import AddTaskModal from '../../components/AddTaskModal';
import { getCaregiverById } from '../../services/CaregiverService';
import type { IShift } from '../../components/HourSelector';
import Header from '../../components/HeaderAdmin';
import Footer from '../../components/Footer';
import type { Task } from '../../services/TaskService';
import { getCaregiverTask, updateTask, deleteTask } from '../../services/TaskService';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const BACKEND_URL = 'http://localhost:8080/';


const ViewEmployee = () => {
    const { hasAuthority } = useAuth();
    const [employeeData, setEmployeeData] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();




    // Cargar datos del empleado
    useEffect(() => {
        if (id) {
            getCaregiverById(id)
                .then(data => {
                    console.log("Employee Data:", data);
                    setEmployeeData(data);
                })
                .catch(error => {
                    console.error("Error al obtener cuidador:", error);

                });
        }
    }, [id, navigate]);

    // Cargar tareas del empleado
    useEffect(() => {
        if (id) {
            setIsLoadingTasks(true);
            getCaregiverTask(id)
                .then(tasksData => {
                    console.log("Tasks Data:", tasksData);
                    setTasks(tasksData || []);
                })
                .catch(error => {
                    console.error("Error al obtener tareas:", error);
                })
                .finally(() => {
                    setIsLoadingTasks(false);
                });
        }
    }, [id]);

    // Procesa los datos del schedule si existen
    const workScheduleData = useMemo(() => {
        if (!employeeData?.schedule) return [];

        const scheduleInfo: IShift[] = [];

        if (employeeData.schedule.entryTime1) {
            scheduleInfo.push({
                id: '1',
                entryTime: employeeData.schedule.entryTime1,
                exitTime: employeeData.schedule.exitTime1
            });
        }

        if (employeeData.schedule.entryTime2) {
            scheduleInfo.push({
                id: '2',
                entryTime: employeeData.schedule.entryTime2,
                exitTime: employeeData.schedule.exitTime2
            });
        }

        return scheduleInfo.length > 0 ? scheduleInfo : [];
    }, [employeeData?.schedule]);

    // Procesa los días seleccionados
    const selectedDaysData = useMemo(() => {
        if (!employeeData?.schedule?.days) return [];
        return employeeData?.schedule.days.split(',').map((day: string) => day.trim());
    }, [employeeData?.schedule?.days]);

    // Procesa los turnos seleccionados
    const selectedShiftsData = useMemo(() => {
        if (!employeeData?.shift) return [];
        return employeeData.shift.split(',').map((shift: string) => shift.trim());
    }, [employeeData?.shift]);

    // Construir la URL completa de la imagen
    const imageUrl = useMemo(() => {
        if (employeeData?.photoUrl && typeof employeeData.photoUrl === 'string') {
            return `${BACKEND_URL}${employeeData.photoUrl}`;
        }
        return 'placeholder-image-url.jpg'; // Imagen por defecto
    }, [employeeData?.photoUrl]);

    // === Estados para la gestión de Modales ===
    const [showViewTasksModal, setShowViewTasksModal] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editingTaskDescription, setEditingTaskDescription] = useState('');


    // === Handlers para Modales ===
    const handleShowViewTasks = () => setShowViewTasksModal(true);
    const handleCloseViewTasks = () => setShowViewTasksModal(false);

    const handleShowAddTask = () => setShowAddTaskModal(true);
    const handleCloseAddTask = () => setShowAddTaskModal(false);


    // === Handlers para Agregar Tarea ===
    const handleTaskAdded = () => {
        // Recargar las tareas después de agregar una nueva
        if (id) {
            getCaregiverTask(id)
                .then(tasksData => setTasks(tasksData || []))
                .catch(error => console.error("Error al recargar tareas:", error));
        }
    };


    // === Handlers para Editar Tarea ===
    const handleEditClick = (task: Task) => {
        setEditingTask(task);
        setEditingTaskDescription(task.description);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
        setEditingTaskDescription('');
    };

    const handleSaveEdit = async (taskId: number | string) => {
        if (!editingTaskDescription.trim() || !editingTask) return;

        try {
            const updatedTask = {
                ...editingTask,
                description: editingTaskDescription.trim()
            };

            await updateTask(updatedTask);

            // Recargar tareas después de actualizar
            if (id) {
                const freshTasks = await getCaregiverTask(id);
                setTasks(freshTasks || []);
            }

            handleCancelEdit();
        } catch (error) {
            console.error("Error al actualizar tarea:", error);
        }
    };

    const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditingTaskDescription(event.target.value);
    };


    // === Handlers para Eliminar Tarea ===
    const handleDeleteTask = async (taskId: number | string) => {
        try {
            await deleteTask(Number(taskId));

            // Recargar tareas después de eliminar
            if (id) {
                const freshTasks = await getCaregiverTask(id);
                setTasks(freshTasks || []);
            }

            // Si la tarea eliminada era la que se estaba editando, cancelar edición
            if (editingTask?.id === taskId) {
                handleCancelEdit();
            }
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
        }
    };


    const hasItems = (arr?: any[]) => Array.isArray(arr) && arr.length > 0;

    const formattedSalary = useMemo(() => {
        const salary = Number(employeeData?.salary);
        const formateadorCRC = new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
        });
        if (!salary) return '';
        try {
            return formateadorCRC.format(salary);
        } catch (e) {
            console.error("Error formateando salario:", e);
            return salary;
        }

    }, [employeeData?.salary]);

    return (
        <>
            {/* <Header /> */}
            <div className="container mt-5">
                <div className="card m-5">
                    <div className="row g-0">

                        <div className="col-md-4 text-center p-3">
                            <img
                                src={imageUrl}
                                className="img-fluid rounded"
                                alt={`Foto de ${employeeData?.name || 'Empleado'}`}
                                style={{ maxWidth: '150px' }}
                            />
                            <h5 className="card-title mt-3"><strong>Nombre: </strong>{employeeData?.name}</h5>
                            <p className="card-text"><strong>Identificación:</strong> {employeeData?.identification}</p>
                            <p className="card-text"><strong>Email:</strong> {employeeData?.email}</p>
                            <p className="card-text"><strong>Salario:</strong> {formattedSalary}</p>
                        </div>


                        <div className="col-md-8">
                            <div className="card-body">

                                <Link className='btn btn-secondary float-end' to="/empleado/mostrar"> Volver</Link>
                                <div className="card-text">

                                    <strong>Días de trabajo:</strong>
                                    {hasItems(selectedDaysData) ? (
                                        <ul>
                                            {selectedDaysData.map((day: string, index: number) => (
                                                <li key={index}>{day}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-muted"> No hay días seleccionados</span>
                                    )}
                                </div>


                                <div className="card-text">
                                    <strong>Horario de trabajo:</strong>
                                    {hasItems(workScheduleData) ? (
                                        <ul>
                                            {workScheduleData.map((shift) => (
                                                <li key={shift.id}>{`De ${shift.entryTime} a ${shift.exitTime}`}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-muted"> No hay horarios configurados</span>
                                    )}
                                </div>


                                <div className="card-text">
                                    <strong>Turnos seleccionados:</strong>
                                    {hasItems(selectedShiftsData) ? (
                                        <ul>
                                            {selectedShiftsData.map((shift: string, index: number) => (
                                                <li key={index}>{shift}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-muted"> No hay turnos seleccionados</span>
                                    )}
                                </div>

                                <hr />
                                <h6>Gestión de Tareas Pendientes</h6>
                                <div className="d-flex gap-2">
                                    {hasAuthority('PERMISSION_TAREAS_VIEW') && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleShowViewTasks}
                                            disabled={isLoadingTasks}
                                        >
                                            {isLoadingTasks ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Cargando...
                                                </>
                                            ) : (
                                                <>Mostrar ({tasks.length}) <i className="bi bi-eye-fill" /></>
                                            )}
                                        </button>
                                    )}
                                    {hasAuthority('PERMISSION_TAREAS_CREATE') && (
                                        <button
                                            className="btn btn-success"
                                            onClick={handleShowAddTask}
                                            disabled={isLoadingTasks}
                                        >
                                            Agregar <i className="bi bi-clipboard-plus-fill" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




            <ViewTasksModal
                show={showViewTasksModal}
                onClose={handleCloseViewTasks}
                employeeName={employeeData?.name}
                tasks={tasks}
                editingTask={editingTask}
                editingTaskDescription={editingTaskDescription}
                onEditClick={handleEditClick}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={handleSaveEdit}
                onEditInputChange={handleEditInputChange}
                onDeleteTask={handleDeleteTask}
            />


            <AddTaskModal
                show={showAddTaskModal}
                onClose={handleCloseAddTask}
                employeeName={employeeData?.name}
                caregiverId={id}
                onTaskAdded={handleTaskAdded}
            />
            {/* <Footer /> */}
        </>
    );
}

export default ViewEmployee;