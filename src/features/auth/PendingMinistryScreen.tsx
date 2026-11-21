import { BellRing, Clock3 } from 'lucide-react';
import './pending-ministry.css';

export default function PendingMinistryScreen({ names, needsEmailConfirmation = false }: {
  names: string[];
  needsEmailConfirmation?: boolean;
}) {
  return (
    <section className="grid min-h-[65vh] place-items-center overflow-hidden rounded-[2rem] bg-brand-night px-6 py-8 text-white sm:px-10">
      <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1fr_1fr]">
        <div className="order-2 space-y-5 md:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-sm font-bold text-brand-lime">
            <Clock3 size={16} aria-hidden="true" /> {needsEmailConfirmation ? 'Confirme seu e-mail' : 'Aguardando aprovação'}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{needsEmailConfirmation ? 'Falta confirmar seu cadastro' : 'Seu pedido foi enviado!'}</h1>
          <p className="text-base leading-relaxed text-white/75">
            {needsEmailConfirmation ? 'Abra o link que enviamos ao seu e-mail e entre no Escalaê para enviar seu pedido à liderança.' : names.length
              ? <>A liderança está analisando seu pedido para servir em <strong className="text-white">{names.join(', ')}</strong>.</>
              : 'A liderança está analisando seu pedido para servir.'}
          </p>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-sm text-white/90">
            <BellRing size={20} className="shrink-0 text-brand-lime" aria-hidden="true" />
            {needsEmailConfirmation ? 'Depois de confirmar o e-mail, volte para entrar com sua conta.' : 'Você vai receber um aviso aqui no Escalaê quando seu pedido for aceito.'}
          </div>
        </div>
        <div className="pending-staircase order-1 md:order-2" aria-hidden="true">
          <div className="pending-steps"><i /><i /><i /><i /></div>
          <img src={`${import.meta.env.BASE_URL}brand/pulo.png`} alt="" className="pending-climber" />
        </div>
      </div>
    </section>
  );
}
