import { useEffect, useState } from 'react';
import { LuUserRound } from 'react-icons/lu';
import { ChartCard } from '../../components/ChartCard';
import { DataState, type DataStatus } from '../../components/DataState';
import { Table, type TableColumn, type TableRow } from '../../components/Table';
import { Tag } from '../../components/Tag';
import { useLocale } from '../../hooks/useLocale';
import { interpolate } from '../../locales';
import { getAbsences } from '../../services/dashboardService';
import type { AbsenceItem } from '../../types/dashboard';
import { formatEntryDate } from '../../utils/date';
import { formatNumber } from '../../utils/number';
import * as Styled from './styles';

const LIST_MIN_HEIGHT = '16rem';

// Lista de quem faltou aos 3 últimos encontros do grupo. A ordem vem do backend (sem presença há
// mais tempo primeiro); uma participante em dois grupos aparece em duas linhas.
export const AbsencesList = () => {
  const { dashboard } = useLocale();
  const text = dashboard.absences;

  // muda a cada "Tentar novamente", para refazer a busca
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ attempt: number; items: AbsenceItem[] | null } | null>(
    null,
  );

  useEffect(() => {
    let ignore = false;

    getAbsences()
      .then((items) => {
        if (!ignore) setResult({ attempt, items });
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) setResult({ attempt, items: null });
      });

    return () => {
      ignore = true;
    };
  }, [attempt]);

  const items = result?.attempt === attempt ? result.items : undefined;

  const status: DataStatus =
    items === undefined
      ? 'loading'
      : items === null
        ? 'error'
        : items.length === 0
          ? 'empty'
          : 'ready';

  const columns: TableColumn[] = [
    { key: 'participant', label: text.columns.participant, align: 'left' },
    { key: 'group', label: text.columns.group, align: 'left' },
    { key: 'lastPresence', label: text.columns.lastPresence, align: 'left' },
  ];

  const rows: TableRow[] = (items ?? []).map((item) => ({
    participant: (
      <Styled.AbsenceParticipant>
        <Styled.AbsenceAvatar aria-hidden>
          <LuUserRound />
        </Styled.AbsenceAvatar>
        <Styled.AbsenceName>{item.name}</Styled.AbsenceName>
      </Styled.AbsenceParticipant>
    ),
    group: interpolate(text.groupLabel, {
      number: String(item.group.number).padStart(2, '0'),
      description: item.group.description,
    }),
    lastPresence: item.lastPresenceAt ? (
      <Styled.AbsenceDate>{formatEntryDate(item.lastPresenceAt)}</Styled.AbsenceDate>
    ) : (
      <Styled.AbsenceNever>{text.never}</Styled.AbsenceNever>
    ),
    rowHref: `/participantes/${item.participantId}`,
  }));

  return (
    <ChartCard
      title={text.title}
      badge={
        status === 'ready' && items ? (
          <Tag color="neutral">{formatNumber(items.length)}</Tag>
        ) : undefined
      }
    >
      {status === 'ready' ? (
        <Styled.AbsencesTable>
          <Table columns={columns} rows={rows} itemLabel={text.itemLabel} />
        </Styled.AbsencesTable>
      ) : (
        <DataState
          variant={status}
          minHeight={LIST_MIN_HEIGHT}
          onRetry={() => setAttempt((current) => current + 1)}
        >
          {status === 'empty' ? text.empty : undefined}
        </DataState>
      )}
    </ChartCard>
  );
};
