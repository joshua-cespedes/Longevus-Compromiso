import { useEffect, useState } from "react";
import { data } from "../data/data";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="slider">
      <h2>Nuestras Actividades</h2>
      <div className="slider-wrapper">
        <div
          className="slides"
          style={{ transform: `translateX(-${currentIndex * 100}%)`, display: "flex" }}
        >
          {data.map((slide) => (
            <img
              key={slide.id}
              src={slide.imgUrl}
              alt={`Imagen ${slide.id}`}
              className="slide"
            />
          ))}
        </div>
        <div className="dots">
          {data.map((_, index) => (
            <span
              key={index}
              className={index === currentIndex ? "active" : ""}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
