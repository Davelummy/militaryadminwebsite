import type { ChangeEvent, Ref } from "react";

type MaskedTextFieldProps = {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  hint?: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
};

const formatMasked = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const last4 = digits.slice(-4).padStart(4, "_");
  return `***-**-${last4}`;
};

export function MaskedTextField({
  id,
  label,
  value,
  onValueChange,
  hint,
  error,
  inputRef,
}: MaskedTextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const maskId = `${id}-mask`;
  const describedBy = [hintId, maskId, errorId].filter(Boolean).join(" ") || undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "");
    onValueChange(digits.slice(0, 9));
  };

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
      <div className="usa-hint" id={maskId}>
        Masked format: {formatMasked(value)}
      </div>
      {error ? (
        <span className="usa-error-message" id={errorId}>
          {error}
        </span>
      ) : null}
      <input
        ref={inputRef}
        id={id}
        className={`usa-input${error ? " usa-input--error" : ""}`}
        type="password"
        inputMode="numeric"
        autoComplete="off"
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
