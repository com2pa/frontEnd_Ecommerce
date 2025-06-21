import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CarouselComponent = () => {
  // useEffect(() => {
  //   // Inicializar el carrusel con JavaScript vanilla
  //   const myCarousel = document.querySelector('#mainCarousel');
  //   if (myCarousel) {
  //     // Usamos el carrusel de Bootstrap directamente
  //     new window.bootstrap.Carousel(myCarousel, {
  //       interval: 5000,
  //       wrap: true,
  //       keyboard: true,
  //       pause: 'hover'
  //     });
  //   }
  // }, []);

  const carouselItems = [
    {
      id: 1,
      image: "https://via.placeholder.com/1600x500/007bff/ffffff?text=Oferta+Especial",
      title: "Ofertas de Temporada",
      description: "Hasta 50% de descuento en productos seleccionados",
      buttonText: "Comprar ahora",
      buttonClass: "btn-warning"
    },
    {
      id: 2,
      image: "https://via.placeholder.com/1600x500/28a745/ffffff?text=Nuevos+Productos",
      title: "Nueva Colección",
      description: "Descubre nuestros productos más recientes",
      buttonText: "Explorar",
      buttonClass: "btn-success"
    },
    {
      id: 3,
      image: "https://via.placeholder.com/1600x500/dc3545/ffffff?text=Envío+Gratis",
      title: "Envío Gratis",
      description: "En compras superiores a $50.000",
      buttonText: "Ver condiciones",
      buttonClass: "btn-danger"
    }
  ];

  return (
    <div id="mainCarousel" className="carousel slide carousel-fade mb-4" data-bs-ride="carousel">
      {/* Indicadores */}
      <div className="carousel-indicators">
        {carouselItems.map((item, index) => (
          <button 
            key={`indicator-${item.id}`}
            type="button" 
            data-bs-target="#mainCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? 'active' : ''}
            aria-current={index === 0 ? 'true' : ''}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner rounded-3 overflow-hidden shadow-lg">
        {carouselItems.map((item, index) => (
          <div 
            key={`slide-${item.id}`}
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
          >
            <div className="ratio ratio-16x9">
              <img
                src={item.image}
                className="d-block w-100"
                alt={item.title}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-4">
              <div className="container">
                <h2 className="display-5 fw-bold mb-3">{item.title}</h2>
                <p className="lead mb-4">{item.description}</p>
                <button 
                  className={`btn ${item.buttonClass} px-4 py-2 fw-bold`}
                >
                  {item.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles */}
      <button 
        className="carousel-control-prev" 
        type="button" 
        data-bs-target="#mainCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button 
        className="carousel-control-next" 
        type="button" 
        data-bs-target="#mainCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
};

export default CarouselComponent;