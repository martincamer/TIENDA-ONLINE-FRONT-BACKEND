import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const DocumentTitle = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
      case "/login":
        return "Login | Gestión Ecommerce";
      case "/registro":
        return "Registro | Gestión Ecommerce";
      case "/dashboard":
        return "Dashboard | Gestión Ecommerce";
      default:
        return "Gestión Ecommerce";
    }
  };

  return (
    <Helmet>
      <title>{getPageTitle()}</title>
    </Helmet>
  );
};

export default DocumentTitle;
