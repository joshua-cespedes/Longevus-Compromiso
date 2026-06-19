import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getResidentConditions,
  createResidentCondition,
  deleteResidentCondition,
  getConditions,
  ResidentCondition,
  Condition
} from '../../services/ConditionService';
import { succesAlert, errorAlert, confirmDeleteAlert } from '../../js/alerts';
import axios from 'axios';

const ResidentConditionsPage = () => {
  const { residentId } = useParams<{ residentId: string }>();
  const navigate = useNavigate();
  const [residentName, setResidentName] = useState('');
  const [residentConditions, setResidentConditions] = useState<ResidentCondition[]>([]);
  const [allConditions, setAllConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConditionId, setSelectedConditionId] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    if (!residentId) return;
    setLoading(true);
    try {
      const [rcData, conditionsData] = await Promise.all([
        getResidentConditions(parseInt(residentId)),
        getConditions()
      ]);
      setResidentConditions(rcData);
      setAllConditions(conditionsData);

      const res = await axios.get(`http://localhost:8080/residents/findResident?id=${residentId}`);
      setResidentName(res.data.name || '');
    } catch (error) {
      errorAlert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [residentId]);

  const assignedConditionIds = residentConditions.map(rc => rc.condition.id);
  const availableConditions = allConditions.filter(c => !assignedConditionIds.includes(c.id));

  const handleAdd = async () => {
    if (!selectedConditionId || !residentId) return;
    try {
      await createResidentCondition({
        resident: { id: parseInt(residentId), name: '' } as any,
        condition: { id: selectedConditionId, name: '', severity: '' } as any,
        notes: notes
      });
      succesAlert('Agregada', 'Condicion asignada al residente');
      setSelectedConditionId(0);
      setNotes('');
      loadData();
    } catch (error) {
      errorAlert('Error al asignar condicion');
    }
  };

  const handleDelete = async (rc: ResidentCondition) => {
    const result = await confirmDeleteAlert(rc.condition.name);
    if (result.isConfirmed) {
      try {
        await deleteResidentCondition(rc.id);
        succesAlert('Eliminada', 'Condicion removida del residente');
        loadData();
      } catch (error) {
        errorAlert('Error al eliminar');
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
        <div>
          <h2>Condiciones de: {residentName}</h2>
          <small className="text-muted">Residente ID: {residentId}</small>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-header">Asignar Nueva Condicion</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-5">
              <select
                className="form-select"
                value={selectedConditionId}
                onChange={e => setSelectedConditionId(parseInt(e.target.value))}
              >
                <option value={0}>Seleccione una condicion...</option>
                {availableConditions.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.severity})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Notas (opcional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={handleAdd}
                disabled={selectedConditionId === 0}
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Condicion</th>
                <th>Severidad</th>
                <th>Fecha Diagnostico</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {residentConditions.map((rc, index) => (
                <tr key={rc.id}>
                  <td>{index + 1}</td>
                  <td><strong>{rc.condition.name}</strong></td>
                  <td>{getSeverityBadge(rc.condition.severity)}</td>
                  <td>{rc.diagnosedDate || '-'}</td>
                  <td>{rc.notes || '-'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(rc)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              {residentConditions.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    Este residente no tiene condiciones medicas asignadas.
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

export default ResidentConditionsPage;
