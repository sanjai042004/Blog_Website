import { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import { Eye, EyeOff } from "lucide-react";

export const InputField = forwardRef(
  (
    {
      id,
      label,
      name,
      type = "text",
      placeholder = "",
      value = "",
      onChange,
      onKeyDown,
      required = false,
      readOnly = false,
      showToggle = false,
      textarea = false,
      disabled = false,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleToggle = () => setShowPassword((prev) => !prev);
    const inputType = showToggle ? (showPassword ? "text" : "password") : type;

    const commonProps = {
      id,
      name,
      placeholder,
      value,
      onChange,
      onKeyDown,
      required,
      readOnly,
      disabled,
      ref,
      className:
        "w-full px-4 py-2 border border-gray-300 rounded-lg outline-none disabled:opacity-50 bg-white resize-none",
      autoComplete: "off",
    };

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {textarea ? (
            <textarea rows="4" {...commonProps} />
          ) : (
            <input type={inputType} {...commonProps} />
          )}

          {showToggle && !textarea && (
            <button
              type="button"
              onClick={handleToggle}
              className="absolute right-5 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

InputField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  showToggle: PropTypes.bool,
  textarea: PropTypes.bool,
  disabled: PropTypes.bool,
};
