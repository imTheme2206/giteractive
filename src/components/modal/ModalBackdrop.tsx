import type { ReactNode } from 'react';

type ModalBackdropProps = {
  children: ReactNode;
  zIndex?: number;
  background?: string;
};

export const ModalBackdrop = ({ children, zIndex = 50, background }: ModalBackdropProps) => (
  <div
    className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
    style={{ background: background ?? 'var(--backdrop)', zIndex }}
  >
    {children}
  </div>
);
