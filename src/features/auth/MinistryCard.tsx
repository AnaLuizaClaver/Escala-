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

const coverByMinistry: Record<string, string> = {
  'Louvor & Adoração': 'louvor.jpg',
  'Mídia & Transmissão': 'midia.jpg',
  'Ministério Infantil': 'infantil.jpg',
  'Recepção & Boas-Vindas': 'recepcao.jpg',
};

const membershipStatuses = {
  pending: {
    label: 'Aguardando aprovação',
    icon: Clock3,
    classes: 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  },
  approved: {
    label: 'Você faz parte da equipe',
    icon: CheckCircle2,
    classes: 'bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-200',
  },
  rejected: {
    label: 'Pedido recusado',
    icon: XCircle,
    classes: 'bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200',
  },
};

export default function MinistryCard({
  ministry,
  leaders,
  status,
  busy,
  onRequest,
}: {
  ministry: Ministry;
  leaders: MinistryLeader[];
  status?: keyof typeof membershipStatuses;
  busy: boolean;
  onRequest: () => void;
}) {
  const badge = status ? membershipStatuses[status] : undefined;
  const color = /^#[a-f\d]{6}$/i.test(ministry.color ?? '') ? ministry.color : '#c6ff4d';
  const cover = coverByMinistry[ministry.name];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative isolate flex aspect-[16/10] items-end overflow-hidden bg-[#182019] p-4 sm:p-5">
        {cover && (
          <img
            src={`${import.meta.env.BASE_URL}ministerios/${cover}`}
            alt=""
            loading="lazy"
            className="absolute inset-0 -z-20 size-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/95 via-black/25 to-transparent"
        />
        <div className="flex items-center gap-2.5">
          <div
            className="grid size-9 shrink-0 place-items-center rounded-xl text-lg text-black"
            style={{ backgroundColor: color ?? undefined }}
            aria-hidden="true"
          >
            {ministry.icon || <UsersRound size={19} />}
          </div>
          <h3 className="text-lg font-extrabold leading-tight text-white sm:text-xl">{ministry.name}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3.5 p-4 sm:p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {ministry.description || 'A equipe ainda não adicionou uma descrição.'}
        </p>
        <div className="mt-auto flex gap-2.5 border-t border-border pt-3">
          <UsersRound size={18} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="text-xs font-bold">Liderança</p>
            {leaders.length ? (
              <ul className="mt-0.5 text-sm">
                {leaders.map((leader, index) => (
                  <li key={`${leader.full_name}-${index}`}>{leader.full_name}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-0.5 text-sm text-muted-foreground">Liderança ainda não informada</p>
            )}
          </div>
        </div>
        {badge ? (
          <p
            className={`flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold ${badge.classes}`}
          >
            <badge.icon size={16} aria-hidden="true" /> {badge.label}
          </p>
        ) : ministry.active ? (
          <Button
            type="button"
            className="min-h-10 justify-between rounded-xl"
            aria-label={`Quero servir em ${ministry.name}`}
            disabled={busy}
            onClick={onRequest}
          >
            Quero servir <ArrowRight size={16} aria-hidden="true" />
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">Ministério inativo</p>
        )}
      </div>
    </article>
  );
}
