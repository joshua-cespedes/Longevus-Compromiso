import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface IRole {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
}

export interface IPermissionModule {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

// Respuesta de la API 

interface RoleListResponse {
    roles: IRole[];
}

interface PermissionListResponse {
    permissions: IPermissionModule[];
}

export const getAllRoles = async (): Promise<IRole[]> => {
    try {
        const response = await axios.get<RoleListResponse>(`${API_BASE_URL}/roles/list`);
        console.log("ROLES Y PERMISOS " , response.data)
        return response.data.roles;
    } catch (error) {
        console.error('Error al obtener la lista de Roles errorp');
        throw new Error('No se pudo cargar la lista de Roles');
    }
};


export const createRole = async (role: Omit<IRole, 'id'>): Promise<IRole> => {
    try {
        const response = await axios.post<IRole>(
            `${API_BASE_URL}/roles/save`,role
        );
        return response.data;
    } catch (error) {
        console.error('Error al crear el rol:', error);
        throw new Error('No se pudo crear el rol');
    }
};

//Permisos
export const getAllPermissions = async (): Promise<IPermissionModule[]> => {
    try {
        const response = await axios.get<PermissionListResponse>(`${API_BASE_URL}/permissions/list`);
        console.log(response.data.permissions);
        return response.data.permissions;
    } catch (error) {
        console.error('Error al obtener la lista de Permisos:', error);
        throw new Error('No se pudo cargar la lista de Permisos');
    }
};

export const getAllPermissionsById = async (roleId:number): Promise<IPermissionModule[]> => {

    try {
      console.log("rol a buscar: "+roleId);
      const response = await axios.get<IPermissionModule[]>(`${API_BASE_URL}/permissions/list/${roleId}`);
      console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la lista de Permisos:', error);
        throw new Error('No se pudo cargar la lista de Permisos');
    }
};

export const updatePermissions = async (
  roleId: number,
  permissions: IPermissionModule[]
): Promise<void> => {
  try {
    await axios.post(
      `${API_BASE_URL}/permissions/save/${roleId}`,
      permissions,
      
    );
  } catch (error) {
    console.error('Error al actualizar permisos:', error);
    throw new Error('No se pudo editar el permiso');
  }
};

export const deleteRole = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/roles/delete`,{
      params:{id}
    });
    console.log(`Rol con ID ${id} eliminado correctamente`);
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
    throw new Error('No se pudo eliminar el rol');
  }
};



