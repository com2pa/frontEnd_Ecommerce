import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaBitcoin,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className='bg-gray-900 text-white pt-12 pb-6'>
      <div className='container mx-auto px-4'>
        {/* Sección Superior */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
          {/* Información de la Empresa */}
          <div className='space-y-4'>
            <h3 className='text-2xl font-bold text-indigo-400'>MiTienda</h3>
            <p className='text-gray-300'>
              La mejor selección de productos con envíos a todo el país. Calidad
              garantizada.
            </p>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='text-gray-300 hover:text-indigo-400 transition'
              >
                <FaFacebook size={24} />
              </a>
              <a
                href='#'
                className='text-gray-300 hover:text-indigo-400 transition'
              >
                <FaInstagram size={24} />
              </a>
              <a
                href='#'
                className='text-gray-300 hover:text-indigo-400 transition'
              >
                <FaTwitter size={24} />
              </a>
              <a
                href='#'
                className='text-gray-300 hover:text-indigo-400 transition'
              >
                <FaYoutube size={24} />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold'>Enlaces Rápidos</h4>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-gray-300 hover:text-indigo-400 transition'
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-300 hover:text-indigo-400 transition'
                >
                  Productos
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-300 hover:text-indigo-400 transition'
                >
                  Ofertas
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-300 hover:text-indigo-400 transition'
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Métodos de Pago */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold'>Aceptamos</h4>
            <div className='flex flex-wrap gap-4'>
              <FaCcVisa
                size={32}
                className='text-gray-300 hover:text-blue-500 transition'
              />
              <FaCcMastercard
                size={32}
                className='text-gray-300 hover:text-red-500 transition'
              />
              <FaCcPaypal
                size={32}
                className='text-gray-300 hover:text-blue-400 transition'
              />
              <FaBitcoin
                size={32}
                className='text-gray-300 hover:text-orange-500 transition'
              />
            </div>
            <p className='text-sm text-gray-400'>
              Transacciones 100% seguras con encriptación SSL
            </p>
          </div>
        </div>

        {/* Línea Divisora */}
        <div className='border-t border-gray-700 my-6'></div>

        {/* Sección Inferior */}
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <p className='text-gray-400 text-sm'>
            © {new Date().getFullYear()} MiTienda. Todos los derechos
            reservados.
          </p>
          <div className='flex space-x-6 mt-4 md:mt-0'>
            <a
              href='#'
              className='text-gray-400 hover:text-indigo-400 text-sm transition'
            >
              Términos y Condiciones
            </a>
            <a
              href='#'
              className='text-gray-400 hover:text-indigo-400 text-sm transition'
            >
              Política de Privacidad
            </a>
            <a
              href='#'
              className='text-gray-400 hover:text-indigo-400 text-sm transition'
            >
              Preguntas Frecuentes
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
