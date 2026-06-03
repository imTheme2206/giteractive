import { useTranslation } from 'react-i18next';
import { cardRadius } from '../common/radii';
import { matchCommand } from './commandInfo';

type CommandButtonProps = {
  cmd: string;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onTipToggle: () => void;
};

export const CommandButton = ({
  cmd,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onTipToggle,
}: CommandButtonProps) => {
  const { t } = useTranslation();
  const commandKey = matchCommand(cmd);

  return (
    <div
      className="flex items-stretch border border-[var(--hair)] bg-[var(--panel)] overflow-hidden"
      style={{ borderRadius: cardRadius }}
    >
      <button
        type="button"
        className="px-2 py-0.5 font-mono text-[10px] text-[var(--soft)] hover:bg-[var(--panel2)] hover:text-[var(--ink)] transition-colors cursor-pointer"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {cmd}
      </button>
      {commandKey && (
        <button
          type="button"
          className="px-1.5 border-l border-[var(--hair)] font-mono text-[9px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--panel2)] transition-colors cursor-pointer flex-shrink-0"
          style={{
            color: isActive ? 'var(--ink)' : undefined,
            background: isActive ? 'var(--panel2)' : undefined,
          }}
          onClick={onTipToggle}
          title={t('commandPanel.whatDoesThisDo')}
        >
          ?
        </button>
      )}
    </div>
  );
};
