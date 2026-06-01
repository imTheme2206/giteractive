import type { ReactNode } from 'react';

type ModuleCompleteModalProps = {
  icon: string;
  title: string;
  body: ReactNode;
  buttonLabel: string;
  accentColor?: string;
  onAction: () => void;
};

const cardRadius = '255px 14px 225px 16px/16px 225px 14px 255px';
const btnRadius = '60px 10px 60px 10px/10px 60px 10px 60px';

export const ModuleCompleteModal = ({
  icon,
  title,
  body,
  buttonLabel,
  accentColor = 'var(--ok)',
  onAction,
}: ModuleCompleteModalProps) => (
  <div
    className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10"
    style={{ background: 'var(--backdrop)' }}
  >
    <div
      className="bg-[var(--panel)] p-8 max-w-sm text-center shadow-lg"
      style={{ borderRadius: cardRadius, border: `2px solid ${accentColor}` }}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h2
        className="text-2xl font-bold text-[var(--ink)] mt-0 mb-2.5"
        style={{ fontFamily: 'var(--hand)' }}
      >
        {title}
      </h2>
      <div className="mb-5">{body}</div>
      <button
        onClick={onAction}
        className="font-bold text-sm px-6 py-2 cursor-pointer text-[var(--panel)] border-2"
        style={{
          fontFamily: 'var(--hand)',
          borderRadius: btnRadius,
          background: accentColor,
          borderColor: accentColor,
        }}
      >
        {buttonLabel}
      </button>
    </div>
  </div>
);
