import { useState, type FormEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ArrowRight, Camera, Eye, EyeOff, Mail } from 'lucide-react';
import AuthLayout from '../../app/AuthLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../app/components/ui/tabs';
import { avatarTypes, maxAvatarBytes, readPhoto, rememberAvatar, saveAvatar } from './avatar';
import './auth.css';

const googleEnabled = import.meta.env.VITE_GOOGLE_AUTH_ENABLED === 'true';

function returnUrl() {
  return new URL(import.meta.env.BASE_URL, window.location.origin).href;
}

function Password({ creating = false }: { creating?: boolean }) {
  const [visible, setVisible] = useState(false);
  return <label className="access-field">
    Senha
    <span className="access-password">
      <input name="password" type={visible ? 'text' : 'password'} required
        minLength={creating ? 8 : undefined} maxLength={256}
        autoComplete={creating ? 'new-password' : 'current-password'}
        placeholder={creating ? 'Pelo menos 8 caracteres' : 'Sua senha'} />
      <button type="button" aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setVisible(!visible)}>
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </span>
  </label>;
}

export default function AuthScreen({ client }: { client: SupabaseClient }) {
  const [tab, setTab] = useState('login');
  const [identifier, setIdentifier] = useState('');
  const [photo, setPhoto] = useState<File>();
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [registered, setRegistered] = useState(false);

  function changeTab(value: string) {
    setTab(value);
    setError('');
    setNotice('');
    setRegistered(false);
    setPhoto(undefined);
    setPreview('');
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Não foi possível conectar. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get('password'));
    const loginId = identifier.trim();
    await run(async () => {
      if (loginId.includes('@')) {
        const { error: authError } = await client.auth.signInWithPassword({ email: loginId, password });
        if (authError?.code === 'email_not_confirmed') throw new Error('Confirme seu e-mail antes de entrar.');
        if (authError) throw new Error(authError.status === 429 ? 'Aguarde antes de tentar de novo.' : 'Confira seu e-mail e sua senha.');
        return;
      }
      const { data, error: authError } = await client.functions.invoke('username-login', {
        body: { username: loginId, password },
      });
      if (authError || !data?.access_token || !data?.refresh_token) {
        throw new Error('Confira seu nome de usuário e sua senha ou tente entrar com o e-mail.');
      }
      const { error: sessionError } = await client.auth.setSession(data);
      if (sessionError) throw new Error('Não foi possível abrir sua sessão. Tente novamente.');
    });
  }

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const email = String(values.get('email')).trim();
    const fullName = String(values.get('full_name')).trim();
    await run(async () => {
      if (!fullName) throw new Error('Informe seu nome.');
      const { data, error: authError } = await client.auth.signUp({
        email,
        password: String(values.get('password')),
        options: {
          data: { full_name: fullName, username: String(values.get('username')).trim().toLowerCase() },
          emailRedirectTo: returnUrl(),
        },
      });
      if (authError?.code === 'email_address_invalid') throw new Error('O serviço de e-mail recusou este endereço. Confira o endereço informado.');
      if (authError?.status === 429) throw new Error('Limite de tentativas atingido. Aguarde antes de tentar novamente.');
      if (authError) throw new Error('Não foi possível criar a conta. Confira os dados ou tente outro nome de usuário.');
      if (data.user?.identities?.length && data.user.id && photo && preview) {
        try {
          if (data.session) await saveAvatar(client, data.user.id, photo);
          else rememberAvatar(data.user.id, preview);
        } catch {
          setError('Seu cadastro foi recebido, mas houve um problema ao salvar a foto.');
        }
      }
      if (!data.session) {
        setIdentifier(email);
        setRegistered(true);
        setNotice('Confira seu e-mail para confirmar o cadastro. Depois, volte para entrar.');
      }
    });
  }

  async function choosePhoto(file?: File) {
    setPhoto(undefined);
    setPreview('');
    setError('');
    if (!file) return;
    if (!avatarTypes.split(',').includes(file.type) || file.size === 0 || file.size > maxAvatarBytes) {
      setError('Escolha uma foto JPG, PNG ou WebP de até 1,5 MB.');
      return;
    }
    try {
      setPreview(await readPhoto(file));
      setPhoto(file);
    } catch {
      setError('Não foi possível abrir essa foto.');
    }
  }

  async function resend() {
    await run(async () => {
      const { error: resendError } = await client.auth.resend({
        type: 'signup', email: identifier.trim(), options: { emailRedirectTo: returnUrl() },
      });
      if (resendError?.code === 'email_address_invalid') throw new Error('O serviço de e-mail recusou este endereço. Confira o e-mail informado.');
      if (resendError) throw new Error('Não foi possível reenviar agora. Aguarde e tente novamente.');
      setNotice('Se houver uma confirmação pendente, confira sua caixa de entrada.');
    });
  }

  return <AuthLayout fullWidth>
    <section className="access-card" aria-label="Acesso ao Escalaê">
      <Tabs value={tab} onValueChange={changeTab}>
        <TabsList aria-label="Escolha como acessar" className="access-tabs">
          <TabsTrigger value="login" disabled={busy}>Entrar</TabsTrigger>
          <TabsTrigger value="register" disabled={busy}>Cadastrar</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <h1>Bem-vindo de volta</h1>
          <p className="access-intro">Entre para acompanhar suas equipes e escalas.</p>
          <form className="access-form" onSubmit={login}>
            <label className="access-field">E-mail ou nome de usuário
              <input name="identifier" value={identifier} onChange={event => setIdentifier(event.target.value)}
                autoComplete="username" autoCapitalize="none" spellCheck={false} required placeholder="Seu e-mail ou usuário" />
            </label>
            <Password />
            <button className="access-primary" disabled={busy}>
              {busy ? 'Aguarde…' : 'Entrar'} <ArrowRight size={18} />
            </button>
          </form>
          <button className="access-resend" type="button" disabled={busy || !identifier.includes('@')} onClick={() => void resend()}>
            <Mail size={16} /> Reenviar confirmação por e-mail
          </button>
        </TabsContent>
        <TabsContent value="register">
          <h1>Crie sua conta</h1>
          <p className="access-intro">Preencha seus dados para começar a servir com sua equipe.</p>
          {registered ? <button type="button" className="access-primary" onClick={() => changeTab('login')}>Voltar para entrar <ArrowRight size={18} /></button>
            : <form className="access-form" onSubmit={register}>
              <label className="access-photo">
                <span className="access-photo-icon">{preview ? <img src={preview} alt="Prévia da foto escolhida" /> : <Camera size={21} />}</span>
                <span><strong>{preview ? 'Trocar foto de perfil' : 'Adicionar foto de perfil'}</strong><small>Opcional · JPG, PNG ou WebP · até 1,5 MB</small></span>
                <input type="file" name="avatar" accept={avatarTypes} disabled={busy} onChange={event => void choosePhoto(event.target.files?.[0])} />
              </label>
              <label className="access-field">Nome completo<input name="full_name" autoComplete="name" maxLength={100} placeholder="Como podemos chamar você?" required /></label>
              <label className="access-field">Nome de usuário
                <input name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} pattern="[a-zA-Z0-9_]{3,24}"
                  aria-describedby="username-help" placeholder="Ex.: ana_luiza" required />
                <small id="username-help">De 3 a 24 caracteres: letras, números e _.</small>
              </label>
              <label className="access-field">E-mail<input name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required /></label>
              <Password creating />
              <button className="access-primary" disabled={busy}>{busy ? 'Aguarde…' : 'Criar conta'} <ArrowRight size={18} /></button>
            </form>}
        </TabsContent>
      </Tabs>
      {error && <p className="access-feedback access-error" role="alert">{error}</p>}
      {notice && <p className="access-feedback" role="status">{notice}</p>}
      <div className="access-providers">
        <p>Ou continue com</p>
        <button type="button" disabled={busy || !googleEnabled} onClick={() => void run(async () => {
          const { error: oauthError } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: returnUrl() } });
          if (oauthError) throw new Error('Não foi possível iniciar o login com Google.');
        })}>
          <span className="access-google" aria-hidden="true">G</span> Google
          {!googleEnabled && <small>Indisponível</small>}
        </button>
      </div>
    </section>
  </AuthLayout>;
}
