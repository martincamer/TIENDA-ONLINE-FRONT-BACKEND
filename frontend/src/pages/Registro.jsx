import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../config/axios";
import Input from "../components/ui/Input";
import InputPassword from "../components/ui/InputPassword";

const Registro = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    defaultValues: {
      username: "",
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      await clienteAxios.post("/users/register", formData);
      navigate("/login");
    } catch (error) {
      setFormError("root", {
        type: "manual",
        message: error.response?.data?.message || "Error al registrar usuario",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-100 py-20">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-custom-500 mb-6">
          Registro
        </h2>

        {errors.root && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errors.root.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          <Input
            label="Nombre de usuario"
            placeholder="usuario123"
            error={errors.username?.message}
            {...register("username", {
              required: "El nombre de usuario es requerido",
              minLength: {
                value: 3,
                message:
                  "El nombre de usuario debe tener al menos 3 caracteres",
              },
            })}
          />

          <Input
            label="Nombre"
            placeholder="Juan"
            error={errors.nombre?.message}
            {...register("nombre", {
              required: "El nombre es requerido",
            })}
          />

          <Input
            label="Apellido"
            placeholder="Pérez"
            error={errors.apellido?.message}
            {...register("apellido", {
              required: "El apellido es requerido",
            })}
          />

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

          <div className="pt-5">
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
              Crear cuenta
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-custom-400">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-custom-500 hover:text-custom-400 font-medium"
          >
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
