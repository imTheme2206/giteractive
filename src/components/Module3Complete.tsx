interface Module3CompleteProps {
  attempts: number;
  onUnlock: () => void;
}

const cardRadius = '255px 14px 225px 16px/16px 225px 14px 255px';
const btnRadius = '60px 10px 60px 10px/10px 60px 10px 60px';

export function Module3Complete({ attempts, onUnlock }: Module3CompleteProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10"
      style={{ background: 'rgba(244,243,236,0.82)' }}
    >
      <div
        className="bg-[var(--panel)] border-2 border-[var(--ok)] p-8 max-w-sm text-center shadow-lg"
        style={{ borderRadius: cardRadius }}
      >
        <div className="text-4xl mb-2">✓</div>
        <h2
          className="text-2xl font-bold text-[var(--ink)] mt-0 mb-2.5"
          style={{ fontFamily: 'var(--hand)' }}
        >
          Cherry-pick Complete!
        </h2>
        <p
          className="text-sm text-[var(--soft)] mt-0 mb-1 leading-relaxed"
          style={{ fontFamily: 'var(--hand)' }}
        >
          You copied one commit onto main — its hash changed because history was re-applied, not moved.
        </p>
        <p
          className="text-sm text-[var(--muted)] mt-0 mb-5 leading-relaxed font-mono"
          style={{ fontSize: 11 }}
        >
          {attempts} attempt{attempts !== 1 ? 's' : ''}
        </p>
        <button
          onClick={onUnlock}
          className="font-bold text-sm px-6 py-2 cursor-pointer text-[var(--panel)] border-2 border-[var(--ok)]"
          style={{ fontFamily: 'var(--hand)', borderRadius: btnRadius, background: 'var(--ok)' }}
        >
          Back to Sandbox
        </button>
      </div>
    </div>
  );
}
