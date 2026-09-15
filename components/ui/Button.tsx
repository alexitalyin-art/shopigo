type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  onClick?: () => void;
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
}: ButtonProps) {
  const baseStyles =
    "rounded-full px-8 py-3 text-sm font-semibold transition";

  const variantStyles =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800"
      : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles}`}
    >
      {children}
    </button>
  );
}