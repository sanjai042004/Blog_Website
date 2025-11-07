import PropTypes from "prop-types";
import clsx from "clsx";

export const Button = ({
  type = "button",
  variant = "default",
  loading = false,
  disabled = false,
  className = "",
  children,
  onClick,
}) => {
  const baseStyles ="font-semibold rounded-lg transition-all duration-200 focus:outline-none p-2 focus:ring-2 focus:ring-purple-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";

  const variantStyles = {
    filled: "bg-purple-600 text-white hover:bg-purple-700",
    outlined: "border-2 border-purple-600 text-purple-600 bg-transparent hover:bg-purple-600 hover:text-white",
    default: "bg-black text-white hover:bg-gray-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={clsx(baseStyles, variantStyles[variant], className)}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["filled", "outlined", "default"]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};
