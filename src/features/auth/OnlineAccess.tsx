import { useEffect, useState, type FormEvent } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { BrowserRouter } from 'react-router';
import LoginView from '../../app/LoginView';
import { Button } from '../../app/components/ui/button';

export default function OnlineAccess({ client }: { client: SupabaseClient }) {
  const [session, setSession] = useState<Session | null>();
  const [register, setRegister] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = client.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      if (event === 'SIGNED_OUT') setRegister(false);
    });
    return () => subscription.unsubscribe();
  }, [client]);

  return (
    <BrowserRouter>
      <main className="mx-auto min-h-screen max-w-2xl space-y-6 p-6 sm:p-12">
        <p className="text-2xl font-extrabold">Escalaê</p>
        {session === undefined ? <p role="status">Verificando sessão…</p>
          : session ? <MinistryAccess key={session.user.id} client={client} userId={session.user.id} />
          : register ? <Register client={client} onBack={() => setRegister(false)} />
          : <LoginView onSwitchToRegister={() => setRegister(true)} signIn={async (email, password) => {
            const { error } = await client.auth.signInWithPassword({ email, password });
            if (error?.code === 'email_not_confirmed') return 'Confirme seu e-mail antes de entrar.';
            if (error?.code === 'invalid_credentials') return 'E-mail ou senha inválidos.';
            return error ? 'Não foi possível entrar agora. Tente novamente.' : null;
          }} />}
      </main>
    </BrowserRouter>
  );
}

function Register({ client, onBack }: { client: SupabaseClient; onBack: () => void }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setBusy(true);
    setMessage('');
    try {
      const { data, error } = await client.auth.signUp({
        email: String(fields.get('email')).trim(),
        password: String(fields.get('password')),
        options: { data: { full_name: String(fields.get('name')).trim() }, emailRedirectTo: window.location.origin },
      });
      if (error) {
        setMessage(error.code === 'over_email_send_rate_limit'
          ? 'Limite de envio de e-mail atingido. Aguarde antes de tentar novamente.'
          : 'Não foi possível concluir o cadastro. Confira os dados e tente novamente.');
      } else if (!data.session) {
        setSubmitted(true);
        setMessage('Confira seu e-mail para confirmar o cadastro e depois entre no Escalaê.');
      }
    } catch {
      setMessage('Não foi possível conectar. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  const inputClass = 'block w-full rounded-xl border bg-background p-3';
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-extrabold">Criar conta de voluntário</h1>
      {!submitted && <form className="space-y-4" onSubmit={submit}>
        <label className="block">Nome<input className={inputClass} name="name" autoComplete="name" required /></label>
        <label className="block">E-mail<input className={inputClass} name="email" type="email" autoComplete="email" required /></label>
        <label className="block">Senha<input className={inputClass} name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
        <Button type="submit" disabled={busy}>{busy ? 'Criando conta…' : 'Criar conta'}</Button>
      </form>}
      {message && <p role="status">{message}</p>}
      <Button type="button" variant="outline" onClick={onBack}>Voltar ao login</Button>
    </section>
  );
}

type Membership = { id: string; user_id: string; ministry_id: string; status: string };
type AccessData = {
  profile: { full_name: string; role: string };
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

  useEffect(() => {
    let current = true;
    async function load() {
      const [profile, ministries, memberships] = await Promise.all([
        client.from('profiles').select('full_name, role').eq('id', userId).single(),
        client.from('ministries').select('id, name, active').order('name'),
        client.from('ministry_members').select('id, user_id, ministry_id, status'),
      ]);
      if (profile.error || ministries.error || memberships.error) throw new Error();
      const pendingUsers = [...new Set(memberships.data.filter(row => row.status === 'pending').map(row => row.user_id))];
      const applicants = profile.data.role === 'admin' && pendingUsers.length
        ? await client.from('profiles').select('id, full_name').in('id', pendingUsers)
        : { data: [], error: null };
      if (applicants.error) throw new Error();
      if (current) setData({ profile: profile.data, ministries: ministries.data, memberships: memberships.data, applicants: applicants.data });
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
      {!data && !error && <p role="status">Carregando ministérios…</p>}
      {data && <>
        <h1 className="text-3xl font-extrabold">Olá, {data.profile.full_name}</h1>
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
