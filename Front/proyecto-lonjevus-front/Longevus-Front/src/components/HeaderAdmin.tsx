import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import '../css/styles.css';

const Header = () => {
    const { hasAuthority } = useAuth();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const [menuActive, setMenuActive] = useState<string | null>(null);
    return (
        <>
            <header className="header">
                <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap py-3">
                    <div className="logo">
                        <Link to={"/roles_permisos"}><img src="/img/logo.jpg" alt="Logo del sitio" />
                        </Link>

                    </div>
                    <nav className="navbar p-0">
                        <ul className="ul-actions d-flex flex-wrap justify-content-end">
                            {hasAuthority('PERMISSION_RESIDENTES_VIEW') && (
                                <li className="ul-actions-li"
                                    onMouseEnter={() => setMenuActive('residents')}
                                    onMouseLeave={() => setMenuActive(null)}>

                                    Residentes

                                    {menuActive === 'residents' && (
                                        <ul className="sub_ul-actions">
                                            {hasAuthority('PERMISSION_RESIDENTES_VIEW') && (
                                                <li className="sub_ul-actions-li">
                                                    <Link className="sub_menu-options" to="/residente/mostrar">Lista de Residentes</Link>
                                                </li>
                                            )}
                                            {hasAuthority('PERMISSION_RESIDENTES_CREATE') && (
                                                <li className="sub_ul-actions-li">
                                                    <Link className="sub_menu-options" to="/residente/agregar">Agregar Residente</Link>
                                                </li>
                                            )}
                                            {hasAuthority('PERMISSION_VISITAS_VIEW') && (
                                                <li className="sub_ul-actions-li">
                                                    <Link className="sub_menu-options" to="/residente/visitas">Registro Visitas</Link>
                                                </li>
                                            )}
                                            {hasAuthority('PERMISSION_HABITACIONES_VIEW') && (
                                                <li className="sub_ul-actions-li">
                                                    <Link className="sub_menu-options" to="/habitaciones">Habitaciones</Link>
                                                </li>
                                            )}
                                            {hasAuthority('PERMISSION_HABITACIONES_CREATE') && (
                                                <li className="sub_ul-actions-li">
                                                    <Link className="sub_menu-options" to="/habitaciones/agregar">Agregar Habitación</Link>
                                                </li>
                                            )}
                                        </ul>
                                    )}

                                </li>
                            )}
                             {hasAuthority('PERMISSION_ACTIVIDADES_VIEW') && (
                            <li className="ul-actions-li"
                                onMouseEnter={() => setMenuActive('activities')}
                                onMouseLeave={() => setMenuActive(null)}>

                                Actividades

                                {menuActive === 'activities' && (
                                    <ul className="sub_ul-actions">
                                         {hasAuthority('PERMISSION_ACTIVIDADES_VIEW') && (
                                        <li className="sub_ul-actions-li">
                                            <Link className="sub_menu-options" to="/actividades/mostrar">Lista de Actividades</Link>
                                        </li>
                                         )}
                                          {hasAuthority('PERMISSION_ACTIVIDADES_CREATE') && (
                                        <li className="sub_ul-actions-li">
                                            <Link className="sub_menu-options" to="/actividad/agregar">Agregar Actividad</Link>
                                        </li>
                                        )}
                                    </ul>
                                )}
                            </li>
                             )}
                            {hasAuthority('PERMISSION_CUIDADORES_VIEW') && (
                                <li className="ul-actions-li"
                                    onMouseEnter={() => setMenuActive('personal')}
                                    onMouseLeave={() => setMenuActive(null)}>

                                    Personal

                                    {menuActive === 'personal' && (
                                        <ul className="sub_ul-actions">
                                            {hasAuthority('PERMISSION_CUIDADORES_VIEW') && (
                                                <li className="sub_ul-actions-li">
                                                    <Link className="sub_menu-options" to="/empleado/mostrar">Lista de Personal</Link>
                                                </li>
                                            )}
                                            {hasAuthority('PERMISSION_CUIDADORES_CREATE') && (
                                                <li className="sub_ul-actions-li">
                                                    <Link className="sub_menu-options" to="/empleado/agregar">Agregar Personal</Link>
                                                </li>
                                            )}
                                        </ul>
                                    )}

                                </li>
                            )}
                            {(hasAuthority('PERMISSION_INVENTARIO_VIEW') || hasAuthority('PERMISSION_COMPRAS_VIEW')) && (
                                <li className="ul-actions-li"
                                    onMouseEnter={() => setMenuActive('inventory')}
                                    onMouseLeave={() => setMenuActive(null)}>

                                    Inventario|Compras

                                    {menuActive === 'inventory' && (
                                        <ul className="sub_ul-actions">
                                            <li className="sub_ul-actions-li">
                                                {hasAuthority('PERMISSION_INVENTARIO_VIEW') && (
                                                    <Link className="sub_menu-options" to="/inventario">Lista de Inventario</Link>
                                                )}
                                                {hasAuthority('PERMISSION_INVENTARIO_VIEW') && (
                                                    <Link className="sub_menu-options" to="/inventario/prioridades">Dashboard Priorizacion</Link>
                                                )}
                                                {hasAuthority('PERMISSION_COMPRAS_VIEW') && (
                                                    <Link className="sub_menu-options" to="/compras">Listar Compras</Link>
                                                )}
                                                {hasAuthority('PERMISSION_COMPRAS_VIEW') && (
                                                    <Link className="sub_menu-options" to="/compras/inactivas">Compras Inactivas</Link>
                                                )}
                                                {hasAuthority('PERMISSION_COMPRAS_CREATE') && (
                                                    <Link className="sub_menu-options" to="/compras/agregar">Agregar Compra</Link>
                                                )}
                                                {hasAuthority('PERMISSION_PRODUCTOS_VIEW') && (
                                                    <Link className="sub_menu-options" to="/productos">Listar Productos</Link>
                                                )}
                                                {hasAuthority('PERMISSION_PRODUCTOS_CREATE') && (
                                                    <Link className="sub_menu-options" to="/productos/agregar">Agregar Productos</Link>
                                                )}
                                                {hasAuthority('PERMISSION_PROVEEDORES_VIEW') && (
                                                    <Link className="sub_menu-options" to="/proveedores">Listar Proveedores</Link>
                                                )}
                                            </li>
                                        </ul>
                                    )}

                                </li>
                            )}
                            {hasAuthority('PERMISSION_INVENTARIO_VIEW') && (
                                <li className="ul-actions-li"
                                    onMouseEnter={() => setMenuActive('conditions')}
                                    onMouseLeave={() => setMenuActive(null)}>

                                    Salud

                                    {menuActive === 'conditions' && (
                                        <ul className="sub_ul-actions">
                                            {hasAuthority('PERMISSION_INVENTARIO_VIEW') && (
                                                <li className="sub_ul-actions-li">
                                                    <Link className="sub_menu-options" to="/condiciones">Condiciones Medicas</Link>
                                                </li>
                                            )}
                                            {hasAuthority('PERMISSION_INVENTARIO_VIEW') && (
                                                <li className="sub_ul-actions-li">
                                                    <Link className="sub_menu-options" to="/residente/mostrar">Asignar a Residentes</Link>
                                                </li>
                                            )}
                                            {hasAuthority('PERMISSION_PRODUCTOS_VIEW') && (
                                                <li className="sub_ul-actions-li">
                                                    <Link className="sub_menu-options" to="/productos">Vincular a Productos</Link>
                                                </li>
                                            )}
                                        </ul>
                                    )}

                                </li>
                            )}
                            {hasAuthority('PERMISSION_PERMISOS_VIEW') && (
                                <li className="ul-actions-li"
                                    onMouseEnter={() => setMenuActive('permissions')}
                                    onMouseLeave={() => setMenuActive(null)}>

                                    Permisos

                                    {menuActive === 'permissions' && (
                                        <ul className="sub_ul-actions">
                                            {hasAuthority('PERMISSION_PERMISOS_VIEW') && (
                                            <li className="sub_ul-actions-li">
                                                <Link className="sub_menu-options" to="/roles_permisos">Mostrar permisos</Link>
                                            </li>
                                            )}
                                        </ul>
                                    )}

                                </li>
                            )}
                             {hasAuthority('PERMISSION_FACTURAS_VIEW') && (
                                <li className="ul-actions-li"
                                    onMouseEnter={() => setMenuActive('Facturas')}
                                    onMouseLeave={() => setMenuActive(null)}>

                                    Facturas

                                    {menuActive === 'Facturas' && (
                                        <ul className="sub_ul-actions">
                                            {hasAuthority('PERMISSION_FACTURAS_VIEW') && (
                                            <li className="sub_ul-actions-li">
                                                <Link className="sub_menu-options" to="/facturas">Mostrar Facturas</Link>
                                            </li>
                                            )}
                                            {hasAuthority('PERMISSION_FACTURAS_CREATE') && (
                                            <li className="sub_ul-actions-li">
                                                <Link className="sub_menu-options" to="/facturas/nueva">Crear Factura</Link>
                                            </li>
                                            )}
                                             {hasAuthority('PERMISSION_FACTURAS_VIEW') && (
                                            <li className="sub_ul-actions-li">
                                                <Link className="sub_menu-options" to="/facturas/inactivas">Canceladas</Link>
                                            </li>
                                            )}
                                        </ul>
                                    )}

                                </li>
                            )}
                            {hasAuthority('PERMISSION_PROVEEDORES_VIEW') && (
                                <li className="ul-actions-li"
                                    onMouseEnter={() => setMenuActive('suppliers')}
                                    onMouseLeave={() => setMenuActive(null)}>

                                    Proveedores

                                    {menuActive === 'suppliers' && (
                                        <ul className="sub_ul-actions">
                                            {hasAuthority('PERMISSION_PROVEEDORES_VIEW') && (
                                                <li className="sub_ul-actions-li">
                                                    <Link className="sub_menu-options" to="/proveedores">Listar Proveedores</Link>
                                                </li>
                                            )}
                                            {hasAuthority('PERMISSION_PROVEEDORES_CREATE') && (
                                                <li className="sub_ul-actions-li">
                                                    <Link className="sub_menu-options" to="/proveedores/agregar">Agregar Proveedores</Link>
                                                </li>
                                            )}
                                        </ul>
                                    )}

                                </li>
                            )}
                            <li className="ul-actions-li"
                                onMouseEnter={() => setMenuActive('user')}
                                onMouseLeave={() => setMenuActive(null)}>

                                Mi perfil

                                {menuActive === 'user' && (
                                    <ul className="sub_ul-actions">
                                        <li className="sub_ul-actions-li">
                                            <Link className="sub_menu-options" to="/perfil">Ver Perfil</Link>
                                        </li>
                                        <li className="sub_ul-actions-li" onClick={handleLogout}>
                                            <span className="sub_menu-options">Cerrar sesión</span>
                                        </li>
                                    </ul>
                                )}

                            </li>

                        </ul>
                    </nav>

                </div>

            </header>
        </>
    );
};

export default Header;
