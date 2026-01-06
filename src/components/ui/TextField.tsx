import type { InputHTMLAttributes, Ref } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
};

export function TextField({
  id,
  label,
  hint,
  error,
  inputRef,
  className = "",
  ...props
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`usa-form-group${error ? " usa-form-group--error" : ""}`}>
      <label className="usa-label" htmlFor={id}>
        {label}
      </label>
      {hint ? (
        <div className="usa-hint" id={hintId}>
          {hint}
        </div>
      ) : null}
      {error ? (
        <span className="usa-error-message" id={errorId}>
          {error}
        </span>
      ) : null}
      <input
        ref={inputRef}
        id={id}
        className={`usa-input${error ? " usa-input--error" : ""} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />
    </div>
  );
}
