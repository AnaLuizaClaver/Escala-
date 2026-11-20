import { useEffect, useState } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { BrowserRouter } from 'react-router';
import AuthLayout from '../../app/AuthLayout';
import { Button } from '../../app/components/ui/button';
import AuthScreen from './AuthScreen';
import { avatarUrl, finishAvatar } from './avatar';

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
        : session ? <main className="mx-auto min-h-screen max-w-2xl space-y-6 p-6 sm:p-12">
          <p className="text-2xl font-extrabold">Escalaê</p>
          <MinistryAccess key={session.user.id} client={client} userId={session.user.id} />
        </main> : <AuthScreen client={client} />}
    </BrowserRouter>
  );
}

type Membership = { id: string; user_id: string; ministry_id: string; status: string };
type AccessData = {
  profile: { full_name: string; role: string };
  photo?: string;
  ministries: { id: string; name: string; active: boolean }[];
  memberships: Membership[];
  applicants: { id: string; full_name: string }[];
};

const statusName: Record<string, string> = { pending: 'Pendente', approved: 'Aprovado', rejected: 'Recusado' };

function MinistryAccess({ client, userId }: { client: SupabaseClient; userId: string }) {
  const [data, setData] = useState<AccessData>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    let current = true;
    async function load() {
      try {
        await finishAvatar(client, userId);
        if (current) setPhotoError(false);
      } catch {
        if (current) setPhotoError(true);
      }
      const [profile, ministries, memberships] = await Promise.all([
        client.from('profiles').select('full_name, role, avatar_url').eq('id', userId).single(),
        client.from('ministries').select('id, name, active').order('name'),
        client.from('ministry_members').select('id, user_id, ministry_id, status'),
      ]);
      if (profile.error || ministries.error || memberships.error) throw new Error();
      const pendingUsers = [...new Set(memberships.data.filter(row => row.status === 'pending').map(row => row.user_id))];
      const applicants = profile.data.role === 'admin' && pendingUsers.length
        ? await client.from('profiles').select('id, full_name').in('id', pendingUsers)
        : { data: [], error: null };
      if (applicants.error) throw new Error();
      const photo = profile.data.avatar_url === `${userId}/profile` ? await avatarUrl(client, userId) : undefined;
      if (current) setData({ profile: profile.data, photo, ministries: ministries.data, memberships: memberships.data, applicants: applicants.data });
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

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={busy} onClick={refresh}>Atualizar</Button>
        <Button variant="outline" disabled={busy} onClick={() => void mutate(() => client.auth.signOut(), false)}>Sair</Button>
      </div>
      {error && <p role="alert">{error}</p>}
      {photoError && <p role="status">A foto ainda não foi salva. Clique em Atualizar para tentar novamente.</p>}
      {!data && !error && <p role="status">Carregando ministérios…</p>}
      {data && <>
        <div className="flex items-center gap-3">
          {data.photo && <img className="size-12 rounded-full object-cover" src={data.photo} alt="Sua foto de perfil" />}
          <h1 className="text-3xl font-extrabold">Olá, {data.profile.full_name}</h1>
        </div>
        <p>{data.profile.role === 'admin' ? 'Conta de administrador' : 'Conta de voluntário'}</p>
        <h2 className="text-xl font-bold">Ministérios</h2>
        {data.ministries.length === 0 && <p>Nenhum ministério disponível.</p>}
        <ul className="space-y-2">
          {data.ministries.map(ministry => {
            const membership = data.memberships.find(row => row.user_id === userId && row.ministry_id === ministry.id);
            return <li key={ministry.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3">
              <span>{ministry.name}</span>
              {membership ? <span>{statusName[membership.status]}</span>
                : ministry.active && <Button disabled={busy} onClick={() => void mutate(() =>
                  client.from('ministry_members').insert({ user_id: userId, ministry_id: ministry.id }))}>Quero servir</Button>}
            </li>;
          })}
        </ul>
        {data.profile.role === 'admin' && <>
          <h2 className="text-xl font-bold">Pedidos de entrada</h2>
          {!data.memberships.some(row => row.status === 'pending') && <p>Nenhum pedido pendente.</p>}
          <ul className="space-y-2">
            {data.memberships.filter(row => row.status === 'pending').map(row => (
              <li key={row.id} className="space-y-2 rounded-xl border p-3">
                <p>{data.applicants.find(person => person.id === row.user_id)?.full_name ?? 'Voluntário'}
                  {' · '}{data.ministries.find(ministry => ministry.id === row.ministry_id)?.name ?? 'Ministério'}</p>
                <div className="flex gap-2">
                  <Button disabled={busy} onClick={() => void mutate(() => client.from('ministry_members')
                    .update({ status: 'approved' }).eq('id', row.id).eq('status', 'pending').select('id').single())}>Aprovar</Button>
                  <Button disabled={busy} variant="outline" onClick={() => void mutate(() => client.from('ministry_members')
                    .update({ status: 'rejected' }).eq('id', row.id).eq('status', 'pending').select('id').single())}>Recusar</Button>
                </div>
              </li>
            ))}
          </ul>
        </>}
      </>}
    </section>
  );
}
