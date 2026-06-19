import type { Task } from '../services/TaskService';
import { useAuth } from '../context/AuthContext';
interface ViewTasksModalProps {
  show: boolean;
  onClose: () => void;
  employeeName?: string;
  tasks: Task[];
  editingTask: Task | null;
  editingTaskDescription: string;
  onEditClick: (task: Task) => void;
  onCancelEdit: () => void;
  onSaveEdit: (taskId: number | string) => void;
  onEditInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteTask: (taskId: number | string) => void;
}

const ViewTasksModal: React.FC<ViewTasksModalProps> = ({
  show,
  onClose,
  employeeName,
  tasks,
  editingTask,
  editingTaskDescription,
  onEditClick,
  onCancelEdit,
  onSaveEdit,
  onEditInputChange,
  onDeleteTask
}) => {
  const { hasAuthority } = useAuth();
  if (!show) {
    return null;
  }

  return (
    <div className="modal show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Tareas Pendientes de {employeeName || 'Empleado'}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {tasks.length === 0 ? (
              <p className="text-center text-muted">No hay tareas pendientes para este empleado.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: '10%' }}>#</th>
                      <th scope="col" style={{ width: '60%' }}>Descripción</th>
                      <th scope="col" style={{ width: '30%' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, index) => (
                      <tr key={task.id}>
                        <td>{index + 1}</td>
                        <td>
                          {editingTask?.id === task.id ? (
                            <input
                              type="text"
                              className="form-control"
                              value={editingTaskDescription}
                              onChange={onEditInputChange}
                              autoFocus
                            />
                          ) : (
                            task.description
                          )}
                        </td>
                        <td>
                          {editingTask?.id === task.id ? (
                            <div className="btn-group btn-group-sm">
                              {hasAuthority('PERMISSION_TAREAS_UPDATE') && (
                              <button
                                className="btn btn-success"
                                onClick={() => onSaveEdit(task.id!)}
                                title="Guardar cambios"
                              >
                                <i className="bi bi-check-lg"></i>
                              </button>
                              )}
                              <button
                                className="btn btn-secondary"
                                onClick={onCancelEdit}
                                title="Cancelar edición"
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                            </div>
                          ) : (
                            <div className="btn-group btn-group-sm">
                              {hasAuthority('PERMISSION_TAREAS_UPDATE') && (
                              <button
                                className="btn btn-warning me-2"
                                onClick={() => onEditClick(task)}
                                title="Editar tarea"
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                            )}
                            {hasAuthority('PERMISSION_TAREAS_DELETE') && (
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
                                    onDeleteTask(task.id!);
                                  }
                                }}
                                title="Eliminar tarea"
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-start">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTasksModal;