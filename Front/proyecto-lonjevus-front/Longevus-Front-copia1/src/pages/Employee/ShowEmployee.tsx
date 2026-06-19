import Table from '../../components/TableBasic';
import type {columnDefinition} from '../../components/TableBasic';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';

interface IPerson{
    id: number,
    name: string,
    identification: string,
    email: string,
}
const userData: IPerson[] = [
  { id: 1, name: 'Alice Smith',identification: '3423242' ,email: 'alice@example.com'},
  { id: 4, name: 'Karla ', identification: 't65fg5gs',email: 'bob@example.com'  },
  { id: 7, name: 'Harry', identification: 't65fg5gs',email: 'bob@example.com'  },
  { id: 10, name: 'Krystal', identification: 't65fg5gs',email: 'bob@example.com'  },
  // ... más usuarios
];
const ShowEmployee = () =>{

   const personColumns: columnDefinition<IPerson>[] =[
    {header: '#', accessor: 'id', Cell:(person, index)=>{return(index+1)}},
    {header: 'Nombre', accessor: 'name'},
    {header: 'Identificacion', accessor: 'identification'},
    {header: 'Correo', accessor: 'email'},
    {header: 'Acciones', accessor: (person) => person,   
        Cell: (person) =>(
            <>
            <a className='btn btn-info me-2' onClick={()=>console.log("Mostrar"+person.id)}>
                <i className='bi bi-eye'/>
            </a>
            <a className='btn btn-warning me-2' onClick={()=>console.log("Editar"+person.name)}>
                <i className='bi bi-pencil-square'/>
            </a>
            
            <a className='btn btn-danger me-2' onClick={()=>console.log("Eliminar"+person.id)}>
                <i className="bi bi-trash"/>
            </a>
            
            </>
        )
        
    }
   ];

   return(
    <>
    <Header/>
    <div className='container'>
            <div className='row'>
                <div className='card mt-5 mb-5'>
                    <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                        <h4>Lista de empleados</h4>
                        <Link className='btn btn-success' to='/agregar'>Agregar</Link>
                    </div>
                    <div className='card-body'>
                        <label>Buscar</label>
                        <input type="text" placeholder="Buscar..." id="userSearch"/>
                        <button className="btn btn-secondary" id="btnSearch"><i className='bi bi-search'/></button>
                        <Table<IPerson> data={userData} columns={personColumns} selectedRows={new Set()} onToggleRow={()=>{}} onSelectAll={()=>{}}/>
                    </div>
                </div>
                
            </div>
            
        </div>
        <Footer/>
    </>
        
        
        
   )


   
}
export default ShowEmployee;
