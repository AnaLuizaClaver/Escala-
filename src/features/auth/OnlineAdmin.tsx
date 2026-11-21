import { ArrowLeft, ClipboardList, LogOut, RefreshCw, ShieldCheck, UsersRound } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import AdminNavigation, { adminNavigation } from '../../app/router/AdminNavigation';
import { pathForView, viewForPath, type View } from '../../app/router/routes';
import BrandLogo from '../../shared/ui/BrandLogo';
import { Button } from '../../app/components/ui/button';
import type { Ministry } from './MinistryCard';

export type Membership = { id: string; user_id: string; ministry_id: string; status: 'pending' | 'approved' | 'rejected' };
export type AdminPerson = { id: string; full_name: string };

export default function OnlineAdmin({ name, photo, ministries, people, memberships, busy, error, refresh, signOut, decide }: {
  name: string;
  photo?: string;
  ministries: Ministry[];
  people: AdminPerson[];
  memberships: Membership[];
  busy: boolean;
  error: string;
  refresh: () => void;
  signOut: () => void;
  decide: (id: string, status: 'approved' | 'rejected') => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentView = viewForPath(location.pathname);
  const navigateTo = (view: View) => navigate(pathForView(view));
  const pending = memberships.filter(row => row.status === 'pending');
  const activeMinistries = ministries.filter(item => item.active);
  const section = adminNavigation.find(item => item.view === currentView);
  if (!section) return <Navigate to={pathForView('admin_dashboard')} replace />;

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-card md:flex">
        <button type="button" aria-label="Escalaê, abrir Dashboard" className="bg-brand-surface px-8 py-5 text-left"
          onClick={() => navigateTo('admin_dashboard')}><BrandLogo /></button>
        <nav aria-label="Navegação administrativa" className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          <AdminNavigation currentView={currentView} navigateTo={navigateTo} pendingCount={pending.length} />
        </nav>
        <div className="flex items-center gap-3 border-t border-border p-4">
          {photo ? <img src={photo} alt="" className="size-9 rounded-full object-cover" />
            : <ShieldCheck size={23} className="shrink-0 text-primary" aria-hidden="true" />}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{name}</p>
            <p className="text-xs text-muted-foreground">Modo Admin</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Sair" disabled={busy} onClick={signOut}><LogOut size={17} /></Button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between bg-brand-surface px-5 py-3 text-white md:hidden">
          <button type="button" aria-label="Escalaê, abrir Dashboard" onClick={() => navigateTo('admin_dashboard')}><BrandLogo /></button>
          <Button variant="ghost" size="icon" aria-label="Sair" disabled={busy} onClick={signOut}><LogOut size={18} /></Button>
        </header>
        <div className="mx-auto max-w-6xl space-y-6 px-5 pb-28 pt-6 sm:px-8 md:pb-10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{section.label}</h1>
              {currentView === 'admin_dashboard' && <p className="mt-1 text-muted-foreground">Olá, {name.split(' ')[0]}!</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigateTo('home')}><ArrowLeft size={16} aria-hidden="true" /> Voltar ao app</Button>
              <Button variant="outline" disabled={busy} onClick={refresh}><RefreshCw size={16} aria-hidden="true" /> Atualizar</Button>
            </div>
          </div>
          {error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          {currentView === 'admin_dashboard' && (
            <div className="grid gap-4 sm:grid-cols-3">
              <button type="button" onClick={() => navigateTo('admin_solicitacoes')} className="rounded-2xl border border-border bg-card p-5 text-left hover:border-primary">
                <ClipboardList className="mb-3 text-primary" aria-hidden="true" />
                <span className="block text-3xl font-extrabold">{pending.length}</span>
                <span className="text-sm font-semibold">Solicitações pendentes</span>
              </button>
              <button type="button" onClick={() => navigateTo('admin_ministerios')} className="rounded-2xl border border-border bg-card p-5 text-left hover:border-primary">
                <UsersRound className="mb-3 text-primary" aria-hidden="true" />
                <span className="block text-3xl font-extrabold">{activeMinistries.length}</span>
                <span className="text-sm font-semibold">Ministérios ativos</span>
              </button>
              <button type="button" onClick={() => navigateTo('admin_voluntarios')} className="rounded-2xl border border-border bg-card p-5 text-left hover:border-primary">
                <ShieldCheck className="mb-3 text-primary" aria-hidden="true" />
                <span className="block text-3xl font-extrabold">{people.length}</span>
                <span className="text-sm font-semibold">Pessoas cadastradas</span>
              </button>
            </div>
          )}
          {currentView === 'admin_solicitacoes' && (
            <section aria-labelledby="requests-heading" className="rounded-3xl border border-border bg-card p-5">
              <h2 id="requests-heading" className="mb-4 text-lg font-extrabold">Pedidos de entrada</h2>
              {pending.length === 0 && <p className="text-sm text-muted-foreground">Nenhum pedido pendente.</p>}
              <ul className="space-y-3">
                {pending.map(row => (
                  <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3">
                    <div>
                      <p className="font-bold">{people.find(person => person.id === row.user_id)?.full_name ?? 'Voluntário'}</p>
                      <p className="text-sm text-muted-foreground">{ministries.find(ministry => ministry.id === row.ministry_id)?.name ?? 'Ministério'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" disabled={busy} onClick={() => decide(row.id, 'approved')}>Aprovar</Button>
                      <Button size="sm" variant="outline" disabled={busy} onClick={() => decide(row.id, 'rejected')}>Recusar</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {currentView === 'admin_ministerios' && <ul className="grid gap-3 sm:grid-cols-2">
            {activeMinistries.map(item => <li key={item.id} className="rounded-2xl border border-border bg-card p-4">
              <p className="font-bold">{item.icon} {item.name}</p>
              {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
            </li>)}
          </ul>}
          {currentView === 'admin_voluntarios' && <ul className="grid gap-3 sm:grid-cols-2">
            {people.map(person => <li key={person.id} className="rounded-2xl border border-border bg-card p-4 font-bold">{person.full_name}</li>)}
          </ul>}
          {!['admin_dashboard', 'admin_solicitacoes', 'admin_ministerios', 'admin_voluntarios'].includes(currentView) && (
            <p className="rounded-2xl border border-border bg-card p-5 text-muted-foreground">Este módulo ainda não está conectado aos dados online.</p>
          )}
        </div>
      </div>
      <nav aria-label="Navegação administrativa no celular" className="fixed inset-x-0 bottom-0 z-30 flex gap-2 overflow-x-auto border-t border-border bg-background px-2 py-3 md:hidden">
        <AdminNavigation mobile currentView={currentView} navigateTo={navigateTo} pendingCount={pending.length} />
      </nav>
    </div>
  );
}
