import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaBox,
  FaEnvelope,
  FaFileDownload,
} from "react-icons/fa";
import { useCart } from "../../context/CartProvider";
import { formatearDinero } from "../../utils/formatearDinero";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ComprobanteVenta from "../../components/ComprobanteVenta";

const PagoExitoso = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { ordenId, total, usuario, envio, productos } = location.state || {};

  useEffect(() => {
    if (!ordenId) {
      navigate("/");
    }
  }, [ordenId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-lg border">
        <div className="text-center">
          <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            ¡Gracias por tu compra!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tu pedido ha sido procesado correctamente
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="border-t border-b py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">
                Número de Orden:
              </span>
              <span className="text-sm font-bold text-gray-900">{ordenId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Total Pagado:
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatearDinero(total)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <FaEnvelope className="h-5 w-5 text-green-500 mr-3" />
              <span>Recibirás un email con los detalles de tu compra</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaBox className="h-5 w-5 text-green-500 mr-3" />
              <span>Te notificaremos cuando tu pedido sea enviado</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver a la tienda
            </Link>
            <Link
              to="/productos-tienda"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Seguir comprando
            </Link>

            {/* Botón de descarga PDF */}
            <PDFDownloadLink
              document={
                <ComprobanteVenta
                  venta={{
                    ordenId,
                    total,
                    usuario,
                    envio,
                    productos,
                    fecha: new Date().toLocaleDateString(),
                  }}
                />
              }
              fileName={`comprobante-${ordenId}.pdf`}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
            >
              {({ blob, url, loading, error }) =>
                loading ? (
                  "Generando comprobante..."
                ) : (
                  <>
                    <FaFileDownload />
                    Descargar Comprobante
                  </>
                )
              }
            </PDFDownloadLink>

            {/* Información adicional */}
            <div className="mt-4 text-xs text-center text-gray-500">
              <p>Guarda tu comprobante de compra para cualquier consulta</p>
              <p>También recibirás una copia en tu correo electrónico</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoExitoso;
