import type { ChangeEvent } from "react";

type FileUploadFieldProps = {
  id: string;
  label: string;
  accept?: string;
  hint?: string;
  error?: string;
  file?: File | null;
  required?: boolean;
  onFileChange: (file: File | null) => void;
};

const formatSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export function FileUploadField({
  id,
  label,
  accept,
  hint,
  error,
  file,
  required,
  onFileChange,
}: FileUploadFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const infoId = `${id}-info`;
  const describedBy = [hintId, infoId, errorId].filter(Boolean).join(" ") || undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    onFileChange(nextFile);
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
      {error ? (
        <span className="usa-error-message" id={errorId}>
          {error}
        </span>
      ) : null}
      <input
        id={id}
        type="file"
        className={`usa-file-input${error ? " usa-input--error" : ""}`}
        accept={accept}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        required={required}
        onChange={handleChange}
      />
      <div className="usa-hint" id={infoId}>
        {file ? `Selected file: ${file.name} (${formatSize(file.size)})` : "No file selected."}
      </div>
    </div>
  );
}
