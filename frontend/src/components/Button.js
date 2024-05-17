import { FaSpinner } from "react-icons/fa";

export default function Button({
  type = "button",
  title,
  onClick = () => {},
  loading,
  text,
  children,
  full = false,
  disabled = false,
  outline=false,
  customStyle,
}) {
  const classNames = [
    "btnPrimary",
    full ? "full" : "",
    disabled ? "disabled" : "",
    outline ? "outline" : "fill",
  ].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      title={title}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick(e);
      }}
      className={classNames}
      style={{ ...customStyle }}
    >
      {loading ? (
        <>
          <FaSpinner size="16" className="buttonSpinner" />
          <span style={{ paddingLeft: "0.5rem" }}>Loading...</span>
        </>
      ) : (
        text || children
      )}
    </button>
  );
}
