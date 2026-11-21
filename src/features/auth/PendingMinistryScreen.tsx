import { BellRing, Clock3 } from 'lucide-react';
import './pending-ministry.css';

export default function PendingMinistryScreen({ names }: { names: string[] }) {
  return (
    <section className="grid min-h-[65vh] place-items-center overflow-hidden rounded-[2rem] bg-brand-surface px-6 py-8 text-white sm:px-10">
      <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1fr_1fr]">
        <div className="order-2 space-y-5 md:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-sm font-bold text-primary">
            <Clock3 size={16} aria-hidden="true" /> Aguardando aprovação
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Seu pedido foi enviado!</h1>
          <p className="text-base leading-relaxed text-white/75">
            {names.length
              ? <>A liderança está analisando seu pedido para servir em <strong className="text-white">{names.join(', ')}</strong>.</>
              : 'A liderança está analisando seu pedido para servir.'}
          </p>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-sm text-white/90">
            <BellRing size={20} className="shrink-0 text-primary" aria-hidden="true" />
            Você vai receber um aviso aqui no Escalaê quando seu pedido for aceito.
          </div>
        </div>
        <div className="pending-staircase order-1 md:order-2" aria-hidden="true">
          <div className="pending-steps"><i /><i /><i /><i /></div>
          <img src={`${import.meta.env.BASE_URL}escalae-icon.png`} alt="" className="pending-climber" />
        </div>
      </div>
    </section>
  );
}
