import { forwardRef } from "react";

const Input = forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-medium text-custom-500">
            {label}
          </span>
        </label>
      )}

      <input
        ref={ref}
        className={`
          w-full px-4 py-2.5
          bg-custom-100
          border
          ${error ? "border-red-500" : "border-custom-300"}
          focus:border-custom-500
          rounded
          outline-none
          transition-all
          duration-200
          font-normal
          placeholder:text-custom-300
          placeholder:font-normal
          text-custom-500
          ${className}
        `}
        {...props}
      />

      {error && (
        <label className="label">
          <span className="label-text-alt text-red-500 text-sm font-medium">
            {error}
          </span>
        </label>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
