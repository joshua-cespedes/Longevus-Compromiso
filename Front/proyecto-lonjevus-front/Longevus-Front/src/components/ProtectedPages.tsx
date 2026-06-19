import { Outlet } from "react-router-dom";
import HeaderAdmin from "./HeaderAdmin";
import Footer from "./Footer";


const ProtectedPage = ()=>{
    return(
        <>
        <HeaderAdmin/>
                <Outlet/>
        <Footer/>
        </>
    )

}
export default ProtectedPage;