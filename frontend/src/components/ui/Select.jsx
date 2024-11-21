const Select = ({
  label,
  options,
  register,
  name,
  required = false,
  defaultValue = "",
  className = "",
  error = "",
}) => {
  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <select
        {...register(name)}
        className={`  w-full px-4 py-2.5
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
          text-custom-500 capitalize ${className}`}
        required={required}
        defaultValue={defaultValue}
      >
        <option className="capitalize text-sm font-bold text-gray-800" value="">
          Seleccionar {label?.toLowerCase() || "opción"}
        </option>
        {options.map((option) => (
          <option
            className="capitalize text-sm font-semibold text-gray-500"
            key={option.id || option._id}
            value={option.nombre || option.nombre}
          >
            {option.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
