const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">MiTienda</h3>
            <p className="text-gray-300">
              Tu mejor opción para gestionar tu inventario y productos.
            </p>
          </div>

          {/* Columna 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Acerca de nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Política de privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Email: contacto@mitienda.com</li>
              <li className="text-gray-300">Teléfono: (123) 456-7890</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>
            © {new Date().getFullYear()} MiTienda. Todos los derechos
            reservados. Desarollado por Martin Camer.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
