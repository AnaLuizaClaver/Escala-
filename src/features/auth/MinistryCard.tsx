import { ArrowRight, CheckCircle2, Clock3, UsersRound, XCircle } from 'lucide-react';
import { Button } from '../../app/components/ui/button';

export type Ministry = {
  id: string;
  name: string;
  active: boolean;
  description: string | null;
  icon: string | null;
  color: string | null;
};

export type MinistryLeader = { ministry_id: string; full_name: string };

const membershipStatuses = {
  pending: { label: 'Aguardando aprovação', icon: Clock3, classes: 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200' },
  approved: { label: 'Você faz parte da equipe', icon: CheckCircle2, classes: 'bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-200' },
  rejected: { label: 'Pedido recusado', icon: XCircle, classes: 'bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200' },
};

export default function MinistryCard({ ministry, leaders, status, busy, onRequest }: {
  ministry: Ministry;
  leaders: MinistryLeader[];
  status?: keyof typeof membershipStatuses;
  busy: boolean;
  onRequest: () => void;
}) {
  const badge = status ? membershipStatuses[status] : undefined;
  const color = /^#[a-f\d]{6}$/i.test(ministry.color ?? '') ? ministry.color : '#c6ff4d';

  return (
    <article className="flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm" style={{ borderTopColor: color ?? undefined, borderTopWidth: 3 }}>
      <div>
        <div className="mb-3 grid size-12 place-items-center rounded-2xl text-xl" style={{ backgroundColor: `${color}35` }} aria-hidden="true">
          {ministry.icon || <UsersRound size={22} />}
        </div>
        <h3 className="text-lg font-extrabold leading-tight">{ministry.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ministry.description || 'A equipe ainda não adicionou uma descrição.'}</p>
      </div>
      <div className="mt-auto flex gap-2.5 rounded-xl bg-muted/60 p-3">
        <UsersRound size={18} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="text-xs font-bold">Liderança</p>
          {leaders.length ? <ul className="mt-0.5 text-sm">{leaders.map((leader, index) => <li key={`${leader.full_name}-${index}`}>{leader.full_name}</li>)}</ul>
            : <p className="mt-0.5 text-sm text-muted-foreground">Liderança ainda não informada</p>}
        </div>
      </div>
      {badge ? <p className={`flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold ${badge.classes}`}>
        <badge.icon size={16} aria-hidden="true" /> {badge.label}
      </p> : ministry.active ? <Button type="button" className="min-h-10 justify-between rounded-xl"
        aria-label={`Quero servir em ${ministry.name}`} disabled={busy} onClick={onRequest}>
        Quero servir <ArrowRight size={16} aria-hidden="true" />
      </Button> : <p className="text-sm text-muted-foreground">Ministério inativo</p>}
    </article>
  );
}
