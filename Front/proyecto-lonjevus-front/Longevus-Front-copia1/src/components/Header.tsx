const Header = () => {
    return (
      <header className="header">
        <div className="logo">
          <img src="/img/logo.jpg" alt="Logo del sitio" />
        </div>
        <nav>
          <ul>
            <li><a href="#">Servicios</a></li>
            <li><a href="#">Sobre Nosotros</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </nav>
      </header>
    );
  };
  
  export default Header;
  