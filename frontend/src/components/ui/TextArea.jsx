const TextArea = ({
  label,
  register,
  name,
  required = false,
  placeholder = "",
  className = "",
  rows = 4,
  cols,
  defaultValue = "",
  error = "",
}) => {
  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <textarea
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
          text-custom-500 ${error ? "textarea-error" : ""} ${className}`}
        placeholder={placeholder}
        required={required}
        rows={rows}
        cols={cols}
        defaultValue={defaultValue}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default TextArea;
