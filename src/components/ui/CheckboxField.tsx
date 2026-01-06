import type { InputHTMLAttributes } from "react";

type CheckboxFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function CheckboxField({
  id,
  label,
  hint,
  error,
  className = "",
  ...props
}: CheckboxFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`usa-form-group${error ? " usa-form-group--error" : ""}`}>
      {error ? (
        <span className="usa-error-message" id={errorId}>
          {error}
        </span>
      ) : null}
      <div className="usa-checkbox">
        <input
          className={`usa-checkbox__input${error ? " usa-input--error" : ""} ${className}`}
          id={id}
          type="checkbox"
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          {...props}
        />
        <label className="usa-checkbox__label" htmlFor={id}>
          {label}
        </label>
      </div>
      {hint ? (
        <div className="usa-hint" id={hintId}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
