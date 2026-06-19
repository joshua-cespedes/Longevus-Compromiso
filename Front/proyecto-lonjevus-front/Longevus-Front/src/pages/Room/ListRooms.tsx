import {useEffect,useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from "react-router-dom";
import type { columnDefinition } from "../../components/TableBasic";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Table from '../../components/TableBasic';
import { deleteRoom, getAllResidents, getRooms, type IResident } from "../../services/RoomService";
import { confirmDeleteAlert, succesAlert, errorAlert } from '../../js/alerts';
import { useAuth } from "../../context/AuthContext";
interface IRoom{
    id:number,
    statusRoom:string,
    roomType:string,
    bedCount:number,
    isActive:boolean,
    roomNumber:number
}

const RoomList=() => {

    const [userData, setUserData] = useState<IResident[]>([]);
    const [roomData,setRoomData] = useState<IRoom[]>([])
    const [loading,setLoading] = useState<boolean>(true);
    const [error,setError] = useState<string | null>(null);
    const {hasAuthority} =  useAuth();
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredRooms = roomData.filter(room =>{
        const term = searchTerm.toLowerCase();
        return(
            room.roomNumber.toString().toLocaleLowerCase().includes(term)
        )


    });

    const roomColumns: columnDefinition<IRoom>[]=[

        {header:'#', accessor:'id',Cell:(_room,index)=>{return(index+1)}},
        {header:'Estado De Habitación',accessor:'statusRoom'},
        {header:'Tipo de Habitación',accessor:'roomType'},
        {header:'Cantidad de camas',accessor:'bedCount'},
        {header:'Numero de habitación',accessor:'roomNumber'},
        {header: 'Acciones', accessor: (room) => room,   
                Cell: (room) =>(
                    <>
                    {hasAuthority('PERMISSION_HABITACIONES_UPDATE')&& (
                    <Link className="btn btn-warning me-2" to={`/habitaciones/editar/${room.id}`}><i className='bi bi-pencil-square' /></Link>
                    )}
                    {hasAuthority('PERMISSION_HABITACIONES_DELETE')&& (
                    <a className='btn btn-danger me-2' onClick={()=>handleDelete(room.id,room.roomNumber)}>
                        <i className="bi bi-trash"/>
                    </a>  
                    )}
                    </>
        )}];

    useEffect(()=>{
        loadRooms();
        getAllResidents()
        .then((data)=>setUserData(data))
        .catch((error) => console.error('Error al obtener los residentes: ',error));
    },[]);

    const loadRooms = async () =>{
        try{
            const rooms = await getRooms();

            setRoomData(rooms);
            setLoading(false);
        }catch(err){
            setError(err instanceof Error ? err.message : "Error al cargar habitaciones");
            setLoading(false);
        }
    };

    if(loading){
        return(
            <>
            <Header/>
            <div className="container mt-5">Cargando Habitaciones...</div>
            <Footer/>
            </>
        );
    }

    if(error){
        return(
             <>
            <Header/>
            <div className="container mt-5 text-danger" >{error}</div>
            <Footer/>
            </>
        );

    }

    const handleDelete = async (id: number,roomNumber:number) => {
        //const confirmDelete = window.confirm("¿Seguro que deseas eliminar esta habitacion?");
        const response = await confirmDeleteAlert("la habitación");

        const hasResidents = userData.some(res => res.numberRoom === roomNumber);
        console.log(`HasResidents: ${hasResidents}`)
        if (hasResidents) {
            errorAlert("No se puede eliminar porque hay residentes en ella");
            return;
        }

        if (response.isConfirmed){
      
         try {
            console.log("eliminada la habitacion")
            await deleteRoom(id);
            setRoomData((prev) => prev.filter((p) => p.id !== id));
            succesAlert("Eliminado","Habitación eliminada");
          } catch (err) {
            alert(err instanceof Error ? err.message : "Error desconocido al eliminar habitacion");
          }finally{
            setLoading(false);
          };
    }else{
        return;
    }
}
        return(
             <>  
    {/* <Header/> */}
      <div className="container ">
        <div className='row'>
            <div className='card mt-5 mb-5'>
                <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                        <h4 className="m-2">Lista de habitaciones</h4>
                        {hasAuthority('PERMISSION_HABITACIONES_UPDATE')&& (
                            <Link className='btn btn-success' to='/habitaciones/agregar'><i className="bi bi-building-add"></i> </Link>
                        )}
                </div>  
                <div className='card-body'>
                        <input className="mb-3" type="text" placeholder="Buscar por número..." id="RoomSearch" value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
                      
                        <Table<IRoom> data={filteredRooms} columns={roomColumns} selectedRows={new Set()} onToggleRow={()=>{}} onSelectAll={()=>{}}/>
                </div>
            </div>
        </div>
      </div>
    {/* <Footer/> */}
  </>  
        );
};

export default RoomList;

