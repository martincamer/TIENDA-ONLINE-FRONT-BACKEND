import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaBox,
  FaTruck,
  FaShoppingCart,
  FaChartBar,
  FaFileInvoiceDollar,
  FaTags,
  FaUsers,
  FaCog,
  FaChartPie,
  FaTachometerAlt,
  FaThLarge,
  FaHome,
} from "react-icons/fa";
import { MdDashboard, MdSpaceDashboard } from "react-icons/md";
import { BiSolidDashboard } from "react-icons/bi";

const Sidebar = ({ isOpen }) => {
  const { logout } = useAuth();

  return (
    <div
      className={`bg-gray-800 text-white transition-all duration-300 ease-in-out
      ${isOpen ? "w-64" : "w-0 lg:w-16"}`}
    >
      <div className="px-2 py-4 flex justify-center">
        <h2
          className={`text-2xl font-bold ${
            !isOpen && "scale-0 hidden lg:hidden"
          }`}
        >
          MiTienda Panel
        </h2>
      </div>

      <nav className="space-y-2 p-2">
        {/* Inventario */}
        <Link
          to="/dashboard"
          className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 rounded-md"
        >
          <MdDashboard size={20} />
          <span className={`${!isOpen && "hidden"}`}>Dashboard</span>
        </Link>
        {/* <Link
          to="/inventario"
          className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaBox size={20} />
          <span className={`${!isOpen && "hidden"}`}>Inventario</span>
        </Link> */}

        {/* Productos */}
        <Link
          to="/productos"
          className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaTags size={20} />
          <span className={`${!isOpen && "hidden"}`}>Productos</span>
        </Link>

        {/* Proveedores */}
        <Link
          to="/proveedores"
          className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaTruck size={20} />
          <span className={`${!isOpen && "hidden"}`}>Proveedores</span>
        </Link>

        {/* Órdenes de Compra */}
        <Link
          to="/ordenes"
          className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaShoppingCart size={20} />
          <span className={`${!isOpen && "hidden"}`}>Órdenes de Compra</span>
        </Link>

        {/* Facturación */}
        <Link
          to="/facturacion"
          className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaFileInvoiceDollar size={20} />
          <span className={`${!isOpen && "hidden"}`}>Facturación</span>
        </Link>

        {/* Reportes */}
        <Link
          to="/reportes"
          className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaChartBar size={20} />
          <span className={`${!isOpen && "hidden"}`}>Reportes</span>
        </Link>

        <div className="pt-4 mt-4 border-t border-gray-700">
          {/* Usuarios */}
          <Link
            to="/usuarios"
            className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 rounded-md"
          >
            <FaUsers size={20} />
            <span className={`${!isOpen && "hidden"}`}>Usuarios</span>
          </Link>

          {/* Configuración */}
          <Link
            to="/configuracion"
            className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 rounded-md"
          >
            <FaCog size={20} />
            <span className={`${!isOpen && "hidden"}`}>Configuración</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
