type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "rounded-full px-8 py-3 text-sm font-semibold transition";

  const variantStyles =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800"
      : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100";

  const disabledStyles =
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${disabledStyles}`}
    >
      {children}
    </button>
  );
}