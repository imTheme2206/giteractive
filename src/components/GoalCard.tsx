import { useTranslation } from 'react-i18next';
import type { LessonGoal } from '../types';
import { Badge } from './common/Badge';
import { Button } from './common/Button';
import { ButtonGroup } from './common/ButtonGroup';
import { Card, CardBody, CardTitle } from './common/Card';

type GoalCardProps = {
  lesson: LessonGoal;
  attempts: number;
  guided: boolean;
  onToggleGuided: (v: boolean) => void;
};

export const GoalCard = ({ lesson, attempts, guided, onToggleGuided }: GoalCardProps) => {
  const { t } = useTranslation();
  const rawChips = t(`lessons.${lesson.id}.chips`, { returnObjects: true });
  const chips: string[] = Array.isArray(rawChips) ? rawChips : lesson.chips;

  return (
    <div className="absolute bottom-4 left-4 z-10" style={{ width: 288 }}>
      <Card borderColor="var(--feat)">
        <div className="flex items-center justify-between px-4 pt-4 pb-2 gap-2">
          <CardTitle>{t(`lessons.${lesson.id}.title`)}</CardTitle>
          <ButtonGroup>
            <Button
              variant="sharp"
              onClick={() => onToggleGuided(true)}
              style={{
                background: guided ? 'var(--feat)' : 'var(--panel)',
                color: guided ? 'var(--panel)' : 'var(--muted)',
              }}
            >
              {t('goalCard.guided')}
            </Button>
            <Button
              variant="sharp"
              onClick={() => onToggleGuided(false)}
              style={{
                background: !guided ? 'var(--ink)' : 'var(--panel)',
                color: !guided ? 'var(--panel)' : 'var(--muted)',
              }}
            >
              {t('goalCard.sandbox')}
            </Button>
          </ButtonGroup>
        </div>

        {guided && (
          <>
            <CardBody className="mx-4 mb-3 mt-0">
              <b className="text-[var(--ink)]">{t('goalCard.goal')}</b>{' '}
              {t(`lessons.${lesson.id}.description`)}
            </CardBody>

            <div className="flex flex-wrap gap-1.5 px-4 mb-3">
              {chips.map(chip => (
                <Badge
                  key={chip}
                  variant="chip"
                  className="px-2 py-0.5 border border-[var(--hair)] text-[var(--soft)] bg-[var(--panel2)]"
                >
                  {chip}
                </Badge>
              ))}
              <Badge
                variant="chip"
                className="px-2 py-0.5 border bg-[var(--panel2)]"
                style={{
                  borderColor: attempts > 0 ? 'var(--feat)' : 'var(--hair)',
                  color: attempts > 0 ? 'var(--feat)' : 'var(--soft)',
                }}
              >
                {t('goalCard.attempts', { count: attempts })}
              </Badge>
            </div>

            <div
              className="mx-4 mb-4 px-3 py-2 text-sm text-[var(--soft)] leading-snug font-hand"
              style={{
                border: '1.5px dashed var(--hair)',
                borderRadius: '8px 2px 8px 2px / 2px 8px 2px 8px',
              }}
            >
              <b className="text-[var(--ink)]">{t('goalCard.hint')}</b>{' '}
              {t(`lessons.${lesson.id}.hint`)}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
