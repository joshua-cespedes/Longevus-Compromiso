import { useState, useEffect } from 'react';
import { getConditions, createCondition, updateCondition, deleteCondition, Condition } from '../../services/ConditionService';
import { succesAlert, errorAlert, confirmDeleteAlert } from '../../js/alerts';

const ConditionsPage = () => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCondition, setEditingCondition] = useState<Condition | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    severity: 'Moderada'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getConditions();
      setConditions(data);
    } catch (error) {
      errorAlert('Error al cargar condiciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCondition) {
        await updateCondition({ ...editingCondition, ...formData });
        succesAlert('Actualizada', 'Condicion actualizada exitosamente');
      } else {
        await createCondition(formData);
        succesAlert('Creada', 'Condicion creada exitosamente');
      }
      setShowForm(false);
      setEditingCondition(null);
      setFormData({ name: '', description: '', severity: 'Moderada' });
      loadData();
    } catch (error) {
      errorAlert('Error al guardar condicion');
    }
  };

  const handleEdit = (condition: Condition) => {
    setEditingCondition(condition);
    setFormData({
      name: condition.name,
      description: condition.description,
      severity: condition.severity
    });
    setShowForm(true);
  };

  const handleDelete = async (condition: Condition) => {
    const result = await confirmDeleteAlert(condition.name);
    if (result.isConfirmed) {
      try {
        await deleteCondition(condition.id);
        succesAlert('Eliminada', 'Condicion eliminada exitosamente');
        loadData();
      } catch (error) {
        errorAlert('Error al eliminar condicion');
      }
    }
  };

  const getSeverityBadge = (severity: string) => {
    const styles: Record<string, string> = {
      'Grave': 'bg-danger',
      'Moderada': 'bg-warning text-dark',
      'Leve': 'bg-success'
    };
    return <span className={`badge ${styles[severity] || 'bg-secondary'}`}>{severity}</span>;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Condiciones Medicas</h2>
        <button
          className="btn btn-primary"
          onClick={() => { setShowForm(true); setEditingCondition(null); setFormData({ name: '', description: '', severity: 'Moderada' }); }}
        >
          + Nueva Condicion
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            {editingCondition ? 'Editar Condicion' : 'Nueva Condicion'}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Ej: Diabetes Tipo 2"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Descripcion</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripcion opcional"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Severidad</label>
                  <select
                    className="form-select"
                    value={formData.severity}
                    onChange={e => setFormData({ ...formData, severity: e.target.value })}
                  >
                    <option value="Leve">Leve</option>
                    <option value="Moderada">Moderada</option>
                    <option value="Grave">Grave</option>
                  </select>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingCondition ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setShowForm(false); setEditingCondition(null); }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Severidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {conditions.map((condition, index) => (
                <tr key={condition.id}>
                  <td>{index + 1}</td>
                  <td><strong>{condition.name}</strong></td>
                  <td>{condition.description || '-'}</td>
                  <td>{getSeverityBadge(condition.severity)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(condition)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(condition)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {conditions.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    No hay condiciones registradas. Cree una nueva para comenzar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConditionsPage;
