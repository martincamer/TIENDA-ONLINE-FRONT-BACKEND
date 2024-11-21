import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useProductos } from "../../context/ProductosContext";
import { formatearDinero } from "../../utils/formatearDinero";
import { FaArrowRight, FaShoppingCart } from "react-icons/fa";

const Home = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [productosTecnologia, setProductosTecnologia] = useState([]);
  const [productosElectro, setProductosElectro] = useState([]);
  const [productosIndumentaria, setProductosIndumentaria] = useState([]);
  const [loading, setLoading] = useState(true);

  const { obtenerProductosPublicos } = useProductos();

  const banners = [
    {
      imagen:
        "https://http2.mlstatic.com/D_NQ_648309-MLA79974812720_102024-OO.webp",
      titulo: "Nueva Colección 2024",
      descripcion: "Descubre nuestros nuevos productos",
      link: "/productos-tienda",
    },
    {
      imagen:
        "https://http2.mlstatic.com/D_NQ_860230-MLA80615092771_112024-OO.webp",
      titulo: "Ofertas Especiales",
      descripcion: "Hasta 50% de descuento en productos seleccionados",
      link: "/productos-tienda",
    },
    {
      imagen:
        "https://http2.mlstatic.com/D_NQ_875512-MLA80367743746_112024-OO.webp",
      titulo: "Envío Gratis",
      descripcion: "En compras mayores a $999",
      link: "/productos-tienda",
    },
  ];

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await obtenerProductosPublicos();
        // Filtrar productos por categoría
        setProductosDestacados(data.slice(0, 4));
        setProductosTecnologia(
          data.filter((p) => p.categoria === "tecnologia").slice(0, 4)
        );
        setProductosElectro(
          data.filter((p) => p.categoria === "electrodomesticos").slice(0, 4)
        );
        setProductosIndumentaria(
          data
            .filter((p) => p.categoria === "indumentaria y calzado")
            .slice(0, 4)
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  // Componente para renderizar una sección de productos
  const ProductSection = ({ title, products }) => (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <Link
          to="/productos-tienda"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2 group"
        >
          Ver todos
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((producto) => (
          <Link
            key={producto._id}
            to={`/producto/${producto._id}`}
            className="block bg-white border shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group max-w-sm mx-auto"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-full object-contain p-2"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <span className="bg-white text-gray-800 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 text-sm">
                  <FaShoppingCart className="text-blue-600" />
                  Ver Detalles
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                {producto.nombre}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {producto.descripcion}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold">
                  {formatearDinero(producto.precio_venta)}
                </span>
                {producto.stock_actual > 0 ? (
                  <span className="text-green-500 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Disponible
                  </span>
                ) : (
                  <span className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Agotado
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <div className="relative">
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={5000}
          className="max-h-[600px]"
          showArrows={true}
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="absolute left-0 z-10 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-r-lg transition-all"
              >
                <FaArrowRight className="transform rotate-180 w-6 h-6" />
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="absolute right-0 z-10 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-l-lg transition-all"
              >
                <FaArrowRight className="w-6 h-6" />
              </button>
            )
          }
        >
          {banners.map((banner, index) => (
            <div key={index} className="relative h-[600px]">
              <img
                src={banner.imagen}
                alt={banner.titulo}
                className="w-full h-full object-cover"
              />
              {/* <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    {banner.titulo}
                  </h2>
                  <p className="text-xl md:text-2xl mb-8">
                    {banner.descripcion}
                  </p>
                  <Link
                    to={banner.link}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver Productos
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div> */}
            </div>
          ))}
        </Carousel>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Productos Destacados */}
          <ProductSection
            title="Productos Destacados"
            products={productosDestacados}
          />

          {/* Separador */}
          <div className="w-full h-px bg-gray-200 my-4" />

          {/* Tecnología */}
          {productosTecnologia.length > 0 && (
            <ProductSection title="Tecnología" products={productosTecnologia} />
          )}

          {/* Separador */}
          <div className="w-full h-px bg-gray-200 my-4" />

          {/* Electrodomésticos */}
          {productosElectro.length > 0 && (
            <ProductSection
              title="Electrodomésticos"
              products={productosElectro}
            />
          )}

          {/* Separador */}
          <div className="w-full h-px bg-gray-200 my-4" />

          {/* Indumentaria y Calzado */}
          {productosIndumentaria.length > 0 && (
            <ProductSection
              title="Indumentaria y Calzado"
              products={productosIndumentaria}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Home;
