import { useEffect, useState } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { BrowserRouter } from 'react-router';
import { BellRing, ClipboardList, LogOut, RefreshCw, X } from 'lucide-react';
import AuthLayout from '../../app/AuthLayout';
import BrandLogo from '../../shared/ui/BrandLogo';
import { Button } from '../../app/components/ui/button';
import AuthScreen from './AuthScreen';
import { avatarUrl, finishAvatar } from './avatar';
import MinistryCard, { type Ministry, type MinistryLeader } from './MinistryCard';
import PendingMinistryScreen from './PendingMinistryScreen';

export default function OnlineAccess({ client }: { client: SupabaseClient }) {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => subscription.unsubscribe();
  }, [client]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {session === undefined ? <AuthLayout><p role="status">Verificando sessão…</p></AuthLayout>
        : session ? <main className="mx-auto min-h-screen w-full p-5 sm:p-8 lg:w-4/5 lg:px-0">
          <MinistryAccess key={session.user.id} client={client} userId={session.user.id} />
        </main> : <AuthScreen client={client} />}
    </BrowserRouter>
  );
}

type Membership = { id: string; user_id: string; ministry_id: string; status: 'pending' | 'approved' | 'rejected' };
type AccessData = {
  profile: { full_name: string; role: string };
  photo?: string;
  ministries: Ministry[];
  leaders: MinistryLeader[];
  memberships: Membership[];
  applicants: { id: string; full_name: string }[];
};

function readDismissedApprovals(userId: string): string[] {
  try {
    const entries: unknown = JSON.parse(localStorage.getItem(`escalae:read-approvals:${userId}`) ?? '[]');
    return Array.isArray(entries) ? entries.filter((entry): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

function MinistryAccess({ client, userId }: { client: SupabaseClient; userId: string }) {
  const [data, setData] = useState<AccessData>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [photoError, setPhotoError] = useState(false);
  const [dismissedApprovals, setDismissedApprovals] = useState(() => readDismissedApprovals(userId));

  const isAdmin = data?.profile.role === 'admin';
  const pending = data?.memberships.filter(row => row.status === 'pending') ?? [];
  const waiting = !isAdmin && pending.some(row => row.user_id === userId);

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
        client.from('ministry_members').select('id, user_id, ministry_id, status'),
        client.rpc('ministry_leader_names'),
      ]);
      if (profile.error || ministries.error || memberships.error || leaders.error) throw new Error();
      const pendingUsers = [...new Set(memberships.data.filter(row => row.status === 'pending').map(row => row.user_id))];
      const applicants = profile.data.role === 'admin' && pendingUsers.length
        ? await client.from('profiles').select('id, full_name').in('id', pendingUsers)
        : { data: [], error: null };
      if (applicants.error) throw new Error();
      const photo = profile.data.avatar_url === `${userId}/profile` ? await avatarUrl(client, userId) : undefined;
      if (current) {
        setError('');
        setData({ profile: profile.data, photo, ministries: ministries.data, memberships: memberships.data, leaders: leaders.data, applicants: applicants.data });
      }
    }
    void load().catch(() => {
      if (current) setError('Não foi possível carregar a conta ou os ministérios.');
    });
    return () => { current = false; };
  }, [client, userId, revision]);

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

  const approved = data?.memberships.filter(row => row.user_id === userId
    && row.status === 'approved' && !dismissedApprovals.includes(row.id)) ?? [];

  function dismissApprovals() {
    const read = [...dismissedApprovals, ...approved.map(row => row.id)];
    setDismissedApprovals(read);
    try {
      localStorage.setItem(`escalae:read-approvals:${userId}`, JSON.stringify(read));
    } catch {
      // The notice remains dismissed for this session.
    }
  }

  function decide(id: string, status: 'approved' | 'rejected') {
    return mutate(() => client.from('ministry_members').update({ status })
      .eq('id', id).eq('status', 'pending').select('id').single());
  }

  return (
    <div className="space-y-6 sm:space-y-8">
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
      {!isAdmin && approved.length > 0 && <div className="flex items-start gap-3 rounded-2xl border border-primary bg-primary/20 p-4" role="status">
        <BellRing size={20} className="mt-1 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <p className="font-extrabold">Você foi aceito!</p>
          <p className="text-sm">Bem-vindo à equipe de {approved.map(row =>
            data?.ministries.find(ministry => ministry.id === row.ministry_id)?.name ?? 'um ministério').join(', ')}.</p>
        </div>
        <Button size="icon" variant="ghost" aria-label="Dispensar aviso" onClick={dismissApprovals}><X size={17} /></Button>
      </div>}
      {waiting && data ? <PendingMinistryScreen names={data.ministries.filter(ministry =>
        pending.some(row => row.user_id === userId && row.ministry_id === ministry.id)).map(ministry => ministry.name)} />
      : data && <>
        <div className="flex items-center gap-3">
          {data.photo && <img className="size-12 rounded-full object-cover" src={data.photo} alt="Sua foto de perfil" />}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Olá, {data.profile.full_name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{isAdmin ? 'Conta de administrador' : 'Conta de voluntário'}</p>
          </div>
        </div>
        <div className={isAdmin ? 'grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]' : undefined}>
          <section aria-labelledby="ministry-heading">
            <h2 id="ministry-heading" className="text-xl font-extrabold">Ministérios</h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">Conheça as equipes e encontre um lugar para servir.</p>
            {data.ministries.length === 0 && <p>Nenhum ministério disponível.</p>}
            <ul className={`grid gap-4 sm:grid-cols-2 ${isAdmin ? '' : 'xl:grid-cols-3'}`}>
              {data.ministries.map(ministry => {
                const membership = data.memberships.find(row => row.user_id === userId && row.ministry_id === ministry.id);
                return <li key={ministry.id}>
                  <MinistryCard ministry={ministry} leaders={data.leaders.filter(leader => leader.ministry_id === ministry.id)}
                    status={membership?.status} busy={busy} onRequest={() => void mutate(() =>
                      client.from('ministry_members').insert({ user_id: userId, ministry_id: ministry.id }))} />
                </li>;
              })}
            </ul>
          </section>
          {isAdmin && <section aria-labelledby="requests-heading" className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList size={21} aria-hidden="true" />
              <h2 id="requests-heading" className="text-lg font-extrabold">Pedidos de entrada</h2>
              <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-xs font-bold" aria-label={`${pending.length} pendentes`}>{pending.length}</span>
            </div>
            {pending.length === 0 && <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">Nenhum pedido pendente.</p>}
            <ul className="space-y-3">
              {pending.map(row => (
                <li key={row.id} className="space-y-3 rounded-xl border border-border p-3">
                  <div>
                    <p className="font-bold">{data.applicants.find(person => person.id === row.user_id)?.full_name ?? 'Voluntário'}</p>
                    <p className="text-sm text-muted-foreground">{data.ministries.find(ministry => ministry.id === row.ministry_id)?.name ?? 'Ministério'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" disabled={busy} onClick={() => void decide(row.id, 'approved')}>Aprovar</Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void decide(row.id, 'rejected')}>Recusar</Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>}
        </div>
      </>}
    </div>
  );
}
