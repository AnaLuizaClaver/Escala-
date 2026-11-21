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
  'Louvor & Adoração': 'louvor-3d.jpg',
  'Mídia & Transmissão': 'midia-3d.jpg',
  'Ministério Infantil': 'infantil-3d.jpg',
  'Recepção & Boas-Vindas': 'recepcao-3d.jpg',
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
    <article className="group relative isolate flex h-full min-h-[25rem] flex-col justify-end overflow-hidden rounded-[1.6rem] border-2 bg-[#101322] text-white shadow-lg motion-safe:transition-transform motion-safe:hover:-translate-y-1 sm:min-h-[28rem]" style={{ borderColor: color ?? undefined }}>
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {cover && (
          <img
            src={`${import.meta.env.BASE_URL}ministerios/${cover}`}
            alt=""
            loading="lazy"
            className="size-full object-cover object-top motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,#101322_7%,#101322f2_26%,#1013229e_50%,transparent_74%)]"
        />
      </div>
      <div className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-lg text-black shadow-md"
        style={{ backgroundColor: color ?? undefined }} aria-hidden="true">
        {ministry.icon || <UsersRound size={19} />}
      </div>
      <div className="flex flex-col gap-3 px-4 pb-4 pt-40 sm:px-5 sm:pb-5">
        <h3 className="text-xl font-extrabold leading-tight tracking-tight sm:text-2xl" style={{ color: color ?? undefined }}>{ministry.name}</h3>
        <p className="text-sm leading-relaxed text-white/85">
          {ministry.description || 'A equipe ainda não adicionou uma descrição.'}
        </p>
        <div className="flex gap-2.5 border-t border-white/20 pt-3">
          <UsersRound size={18} className="mt-0.5 shrink-0 text-white/75" aria-hidden="true" />
          <div>
            <p className="text-xs font-bold">Liderança</p>
            {leaders.length ? (
              <ul className="mt-0.5 text-sm">
                {leaders.map((leader, index) => (
                  <li key={`${leader.full_name}-${index}`}>{leader.full_name}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-0.5 text-sm text-white/75">Liderança ainda não informada</p>
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
            className="min-h-10 justify-between rounded-full text-black hover:brightness-110"
            style={{ backgroundColor: color ?? undefined }}
            aria-label={`Quero servir em ${ministry.name}`}
            disabled={busy}
            onClick={onRequest}
          >
            Quero servir <ArrowRight size={16} aria-hidden="true" />
          </Button>
        ) : (
          <p className="text-sm text-white/75">Ministério inativo</p>
        )}
      </div>
    </article>
  );
}
