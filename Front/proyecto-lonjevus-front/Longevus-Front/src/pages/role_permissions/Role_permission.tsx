
import React, { useState, useEffect } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/HeaderAdmin'
import type { columnDefinition } from '../../components/TableBasic'
import Table from '../../components/TableBasic';
import { useAuth } from '../../context/AuthContext';
import { succesAlert, errorAlert, confirmEditAlert, confirmDeleteAlert } from '../../js/alerts';
import { useNavigate } from 'react-router-dom';
import { createRole, deleteRole, getAllPermissions, getAllPermissionsById, getAllRoles, updatePermissions } from '../../services/RolePermissionsService';

interface IRole {
  id: number
  name: string
  description: string
  isActive: boolean
}

interface IPermissionModule {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}


const RolesList = () => {
  const navigate = useNavigate();
  const { hasAuthority,logout } = useAuth();
  const [rolesData, setRolesData] = useState<IRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [currentRole, setCurrentRole] = useState<IRole | null>(null);
  const [permissions, setPermissions] = useState<IPermissionModule[]>([]);
  const [loadingPerms, setLoadingPerms] = useState(false);

  const fetchRoles = () => { setLoadingRoles(true); getAllRoles().then(setRolesData).catch(console.error).finally(() => setLoadingRoles(false)) };
  //Cargar roles al montar
  useEffect(() => {
    setLoadingRoles(true);
    fetchRoles();
  }, []);
  //Columnas de la tabla
  const rolesColumns: columnDefinition<IRole>[] = [
    { header: '#', accessor: 'id', Cell: (_r, idx) => idx + 1 },
    { header: 'Nombre', accessor: 'name' },
    { header: 'Descripción', accessor: 'description' },
    {
      header: 'Permisos',
      accessor: role => role,
      Cell: role => (
        <>
        {hasAuthority('PERMISSION_ROLES_UPDATE')&& (
          <button
            className="btn btn-warning"
            onClick={() => handleOpenModalRoleEdit(role)}
          >
            <i className="bi bi-key-fill"></i>
          </button>
        )}
          {' '}
          {hasAuthority('PERMISSION_ROLES_DELETE')&& (
          <button className='btn btn-danger me-2' onClick={() => handleDelete(role.id, role.name)}>
            <i className="bi bi-trash" />
          </button>
          )}
        </>
      )
    }
  ];

  // Estado para el modal de “nuevo rol”
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);

  // Estado para el formulario
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRoleIsActive, setNewRoleIsActive] = useState(true);

  // Abre modal creación
  const handleOpenAddRoleModal = () => {
    setNewRoleName('');
    setNewRoleDescription('');
    setNewRoleIsActive(true);
    setShowAddRoleModal(true);
  };

  // Cierra modal creación
  const handleCloseNewModal = () => {
    setShowAddRoleModal(false);
  };

  // Crea el rol y actualiza la lista
  const handleCreateRole = async () => {
    try {
      const created = await createRole({
        name: newRoleName,
        description: newRoleDescription,
        isActive: newRoleIsActive
      });
      // Añade el rol nuevo al array para que aparezca en la tabla
      setRolesData(prev => [...prev, created]);
      succesAlert('Rol creado', `Se creó el rol correctamente`);
      handleCloseNewModal();
      fetchRoles();
    } catch (e) {
      console.error(e);
    }
  };


  //  Abrir modal y cargar permisos del rol
  const handleOpenModalRoleEdit = (role: IRole) => {
    setCurrentRole(role);
    setLoadingPerms(true);

    getAllPermissionsById(role.id)
      .then(apiPerms => {
        // mapeo de canX → X
        const mapped = apiPerms.map(p => ({
          module: p.module,
          canView: !!p.canView,
          canCreate: !!p.canCreate,
          canUpdate: !!p.canUpdate,
          canDelete: !!p.canDelete,
        }));
        setPermissions(mapped);
        setShowModal(true);
      })
      .catch(console.error)
      .finally(() => setLoadingPerms(false));
  };


  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentRole(null);
    setPermissions([]);
  };

  const handleToggle = (index: number, field: keyof Omit<IPermissionModule, 'module'>) => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

  const handleSave = async () => {
    if (!currentRole) return;

    try {
      await updatePermissions(currentRole.id, permissions);
      succesAlert('Permisos Actualizados', 'Los permisos se han guardado correctamente. Por seguridad, se cerrará la sesión para aplicar los cambios.');
      logout();
      navigate('/login');
    } catch (e) {
      errorAlert("Ha ocurrido un error inesperado");
      console.log(e);
    } finally {
      handleCloseModal();
      const response = await confirmEditAlert(`l rol: ${currentRole.name}`);

      if (response.isConfirmed) {

        try {
          updatePermissions(currentRole.id, permissions);
          succesAlert("Actualizado", "Habitacion actualizada");
        } catch (e) {
          console.log(e);
        } finally {
          handleCloseModal();
        }
      }

    };
  }

  const handleDelete = async (roleId: number, roleName: string) => {
    console.log(`ID SELECCIONADO PARA BORRAR${roleId}`)
    const response = await confirmDeleteAlert(roleName);
    if (response.isConfirmed) {

      try {
        if(roleId===1){
          errorAlert(`No se puede eliminar el Role: ${roleName}`);
          return;
        }

        await deleteRole(roleId);
        succesAlert("Eliminado", "Rol eliminado exitosamente");
        fetchRoles();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Error desconocido al eliminar proveedor");
      } finally {

      }
    } else {
      return;
    }
  }


  return (
    <>
      {/* <Header /> */}
      <div className="container">
        <div className='row'>
          <div className='card mt-5 mb-5'>
            <div className="card-title d-flex justify-content-between align-items-center mt-3">
              <h2 className="flex-grow-1 mt-2">
                <i className="bi bi-person-badge me-2"></i>
                Roles Usuario Hogar de Ancianos
              </h2>
              {hasAuthority('PERMISSION_ROLES_CREATE')&& (
              <button className="btn btn-success" onClick={handleOpenAddRoleModal}>
                <i className="bi bi-plus-square"></i> Nuevo
              </button>
              )}
            </div>
            <div className="card-body">
              {loadingRoles
                ? <p>Cargando roles...</p>
                : <Table<IRole> data={rolesData} columns={rolesColumns} selectedRows={new Set()} onToggleRow={() => { }} onSelectAll={() => { }} />
              }
            </div>
          </div>
        </div>
      </div>
      {showModal && (

        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Permisos para: <strong>{currentRole?.name}</strong></h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">

                {permissions.length === 0

                  ? <p>Cargando Permisos...</p> : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Modulo</th>
                          <th>VER</th>
                          <th>INSERTAR</th>
                          <th>ACTUALIZAR</th>
                          <th>ELIMINAR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {permissions.map((perm, idx) => (
                          <tr key={perm.module}>
                            <td>{perm.module}</td>
                            <td>
                              <input type="checkbox" checked={!!perm.canView} onChange={() => handleToggle(idx, 'canView')} />
                            </td>
                            <td>
                              <input type="checkbox" checked={!!perm.canCreate} onChange={() => handleToggle(idx, 'canCreate')} />
                            </td>
                            <td>
                              <input type="checkbox" checked={!!perm.canUpdate} onChange={() => handleToggle(idx, 'canUpdate')} />
                            </td>
                            <td>
                              <input type="checkbox" checked={!!perm.canDelete} onChange={() => handleToggle(idx, 'canDelete')} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                }
              </div>
              <div className="modal-footer d-flex justify-content-start">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar</button>
              </div>
            </div>
          </div>

        </div>
      )}
      {showAddRoleModal && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear nuevo rol</h5>
                <button className="btn-close" onClick={handleCloseNewModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRoleName}
                    onChange={e => setNewRoleName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRoleDescription}
                    onChange={e => setNewRoleDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-start">
                <button className="btn btn-secondary" onClick={handleCloseNewModal}>
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreateRole}
                  disabled={!newRoleName.trim()}
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <Footer /> */}
    </>
  )
}
export default RolesList;
