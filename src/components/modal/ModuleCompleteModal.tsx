import type { ReactNode } from 'react';
import { ModalBackdrop } from './ModalBackdrop';
import { Button } from '../common/Button';
import { cardRadius } from '../common/radii';

type ModuleCompleteModalProps = {
  icon: string;
  title: string;
  body: ReactNode;
  buttonLabel: string;
  accentColor?: string;
  onAction: () => void;
};

export const ModuleCompleteModal = ({
  icon,
  title,
  body,
  buttonLabel,
  accentColor = 'var(--ok)',
  onAction,
}: ModuleCompleteModalProps) => (
  <ModalBackdrop zIndex={10}>
    <div
      className="bg-[var(--panel)] p-8 max-w-sm text-center shadow-lg"
      style={{ borderRadius: cardRadius, border: `2px solid ${accentColor}` }}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h2 className="text-2xl font-bold text-[var(--ink)] mt-0 mb-2.5 font-hand">
        {title}
      </h2>
      <div className="mb-5">{body}</div>
      <Button variant="primary" color={accentColor} className="px-6" onClick={onAction}>
        {buttonLabel}
      </Button>
    </div>
  </ModalBackdrop>
);
