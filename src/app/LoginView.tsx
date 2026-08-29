import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { Mail, Lock, Eye, EyeOff, LogIn, KeyRound, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function LoginView({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Por favor, informe seu e-mail.')
      toast.error('Informe seu e-mail.')
      return
    }

    if (!password) {
      setError('Por favor, informe sua senha.')
      toast.error('Informe sua senha.')
      return
    }

    setLoading(true)
    const { error: authError } = await signIn(trimmedEmail, password)
    setLoading(false)

    if (authError) {
      const msg = (authError as any).message || 'Erro ao conectar'
      let friendlyMsg = msg
      if (msg.includes('Invalid login credentials')) {
        friendlyMsg = 'E-mail ou senha incorretos. Verifique seus dados.'
      } else if (msg.includes('Email not confirmed')) {
        friendlyMsg = 'E-mail ainda não confirmado. Verifique sua caixa de entrada.'
      } else if (msg.includes('rate limit')) {
        friendlyMsg = 'Muitas tentativas. Aguarde alguns instantes antes de tentar novamente.'
      }
      setError(friendlyMsg)
      toast.error(friendlyMsg)
    } else {
      toast.success('Login realizado com sucesso! Bem-vindo(a).')
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetEmail = (forgotEmail || email).trim()

    if (!targetEmail) {
      toast.error('Informe seu e-mail para recuperar a senha.')
      return
    }

    setForgotLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(targetEmail, {
      redirectTo: `${window.location.origin}`,
    })
    setForgotLoading(false)

    if (resetError) {
      toast.error(resetError.message || 'Não foi possível enviar o e-mail de recuperação.')
    } else {
      setForgotSuccess(true)
      toast.success('Link de recuperação enviado para o seu e-mail!')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.05 }}
          className="w-16 h-16 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-3xl shadow-lg rotate-3 mx-auto mb-5"
        >
          E
        </motion.div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center justify-center gap-2">
          Bem-vindo de volta <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </h1>
        <p className="font-semibold text-muted-foreground text-sm">
          Acesse sua conta para ver suas escalas e ministérios
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                <Mail className="w-4 h-4" />
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                className="w-full h-12 bg-secondary/50 border border-border rounded-2xl pl-11 pr-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                placeholder="seu.email@igreja.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1 mr-1">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Senha
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email)
                  setForgotSuccess(false)
                  setShowForgotModal(true)
                }}
                className="text-xs font-bold text-primary hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                <Lock className="w-4 h-4" />
              </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full h-12 bg-secondary/50 border border-border rounded-2xl pl-11 pr-12 text-sm font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground font-extrabold text-sm shadow-md hover:brightness-105 active:brightness-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Entrando...
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Entrar na minha conta
              </>
            )}
          </motion.button>
        </form>

        {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground font-bold text-[10px] tracking-wider">
              Ainda não tem cadastro?
            </span>
          </div>
        </div>

        {/* Switch to Register Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onSwitchToRegister}
          className="w-full h-12 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-foreground font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Criar nova conta de voluntário
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Modal: Recuperação de Senha */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={() => setShowForgotModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight mb-2">Recuperar Senha</h2>
              <p className="text-sm text-muted-foreground font-semibold mb-6">
                Informe o e-mail cadastrado e enviaremos um link seguro para você redefinir sua senha.
              </p>

              {forgotSuccess ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm font-bold flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>E-mail enviado! Verifique sua caixa de entrada e spam.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold text-sm"
                  >
                    Voltar ao Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                      E-mail cadastrado
                    </label>
                    <input
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      type="email"
                      required
                      className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="seu.email@igreja.com"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 h-12 rounded-full bg-secondary border border-border text-foreground font-bold text-sm hover:bg-secondary/80"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-sm hover:brightness-105 disabled:opacity-50"
                    >
                      {forgotLoading ? 'Enviando...' : 'Enviar Link'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
