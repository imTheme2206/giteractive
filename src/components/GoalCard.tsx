import type { LessonGoal } from '../types';

type GoalCardProps = {
  lesson: LessonGoal;
  attempts: number;
  guided: boolean;
  onToggleGuided: (v: boolean) => void;
};

const cardRadius = '255px 14px 225px 16px/16px 225px 14px 255px';
const pillRadius = '60px 10px 60px 10px/10px 60px 10px 60px';
const chipRadius = '14px 4px 14px 4px / 4px 14px 4px 14px';

export const GoalCard = ({ lesson, attempts, guided, onToggleGuided }: GoalCardProps) => {
  return (
    <div
      className="absolute bottom-4 left-4 z-10"
      style={{ width: 288 }}
    >
      <div
        className="bg-[var(--panel)] shadow-lg"
        style={{
          border: '2px solid var(--feat)',
          borderRadius: cardRadius,
        }}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2 gap-2">
          <h3
            className="font-bold text-sm text-[var(--ink)] m-0"
            style={{ fontFamily: 'var(--hand)' }}
          >
            {lesson.title}
          </h3>
          <div
            className="flex text-[11px] font-mono border border-[var(--hair)] overflow-hidden flex-shrink-0"
            style={{ borderRadius: pillRadius }}
          >
            <button
              onClick={() => onToggleGuided(true)}
              className="px-2 py-0.5 cursor-pointer border-0"
              style={{
                background: guided ? 'var(--feat)' : 'var(--panel)',
                color: guided ? 'var(--panel)' : 'var(--muted)',
              }}
            >
              Guided
            </button>
            <button
              onClick={() => onToggleGuided(false)}
              className="px-2 py-0.5 cursor-pointer border-0"
              style={{
                background: !guided ? 'var(--ink)' : 'var(--panel)',
                color: !guided ? 'var(--panel)' : 'var(--muted)',
              }}
            >
              Sandbox
            </button>
          </div>
        </div>

        {guided && (
          <>
            <p
              className="text-[13px] text-[var(--soft)] mx-4 mb-3 mt-0 leading-snug"
              style={{ fontFamily: 'var(--hand)' }}
            >
              <b className="text-[var(--ink)]">Goal:</b> {lesson.description}
            </p>

            <div className="flex flex-wrap gap-1.5 px-4 mb-3">
              {lesson.chips.map(chip => (
                <span
                  key={chip}
                  className="font-mono text-[10px] px-2 py-0.5 border border-[var(--hair)] text-[var(--soft)] bg-[var(--panel2)]"
                  style={{ borderRadius: chipRadius }}
                >
                  {chip}
                </span>
              ))}
              <span
                className="font-mono text-[10px] px-2 py-0.5 border text-[var(--soft)] bg-[var(--panel2)]"
                style={{
                  borderRadius: chipRadius,
                  borderColor: attempts > 0 ? 'var(--feat)' : 'var(--hair)',
                  color: attempts > 0 ? 'var(--feat)' : 'var(--soft)',
                }}
              >
                attempts: {attempts}
              </span>
            </div>

            <div
              className="mx-4 mb-4 px-3 py-2 text-[12px] text-[var(--soft)] leading-snug"
              style={{
                fontFamily: 'var(--hand)',
                border: '1.5px dashed var(--hair)',
                borderRadius: '8px 2px 8px 2px / 2px 8px 2px 8px',
              }}
            >
              <b className="text-[var(--ink)]">Hint ▸</b>{' '}
              {lesson.hint}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
