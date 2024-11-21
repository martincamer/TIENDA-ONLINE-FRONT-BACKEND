import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { ProductosProvider } from "./context/ProductosContext";
import { CategoriasProvider } from "./context/CategoriasContext";
import { CartProvider } from "./context/CartProvider";
import { ProveedoresProvider } from "./context/ProveedoresContext";
import { OrdenesProvider } from "./context/OrdenesProvider";
import { FacturacionProvider } from "./context/FacturacionProvider";
import RutaProtegida from "./components/RutaProtegida";
import DocumentTitle from "./components/DocumentTitle";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/inventario/Productos";
import Categorias from "./pages/inventario/Categorias";
import Proveedores from "./pages/proveedores/Proveedores";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/public/Home";
import Contacto from "./pages/public/Contacto";
import ProductosTienda from "./pages/public/ProductosTienda";
import ProductoDetalle from "./pages/public/ProductoDetalle";
import Carrito from "./pages/public/Carrito";
import Checkout from "./pages/public/Checkout";
import PagoExitoso from "./pages/public/PagoExitoso";
import OrdenesCompra from "./pages/ordenes/OrdenesCompra";
import VerOrden from "./pages/ordenes/VerOrden";
import Facturacion from "./pages/facturacion/Facturacion";
import VerFactura from "./pages/facturacion/VerFactura";
import VerProducto from "./pages/inventario/VerProducto";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <CategoriasProvider>
            <ProductosProvider>
              <ProveedoresProvider>
                <OrdenesProvider>
                  <FacturacionProvider>
                    <CartProvider>
                      <DocumentTitle />
                      <Routes>
                        {/* Rutas públicas de la tienda */}
                        <Route path="/" element={<PublicLayout />}>
                          <Route index element={<Home />} />
                          <Route
                            path="productos-tienda"
                            element={<ProductosTienda />}
                          />{" "}
                          <Route
                            path="producto/:id"
                            element={<ProductoDetalle />}
                          />
                          <Route path="contacto" element={<Contacto />} />
                          <Route path="carrito" element={<Carrito />} />
                          <Route path="checkout" element={<Checkout />} />
                          <Route
                            path="pago-exitoso"
                            element={<PagoExitoso />}
                          />
                        </Route>

                        {/* Rutas de autenticación */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Registro />} />

                        {/* Rutas Protegidas - Panel de Administración */}
                        <Route path="/dashboard" element={<RutaProtegida />}>
                          <Route index element={<Dashboard />} />
                        </Route>
                        <Route element={<RutaProtegida />}>
                          <Route path="productos" element={<Productos />} />
                        </Route>
                        <Route element={<RutaProtegida />}>
                          <Route
                            path="inventario/productos/:id"
                            element={<VerProducto />}
                          />
                        </Route>
                        <Route element={<RutaProtegida />}>
                          <Route
                            path="inventario/categorias"
                            element={<Categorias />}
                          />
                        </Route>
                        <Route element={<RutaProtegida />}>
                          <Route path="proveedores" element={<Proveedores />} />
                        </Route>
                        <Route element={<RutaProtegida />}>
                          <Route path="ordenes" element={<OrdenesCompra />} />
                        </Route>
                        <Route element={<RutaProtegida />}>
                          <Route path="/ordenes/:id" element={<VerOrden />} />
                        </Route>
                        <Route element={<RutaProtegida />}>
                          <Route path="facturacion" element={<Facturacion />} />
                        </Route>
                        <Route element={<RutaProtegida />}>
                          <Route
                            path="/facturas/:id"
                            element={<VerFactura />}
                          />
                        </Route>
                      </Routes>
                    </CartProvider>
                  </FacturacionProvider>
                </OrdenesProvider>
              </ProveedoresProvider>
            </ProductosProvider>
          </CategoriasProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
