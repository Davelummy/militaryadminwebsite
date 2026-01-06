import type { Ref, TextareaHTMLAttributes } from "react";

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  inputRef?: Ref<HTMLTextAreaElement>;
};

export function TextAreaField({
  id,
  label,
  hint,
  error,
  inputRef,
  className = "",
  ...props
}: TextAreaFieldProps) {
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
      <textarea
        ref={inputRef}
        id={id}
        className={`usa-textarea${error ? " usa-input--error" : ""} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />
    </div>
  );
}
