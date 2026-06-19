import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          
          {/* Columna: Dirección */}
          <div className="footer-column">
            <h3>Dirección</h3>
            <p>Hogar de Ancianos de Guápiles</p>
            <p>La Colonia, Guápiles, Limón, Costa Rica</p>
            <div className="mapa-footer">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.52194499198!2d-83.80404383209641!3d10.240523683220607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0b9445a658c99%3A0xe8e01953b8d7cde3!2sHogar%20NOA!5e0!3m2!1ses-419!2scr!4v1746819331742!5m2!1ses-419!2scr"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Columna: Teléfonos */}
          <div className="footer-column">
            <h3>Teléfonos</h3>
            <p>(+506) 2222-2222</p>
            <p>
              <strong>WhatsApp:</strong> (+506) 8888-8888
            </p>
          </div>

          {/* Columna: Contacto */}
          <div className="footer-column">
            <h3>Correo Electrónico</h3>
            <p>
              <a href="mailto:info@hogarlacolonia.cr">
                info@hogarlacolonia.cr
              </a>
            </p>
            
          </div>
        </div>

        {/* Parte inferior */}
        <div className="footer-bottom">
          <Link className="btn-footer" to="/login">Uso Interno</Link>
          <p>&copy; 2025 Hogar de Ancianos La Colonia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
