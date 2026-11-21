import { ArrowRight, CheckCircle2, UsersRound } from 'lucide-react';

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

export default function MinistryCard({ ministry, leaders, member, onOpen, selected }: {
  ministry: Ministry;
  leaders: MinistryLeader[];
  member: boolean;
  onOpen: () => void;
  selected?: boolean;
}) {
  const color = /louvor/i.test(ministry.name) ? 'var(--brand-purple)' : /mídia|midia/i.test(ministry.name) ? 'var(--brand-blue)' : 'var(--brand-lime)';
  const cover = coverByMinistry[ministry.name];

  return (
    <article className="group relative isolate flex aspect-[4/5] w-full flex-col justify-end overflow-hidden rounded-2xl border-2 bg-brand-night text-brand-cream shadow-[var(--sticker-shadow)] motion-safe:transition-transform motion-safe:hover:-translate-y-1" style={{ borderColor: selected ? 'var(--ring)' : 'var(--brand-cream)' }}>
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
      <div className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-brand-night text-lg shadow-md"
        style={{ backgroundColor: color, color: color === 'var(--brand-blue)' ? 'white' : 'var(--brand-night)' }} aria-hidden="true">
        {ministry.icon || <UsersRound size={19} />}
      </div>
      <div className="max-h-full space-y-2.5 overflow-y-auto px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <h3 className="text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">{ministry.name}</h3>
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
        {member && <p className="flex items-center gap-2 text-xs font-bold text-green-200">
          <CheckCircle2 size={15} aria-hidden="true" /> Você faz parte da equipe
        </p>}
        <button type="button" onClick={onOpen} aria-pressed={selected} aria-label={`${selected === undefined ? 'Abrir' : 'Selecionar'} ${ministry.name}`}
          className="flex min-h-11 w-full items-center justify-between rounded-full border border-brand-night px-4 text-sm font-bold hover:brightness-110"
          style={{ backgroundColor: selected === false ? 'var(--brand-cream)' : 'var(--brand-lime)', color: 'var(--brand-night)' }}>
          {selected === undefined ? 'Abrir ministério' : selected ? 'Selecionado' : 'Selecionar ministério'} <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
