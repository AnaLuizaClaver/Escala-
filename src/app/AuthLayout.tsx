import type { ReactNode } from 'react';

export default function AuthLayout({ children, controls, fullWidth = false }: {
  children: ReactNode;
  controls?: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans lg:grid lg:grid-cols-[45%_55%]">
      <aside className="relative isolate flex min-h-36 flex-col justify-between overflow-hidden bg-primary p-6 text-white lg:sticky lg:top-0 lg:h-dvh lg:p-12">
        <img src={`${import.meta.env.BASE_URL}equipe-servindo.png`} alt="" fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_42%]" />
        <div className="absolute inset-0 -z-10 bg-[#bdf348]/30 mix-blend-screen" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#10230c]/95 via-[#10230c]/25 to-[#10230c]/65" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-foreground text-primary flex items-center justify-center font-extrabold text-2xl shadow-sm rotate-3">E</div>
          <span className="font-extrabold text-3xl tracking-tight">Escalaê</span>
        </div>
        <div className="relative z-10 mt-6 max-w-md">
          <p className="text-lg font-bold tracking-tight lg:text-6xl lg:leading-[1.03]">
            Organize.<span className="lg:block"> Conecte.</span><span className="text-[#cbfa76] lg:block"> Sirva.</span>
          </p>
          <p className="mt-5 hidden max-w-xs text-base text-white/85 lg:block">Organize as escalas e reúna as equipes que servem na sua igreja.</p>
        </div>
      </aside>
      <main className="relative flex flex-col">
        {controls && <div className="absolute top-6 right-6 z-10">{controls}</div>}
        <div className={fullWidth
          ? 'flex flex-1 p-5 sm:p-8 lg:min-h-dvh lg:px-12 lg:py-10'
          : 'flex flex-1 items-center justify-center p-6 sm:p-12 lg:min-h-dvh'}>
          {children}
        </div>
      </main>
    </div>
  );
}
