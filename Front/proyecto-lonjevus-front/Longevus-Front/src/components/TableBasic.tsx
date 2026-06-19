
export type columnDefinition<T>={
    header:string,
    Header?: (props: {
     allRows: T[]; // Todos los datos de la tabla
     selectedRows: Set<number>; // Set con los IDs de las filas seleccionadas (asumiendo que T tiene 'id')
     isSelectedAll: boolean; // Si todas las filas están seleccionadas actualmente
     onSelectAll: (isSelected: boolean) => void; // Función para (des)seleccionar todas
    }) => React.ReactNode;
    accessor: keyof T | ((data: T) => any);
    Cell?: (data: T, index:number) => React.ReactNode;
    render?: (item: T, index: number) => React.ReactNode;
}

export interface GenericTableProps<T>{
    data: T [];
    columns: columnDefinition<T>[];
    selectedRows: Set<number>; // Set con los IDs de las filas seleccionadas
    onToggleRow: (rowId: number) => void; // Función para (de)seleccionar una fila individual
    onSelectAll: (isSelected: boolean) => void; // Función para (de)seleccionar todas las filas
    renderActions?: (item: T) => React.ReactNode;

}

function GenericTable<T extends {id: number}>({data,columns,selectedRows,onSelectAll, onToggleRow,renderActions}: GenericTableProps<T>) {

    // Calculamos si todas las filas están seleccionadas para pasarlo a la cabecera
    const isSelectedAll = data.length > 0 && selectedRows.size === data.length;
    return(
        <div className="table-container">
        <table className="table table-bordered table-hover w-100">

            <thead>
                <tr>
                    {columns.map((column, index)=>
                    <th key={index}>     
                            {column.Header ? (
                                // Si tiene un renderizador de cabecera personalizado
                                column.Header({
                                    allRows: data,
                                    selectedRows: selectedRows,
                                    isSelectedAll: isSelectedAll,
                                    onSelectAll: onSelectAll,
                                })
                            ) : (
                      
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
       </div> 
    )
}
export default GenericTable;