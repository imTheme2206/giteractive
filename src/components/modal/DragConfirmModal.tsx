import { useState } from 'react';
import ReactDOM from 'react-dom';
import { cardRadius } from '../common/radii';

type DragOp =
  | { type: 'rebase'; branchToRebase: string; ontoBranch: string }
  | { type: 'merge'; sourceBranch: string; targetBranch: string };

type DragConfirmModalProps = {
  op: DragOp;
  headBranch: string;
  onConfirm: (choice: 'rebase' | 'merge') => void;
  onCancel: () => void;
};

type OptionCard = {
  id: 'rebase' | 'merge';
  label: string;
  description: string;
  command: string;
  color: string;
  bg: string;
};

const buildCards = (op: DragOp): OptionCard[] => {
  const fromBranch = op.type === 'rebase' ? op.branchToRebase : op.sourceBranch;
  const ontoBranch = op.type === 'rebase' ? op.ontoBranch : op.targetBranch;

  return [
    {
      id: 'rebase',
      label: 'Rebase',
      description: 'Re-apply commits on top of the target. Linear history, no merge commit.',
      command: `git rebase ${ontoBranch}`,
      color: 'var(--main)',
      bg: 'color-mix(in srgb, var(--main) 8%, var(--panel))',
    },
    {
      id: 'merge',
      label: 'Merge',
      description: `Combine branches with a merge commit. Preserves full history.`,
      command: `git merge ${fromBranch}`,
      color: 'var(--feat)',
      bg: 'color-mix(in srgb, var(--feat) 8%, var(--panel))',
    },
  ];
};

const getSmartDefault = (op: DragOp, headBranch: string): 'rebase' | 'merge' | null => {
  if (op.type === 'rebase' && op.branchToRebase === headBranch) return 'rebase';
  if (op.type === 'merge' && op.targetBranch === headBranch) return 'merge';
  return null;
};

export const DragConfirmModal = ({ op, headBranch, onConfirm, onCancel }: DragConfirmModalProps) => {
  const smartDefault = getSmartDefault(op, headBranch);
  const [selected, setSelected] = useState<'rebase' | 'merge'>(smartDefault ?? op.type);

  const cards = buildCards(op);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
      style={{ background: 'var(--backdrop)', zIndex: 100 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="w-[520px] max-w-[92vw] p-6 border-2"
        style={{
          borderRadius: cardRadius,
          background: 'var(--panel)',
          borderColor: 'var(--ink)',
          boxShadow: '0 8px 48px color-mix(in srgb, var(--ink) 18%, transparent)',
        }}
      >
        <div className="mb-5">
          <div className="font-bold text-base text-[var(--ink)] font-hand mb-1">
            How do you want to integrate these branches?
          </div>
          <div className="font-mono text-[11px] text-[var(--muted)]">
            {op.type === 'rebase'
              ? `${op.branchToRebase} → ${op.ontoBranch}`
              : `${op.sourceBranch} → ${op.targetBranch}`}
          </div>
        </div>

        <div className="flex gap-3 mb-5">
          {cards.map((card) => {
            const isSelected = selected === card.id;
            const isDefault = smartDefault === card.id;
            return (
              <button
                key={card.id}
                onClick={() => setSelected(card.id)}
                className="flex-1 text-left p-4 border-2 cursor-pointer transition-all"
                style={{
                  borderRadius: cardRadius,
                  borderColor: isSelected ? card.color : 'var(--hair)',
                  background: isSelected ? card.bg : 'var(--panel)',
                  outline: 'none',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-[13px] font-hand" style={{ color: card.color }}>
                    {card.label}
                  </span>
                  {isDefault && (
                    <span
                      className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{ background: card.color, color: 'var(--panel)' }}
                    >
                      suggested
                    </span>
                  )}
                </div>
                <div className="font-mono text-[11px] text-[var(--soft)] mb-3 leading-relaxed">
                  {card.description}
                </div>
                <div
                  className="font-mono text-[10px] px-2 py-1.5 rounded"
                  style={{
                    background: 'var(--panel2)',
                    color: card.color,
                    border: `1px solid color-mix(in srgb, ${card.color} 30%, transparent)`,
                    borderRadius: '6px',
                  }}
                >
                  $ {card.command}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="font-mono text-[12px] px-4 py-1.5 border cursor-pointer"
            style={{
              borderRadius: '8px',
              borderColor: 'var(--hair)',
              background: 'transparent',
              color: 'var(--muted)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selected)}
            className="font-mono text-[12px] px-4 py-1.5 border cursor-pointer font-bold"
            style={{
              borderRadius: '8px',
              borderColor: selected === 'rebase' ? 'var(--main)' : 'var(--feat)',
              background: selected === 'rebase' ? 'var(--main)' : 'var(--feat)',
              color: 'var(--panel)',
            }}
          >
            Confirm {selected === 'rebase' ? 'Rebase' : 'Merge'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
