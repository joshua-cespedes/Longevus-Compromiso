import Swal from 'sweetalert2'


export function confirmDeleteAlert(param: string){
    return Swal.fire({
      title: `¿Estas seguro que deseas eliminar a ${param}?`,
      text: "Esta accion es definitiva!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
  })
}

export function confirmAlert(param: string){
    return Swal.fire({
      title: `¿Estas seguro que deseas agregar a ${param}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar"
  })
}

export function succesAlert(title: string, message: string){
  return Swal.fire({
        title: title,
        text: message,
        icon: "success",
        timer: 2500
    });
}

export function errorAlert(message:string){
    Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
        timer: 2500
    });
}

export async function loadingAlert<T>(asyncOperation: () => Promise<T>): Promise<T> {
  
  Swal.fire({
    title: 'Cargando datos...',
    html: 'Por favor, espere.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const result = await asyncOperation();
    Swal.close();
    return result;

  } catch (error) {
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los datos.'
    });

    
    throw error;
  }
}
export function confirmEditSupplierAlert(param: string){
    return Swal.fire({
      title: `¿Estas seguro que deseas guardar los cambios a ${param}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar"
  })
}
export const confirmExitAlert = (text: string) => {
  return Swal.fire({
    icon: "warning",
    title: "¿Estás seguro?",
    text: text,
    showCancelButton: true,
    confirmButtonText: "Salir sin guardar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });
};

export const confirmDeletePurchaseAlert = () => {
  return Swal.fire({
    icon: "warning",
    title: "Compra sin productos",
    text: "No puedes guardar una compra vacía. ¿Deseas eliminarla?",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });
};

export function confirmEditAlert(message: string) {
  return Swal.fire({
    title: "¿Deseas Editar?",
    text: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar"
  });
}

export function infoAlert(title: string, message: string) {
  Swal.fire({
    title,
    text: message,
    icon: "info",
    timer: 3000,
  });
}

export function confirmExpiredProductAlert() {
  return Swal.fire({
    icon: "warning",
    title: "Producto vencido",
    text: "Estás agregando un producto vencido. ¿Quieres continuar?",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });
}



export function confirmDeleteSupplierAlert(numberOfProducts:number,supplierName:string){
  return Swal.fire({
    icon: "warning",
    title: "Eliminación delicada",
    text: `¿Seguro que desea aliminar a: ${supplierName}? 
    se eliminara también ${numberOfProducts} ${(numberOfProducts == 1 ? " producto asociado":" productos asociados" )}.`,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });
}
