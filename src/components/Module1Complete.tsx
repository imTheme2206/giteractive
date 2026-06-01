interface Module1CompleteProps {
  onUnlock: () => void;
}

const cardRadius = '255px 14px 225px 16px/16px 225px 14px 255px';
const btnRadius = '60px 10px 60px 10px/10px 60px 10px 60px';

export function Module1Complete({ onUnlock }: Module1CompleteProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10"
      style={{ background: 'rgba(244,243,236,0.82)' }}
    >
      <div
        className="bg-[var(--panel)] border-2 border-[var(--ok)] p-8 max-w-sm text-center shadow-lg"
        style={{ borderRadius: cardRadius }}
      >
        <div className="text-4xl mb-2">🎉</div>
        <h2
          className="text-2xl font-bold text-[var(--ink)] mt-0 mb-2.5"
          style={{ fontFamily: 'var(--hand)' }}
        >
          Module 1 Complete!
        </h2>
        <p
          className="text-sm text-[var(--soft)] mt-0 mb-5 leading-relaxed"
          style={{ fontFamily: 'var(--hand)' }}
        >
          You've mastered linear history. Ready for branches?
        </p>
        <button
          onClick={onUnlock}
          className="font-bold text-sm px-6 py-2 cursor-pointer bg-[var(--ok)] text-[var(--panel)] border-2 border-[var(--ok)]"
          style={{ fontFamily: 'var(--hand)', borderRadius: btnRadius }}
        >
          Unlock Sandbox Mode
        </button>
      </div>
    </div>
  );
}
