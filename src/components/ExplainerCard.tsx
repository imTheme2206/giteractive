import { useEffect, useState } from 'react';

interface ExplainerCardProps {
  command: string;
  onDismiss: () => void;
}

const cardRadius = '255px 14px 225px 16px/16px 225px 14px 255px';
const pillRadius = '60px 10px 60px 10px/10px 60px 10px 60px';

function getExplanation(command: string): { title: string; body: string; color: string } | null {
  if (command.startsWith('git checkout -b')) {
    const branch = command.split(' ')[2] ?? 'feature';
    return {
      title: 'Branch created',
      body: `Git created a new pointer called "${branch}" — no files were copied. Branches are just labels. HEAD now follows ${branch} forward as you add commits.`,
      color: 'var(--feat)',
    };
  }
  if (command.startsWith('git commit')) {
    return {
      title: 'New commit created',
      body: 'Git took a snapshot of your staged changes and stored it as a new node in the history graph. Each commit gets a unique hash — that\'s why the ID looks random.',
      color: 'var(--main)',
    };
  }
  if (command.startsWith('git cherry-pick')) {
    const hash = command.split(' ')[2] ?? '';
    return {
      title: 'Cherry-pick',
      body: `Git copied commit ${hash} and re-applied its changes on top of the current branch tip. Notice the new node has a different hash — same changes, new identity.`,
      color: 'var(--feat)',
    };
  }
  if (command.startsWith('git rebase')) {
    const onto = command.split(' ')[2] ?? '';
    return {
      title: 'Rebase',
      body: `Git found the common ancestor of both branches, lifted your commits off their old base, and re-applied them one-by-one on top of ${onto}. Old commit IDs are gone — history was rewritten.`,
      color: 'var(--head)',
    };
  }
  return null;
}

export function ExplainerCard({ command, onDismiss }: ExplainerCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const t1 = setTimeout(() => setVisible(true), 50);
    // Auto-dismiss after 6s
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDismiss]);

  const explanation = getExplanation(command);
  if (!explanation) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 72,
        right: 24,
        width: 300,
        zIndex: 20,
        transition: 'opacity 0.3s, transform 0.3s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      <div
        className="bg-[var(--panel)] p-4 shadow-lg"
        style={{
          border: `2px solid ${explanation.color}`,
          borderRadius: cardRadius,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <span
              className="font-bold text-sm text-[var(--ink)]"
              style={{ fontFamily: 'var(--hand)' }}
            >
              {explanation.title}
            </span>
          </div>
          <button
            onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
            className="text-[var(--muted)] text-lg leading-none cursor-pointer bg-transparent border-0 flex-shrink-0"
            style={{ fontFamily: 'var(--hand)' }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <p
          className="text-sm text-[var(--soft)] leading-snug m-0 mb-3"
          style={{ fontFamily: 'var(--hand)' }}
        >
          {explanation.body}
        </p>

        {/* Command pill */}
        <span
          className="font-mono text-[11px] text-[var(--muted)] border border-[var(--hair)] px-2 py-0.5 bg-[var(--panel2)]"
          style={{ borderRadius: pillRadius }}
        >
          $ {command}
        </span>
      </div>
    </div>
  );
}
