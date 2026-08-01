import Colors from "../../constants/colors";

export default function Button({
  children,
  loading = false,
  disabled = false,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) {
  const variants = {
    primary: {
      backgroundColor:
        Colors.primary,
      color: "#FFFFFF",
    },

    outline: {
      backgroundColor:
        Colors.background,
      color: Colors.primary,
      border: `1px solid ${Colors.primary}`,
    },

    ghost: {
      backgroundColor:
        "transparent",
      color: Colors.primary,
    },
  };

  return (
    <button
      type={type}
      disabled={
        disabled || loading
      }
      className={[
        "flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      style={variants[variant]}
      {...props}
    >
      {loading && (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}

      <span>
        {loading
          ? "Please wait..."
          : children}
      </span>
    </button>
  );
}