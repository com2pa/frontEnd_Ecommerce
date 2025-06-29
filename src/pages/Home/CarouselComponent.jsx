import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const EnhancedCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const carouselItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Ofertas de Temporada",
      description: "Hasta 50% de descuento en productos seleccionados",
      buttonText: "Comprar ahora",
      buttonClass: "btn-warning",
      link: "/ofertas"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Nueva Colección",
      description: "Descubre nuestros productos más recientes",
      buttonText: "Explorar",
      buttonClass: "btn-success",
      link: "/nuevos-productos"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1623787549664-5bad338ae585?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Envío Gratis",
      description: "En compras superiores a $50.000",
      buttonText: "Ver condiciones",
      buttonClass: "btn-danger",
      link: "/envio-gratis"
    }
  ];

  // Auto-rotación del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => 
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToIndex = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="position-relative mb-5">
      {/* Carrusel */}
      <div 
        id="enhancedCarousel" 
        className="carousel slide carousel-fade shadow-lg rounded-3 overflow-hidden"
        data-bs-interval="false" // Desactivamos el intervalo de Bootstrap para controlarlo manualmente
      >
        {/* Indicadores personalizados */}
        <div className="position-absolute bottom-0 start-0 end-0 mb-3 z-1 d-flex justify-content-center">
          {carouselItems.map((_, index) => (
            <button
              key={`indicator-${index}`}
              type="button"
              className={`mx-1 rounded-circle p-2 ${index === activeIndex ? 'bg-primary' : 'bg-secondary bg-opacity-50'}`}
              aria-label={`Ir a slide ${index + 1}`}
              onClick={() => goToIndex(index)}
              style={{
                width: '12px',
                height: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Slides */}
        <div className="carousel-inner">
          {carouselItems.map((item, index) => (
            <div 
              key={`slide-${item.id}`}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
              style={{ transition: 'opacity 0.8s ease' }}
            >
              <div className="ratio ratio-16x9">
                <img
                  src={item.image}
                  className="d-block w-100"
                  alt={item.title}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="carousel-caption d-none d-md-block text-start p-4">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="bg-dark bg-opacity-75 p-4 rounded-3">
                        <h2 className="display-5 fw-bold mb-3 text-white">{item.title}</h2>
                        <p className="lead mb-4 text-white">{item.description}</p>
                        <a 
                          href={item.link}
                          className={`btn ${item.buttonClass} px-4 py-2 fw-bold`}
                        >
                          {item.buttonText}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles personalizados */}
        <button 
          className="carousel-control-prev" 
          type="button" 
          onClick={handlePrev}
          style={{ width: '5%' }}
        >
          <span className="carousel-control-prev-icon bg-dark bg-opacity-50 rounded p-3" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button 
          className="carousel-control-next" 
          type="button" 
          onClick={handleNext}
          style={{ width: '5%' }}
        >
          <span className="carousel-control-next-icon bg-dark bg-opacity-50 rounded p-3" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      {/* Miniaturas para dispositivos grandes */}
      <div className="d-none d-lg-block mt-3">
        <div className="d-flex justify-content-center gap-2">
          {carouselItems.map((item, index) => (
            <button
              key={`thumbnail-${item.id}`}
              className={`border-0 p-0 rounded-2 overflow-hidden ${index === activeIndex ? 'border-primary border-2' : ''}`}
              onClick={() => goToIndex(index)}
              style={{
                width: '100px',
                height: '60px',
                cursor: 'pointer',
                opacity: index === activeIndex ? 1 : 0.7,
                transition: 'opacity 0.3s ease'
              }}
            >
              <img
                src={item.image}
                alt={`Miniatura ${item.title}`}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCarousel;