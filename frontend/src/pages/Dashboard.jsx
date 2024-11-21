import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  FaChartBar,
  FaChartLine,
  FaDollarSign,
  FaBox,
  FaCalendar,
} from "react-icons/fa";
import { useProductos } from "../context/ProductosContext";
import clienteAxios from "../config/clienteAxios";

const Dashboard = () => {
  const { auth } = useAuth();
  const { categorias } = useProductos();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ventasPorCategoria, setVentasPorCategoria] = useState([]);
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    ventasTotales: 0,
    productosTotales: 0,
    ventasHoy: 0,
    productosBajoStock: 0,
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0], // Inicio del año actual
    endDate: new Date().toISOString().split("T")[0], // Hoy
  });

  useEffect(() => {
    const loadDataVentas = async () => {
      try {
        const { data } = await clienteAxios("/ventas");

        // Filtrar ventas por rango de fechas
        const ventasFiltradas = data.filter((venta) => {
          const fechaVenta = new Date(venta.createdAt)
            .toISOString()
            .split("T")[0];
          return (
            fechaVenta >= dateRange.startDate && fechaVenta <= dateRange.endDate
          );
        });

        // Calcular estadísticas con ventas filtradas
        const totalVentas = ventasFiltradas.reduce(
          (acc, venta) => acc + venta.total,
          0
        );

        // Calcular ventas de hoy
        const hoy = new Date().toISOString().split("T")[0];
        const ventasHoy = ventasFiltradas
          .filter((venta) => venta.createdAt.startsWith(hoy))
          .reduce((acc, venta) => acc + venta.total, 0);

        // Procesar ventas por categoría
        const ventasPorCat = {};
        ventasFiltradas.forEach((venta) => {
          venta.productos.forEach((prod) => {
            // Usar la categoría directamente del producto
            const categoria = prod.categoria || "Sin categoría";
            ventasPorCat[categoria] =
              (ventasPorCat[categoria] || 0) + prod.subtotal;
          });
        });

        // Formatear datos para el gráfico de categorías
        const dataCategories = Object.entries(ventasPorCat).map(
          ([name, ventas]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalizar primera letra
            ventas,
          })
        );

        // Procesar ventas por mes
        const ventasPorMeses = {};
        const meses = [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ];

        ventasFiltradas.forEach((venta) => {
          const fecha = new Date(venta.createdAt);
          const mes = meses[fecha.getMonth()];
          ventasPorMeses[mes] = (ventasPorMeses[mes] || 0) + venta.total;
        });

        const dataMensual = Object.entries(ventasPorMeses).map(
          ([name, ventas]) => ({
            name,
            ventas,
          })
        );

        setVentasPorCategoria(dataCategories);
        setVentasPorMes(dataMensual);
        setEstadisticas({
          ventasTotales: totalVentas,
          productosTotales: ventasFiltradas.reduce(
            (acc, venta) =>
              acc +
              venta.productos.reduce((sum, prod) => sum + prod.cantidad, 0),
            0
          ),
          ventasHoy: ventasHoy,
          productosBajoStock: 0,
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    loadDataVentas();
  }, [dateRange]); // Se ejecuta cuando cambian las fechas

  const handleDateChange = (e) => {
    setDateRange((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Panel de Control
            </h1>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="input-sm outline-none border border-gray-300 rounded-md"
                />
                <span className="text-gray-500">hasta</span>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="input-sm outline-none border border-gray-300 rounded-md"
                />
              </div>
              <select
                className=" border border-gray-300 rounded-md select-sm outline-none"
                onChange={(e) => {
                  const today = new Date();
                  const start = new Date();

                  switch (e.target.value) {
                    case "week":
                      start.setDate(today.getDate() - 7);
                      break;
                    case "month":
                      start.setMonth(today.getMonth() - 1);
                      break;
                    case "year":
                      start.setFullYear(today.getFullYear() - 1);
                      break;
                    default:
                      return;
                  }

                  setDateRange({
                    startDate: start.toISOString().split("T")[0],
                    endDate: today.toISOString().split("T")[0],
                  });
                }}
              >
                <option value="">Período</option>
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="year">Último año</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Ventas Totales */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Ventas Totales
                </p>
                <p className="text-2xl font-semibold text-green-600">
                  ${estadisticas.ventasTotales.toLocaleString()}
                </p>
              </div>
              <div className="p-3 border rounded-full">
                <FaDollarSign className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Ventas de Hoy */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Ventas de Hoy
                </p>
                <p className="text-2xl font-semibold text-green-600">
                  ${estadisticas.ventasHoy.toLocaleString()}
                </p>
              </div>
              <div className="p-3 border rounded-full">
                <FaChartLine className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Total Productos */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Productos
                </p>
                <p className="text-2xl font-semibold text-gray-700">
                  {estadisticas.productosTotales}
                </p>
              </div>
              <div className="p-3 border rounded-full">
                <FaBox className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Bajo Stock */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Bajo Stock</p>
                <p className="text-2xl font-semibold text-gray-700">
                  {estadisticas.productosBajoStock}
                </p>
              </div>
              <div className="p-3 border rounded-full">
                <FaChartBar className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Ventas por Categoría
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ventasPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
                <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Ventas Mensuales
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
