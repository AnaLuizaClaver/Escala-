import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { BrowserRouter, Navigate, useLocation, useNavigate } from 'react-router';
import { BellRing, LogOut, RefreshCw, X } from 'lucide-react';
import AuthLayout from '../../app/AuthLayout';
import BrandLogo from '../../shared/ui/BrandLogo';
import { Button } from '../../app/components/ui/button';
import AuthScreen from './AuthScreen';
import { avatarUrl, finishAvatar } from './avatar';
import MinistryCard, { type Ministry, type MinistryLeader } from './MinistryCard';
import PendingMinistryScreen from './PendingMinistryScreen';
import { isMinistryOption } from './ministry-options';
import { isPublicPath, pathForView } from '../../app/router/routes';

export type OnlineAccount = { session: Session; isAdmin: boolean; photo?: string };
type AccessProps = { client: SupabaseClient; renderApp: (account: OnlineAccount) => ReactNode };

export default function OnlineAccess({ client, renderApp }: AccessProps) {
  return <BrowserRouter basename={import.meta.env.BASE_URL}><OnlineSession client={client} renderApp={renderApp} /></BrowserRouter>;
}

function OnlineSession({ client, renderApp }: AccessProps) {
  const [session, setSession] = useState<Session | null>();
  const previousSession = useRef<Session | null | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = client.auth.onAuthStateChange((event, nextSession) => {
      if ((event === 'SIGNED_IN' && previousSession.current === null) || event === 'SIGNED_OUT') {
        navigate(pathForView('home'), { replace: true });
      }
      previousSession.current = nextSession;
      setSession(nextSession);
    });
    return () => subscription.unsubscribe();
  }, [client, navigate]);

  return (
    <>
      {session === undefined ? <AuthLayout><p role="status">Verificando sessão…</p></AuthLayout>
        : session ? <MinistryAccess key={session.user.id} client={client} session={session} renderApp={renderApp}
          requestedMinistry={session.user.user_metadata?.requested_ministry} />
        : <AuthScreen client={client} />}
    </>
  );
}

type AccessData = {
  profile: { full_name: string; role: string };
  photo?: string;
  ministries: Ministry[];
  leaders: MinistryLeader[];
  memberships: { id: string; user_id: string; ministry_id: string; status: string }[];
};

function readDismissedApprovals(userId: string): string[] {
  try {
    const entries: unknown = JSON.parse(localStorage.getItem(`escalae:read-approvals:${userId}`) ?? '[]');
    return Array.isArray(entries) ? entries.filter((entry): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

function MinistryAccess({ client, session, renderApp, requestedMinistry }: AccessProps & { session: Session; requestedMinistry: unknown }) {
  const userId = session.user.id;
  const { pathname } = useLocation();
  const [data, setData] = useState<AccessData>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [photoError, setPhotoError] = useState(false);
  const [dismissedApprovals, setDismissedApprovals] = useState(() => readDismissedApprovals(userId));
  const [selectedMinistry, setSelectedMinistry] = useState('');

  const isAdmin = data?.profile.role === 'admin';
  const adminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const pending = data?.memberships.filter(row => row.status === 'pending') ?? [];
  const waiting = !isAdmin && pending.some(row => row.user_id === userId)
    && !data?.memberships.some(row => row.user_id === userId && row.status === 'approved');

  useEffect(() => {
    if (!waiting) return;
    const timer = window.setInterval(() => setRevision(previous => previous + 1), 20_000);
    return () => window.clearInterval(timer);
  }, [waiting]);

  useEffect(() => {
    let current = true;
    async function load() {
      try {
        await finishAvatar(client, userId);
        if (current) setPhotoError(false);
      } catch {
        if (current) setPhotoError(true);
      }
      const [profile, ministries, memberships, leaders] = await Promise.all([
        client.from('profiles').select('full_name, role, avatar_url').eq('id', userId).single(),
        client.from('ministries').select('id, name, active, description, icon, color').order('name'),
        client.from('ministry_members').select('id, user_id, ministry_id, status').eq('user_id', userId),
        client.rpc('ministry_leader_names'),
      ]);
      if (profile.error || ministries.error || memberships.error) throw new Error();
      let visibleMemberships = memberships.data;
      const initialMinistry = isMinistryOption(requestedMinistry) && ministries.data.find(
        ministry => ministry.active && ministry.name === requestedMinistry,
      );
      if (profile.data.role !== 'admin' && initialMinistry && !visibleMemberships.some(row => row.user_id === userId)) {
        const request = await client.from('ministry_members')
          .upsert({ user_id: userId, ministry_id: initialMinistry.id }, { onConflict: 'user_id,ministry_id', ignoreDuplicates: true });
        if (request.error) throw request.error;
        const fresh = await client.from('ministry_members').select('id, user_id, ministry_id, status').eq('user_id', userId);
        if (fresh.error) throw fresh.error;
        visibleMemberships = fresh.data;
      }
      const photo = profile.data.avatar_url === `${userId}/profile` ? await avatarUrl(client, userId) : undefined;
      if (current) {
        setError('');
        setData({ profile: profile.data, photo, ministries: ministries.data, memberships: visibleMemberships, leaders: leaders.data ?? [] });
      }
    }
    void load().catch(() => {
      if (current) setError('Não foi possível carregar a conta ou os ministérios.');
    });
    return () => { current = false; };
  }, [client, userId, requestedMinistry, revision]);

  function refresh() {
    setError('');
    setRevision(previous => previous + 1);
  }

  async function mutate(operation: () => PromiseLike<{ error: unknown }>, reload = true) {
    setBusy(true);
    setError('');
    try {
      const result = await operation();
      if (result.error) throw result.error;
      if (reload) refresh();
    } catch {
      setError('Não foi possível concluir a ação. Atualize a página e tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  const ownMemberships = data?.memberships.filter(row => row.user_id === userId) ?? [];
  const activeMemberships = ownMemberships.filter(row => row.status === 'approved');
  const approved = activeMemberships.filter(row => !dismissedApprovals.includes(row.id));
  const availableMinistries = data?.ministries.filter(ministry => ministry.active && isMinistryOption(ministry.name)
    && !ownMemberships.some(row => row.ministry_id === ministry.id)) ?? [];
  function dismissApprovals() {
    const read = [...dismissedApprovals, ...approved.map(row => row.id)];
    setDismissedApprovals(read);
    try {
      localStorage.setItem(`escalae:read-approvals:${userId}`, JSON.stringify(read));
    } catch {
      // The notice remains dismissed for this session.
    }
  }

  if (waiting && !error && pathname !== '/aguardando-aprovacao') return <Navigate to="/aguardando-aprovacao" replace />;

  if (data && (isAdmin || activeMemberships.length > 0)) {
    if (pathname === '/' || isPublicPath(pathname) || (adminRoute && !isAdmin)) {
      return <Navigate to={pathForView('home')} replace />;
    }
    return <>
      {!isAdmin && approved.length > 0 && (
        <div className="fixed bottom-24 right-4 z-40 flex max-w-sm items-start gap-3 rounded-2xl border border-primary bg-card p-4 shadow-xl md:bottom-4" role="status">
          <BellRing size={20} className="mt-1 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-extrabold">Você foi aceito!</p>
            <p className="text-sm">Bem-vindo à equipe de {approved.map(row =>
              data.ministries.find(ministry => ministry.id === row.ministry_id)?.name ?? 'um ministério').join(', ')}.</p>
          </div>
          <Button size="icon" variant="ghost" aria-label="Dispensar aviso" onClick={dismissApprovals}><X size={17} /></Button>
        </div>
      )}
      {renderApp({ session, isAdmin, photo: data.photo })}
    </>;
  }

  return (
    <main className="mx-auto min-h-screen w-full space-y-6 p-5 sm:space-y-8 sm:p-8 lg:w-4/5 lg:px-0">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-surface px-4 py-2 text-white sm:px-6">
        <BrandLogo />
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white" disabled={busy} onClick={refresh}><RefreshCw size={16} aria-hidden="true" /> Atualizar</Button>
          <Button variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white" disabled={busy} onClick={() => void mutate(() => client.auth.signOut(), false)}><LogOut size={16} aria-hidden="true" /> Sair</Button>
        </div>
      </header>
      {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p>}
      {photoError && <p className="text-sm text-muted-foreground" role="status">A foto ainda não foi salva. Clique em Atualizar para tentar novamente.</p>}
      {!data && !error && <p role="status">Carregando ministérios…</p>}
      {waiting && data ? <PendingMinistryScreen names={data.ministries.filter(ministry =>
        pending.some(row => row.user_id === userId && row.ministry_id === ministry.id)).map(ministry => ministry.name)} />
      : data && <>
        <div className="flex items-center gap-3">
          {data.photo && <img className="size-12 rounded-full object-cover" src={data.photo} alt="Sua foto de perfil" />}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Olá, {data.profile.full_name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{isAdmin ? 'Visão de membro · acesso administrativo' : 'Conta de voluntário'}</p>
          </div>
        </div>
        {!isAdmin && activeMemberships.length === 0 && <section aria-labelledby="ministry-picker-title" className="ministry-picker max-w-[46rem] space-y-5">
          <header className="page-intro">
            <h2 id="ministry-picker-title" className="text-2xl font-extrabold sm:text-3xl">Onde você quer servir?</h2>
          </header>
          {ownMemberships.some(row => row.status === 'rejected') &&
            <p className="text-sm text-muted-foreground">Seu pedido anterior foi recusado.</p>}
          {availableMinistries.length > 0 ? <form className="space-y-4" onSubmit={event => {
            event.preventDefault();
            if (!availableMinistries.some(ministry => ministry.id === selectedMinistry)) return;
            void mutate(() => client.from('ministry_members').insert({ user_id: userId, ministry_id: selectedMinistry }));
          }}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {availableMinistries.map(ministry => (
                <MinistryCard key={ministry.id} ministry={ministry}
                  leaders={data.leaders.filter(leader => leader.ministry_id === ministry.id)}
                  member={false} selected={selectedMinistry === ministry.id}
                  onOpen={() => setSelectedMinistry(ministry.id)} />
              ))}
            </div>
            <Button type="submit" disabled={busy || !selectedMinistry}>Enviar pedido</Button>
          </form> : <p className="text-sm text-muted-foreground">Converse com a liderança para revisar seu acesso.</p>}
        </section>}
      </>}
    </main>
  );
}
