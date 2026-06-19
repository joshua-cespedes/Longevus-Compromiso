import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProductConditions,
  createProductCondition,
  deleteProductCondition,
  getConditions,
  ProductCondition,
  Condition
} from '../../services/ConditionService';
import { succesAlert, errorAlert, confirmDeleteAlert } from '../../js/alerts';
import axios from 'axios';

const ProductConditionsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [productConditions, setProductConditions] = useState<ProductCondition[]>([]);
  const [allConditions, setAllConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConditionId, setSelectedConditionId] = useState<number>(0);
  const [relationshipType, setRelationshipType] = useState('Indicado');
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const [pcData, conditionsData] = await Promise.all([
        getProductConditions(parseInt(productId)),
        getConditions()
      ]);
      setProductConditions(pcData);
      setAllConditions(conditionsData);

      const res = await axios.get(`http://localhost:8080/products/getById?id=${productId}`);
      setProductName(res.data.name || '');
    } catch (error) {
      errorAlert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [productId]);

  const assignedConditionIds = productConditions.map(pc => pc.condition.id);
  const availableConditions = allConditions.filter(c => !assignedConditionIds.includes(c.id));

  const handleAdd = async () => {
    if (!selectedConditionId || !productId) return;
    try {
      await createProductCondition({
        product: { id: parseInt(productId), name: '', category: '' } as any,
        condition: { id: selectedConditionId, name: '', severity: '' } as any,
        relationshipType,
        notes
      });
      succesAlert('Vinculada', 'Condicion vinculada al producto');
      setSelectedConditionId(0);
      setNotes('');
      setRelationshipType('Indicado');
      loadData();
    } catch (error) {
      errorAlert('Error al vincular condicion');
    }
  };

  const handleDelete = async (pc: ProductCondition) => {
    const result = await confirmDeleteAlert(pc.condition.name);
    if (result.isConfirmed) {
      try {
        await deleteProductCondition(pc.id);
        succesAlert('Eliminada', 'Vinculo removido del producto');
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

  const getRelationshipBadge = (type: string) => {
    return type === 'Indicado'
      ? <span className="badge bg-primary">Indicado</span>
      : <span className="badge bg-danger">Contraindicado</span>;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Condiciones de: {productName}</h2>
          <small className="text-muted">Producto ID: {productId}</small>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-header">Vincular Nueva Condicion</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
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
            <div className="col-md-3">
              <select
                className="form-select"
                value={relationshipType}
                onChange={e => setRelationshipType(e.target.value)}
              >
                <option value="Indicado">Indicado (el medicamento trata esta condicion)</option>
                <option value="Contraindicado">Contraindicado (no usar con esta condicion)</option>
              </select>
            </div>
            <div className="col-md-3">
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
                Vincular
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
                <th>Tipo</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productConditions.map((pc, index) => (
                <tr key={pc.id}>
                  <td>{index + 1}</td>
                  <td><strong>{pc.condition.name}</strong></td>
                  <td>{getSeverityBadge(pc.condition.severity)}</td>
                  <td>{getRelationshipBadge(pc.relationshipType)}</td>
                  <td>{pc.notes || '-'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(pc)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              {productConditions.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    Este producto no tiene condiciones medicas vinculadas.
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

export default ProductConditionsPage;
