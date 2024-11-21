import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { formatearDinero } from "../utils/formatearDinero";

// Definir estilos
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  headerContainer: {
    marginBottom: 30,
    borderBottom: "2 solid #EEEEEE",
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 5,
  },
  comprobante: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  infoSection: {
    width: "48%",
  },
  infoTitle: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 10,
    color: "#4B5563",
    marginBottom: 4,
    lineHeight: 1.4,
  },
  infoLabel: {
    color: "#6B7280",
    marginRight: 4,
  },
  table: {
    marginTop: 20,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottom: "1 solid #E5E7EB",
    padding: 12,
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #E5E7EB",
    padding: 12,
    fontSize: 10,
    color: "#4B5563",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  tableCellLeft: {
    flex: 2,
    textAlign: "left",
  },
  totalsContainer: {
    marginTop: 30,
    borderTop: "2 solid #EEEEEE",
    paddingTop: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 12,
    color: "#374151",
    marginRight: 40,
  },
  totalAmount: {
    fontSize: 12,
    color: "#374151",
    width: 100,
    textAlign: "right",
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563EB",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 10,
    borderTop: "1 solid #E5E7EB",
    paddingTop: 20,
  },
  orderInfo: {
    position: "absolute",
    top: 40,
    right: 40,
    textAlign: "right",
  },
  orderNumber: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 10,
    color: "#6B7280",
  },
});

const ComprobanteVenta = ({ venta }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.logo}>MiTienda</Text>
        <Text style={styles.comprobante}>Comprobante de Compra</Text>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Orden #{venta.ordenId}</Text>
          <Text style={styles.orderDate}>Fecha: {venta.fecha}</Text>
        </View>
      </View>

      {/* Info Sections */}
      <View style={styles.infoContainer}>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Información del Cliente</Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Nombre:</Text>{" "}
            {venta.usuario?.nombre}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Email:</Text> {venta.usuario?.email}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Teléfono:</Text>{" "}
            {venta.usuario?.telefono}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Dirección de Envío</Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Dirección:</Text>{" "}
            {venta.envio?.direccion}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Ciudad:</Text> {venta.envio?.ciudad}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Provincia:</Text>{" "}
            {venta.envio?.provincia}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>CP:</Text>{" "}
            {venta.envio?.codigoPostal}
          </Text>
        </View>
      </View>

      {/* Products Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCellLeft}>Producto</Text>
          <Text style={styles.tableCell}>Cantidad</Text>
          <Text style={styles.tableCell}>Precio Unit.</Text>
          <Text style={styles.tableCell}>Subtotal</Text>
        </View>

        {venta.productos?.map((producto, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCellLeft}>{producto.nombre}</Text>
            <Text style={styles.tableCell}>{producto.cantidad}</Text>
            <Text style={styles.tableCell}>
              {formatearDinero(producto.precio_venta)}
            </Text>
            <Text style={styles.tableCell}>
              {formatearDinero(producto.precio_venta * producto.cantidad)}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalAmount}>{formatearDinero(venta.total)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Envío</Text>
          <Text style={styles.totalAmount}>Gratis</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, styles.grandTotal]}>Total</Text>
          <Text style={[styles.totalAmount, styles.grandTotal]}>
            {formatearDinero(venta.total)}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Gracias por tu compra</Text>
        <Text>Este documento es un comprobante válido de tu compra</Text>
        <Text>Para cualquier consulta, guarda este comprobante</Text>
      </View>
    </Page>
  </Document>
);

export default ComprobanteVenta;
