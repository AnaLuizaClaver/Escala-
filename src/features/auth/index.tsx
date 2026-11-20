import {
AlertCircle,
Check,
CheckCircle2,
Eye,EyeOff,
Lock,
LogOut,
Mail,
Phone,RefreshCw,Sparkles,
User
} from 'lucide-react';
import { AnimatePresence,motion } from 'motion/react';
import React,{ useEffect,useState } from 'react';
import { toast } from 'sonner';
import { usePreview } from '../../hooks/usePreview';
import { getField,previewData } from '../../mocks/previewData';

import { Badge,Button,Card,cn,getMinistryIconComponent } from '../../shared/ui';

export function RegisterView({ onNext, onRegistered }: any) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loadingLocal, setLoadingLocal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()

    if (!trimmedName) {
      setError('Informe seu nome completo.')
      toast.error('Informe seu nome completo.')
      return
    }
    if (!trimmedEmail) {
      setError('Informe seu e-mail.')
      toast.error('Informe seu e-mail.')
      return
    }
    if (!password) {
      setError('Informe uma senha.')
      toast.error('Informe uma senha.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      toast.error('A senha deve ter no mínimo 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não conferem.')
      toast.error('As senhas não conferem.')
      return
    }

    setLoadingLocal(true)
    setLoadingLocal(false)
    toast.info('Demonstração de cadastro concluída. Selecione um ministério.')
    onRegistered?.()
  }

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-8">
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.05 }}
          className="w-16 h-16 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-3xl shadow-lg rotate-3 mx-auto mb-5"
        >
          E
        </motion.div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center justify-center gap-2">
          Crie sua conta <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </h1>
        <p className="font-semibold text-muted-foreground text-sm">
          Junte-se à equipe de voluntários da sua igreja
        </p>
      </div>

      <Card className="space-y-4 shadow-sm border border-border rounded-3xl p-6 sm:p-8">
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Nome Completo */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
              Nome completo *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                <User className="w-4 h-4" />
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                className="w-full h-12 bg-secondary/50 border border-border rounded-2xl pl-11 pr-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                placeholder="Ex: Ana Oliveira"
                disabled={loadingLocal}
              />
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
              E-mail *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                <Mail className="w-4 h-4" />
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="w-full h-12 bg-secondary/50 border border-border rounded-2xl pl-11 pr-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                placeholder="seu.email@igreja.com"
                disabled={loadingLocal}
              />
            </div>
          </div>

          {/* Telefone e Nascimento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                WhatsApp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  className="w-full h-12 bg-secondary/50 border border-border rounded-2xl pl-11 pr-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                  placeholder="(11) 98888-7777"
                  disabled={loadingLocal}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Nascimento
              </label>
              <div className="relative">
                <input
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  type="date"
                  className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={loadingLocal}
                />
              </div>
            </div>
          </div>

          {/* Senha e Confirmação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Senha *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full h-12 bg-secondary/50 border border-border rounded-2xl pl-10 pr-10 text-sm font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                  placeholder="••••••••"
                  disabled={loadingLocal}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Confirmar *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="w-full h-12 bg-secondary/50 border border-border rounded-2xl pl-10 pr-10 text-sm font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                  placeholder="••••••••"
                  disabled={loadingLocal}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Erro Inline */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão de Criação */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loadingLocal}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground font-extrabold text-sm shadow-md hover:brightness-105 active:brightness-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {loadingLocal ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Criando conta...
              </span>
            ) : (
              <>
                Criar minha conta de voluntário
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </Card>
      
      <p className="text-center text-sm font-semibold text-muted-foreground mt-6">
        Já tem uma conta?{' '}
        <span 
          className="text-primary font-bold hover:underline cursor-pointer" 
          onClick={() => onNext && onNext()}
        >
          Faça login
        </span>
      </p>
    </div>
  )
}

export function SelectMinistryView({ onNext }: any) {
  const { user } = usePreview()
  const [selected, setSelected] = useState<string[]>([])
  const [ministries, setMinistries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadMinistries = async () => {
      const { data, error: queryError } = previewData('ministries', 'read', undefined, (row: any) => getField(row, 'active') === true, { single: false, limit: undefined, order: ['name', { ascending: true }] })

      if (!isMounted) return

      if (queryError) {
        setError(queryError.message ?? 'Não foi possível carregar os ministérios.')
      } else {
        setMinistries(data ?? [])
      }

      setLoading(false)
    }

    void loadMinistries()

    return () => {
      isMounted = false
    }
  }, [])

  const toggleSelect = (id: string) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const handleSubmit = async () => {
    if (!selected.length) {
      setError('Selecione pelo menos um ministério onde você deseja servir.')
      toast.error('Selecione pelo menos um ministério.')
      return
    }

    if (!user?.id) {
      setError('Usuário não autenticado. Faça login novamente.')
      toast.error('Usuário não autenticado. Faça login novamente.')
      return
    }

    setSubmitting(true)
    setError(null)

    const rows = selected.map((ministryId) => ({
      user_id: user.id,
      ministry_id: ministryId,
      role: 'volunteer',
      status: 'pending',
    }))

    const { error: insertError } = previewData('ministry_members', 'insert', rows, () => true, { single: false, limit: undefined, order: undefined })

    setSubmitting(false)

    if (insertError) {
      setError(insertError.message ?? 'Não foi possível enviar a solicitação.')
      toast.error('Não foi possível enviar a solicitação.')
      return
    }

    toast.success('Solicitações enviadas com sucesso para a liderança!')

    const selectedNames = ministries
      .filter((ministry) => selected.includes(ministry.id))
      .map((ministry) => ministry.name)

    onNext?.(selectedNames)
  }

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-16">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-extrabold text-2xl animate-spin mx-auto mb-4">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-bold text-muted-foreground animate-pulse">Carregando ministérios disponíveis...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-in slide-in-from-right-8 duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Escolha onde você quer servir 🙌</h1>
        <p className="font-semibold text-muted-foreground text-sm max-w-lg mx-auto">
          Você pode selecionar um ou mais ministérios. Sua solicitação passará pela aprovação do líder de cada área.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center justify-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {ministries.map((m) => {
          const isSelected = selected.includes(m.id)
          return (
            <Card
              key={m.id}
              onClick={() => toggleSelect(m.id)}
              className={cn(
                'cursor-pointer transition-all border-2 text-center flex flex-col items-center p-6 sm:p-7 relative select-none rounded-3xl',
                isSelected 
                  ? 'border-primary bg-primary/10 shadow-md scale-[1.02]' 
                  : 'border-border hover:border-primary/40 hover:bg-secondary/40'
              )}
            >
              <div className={cn(
                'w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-colors',
                isSelected ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-foreground'
              )}>
                {getMinistryIconComponent(m.name)}
              </div>
              <h3 className="font-extrabold text-lg mb-1">{m.name}</h3>
              <p className="text-xs font-semibold text-muted-foreground line-clamp-2">
                {m.description || 'Equipe e voluntários'}
              </p>

              <div className={cn(
                'absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'
              )}>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </div>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-center">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={selected.length === 0 || submitting}
          className="w-full sm:w-80 h-14 rounded-full bg-primary text-primary-foreground font-extrabold text-base shadow-lg hover:brightness-105 active:brightness-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Enviando solicitação...
            </span>
          ) : (
            <>
              Enviar Solicitação ({selected.length} {selected.length === 1 ? 'selecionado' : 'selecionados'})
              <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}

export function PendingApprovalView({ ministries = [], userMemberships = [], onRefreshMemberships, onSignOut }: any) {
  const { user } = usePreview()
  const [checking, setChecking] = useState(false)

  const handleCheck = async () => {
    setChecking(true)
    if (onRefreshMemberships) {
      await onRefreshMemberships()
    }
    setChecking(false)
  }

  // Lista os nomes de ministérios quer venham via prop de string ou via userMemberships
  const displayMinistries = userMemberships.length > 0 
    ? userMemberships.map((m: any) => ({ name: m.ministries?.name || 'Ministério', status: m.status }))
    : ministries.map((m: string) => ({ name: m, status: 'pending' }))

  return (
    <div className="w-full max-w-md mx-auto text-center animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-primary/20 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm rotate-3">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      
      <h1 className="text-3xl font-extrabold tracking-tight mb-3">Solicitação enviada 🙌</h1>
      <p className="font-semibold text-muted-foreground text-sm mb-8">
        Sua entrada foi registrada com sucesso! Agora é só aguardar o líder aprovar sua participação na equipe.
      </p>

      <Card className="text-left space-y-3 mb-8 p-5 rounded-3xl border border-border">
        <p className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1">
          Status das suas solicitações
        </p>
        
        {displayMinistries.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center border border-border text-foreground">
                {getMinistryIconComponent(item.name)}
              </div>
              <span className="font-extrabold text-sm">{item.name}</span>
            </div>
            <Badge variant={item.status === 'approved' ? 'success' : 'warning'}>
              {item.status === 'approved' ? 'Aprovado' : 'Aguardando aprovação'}
            </Badge>
          </div>
        ))}
      </Card>

      <div className="space-y-3">
        <Button 
          variant="primary" 
          size="md" 
          className="w-full h-12 shadow-sm font-extrabold text-sm"
          onClick={handleCheck}
          disabled={checking}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", checking && "animate-spin")} />
          {checking ? 'Verificando...' : 'Verificar se já fui aprovado(a)'}
        </Button>

        {onSignOut && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-muted-foreground hover:text-foreground font-bold"
            onClick={onSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" /> Entrar com outra conta
          </Button>
        )}
      </div>
    </div>
  )
}

