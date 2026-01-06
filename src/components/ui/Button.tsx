import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "usa-button",
  secondary: "usa-button usa-button--secondary",
  outline: "usa-button usa-button--outline",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variantClass[variant]}${fullWidth ? " width-full" : ""} ${className}`}
      {...props}
    />
  );
}
