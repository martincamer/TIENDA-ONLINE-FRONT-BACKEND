import { useEffect, useState } from "react";
import { useProductos } from "../../context/ProductosContext";
import { FaSearch, FaFilter, FaStar, FaTimes } from "react-icons/fa";
import { formatearDinero } from "../../utils/formatearDinero";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ProductosTienda = () => {
  const { obtenerProductosPublicos, categorias } = useProductos();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: "",
    precioMin: "",
    precioMax: "",
    ordenar: "",
    busqueda: "",
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 10;
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await obtenerProductosPublicos();
        setProductos(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  // Filtrar productos
  const productosFiltrados = productos.filter((producto) => {
    return (
      (!filtros.categoria || producto.categoria === filtros.categoria) &&
      (!filtros.precioMin ||
        producto.precio_venta >= Number(filtros.precioMin)) &&
      (!filtros.precioMax ||
        producto.precio_venta <= Number(filtros.precioMax)) &&
      (!filtros.busqueda ||
        producto.nombre
          .toLowerCase()
          .includes(filtros.busqueda.toLowerCase()) ||
        producto.descripcion
          .toLowerCase()
          .includes(filtros.busqueda.toLowerCase()))
    );
  });

  // Ordenar productos
  if (filtros.ordenar) {
    productosFiltrados.sort((a, b) => {
      switch (filtros.ordenar) {
        case "precio-asc":
          return a.precio_venta - b.precio_venta;
        case "precio-desc":
          return b.precio_venta - a.precio_venta;
        case "nombre":
          return a.nombre.localeCompare(b.nombre);
        default:
          return 0;
      }
    });
  }

  // Calcular índices para la paginación
  const indexUltimoProducto = paginaActual * productosPorPagina;
  const indexPrimerProducto = indexUltimoProducto - productosPorPagina;
  const productosActuales = productosFiltrados.slice(
    indexPrimerProducto,
    indexUltimoProducto
  );
  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );

  // Función para cambiar de página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-20 min-h-screen md:w-11/12 lg:w-4/5 mx-auto">
      {/* Barra de búsqueda */}
      <div className="mb-8">
        <div className="relative mx-auto">
          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            className="w-full py-3 px-4 pl-12 bg-white border 
            focus:shadow-md transition-shadow duration-200 ease-in-out
            placeholder:text-gray-400 text-gray-700
            outline-none"
            value={filtros.busqueda}
            onChange={(e) =>
              setFiltros({ ...filtros, busqueda: e.target.value })
            }
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>

          {/* Botón de búsqueda */}
          <button
            className="absolute inset-y-0 right-0 px-4 flex items-center bg-blue-500 
            text-white font-medium hover:bg-blue-600 transition-colors duration-200 border-blue-500"
          >
            Buscar
          </button>
        </div>

        {/* Sugerencias de búsqueda populares */}
        {!filtros.busqueda && (
          <div className="mt-2 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>Populares:</span>
            <div className="flex flex-wrap gap-2">
              {["Laptops", "Smartphones", "Auriculares"].map((sugerencia) => (
                <button
                  key={sugerencia}
                  onClick={() =>
                    setFiltros({ ...filtros, busqueda: sugerencia })
                  }
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  {sugerencia}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botón para mostrar filtros en mobile */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(true)}
          className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center gap-2"
        >
          <FaFilter />
          Mostrar Filtros
        </button>
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-200px)]">
        {/* Filtros para desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white p-6 border sticky top-20">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaFilter /> Filtros
            </h2>

            {/* Categorías */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Categorías</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFiltros({ ...filtros, categoria: "" })}
                  className={`px-4 py-2 rounded-full text-sm transition-colors
                    ${
                      !filtros.categoria
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                  Todas
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() =>
                      setFiltros({ ...filtros, categoria: cat.nombre })
                    }
                    className={`px-4 py-2 rounded-full text-sm transition-colors capitalize
                      ${
                        filtros.categoria === cat.nombre
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Rango de precios */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Precio</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 p-2 border outline-none"
                  value={filtros.precioMin}
                  onChange={(e) =>
                    setFiltros({ ...filtros, precioMin: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 p-2 border outline-none"
                  value={filtros.precioMax}
                  onChange={(e) =>
                    setFiltros({ ...filtros, precioMax: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Ordenar por */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Ordenar por</h3>
              <select
                className="w-full p-2 border outline-none"
                value={filtros.ordenar}
                onChange={(e) =>
                  setFiltros({ ...filtros, ordenar: e.target.value })
                }
              >
                <option value="">Relevancia</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
                <option value="nombre">Nombre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal de filtros para mobile */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                className="fixed right-0 top-0 h-full w-80 bg-white z-50 overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Filtros</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {/* Categorías */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Categorías</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          setFiltros({ ...filtros, categoria: "" })
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                          ${
                            !filtros.categoria
                              ? "bg-blue-50 text-blue-600"
                              : "hover:bg-gray-50"
                          }`}
                      >
                        Todas las categorías
                      </button>
                      {categorias?.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() =>
                            setFiltros({ ...filtros, categoria: cat.nombre })
                          }
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                            ${
                              filtros.categoria === cat.nombre
                                ? "bg-blue-50 text-blue-600"
                                : "hover:bg-gray-50"
                            }`}
                        >
                          {cat.nombre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rango de Precios */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Rango de Precios</h3>
                    <div className="flex gap-2">
                      <div>
                        <label className="text-sm text-gray-600">Mínimo</label>
                        <input
                          type="number"
                          value={filtros.precioMin}
                          onChange={(e) =>
                            setFiltros({
                              ...filtros,
                              precioMin: e.target.value,
                            })
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Min"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Máximo</label>
                        <input
                          type="number"
                          value={filtros.precioMax}
                          onChange={(e) =>
                            setFiltros({
                              ...filtros,
                              precioMax: e.target.value,
                            })
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ordenar por */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Ordenar por</h3>
                    <select
                      value={filtros.ordenar}
                      onChange={(e) =>
                        setFiltros({ ...filtros, ordenar: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Relevancia</option>
                      <option value="precio-asc">Menor precio</option>
                      <option value="precio-desc">Mayor precio</option>
                      <option value="nombre">Nombre A-Z</option>
                    </select>
                  </div>

                  {/* Botones de acción */}
                  <div className="space-y-2 mt-8">
                    <button
                      onClick={() => {
                        setFiltros({
                          categoria: "",
                          precioMin: "",
                          precioMax: "",
                          ordenar: "",
                          busqueda: "",
                        });
                        setShowFilters(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Limpiar Filtros
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Aplicar Filtros
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Grid de productos */}
        <div className="flex-1">
          {productosFiltrados.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-center text-gray-500">
                No hay productos disponibles
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {productosActuales.map((producto) => (
                  <Link
                    to={`/producto/${producto._id}`}
                    key={producto._id}
                    className="bg-white hover:shadow-md transition-shadow border overflow-hidden flex flex-col"
                  >
                    <div className="relative h-48 md:h-56">
                      <img
                        src={producto?.imagen}
                        alt={producto?.nombre}
                        className="w-full h-full object-contain p-4"
                      />
                      {producto.stock === 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                          Agotado
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-1 text-yellow-400 mb-2">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar className="text-gray-300" />
                      </div>

                      <h3 className="text-lg font-medium mb-2 line-clamp-2">
                        {producto.nombre}
                      </h3>

                      <div className="mb-4">
                        <span className="text-2xl font-bold">
                          {formatearDinero(producto.precio_venta)}
                        </span>
                        {producto.precio_compra > producto.precio_venta && (
                          <span className="text-sm text-green-600 ml-2">
                            10% OFF
                          </span>
                        )}
                      </div>

                      {/* <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {producto.categoria?.nombre}
                        </span>
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={producto.stock === 0}
                        >
                          Agregar al carrito
                        </button>
                      </div> */}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 pb-8">
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-gray-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Anterior
                  </button>

                  <div className="flex flex-wrap justify-center gap-1">
                    {[...Array(totalPaginas)].map((_, index) => {
                      const numeroPagina = index + 1;
                      if (
                        numeroPagina === 1 ||
                        numeroPagina === totalPaginas ||
                        (numeroPagina >= paginaActual - 2 &&
                          numeroPagina <= paginaActual + 2)
                      ) {
                        return (
                          <button
                            key={numeroPagina}
                            onClick={() => cambiarPagina(numeroPagina)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors
                              ${
                                paginaActual === numeroPagina
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                          >
                            {numeroPagina}
                          </button>
                        );
                      } else if (
                        numeroPagina === paginaActual - 3 ||
                        numeroPagina === paginaActual + 3
                      ) {
                        return (
                          <span
                            key={numeroPagina}
                            className="w-8 h-8 flex items-center justify-center text-gray-500"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-gray-700 transition-colors"
                  >
                    Siguiente
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductosTienda;
