import type { ReactNode } from 'react';
import BrandLogo from '../shared/ui/BrandLogo';

export default function AuthLayout({ children, controls, fullWidth = false }: {
  children: ReactNode;
  controls?: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans lg:grid lg:grid-cols-[minmax(0,70%)_minmax(0,30%)]">
      <aside className="relative isolate flex min-h-36 flex-col justify-between overflow-hidden bg-brand-blue p-6 text-white lg:sticky lg:top-0 lg:h-dvh lg:p-12">
        <img src={`${import.meta.env.BASE_URL}equipe-servindo.png`} alt="" fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_42%]" />
        <div className="absolute inset-0 -z-10 bg-brand-blue/30 mix-blend-color" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-night via-brand-night/35 to-brand-blue/65" />
        <BrandLogo onPhoto />
        <div className="relative z-10 mt-6 max-w-md">
          <p className="font-display text-lg font-extrabold tracking-tight lg:text-6xl lg:leading-[1.03]">
            Talentos que sobem <span className="text-brand-lime">juntos.</span>
          </p>
          <p className="mt-5 hidden max-w-xs text-base text-white/85 lg:block">Organize as escalas e reúna as equipes que servem na sua igreja.</p>
        </div>
      </aside>
      <main className="relative flex flex-col">
        {controls && <div className="absolute top-6 right-6 z-10">{controls}</div>}
        <div className={fullWidth
          ? 'flex flex-1 p-5 sm:p-8 lg:min-h-dvh lg:px-7 lg:py-10 xl:px-10'
          : 'flex flex-1 items-center justify-center p-6 sm:p-12 lg:min-h-dvh'}>
          {children}
        </div>
      </main>
    </div>
  );
}
