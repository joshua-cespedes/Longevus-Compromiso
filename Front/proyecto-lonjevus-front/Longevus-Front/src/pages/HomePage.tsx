import { useEffect } from "react";
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";

const HomePage = () => {
  useEffect(() => {
    const scrollBtn = document.getElementById("scrollToTop");

    const handleScroll = () => {
      if (window.scrollY > 200) {
        scrollBtn!.style.display = "block";
      } else {
        scrollBtn!.style.display = "none";
      }
    };

    const handleClick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("scroll", handleScroll);
    scrollBtn?.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      scrollBtn?.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <Header/>
      <section className="hero">
        <div className="hero-content">
          <h1>Hogar de Ancianos La Colonia</h1>
          <p>“Porque en cada vida hay un legado que cuidar.”</p>
          <Link className="btn-visita" to="/visita">Agendar una visita</Link>
        </div>
      </section>
      <Carousel />
      <Footer />
      <button id="scrollToTop" title="Volver arriba">↑</button>
    </>
  );
};

export default HomePage;
