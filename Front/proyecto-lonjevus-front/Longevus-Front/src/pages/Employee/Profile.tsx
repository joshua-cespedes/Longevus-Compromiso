import { useEffect, useState, useMemo } from "react";
import { isAdmin, isCaregiver } from "../../services/AuthService";
import type { UserProfile } from "../../services/AuthService";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import ViewTasksModal from "../../components/ViewTaskModal";
import AddTaskModal from "../../components/AddTaskModal";
import type { Task } from "../../services/TaskService";
import { useAuth } from "../../context/AuthContext";
import { getCaregiverTask, updateTask, deleteTask} from '../../services/TaskService';

const BACKEND_URL = "http://localhost:8080/";

const Profile = () => {
    const { user } = useAuth(); 
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const id = user?.id;
    const isUserAdmin = user && isAdmin(user);
    const isUserCaregiver = user && isCaregiver(user);

      const formateadorCRC = new Intl.NumberFormat('es-CR', { 
        style: 'currency',
        currency: 'CRC',
    });

    useEffect(() => {
        if (isUserCaregiver && user?.id) {
            setLoadingTasks(true);
            getCaregiverTask(user.id.toString())
                .then(setTasks)
                .catch(err => console.error("Error cargando tareas", err))
                .finally(() => setLoadingTasks(false));
        }
    }, [user, isUserCaregiver]);

    const imageUrl = useMemo(() => {
        if (user?.photoUrl) return `${BACKEND_URL}${user.photoUrl}`;
        return "placeholder.jpg";
    }, [user]);

    const selectedDays = useMemo(() => {
        return user?.schedule?.days?.split(",").map(day => day.trim()) || [];
    }, [user]);

    const workSchedule = useMemo(() => {
        const schedule = user?.schedule;
        if (!schedule) return [];

        const shifts = [];
        if (schedule.entryTime1) {
            shifts.push(`De ${schedule.entryTime1} a ${schedule.exitTime1}`);
        }
        if (schedule.entryTime2) {
            shifts.push(`De ${schedule.entryTime2} a ${schedule.exitTime2}`);
        }
        return shifts;
    }, [user]);

    const shiftInfo = useMemo(() => {
        if (isUserCaregiver && user?.shift) {
            return user.shift.split(",").map(s => s.trim());
        }
        return [];
    }, [user]);

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
                
                if (id) {
                    const freshTasks = await getCaregiverTask(id);
                    setTasks(freshTasks || []);
                }
                
                if (editingTask?.id === taskId) {
                    handleCancelEdit();
                }
            } catch (error) {
                console.error("Error al eliminar tarea:", error);
            }
        };
        const formattedSalary = useMemo(() => {
        const salary = Number(user?.salary);
        const formateadorCRC = new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
        });
        if (!salary) return 'N/D';
        try {
            return formateadorCRC.format(salary);
        } catch (e) {
            console.error("Error formateando salario:", e);
            return salary;
        }

    }, [user?.salary]);
    return (
        <>
           
            <div className="container m-5 d-flex justify-content-center align-items-center">
                <div className="card p-4 w-75">
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <img
                                src={imageUrl}
                                alt="Perfil"
                                className="img-fluid rounded mb-3"
                                style={{ maxWidth: "150px" }}
                            />
                            <h5><strong>{user?.name}</strong></h5>
                            <p><strong>Identificación:</strong> {user?.identification}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Salario:</strong> {formattedSalary}</p>
                            {isUserAdmin && (
                                    <p><strong>Contacto de Oficina:</strong> {user.officeContact}</p>
                                )}
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                {isUserCaregiver && (
                                    <>
                                        

                                        <p><strong>Días de trabajo:</strong></p>
                                        {selectedDays.length ? (
                                            <ul>
                                                {selectedDays.map((day, i) => (
                                                    <li key={i}>{day}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-muted">No definidos</span>
                                        )}

                                        <p><strong>Horario de trabajo:</strong></p>
                                        {workSchedule.length ? (
                                            <ul>
                                                {workSchedule.map((h, i) => (
                                                    <li key={i}>{h}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-muted">No definido</span>
                                        )}
                            
                                        <hr />
                                        <h6>Gestión de Tareas</h6>
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={handleShowViewTasks}
                                            disabled={loadingTasks}
                                        >
                                            {loadingTasks ? 'Cargando...' : `Ver tareas (${tasks.length})`}
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            onClick={handleShowAddTask}
                                            disabled={loadingTasks}
                                        >
                                            Agregar Tarea
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modales de tareas */}
            {isUserCaregiver && (
                <>
                    <ViewTasksModal
                        show={showViewTasksModal}
                        onClose={handleCloseViewTasks}
                        employeeName={user?.name}
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
                        employeeName={user?.name}
                        caregiverId={id}
                        onTaskAdded={handleTaskAdded}
                    />
                </>
            )}
            
        </>
    );
};

export default Profile;