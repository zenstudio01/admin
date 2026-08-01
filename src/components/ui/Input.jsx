import { forwardRef } from "react";

import Colors from "../../constants/colors";

const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      rightElement,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <Icon
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          )}

          <input
            ref={ref}
            className={[
              "h-12 w-full rounded-xl border bg-white text-sm text-gray-900 outline-none transition",
              Icon
                ? "pl-11"
                : "pl-4",
              rightElement
                ? "pr-12"
                : "pr-4",
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:ring-2",
              className,
            ].join(" ")}
            style={
              !error
                ? {
                    "--tw-ring-color":
                      `${Colors.primary}25`,
                  }
                : undefined
            }
            {...props}
          />

          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;