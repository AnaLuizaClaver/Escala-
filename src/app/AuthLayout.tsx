import type { ReactNode } from 'react';

export default function AuthLayout({ children, controls }: {
  children: ReactNode;
  controls?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">
      <div className="hidden lg:flex w-[45%] bg-primary flex-col justify-between p-12 relative overflow-hidden text-primary-foreground border-r border-border">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.05)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.05)_75%,transparent_75%,transparent)]" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-foreground text-primary flex items-center justify-center font-extrabold text-2xl shadow-sm rotate-3">E</div>
          <span className="font-extrabold text-3xl tracking-tight">Escalaê</span>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">Organize.<br />Conecte.<br />Sirva.</h1>
          <p className="font-semibold text-primary-foreground/80 text-lg">A plataforma feita para simplificar e gamificar o voluntariado na sua igreja local.</p>
        </div>
      </div>
      <main className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
        {controls && <div className="absolute top-6 right-6 z-10">{controls}</div>}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 mt-12 sm:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
