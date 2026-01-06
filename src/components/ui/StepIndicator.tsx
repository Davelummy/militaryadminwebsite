type StepIndicatorProps = {
  current: number;
  labels: string[];
};

export function StepIndicator({ current, labels }: StepIndicatorProps) {
  return (
    <div className="usa-step-indicator" aria-label="Registration progress">
      <ol className="usa-step-indicator__segments">
        {labels.map((label, index) => {
          const stepNumber = index + 1;
          const status =
            stepNumber < current ? "complete" : stepNumber === current ? "current" : "incomplete";
          return (
            <li
              key={label}
              className={`usa-step-indicator__segment usa-step-indicator__segment--${status}`}
              aria-current={status === "current" ? "step" : undefined}
            >
              <span className="usa-step-indicator__segment-label">{label}</span>
            </li>
          );
        })}
      </ol>
      <div className="usa-step-indicator__header">
        <h2 className="usa-step-indicator__heading">
          Step <span className="usa-step-indicator__current-step">{current}</span> of{" "}
          <span className="usa-step-indicator__total-steps">{labels.length}</span>
        </h2>
      </div>
    </div>
  );
}
