import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import InputPassword from "../components/ui/InputPassword";
import { useEffect } from "react";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | Gestión Ecommerce";
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      if (response.success) {
        navigate("/dashboard");
      } else {
        setFormError("root", {
          type: "manual",
          message: response.message || "Error al iniciar sesión",
        });
      }
    } catch (error) {
      setFormError("root", {
        type: "manual",
        message: "Error al conectar con el servidor",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-custom-500 mb-6">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="correo@ejemplo.com"
            error={errors.email?.message}
            {...register("email", {
              required: "El email es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            })}
          />

          <InputPassword
            label="Contraseña"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
          />

          <button
            type="submit"
            className="w-full py-2.5 px-4 
              bg-custom-500 hover:bg-custom-400
              text-white font-medium
              rounded-lg
              transition-colors
              duration-200
              focus:ring-2 focus:ring-custom-200
              focus:outline-none"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="mt-6 text-center text-custom-400">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-custom-500 hover:text-custom-400 font-medium"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
