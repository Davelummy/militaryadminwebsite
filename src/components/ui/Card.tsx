import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  containerClassName?: string;
};

export function Card({ title, children, footer, containerClassName = "" }: CardProps) {
  return (
    <div className="usa-card">
      <div className={`usa-card__container ${containerClassName}`}>
        {title ? (
          <div className="usa-card__header">
            <h3 className="usa-card__heading">{title}</h3>
          </div>
        ) : null}
        <div className="usa-card__body">{children}</div>
        {footer ? <div className="usa-card__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
