
export type columnDefinition<T>={
    header:string,
    Header?: (props: {
     allRows: T[]; // Todos los datos de la tabla
     selectedRows: Set<number>; // Set con los IDs de las filas seleccionadas (asumiendo que T tiene 'id')
     isSelectedAll: boolean; // Si todas las filas están seleccionadas actualmente
     onSelectAll: (isSelected: boolean) => void; // Función para (de)seleccionar todas
    }) => React.ReactNode;
    accessor: keyof T | ((data: T) => any);
    Cell?: (data: T, index:number) => React.ReactNode;
   
}

export interface GenericTableProps<T>{
    data: T [];
    columns: columnDefinition<T>[];
    selectedRows: Set<number>; // Set con los IDs de las filas seleccionadas
    onToggleRow: (rowId: number) => void; // Función para (de)seleccionar una fila individual
    onSelectAll: (isSelected: boolean) => void; // Función para (de)seleccionar todas las filas
}

function GenericTable<T extends {id: number}>({data,columns,selectedRows,onSelectAll,}: GenericTableProps<T>) {

    // Calculamos si todas las filas están seleccionadas para pasarlo a la cabecera
    const isSelectedAll = data.length > 0 && selectedRows.size === data.length;
    return(
        <table className="table table-responsive table-hover">
            <thead>
                <tr>
                    {columns.map((column, index)=>
                    <th key={index}>     
                            {column.Header ? (
                                // Si tiene un renderizador de cabecera personalizado, lo usamos
                                // Le pasamos la información que necesita
                                column.Header({
                                    allRows: data,
                                    selectedRows: selectedRows,
                                    isSelectedAll: isSelectedAll,
                                    onSelectAll: onSelectAll,
                                })
                            ) : (
                        // Si no, usamos el header string simple
                        column.header
                        )}
                    </th>
                    )}
                </tr>
            </thead>
            <tbody>
                {data.map((rowData, rowIndex)=>
                (<tr key={rowData.id}>                   
                    {columns.map((column, columnIndex) =>{
                        let cellValue: any;
                            if(typeof column.accessor === 'string'){
                                cellValue = rowData[column.accessor];
                            }else if(typeof column.accessor === 'function'){
                                cellValue = column.accessor(rowData);
                            }
                            return(
                                <td key={columnIndex}>
                                    {column.Cell ? column.Cell(rowData, rowIndex): cellValue}
                                </td>
                            );
                        }
                    )}
                </tr>)
                )}
            </tbody>
        </table>
    )
}
export default GenericTable;