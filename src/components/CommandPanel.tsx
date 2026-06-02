import type { Mode } from '../types';
import { cardRadius } from './common/radii';

type CommandPanelProps = {
  mode: Mode;
  commands: string[];
  onPreview: (cmd: string) => void;
  onExecute: (cmd: string) => void;
};

export const CommandPanel = ({ mode: _mode, commands, onPreview, onExecute }: CommandPanelProps) => {
  if (commands.length === 0) return null;

  return (
    <div className="flex-shrink-0 flex items-center gap-2 px-4 py-1.5 border-t border-dashed border-[var(--hair)] bg-[var(--panel2)]">
      <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)] flex-shrink-0">
        Commands
      </span>
      <div className="flex flex-wrap gap-1.5">
        {commands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            className="px-2 py-0.5 border border-[var(--hair)] bg-[var(--panel)] font-mono text-[10px] text-[var(--soft)] hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            style={{ borderRadius: cardRadius }}
            onMouseEnter={() => onPreview(cmd)}
            onMouseLeave={() => onPreview('')}
            onClick={() => onExecute(cmd)}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
