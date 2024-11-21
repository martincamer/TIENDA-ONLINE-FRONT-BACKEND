import { forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const InputPassword = forwardRef(
  ({ label, error, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-medium text-custom-500">
              {label}
            </span>
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`
            w-full px-4 py-2.5
            bg-custom-100
            border-2 
            ${error ? "border-red-500" : "border-custom-300"}
            focus:border-custom-500
            rounded-lg
            outline-none
            transition-all
            duration-200
            font-normal
            placeholder:text-custom-300
            placeholder:font-normal
            text-custom-500
            pr-12
            ${
              error
                ? "focus:ring-2 focus:ring-red-200"
                : "focus:ring-2 focus:ring-custom-200"
            }
            ${className}
          `}
            {...props}
          />

          <button
            type="button"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 
            text-custom-400 
            hover:text-custom-500 
            focus:text-custom-500
            focus:outline-none
            transition-colors
            duration-200"
            onClick={togglePassword}
          >
            {showPassword ? (
              <FiEyeOff className="w-5 h-5" />
            ) : (
              <FiEye className="w-5 h-5" />
            )}
          </button>
        </div>

        {error && (
          <label className="label">
            <span className="label-text-alt text-red-500 text-sm font-medium">
              {error}
            </span>
          </label>
        )}
      </div>
    );
  }
);

InputPassword.displayName = "InputPassword";

export default InputPassword;
