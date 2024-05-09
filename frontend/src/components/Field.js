import "../css/field.css";

export function Field({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange = () => {},
  halfWidth = false,
}) {
  return (
    <div className={`formGroup ${halfWidth ? "half" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export function Textarea({
  label,
  rows = "4",
  name,
  placeholder,
  value,
  onChange = () => {},
}) {
  return (
    <div className="formGroup">
      <label htmlFor={name}>{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
      ></textarea>
    </div>
  );
}
