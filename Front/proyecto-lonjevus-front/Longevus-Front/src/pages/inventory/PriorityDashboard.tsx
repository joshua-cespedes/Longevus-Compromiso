import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPrioritizedProducts, getAlerts, recordExit, PrioritizedProduct, Alert } from '../../services/InventoryPredictionService';
import { succesAlert, errorAlert, confirmDeleteAlert } from '../../js/alerts';
import { hasAuthority } from '../../context/AuthContext';

const PriorityDashboard = () => {
  const [products, setProducts] = useState<PrioritizedProduct[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'prioritized' | 'alerts'>('prioritized');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<PrioritizedProduct | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, alertsData] = await Promise.all([
        getPrioritizedProducts(),
        getAlerts()
      ]);
      setProducts(productsData);
      setAlerts(alertsData);
    } catch (error) {
      errorAlert('Error al cargar datos de prediccion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = filterLevel === 'all'
    ? products
    : products.filter(p => p.level === filterLevel);

  const handleRecordExit = async (inventoryId: number, productName: string) => {
    const result = await confirmDeleteAlert(productName);
    if (result.isConfirmed) {
      try {
        await recordExit(inventoryId, 'Consumo registrado desde dashboard');
        succesAlert('Salida registrada', 'El movimiento fue registrado exitosamente');
        loadData();
      } catch (error) {
        errorAlert('Error al registrar salida');
      }
    }
  };

  const getLevelBadge = (level: string) => {
    const styles: Record<string, string> = {
      'Critico': 'bg-danger text-white',
      'Alto': 'bg-warning text-dark',
      'Medio': 'bg-info text-white',
      'Bajo': 'bg-success text-white'
    };
    return <span className={`badge ${styles[level] || 'bg-secondary'}`}>{level}</span>;
  };

  const getSeverityBadge = (severity: string) => {
    const styles: Record<string, string> = {
      'Critica': 'bg-danger text-white',
      'Advertencia': 'bg-warning text-dark'
    };
    return <span className={`badge ${styles[severity] || 'bg-secondary'}`}>{severity}</span>;
  };

  const criticalCount = alerts.filter(a => a.severity === 'Critica').length;
  const warningCount = alerts.filter(a => a.severity === 'Advertencia').length;
  const criticalProducts = products.filter(p => p.level === 'Critico').length;

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard de Priorizacion de Inventario</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/inventario')}>
          Volver al Inventario
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body text-center">
              <h5 className="card-title">Criticos</h5>
              <h2>{criticalProducts}</h2>
              <p className="card-text">productos prioritarios</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body text-center">
              <h5 className="card-title">Alertas Criticas</h5>
              <h2>{criticalCount}</h2>
              <p className="card-text">requieren accion inmediata</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-body text-center">
              <h5 className="card-title">Advertencias</h5>
              <h2>{warningCount}</h2>
              <p className="card-text">riesgo moderado</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body text-center">
              <h5 className="card-title">Total Productos</h5>
              <h2>{products.length}</h2>
              <p className="card-text">en inventario activo</p>
            </div>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'prioritized' ? 'active' : ''}`}
            onClick={() => setActiveTab('prioritized')}
          >
            Productos Priorizados
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            Alertas ({alerts.length})
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Calculando prioridades...</p>
        </div>
      ) : (
        <>
          {activeTab === 'prioritized' && (
            <>
              <div className="mb-3">
                <label className="form-label fw-bold">Filtrar por nivel:</label>
                <div className="btn-group ms-2">
                  {['all', 'Critico', 'Alto', 'Medio', 'Bajo'].map(level => (
                    <button
                      key={level}
                      className={`btn btn-sm ${filterLevel === level ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setFilterLevel(level)}
                    >
                      {level === 'all' ? 'Todos' : level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Producto</th>
                      <th>Categoria</th>
                      <th>Stock</th>
                      <th>Consumo 30d</th>
                      <th>Demanda Proyect.</th>
                      <th>Vencimiento</th>
                      <th>Score</th>
                      <th>Nivel</th>
                      <th>Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <tr key={product.productId} className={product.level === 'Critico' ? 'table-danger' : ''}>
                        <td>{index + 1}</td>
                        <td><strong>{product.productName}</strong></td>
                        <td>{product.category}</td>
                        <td>
                          <span className={product.stockActual <= 3 ? 'text-danger fw-bold' : ''}>
                            {product.stockActual}
                          </span>
                        </td>
                        <td>{product.consumosUltimos30d}</td>
                        <td>{product.demandaProyectada30d}</td>
                        <td>
                          {product.diasParaVencimiento !== null ? (
                            <span className={product.diasParaVencimiento <= 30 ? 'text-danger fw-bold' : ''}>
                              {product.diasParaVencimiento} dias
                            </span>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td><strong>{(product.priorityScore * 100).toFixed(1)}%</strong></td>
                        <td>{getLevelBadge(product.level)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => setSelectedProduct(selectedProduct?.productId === product.productId ? null : product)}
                          >
                            {selectedProduct?.productId === product.productId ? 'Ocultar' : 'Ver'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={10} className="text-center py-4 text-muted">
                          No hay productos que mostrar con este filtro.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {selectedProduct && (
                <div className="card mt-3 border-primary">
                  <div className="card-header bg-primary text-white">
                    <strong>Detalle de Prioridad: {selectedProduct.productName}</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h6>Factores de Ponderacion:</h6>
                        <table className="table table-sm">
                          <tbody>
                            <tr>
                              <td>Factor Vencimiento (25%)</td>
                              <td className="text-end">{(selectedProduct.factorVencimiento * 100).toFixed(1)}%</td>
                            </tr>
                            <tr>
                              <td>Factor Categoria (15%)</td>
                              <td className="text-end">{(selectedProduct.factorCategoria * 100).toFixed(1)}%</td>
                            </tr>
                            <tr>
                              <td>Factor Rotacion (15%)</td>
                              <td className="text-end">{(selectedProduct.factorRotacion * 100).toFixed(1)}%</td>
                            </tr>
                            <tr>
                              <td>Factor Stock Bajo (15%)</td>
                              <td className="text-end">{(selectedProduct.factorStockBajo * 100).toFixed(1)}%</td>
                            </tr>
                            <tr className="table-primary">
                              <td><strong>Factor Demanda Medica (30%)</strong></td>
                              <td className="text-end"><strong>{(selectedProduct.factorDemandaMedica * 100).toFixed(1)}%</strong></td>
                            </tr>
                            <tr className="table-dark text-white">
                              <td><strong>SCORE TOTAL</strong></td>
                              <td className="text-end"><strong>{(selectedProduct.priorityScore * 100).toFixed(1)}%</strong></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-md-6">
                        <h6>Resumen:</h6>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">Stock actual: <strong>{selectedProduct.stockActual}</strong></li>
                          <li className="list-group-item">Demanda proyectada (30 dias): <strong>{selectedProduct.demandaProyectada30d}</strong></li>
                          <li className="list-group-item">
                            Dias para vencimiento: <strong>
                              {selectedProduct.diasParaVencimiento !== null ? `${selectedProduct.diasParaVencimiento} dias` : 'Sin fecha'}
                            </strong>
                          </li>
                          <li className="list-group-item">
                            Riesgo de desabastecimiento: {' '}
                            {selectedProduct.stockActual < selectedProduct.demandaProyectada30d ? (
                              <span className="badge bg-danger">ALTO</span>
                            ) : (
                              <span className="badge bg-success">BAJO</span>
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'alerts' && (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Tipo</th>
                    <th>Producto</th>
                    <th>Categoria</th>
                    <th>Stock</th>
                    <th>Severidad</th>
                    <th>Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert, index) => (
                    <tr key={index} className={alert.severity === 'Critica' ? 'table-danger' : 'table-warning'}>
                      <td>{alert.type === 'STOCKOUT_RISK' ? 'Stock Bajo' : 'Vencimiento'}</td>
                      <td><strong>{alert.productName}</strong></td>
                      <td>{alert.category}</td>
                      <td>{alert.stockActual}</td>
                      <td>{getSeverityBadge(alert.severity)}</td>
                      <td>{alert.message}</td>
                    </tr>
                  ))}
                  {alerts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        No hay alertas activas en este momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PriorityDashboard;
