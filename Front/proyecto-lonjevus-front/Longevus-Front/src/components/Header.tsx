import { Link } from "react-router-dom";

const Header = () => {
    return (
      <header className="header">
        <div className="logo">
          <Link to={"/"}>
          <img src="/img/logo.jpg" alt="Logo del sitio" />
          </Link>
        </div>
        <nav>
          <ul>
            {/* <li><a href="#">Servicios</a></li>
            <li><a href="#">Sobre Nosotros</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contacto</a></li> */}
          </ul>
        </nav>
      </header>
    );
  };
  
  export default Header;
  