import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function InputField({ Icon, type = "text", ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative">
      <Icon
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-soft"
      />
      <input
        {...props}
        type={isPassword && show ? "text" : type}
        className="w-full pl-11 pr-11 py-3 rounded-full bg-white border border-pale text-sm focus:outline-none focus:ring-2 focus:ring-primary-soft"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

export default InputField;