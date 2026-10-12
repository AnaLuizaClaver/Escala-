import React, { useState, useEffect } from 'react';
import { previewData, getField } from '../mocks/previewData'
import { PreviewProvider } from '../context/PreviewContext'
import { usePreview } from '../hooks/usePreview'
import LoginView from './LoginView'

class ErrorBoundary extends React.Component<any, { hasError: boolean; error?: any }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: undefined }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold mb-4">Erro na aplicação</h2>
          <pre className="whitespace-pre-wrap text-sm text-red-600">{String(this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <PreviewProvider>
      <AppInner />
    </PreviewProvider>
  )
}
import { 
  Home, Calendar, Music, MessageSquare, User, Bell, Moon, Sun,
  Flame, CheckCircle2, AlertCircle, Clock, MapPin, Trophy, Gift,
  ArrowRightLeft, Users, Award, Settings, ChevronRight, ChevronLeft,
  Filter, Check, MoreVertical, X, PlayCircle, Mic2, Youtube, AlignLeft,
  FileText, Search, Camera, MonitorPlay, HeartHandshake, Mic, LogOut,
  LayoutDashboard, ListChecks, PieChart, ShieldCheck, AlertTriangle,
  Plus, Trash2, Edit2, LayoutTemplate, Copy, Eye, EyeOff, PlusCircle, Repeat,
  ChevronUp, ChevronDown, ListMusic, TrendingUp, XCircle, Activity,
  Mail, Lock, Phone, RefreshCw, Sparkles, Layers, Video
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



// --- SYSTEM COMPONENTS ---

function Button({ children, variant = 'primary', size = 'md', className, ...props }: any) {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:brightness-95 border-transparent shadow-sm',
    secondary: 'bg-secondary text-foreground hover:bg-secondary/80 border-border',
    ghost: 'bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground',
    outline: 'bg-transparent border-border text-foreground hover:bg-secondary',
    destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent',
  };
  const sizes = {
    xs: 'h-8 px-3 text-[10px] font-bold rounded-full',
    sm: 'h-9 px-4 text-xs font-bold rounded-full',
    md: 'h-12 px-6 text-sm font-bold rounded-full',
    lg: 'h-14 px-8 text-base font-bold rounded-full',
    icon: 'h-10 w-10 flex items-center justify-center rounded-full',
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-colors border outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variants[variant as keyof typeof variants],
        sizes[size as keyof typeof sizes],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function Badge({ children, variant = 'default', className }: any) {
  const variants = {
    default: 'bg-secondary text-foreground',
    primary: 'bg-primary/20 text-primary-foreground dark:text-primary',
    success: 'bg-green-500/20 text-green-700 dark:text-green-400',
    warning: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
    destructive: 'bg-red-500/20 text-red-700 dark:text-red-400 animate-pulse',
  };
  return (
    <span className={cn('px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap', variants[variant as keyof typeof variants], className)}>
      {children}
    </span>
  );
}

function Card({ children, className, hoverable = false, onClick }: any) {
  const Component = hoverable ? motion.div : 'div';
  return (
    <Component 
      onClick={onClick}
      whileHover={hoverable ? { y: -4 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden',
        hoverable && 'hover:border-primary/50 transition-colors group cursor-pointer hover:shadow-md',
        className
      )}
    >
      {children}
    </Component>
  );
}

function Avatar({ src, alt, size = 'md', className, fallback }: any) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };
  
  if (!src) {
    return (
      <div className={cn('rounded-full flex items-center justify-center bg-secondary border border-border text-muted-foreground font-bold text-xs', sizes[size as keyof typeof sizes], className)}>
        {fallback || '?'}
      </div>
    );
  }
  return (
    <img src={src} alt={alt} className={cn('rounded-full object-cover border border-border bg-secondary', sizes[size as keyof typeof sizes], className)} />
  );
}

function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>
      <Card className="w-full max-w-lg shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 p-6 sm:p-8">
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
        {title && <h2 className="text-2xl font-extrabold mb-6 pr-8">{title}</h2>}
        {children}
      </Card>
    </div>
  );
}

// --- MAIN APP ---

function AppInner() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedEscala, setSelectedEscala] = useState<any>(null);

  const [isAdminMode, setIsAdminMode] = useState(false);

  // Modals state
  const [trocaModalOpen, setTrocaModalOpen] = useState(false);
  const [selectedTrocaSlot, setSelectedTrocaSlot] = useState<any>(null);
  const [selectedSongModal, setSelectedSongModal] = useState<any>(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      toast('Modo escuro ativado', { icon: '🌙' });
    } else {
      document.documentElement.classList.remove('dark');
      toast('Modo claro ativado', { icon: '☀️' });
    }
  };

  const navigateTo = (view: string, data?: any) => {
    setCurrentView(view);
    if (data) setSelectedEscala(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const { showApp, user, showLogin } = usePreview()

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'select_ministry' | 'pending_approval'>('login')
  const [pendingApprovalMinistries, setPendingApprovalMinistries] = useState<string[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userMemberships, setUserMemberships] = useState<any[]>([])
  const [selectedMinistry, setSelectedMinistry] = useState<any>(null)

  useEffect(() => {
    if (!user?.id) {
      setUserProfile(null)
      setUserMemberships([])
      setSelectedMinistry(null)
      setUnreadNotificationsCount(0)
      return
    }

    let isMounted = true

    async function loadUserData() {
      try {
        const { data: profile } = previewData('profiles', 'read', undefined, (row: any) => getField(row, 'id') === user!.id, { single: true, limit: undefined, order: undefined })

        if (isMounted && profile) {
          setUserProfile(profile)
        }

        const { data: memberships } = previewData('ministry_members', 'read', undefined, (row: any) => getField(row, 'user_id') === user!.id, { single: false, limit: undefined, order: undefined })

        if (isMounted && memberships) {
          setUserMemberships(memberships)
          const approved = memberships.filter((m: any) => m.status === 'approved')
          if (approved.length > 0) {
            setSelectedMinistry(approved[0].ministries)

            // Contar notificações não lidas / confirmações pendentes
            const approvedMemberIds = approved.map((m: any) => m.id);
            const todayStr = new Date().toISOString().split('T')[0];
            const { count } = previewData('schedule_members', 'read', undefined, (row: any) => (approvedMemberIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'response') === 'pending' && getField(row, 'schedules.status') === 'published' && getField(row, 'schedules.date') >= todayStr, { single: false, limit: undefined, order: undefined });

            if (isMounted && typeof count === 'number') {
              setUnreadNotificationsCount(count);
            }
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err)
      }
    }

    void loadUserData()

    return () => {
      isMounted = false
    }
  }, [user?.id])

  const refreshUserData = async () => {
    if (!user?.id) return
    try {
      const { data: profile } = previewData('profiles', 'read', undefined, (row: any) => getField(row, 'id') === user.id, { single: true, limit: undefined, order: undefined })
      if (profile) setUserProfile(profile)

      const { data: memberships } = previewData('ministry_members', 'read', undefined, (row: any) => getField(row, 'user_id') === user.id, { single: false, limit: undefined, order: undefined })

      if (memberships) {
        setUserMemberships(memberships)
        const approved = memberships.filter((m: any) => m.status === 'approved')
        if (approved.length > 0) {
          setSelectedMinistry(approved[0].ministries)

          const approvedMemberIds = approved.map((m: any) => m.id);
          const todayStr = new Date().toISOString().split('T')[0];
          const { count } = previewData('schedule_members', 'read', undefined, (row: any) => (approvedMemberIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'response') === 'pending' && getField(row, 'schedules.status') === 'published' && getField(row, 'schedules.date') >= todayStr, { single: false, limit: undefined, order: undefined });

          if (typeof count === 'number') {
            setUnreadNotificationsCount(count);
          }
        }
      }
    } catch (err) {
      console.error('Erro ao recarregar dados do usuário:', err)
    }
  }

  if (!showApp) {
    return (
      <div className="flex min-h-screen w-full bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">
        <div className="hidden lg:flex w-[45%] bg-primary flex-col justify-between p-12 relative overflow-hidden text-primary-foreground border-r border-border">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.05)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.05)_75%,transparent_75%,transparent)] bg-[length:32px_32px]"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-foreground text-primary flex items-center justify-center font-extrabold text-2xl shadow-sm rotate-3">E</div>
            <span className="font-extrabold text-3xl tracking-tight">Escalaê</span>
          </div>
          <div className="relative z-10 max-w-md">
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">Organize.<br/>Conecte.<br/>Sirva.</h1>
            <p className="font-semibold text-primary-foreground/80 text-lg">A plataforma feita para simplificar e gamificar o voluntariado na sua igreja local.</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
          <div className="absolute top-6 right-6 z-10">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 sm:p-12 mt-12 sm:mt-0">
            {authMode === 'register' ? (
              <RegisterView
                onNext={() => setAuthMode('login')}
                onRegistered={() => setAuthMode('select_ministry')}
              />
            ) : authMode === 'select_ministry' ? (
              <SelectMinistryView
                onNext={(selectedNames: string[]) => {
                  setPendingApprovalMinistries(selectedNames)
                  setAuthMode('pending_approval')
                }}
              />
            ) : authMode === 'pending_approval' ? (
              <PendingApprovalView
                ministries={pendingApprovalMinistries}
                onSignOut={showLogin}
              />
            ) : (
              <LoginView onSwitchToRegister={() => setAuthMode('register')} />
            )}
          </div>
        </div>
      </div>
    )
  }

  // Se o usuário está autenticado, mas não possui ministérios aprovados
  const hasApprovedMinistry = userMemberships.some((m: any) => m.status === 'approved')
  const hasPendingMinistry = userMemberships.some((m: any) => m.status === 'pending')

  if (!hasApprovedMinistry && userMemberships.length === 0 && authMode !== 'pending_approval') {
    return (
      <div className="flex min-h-screen w-full bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">
        <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar p-6 sm:p-12">
          <div className="flex justify-between items-center max-w-2xl mx-auto w-full mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-sm rotate-3">E</div>
              <span className="font-extrabold text-lg tracking-tight">Escalaê</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => showLogin()} className="text-muted-foreground hover:text-foreground font-bold">
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <SelectMinistryView
              onNext={(selectedNames: string[]) => {
                setPendingApprovalMinistries(selectedNames)
                setAuthMode('pending_approval')
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  if (!hasApprovedMinistry && (hasPendingMinistry || authMode === 'pending_approval')) {
    return (
      <div className="flex min-h-screen w-full bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">
        <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar p-6 sm:p-12">
          <div className="flex justify-between items-center max-w-md mx-auto w-full mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-sm rotate-3">E</div>
              <span className="font-extrabold text-lg tracking-tight">Escalaê</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => showLogin()} className="text-muted-foreground hover:text-foreground font-bold">
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <PendingApprovalView
              ministries={pendingApprovalMinistries}
              userMemberships={userMemberships}
              onRefreshMemberships={async () => {
                if (!user?.id) return
                const { data } = previewData('ministry_members', 'read', undefined, (row: any) => getField(row, 'user_id') === user.id, { single: false, limit: undefined, order: undefined })

                if (data) {
                  setUserMemberships(data)
                  const approved = data.filter((m: any) => m.status === 'approved')
                  if (approved.length > 0) {
                    setSelectedMinistry(approved[0].ministries)
                    toast.success('Sua entrada foi aprovada! Bem-vindo(a) ao Escalaê.')
                  } else {
                    toast.info('Sua solicitação continua sob análise do líder.')
                  }
                }
              }}
              onSignOut={showLogin}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
    <div className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-card border-r border-border h-full flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-24 flex items-center px-8 border-b border-border/50 cursor-pointer" onClick={() => navigateTo('home')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-xl shadow-sm rotate-3">E</div>
            <span className="font-extrabold text-2xl tracking-tight">Escalaê</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {isAdminMode ? (
            <>
              <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={currentView === 'admin_dashboard'} onClick={() => navigateTo('admin_dashboard')} />
              <SidebarItem icon={<Users />} label="Ministérios" active={currentView === 'admin_ministerios' || currentView === 'admin_ministerio_detalhes'} onClick={() => navigateTo('admin_ministerios')} />
              <SidebarItem icon={<Calendar />} label="Escalas" active={currentView === 'admin_escalas' || currentView === 'admin_escala_create'} onClick={() => navigateTo('admin_escalas')} />
              <SidebarItem icon={<User />} label="Voluntários" active={currentView === 'admin_voluntarios' || currentView === 'admin_voluntario_perfil'} onClick={() => navigateTo('admin_voluntarios')} />
              <SidebarItem icon={<Music />} label="Repertório" active={currentView === 'admin_repertorio'} onClick={() => navigateTo('admin_repertorio')} />
              <SidebarItem icon={<ListChecks />} label="Solicitações" active={currentView === 'admin_solicitacoes'} badge="5" onClick={() => navigateTo('admin_solicitacoes')} />
              <SidebarItem icon={<MessageSquare />} label="Feed" active={currentView === 'admin_feed'} onClick={() => navigateTo('admin_feed')} />
              <SidebarItem icon={<PieChart />} label="Relatórios" active={currentView === 'admin_relatorios'} onClick={() => navigateTo('admin_relatorios')} />
            </>
          ) : (
            <>
              <SidebarItem icon={<Home />} label="Início" active={currentView === 'home'} onClick={() => navigateTo('home')} />
              <SidebarItem icon={<Calendar />} label="Escalas" active={currentView === 'escalas' || currentView === 'detalhes'} onClick={() => navigateTo('escalas')} />
              <SidebarItem icon={<Music />} label="Repertório" active={currentView === 'repertorio'} onClick={() => navigateTo('repertorio')} />
              <SidebarItem icon={<MessageSquare />} label="Feed" active={currentView === 'feed'} onClick={() => navigateTo('feed')} />
              
              <div className="pt-8 pb-3 px-4">
                <p className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest">Sua Jornada</p>
              </div>
              
              <SidebarItem icon={<Users />} label="Meus Ministérios" active={currentView === 'ministerios'} onClick={() => navigateTo('ministerios')} />
              <SidebarItem icon={<Award />} label="Conquistas" badge="Nova" active={currentView === 'conquistas'} onClick={() => navigateTo('conquistas')} />
              <SidebarItem 
                icon={<Bell />} 
                label="Notificações" 
                notificationCount={unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined} 
                active={currentView === 'notificacoes'} 
                onClick={() => navigateTo('notificacoes')} 
              />
              <SidebarItem icon={<User />} label="Perfil" active={currentView === 'perfil'} onClick={() => navigateTo('perfil')} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-border/50 bg-background/30 backdrop-blur-sm">
          <div 
            onClick={() => { setIsAdminMode(!isAdminMode); navigateTo(isAdminMode ? 'home' : 'admin_dashboard'); }}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-colors border",
              isAdminMode ? "bg-primary/10 border-primary text-primary hover:bg-primary/20" : "bg-transparent border-transparent hover:bg-secondary hover:border-border"
            )}
          >
            <Avatar 
              src={userProfile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format"} 
              alt={userProfile?.full_name || "Perfil"} 
              size="md"
              fallback={userProfile?.full_name ? userProfile.full_name.charAt(0) : (user?.email?.charAt(0).toUpperCase() || "U")}
            />
            <div className="flex-1 overflow-hidden">
              <p className={cn("text-sm font-bold truncate", isAdminMode && "text-foreground")}>
                {userProfile?.full_name || user?.email?.split('@')[0] || "Voluntário"}
              </p>
              <p className="text-[11px] font-medium text-muted-foreground truncate flex items-center gap-1">
                {isAdminMode ? <><ShieldCheck className="w-3 h-3" /> Modo Admin</> : (selectedMinistry?.name ? selectedMinistry.name : "Voluntário")}
              </p>
            </div>
            <div 
              onClick={(e) => { e.stopPropagation(); navigateTo('configuracoes'); }} 
              className="p-1.5 hover:bg-background rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="md:hidden h-20 flex items-center justify-between px-5 sm:px-6 border-b border-border bg-background z-20 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-lg rotate-3 shadow-sm">E</div>
            <span className="font-extrabold text-xl tracking-tight">Escalaê</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 md:pb-6">
          {currentView === 'home' && (
            <HomeView 
              navigateTo={navigateTo} 
              onTrocaClick={() => setTrocaModalOpen(true)}
              toggleTheme={toggleTheme}
              isDarkMode={isDarkMode}
              user={user}
              userProfile={userProfile}
              userMemberships={userMemberships}
              unreadCount={unreadNotificationsCount}
            />
          )}
          {currentView === 'escalas' && (
            <EscalasView 
              navigateTo={navigateTo}
              user={user}
              userMemberships={userMemberships}
            />
          )}
          {currentView === 'detalhes' && (
            <DetalhesView 
              escala={selectedEscala} 
              onBack={() => navigateTo('escalas')} 
              onOpenTroca={(slot?: any) => {
                setSelectedTrocaSlot(slot);
                setTrocaModalOpen(true);
              }} 
              onOpenSong={(s: any) => setSelectedSongModal(s)}
              user={user}
              userMemberships={userMemberships}
            />
          )}
          {currentView === 'repertorio' && <RepertorioView onOpenSong={(s: any) => setSelectedSongModal(s)} />}
          {currentView === 'feed' && <FeedView user={user} userMemberships={userMemberships} />}
          {currentView === 'ministerios' && (
            <MeusMinisteriosView 
              user={user} 
              userMemberships={userMemberships} 
              onRefreshMemberships={refreshUserData} 
            />
          )}
          {currentView === 'conquistas' && (
            <ConquistasView 
              navigateTo={navigateTo} 
              user={user} 
              userMemberships={userMemberships} 
            />
          )}
          {currentView === 'notificacoes' && (
            <NotificacoesView 
              navigateTo={navigateTo} 
              user={user} 
              userMemberships={userMemberships} 
            />
          )}
          {currentView === 'perfil' && (
            <PerfilView 
              navigateTo={navigateTo} 
              user={user} 
              userProfile={userProfile} 
              userMemberships={userMemberships} 
              onRefreshProfile={refreshUserData} 
              onSignOut={showLogin} 
              toggleTheme={toggleTheme} 
              isDarkMode={isDarkMode} 
            />
          )}
          
          {/* Admin Views */}
          {currentView === 'admin_dashboard' && (
            <AdminDashboardView 
              navigateTo={navigateTo} 
              user={user} 
              userProfile={userProfile} 
              toggleTheme={toggleTheme} 
              isDarkMode={isDarkMode} 
            />
          )}
          {currentView === 'admin_ministerios' && <AdminMinisteriosView navigateTo={navigateTo} />}
          {currentView === 'admin_ministerio_detalhes' && (
            <AdminMinisterioDetalhesView 
              ministry={selectedEscala} 
              navigateTo={navigateTo} 
            />
          )}
          {currentView === 'admin_escalas' && <AdminEscalasView navigateTo={navigateTo} />}
          {currentView === 'admin_escala_create' && <AdminEscalaCreateView navigateTo={navigateTo} />}
          {currentView === 'admin_voluntarios' && <AdminVoluntariosView navigateTo={navigateTo} />}
          {currentView === 'admin_voluntario_perfil' && <AdminVoluntarioPerfilView voluntario={selectedEscala} navigateTo={navigateTo} />}
          {currentView === 'admin_solicitacoes' && <AdminSolicitacoesView navigateTo={navigateTo} />}
          {currentView === 'admin_repertorio' && <AdminRepertorioView />}
          {currentView === 'admin_feed' && <AdminFeedView user={user} userProfile={userProfile} navigateTo={navigateTo} />}
          {currentView === 'admin_relatorios' && <AdminRelatoriosView navigateTo={navigateTo} />}
          {currentView === 'configuracoes' && (
            <ConfiguracoesView 
              toggleTheme={toggleTheme} 
              isDarkMode={isDarkMode} 
              navigateTo={navigateTo} 
              user={user}
              userProfile={userProfile}
              onRefreshProfile={refreshUserData}
              showLogin={showLogin}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border z-30 pb-safe">
        <div className="flex justify-around items-center px-2 py-3">
          <BottomNavItem icon={<Home />} label="Início" active={currentView === 'home'} onClick={() => navigateTo('home')} />
          <BottomNavItem icon={<Calendar />} label="Escalas" active={currentView === 'escalas' || currentView === 'detalhes'} onClick={() => navigateTo('escalas')} />
          <BottomNavItem icon={<MessageSquare />} label="Feed" active={currentView === 'feed'} onClick={() => navigateTo('feed')} />
          <BottomNavItem icon={<Music />} label="Repertório" active={currentView === 'repertorio'} onClick={() => navigateTo('repertorio')} />
          <BottomNavItem icon={<User />} label="Perfil" active={currentView === 'perfil' || currentView === 'conquistas'} onClick={() => navigateTo('perfil')} />
        </div>
      </nav>

      {/* Global Modals */}
      <AnimatePresence>
        {trocaModalOpen && (
          <TrocaModal 
            isOpen={trocaModalOpen} 
            onClose={() => setTrocaModalOpen(false)} 
            slot={selectedTrocaSlot}
            userMemberships={userMemberships}
          />
        )}
        {selectedSongModal && <SongDetailsModal song={selectedSongModal} onClose={() => setSelectedSongModal(null)} />}
      </AnimatePresence>

      <Toaster position="bottom-right" theme={isDarkMode ? 'dark' : 'light'} className="font-sans" toastOptions={{
        className: 'border-border bg-card text-foreground font-bold rounded-2xl shadow-xl'
      }} />

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 20px; border: 2px solid var(--card); }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: var(--muted-foreground); }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1.5rem); }
      `}} />
    </div>
    </ErrorBoundary>
  );
}

// --- UTILS DE DATA EM PORTUGUÊS ---

function formatDatePtBR(dateStr?: string) {
  if (!dateStr) return ''
  try {
    const [year, month, day] = dateStr.split('-')
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const monthIndex = parseInt(month, 10) - 1
    return `${day} ${months[monthIndex] || ''}`
  } catch {
    return dateStr
  }
}

function formatFullDatePtBR(dateStr?: string) {
  if (!dateStr) return ''
  try {
    const [year, month, day] = dateStr.split('-')
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    const monthIndex = parseInt(month, 10) - 1
    return `${parseInt(day, 10)} de ${months[monthIndex] || ''} de ${year}`
  } catch {
    return dateStr
  }
}

function formatTimePtBR(timeStr?: string) {
  if (!timeStr) return ''
  return timeStr.slice(0, 5)
}

// --- VIEWS ---

function HomeView({ toggleTheme, isDarkMode, navigateTo, onTrocaClick, unreadCount, user, userProfile, userMemberships }: any) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const firstName = userProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Voluntário'

  const [proximaEscala, setProximaEscala] = useState<any>(null)
  const [openSlots, setOpenSlots] = useState<any[]>([])
  const [voluntarioMes, setVoluntarioMes] = useState<any>(null)
  const [aniversarios, setAniversarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadHomeData = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0]
      const userMemberIds = (userMemberships || []).map((m: any) => m.id)

      // 1. Próxima escala do voluntário
      if (userMemberIds.length > 0) {
        const { data: myMemberRows } = previewData('schedule_members', 'read', undefined, (row: any) => (userMemberIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'schedules.date') >= todayStr && getField(row, 'schedules.status') === 'published', { single: false, limit: 1, order: ['schedules(date)', { ascending: true }] })

        if (myMemberRows && myMemberRows.length > 0) {
          setProximaEscala(myMemberRows[0])
        } else {
          setProximaEscala(null)
        }
      }

      // 2. Vagas abertas (Quero Servir)
      const { data: slots } = previewData('schedule_members', 'read', undefined, (row: any) => getField(row, 'ministry_member_id') === null && getField(row, 'schedules.status') === 'published' && getField(row, 'schedules.date') >= todayStr, { single: false, limit: 4, order: ['schedules(date)', { ascending: true }] })

      setOpenSlots(slots || [])

      // 3. Voluntário do mês
      const now = new Date()
      const { data: volMonth } = previewData('volunteer_of_month', 'read', undefined, (row: any) => getField(row, 'month') === now.getMonth() + 1 && getField(row, 'year') === now.getFullYear(), { single: true, limit: 1, order: undefined })

      setVoluntarioMes(volMonth)

      // 4. Aniversariantes
      const { data: bdays } = previewData('profiles', 'read', undefined, (row: any) => getField(row, 'birth_date') !== null, { single: false, limit: 6, order: undefined })

      setAniversarios(bdays || [])
    } catch (err) {
      console.error('Erro ao carregar dados da Home:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadHomeData()
  }, [userMemberships])

  const handleConfirmarPresenca = async (scheduleMemberId: string) => {
    const { error } = previewData('schedule_members', 'update', {
        response: 'confirmed',
        response_at: new Date().toISOString()
      }, (row: any) => getField(row, 'id') === scheduleMemberId, { single: false, limit: undefined, order: undefined })

    if (error) {
      toast.error('Erro ao confirmar presença.')
    } else {
      toast.success('Presença confirmada com sucesso!')
      setProximaEscala((prev: any) => prev ? { ...prev, response: 'confirmed' } : prev)
    }
  }

  const handleQueroServir = async (slotId: string, ministryId: string) => {
    const matchingMember = (userMemberships || []).find((m: any) => m.ministry_id === ministryId && m.status === 'approved')
    if (!matchingMember) {
      toast.error('Você precisa fazer parte deste ministério para assumir esta vaga.')
      return
    }

    const { error } = previewData('schedule_members', 'update', {
        ministry_member_id: matchingMember.id,
        response: 'confirmed',
        response_at: new Date().toISOString()
      }, (row: any) => getField(row, 'id') === slotId, { single: false, limit: undefined, order: undefined })

    if (error) {
      toast.error('Não foi possível assumir a vaga. Tente novamente.')
    } else {
      toast.success('Você assumiu a vaga com sucesso!')
      setOpenSlots(prev => prev.filter((s: any) => s.id !== slotId))
      void loadHomeData()
    }
  }

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300">
      <div className="hidden md:flex items-center justify-between mb-10">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Visão Geral</p>
          <h1 className="text-4xl font-extrabold">{greeting}, {firstName} 👋</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Tema Claro' : 'Tema Escuro'}
          </Button>
          <Button variant="outline" size="icon" className="relative" onClick={() => navigateTo('notificacoes')}>
            <Bell className="w-4 h-4 text-foreground" />
            {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border border-background"></span>}
          </Button>
        </div>
      </div>

      <div className="md:hidden mb-8 mt-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Visão Geral</p>
        <h1 className="text-3xl font-extrabold">{greeting}, {firstName} 👋</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
        <div className="xl:col-span-8 space-y-6 xl:space-y-8">
          <section>
            <SectionHeader title="Próximo culto" />
            <ProximoCultoCard 
              proximaEscala={proximaEscala}
              loading={loading}
              onClick={() => {
                if (proximaEscala?.schedules) {
                  navigateTo('detalhes', proximaEscala.schedules)
                }
              }} 
              onConfirm={() => {
                if (proximaEscala?.id) {
                  handleConfirmarPresenca(proximaEscala.id)
                }
              }}
              onTrocaClick={onTrocaClick} 
            />
          </section>

          <section>
            <div className="flex items-center justify-between mb-5">
              <SectionHeader title="Escalas abertas" badge={openSlots.length > 0 ? String(openSlots.length) : undefined} />
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => navigateTo('escalas')}>
                Ver todas <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {openSlots.length === 0 ? (
              <Card className="p-8 text-center bg-card border-dashed">
                <p className="text-muted-foreground font-bold text-sm">Nenhuma vaga em aberto no momento 🎉</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                {openSlots.map((slot) => (
                  <EscalaAbertaCard 
                    key={slot.id}
                    slot={slot}
                    onQueroServir={() => handleQueroServir(slot.id, slot.ministry_roles?.ministry_id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="xl:col-span-4 space-y-6 xl:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            <VoluntarioMesCard highlight={voluntarioMes} />
            <AniversariosCard birthdays={aniversarios} />
          </div>
        </div>
      </div>
    </div>
  )
}

function EscalasView({ navigateTo, user, userMemberships }: any) {
  const [filter, setFilter] = useState('Todas');
  const [viewScope, setViewScope] = useState<'my' | 'all'>('my');
  const [escalas, setEscalas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = ['Todas', 'Próximas', 'Confirmadas', 'Pendentes', 'Passadas'];

  const loadEscalas = async () => {
    setLoading(true);
    try {
      const userMemberIds = (userMemberships || []).map((m: any) => m.id);

      if (viewScope === 'my') {
        if (userMemberIds.length === 0) {
          setEscalas([]);
          setLoading(false);
          return;
        }

        const { data: memberRows, error } = previewData('schedule_members', 'read', undefined, (row: any) => (userMemberIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'schedules.status') === 'published', { single: false, limit: undefined, order: ['schedules(date)', { ascending: false }] });

        if (error) {
          toast.error('Erro ao carregar suas escalas.');
        } else {
          setEscalas(memberRows || []);
        }
      } else {
        const { data: allSchedules, error } = previewData('schedules', 'read', undefined, (row: any) => getField(row, 'status') === 'published', { single: false, limit: undefined, order: ['date', { ascending: false }] });

        if (error) {
          toast.error('Erro ao carregar escalas da igreja.');
        } else {
          const normalized = (allSchedules || []).map((s: any) => {
            const userSlot = s.schedule_members?.find((sm: any) => userMemberIds.includes(sm.ministry_member_id));
            return {
              id: userSlot?.id || s.id,
              response: userSlot?.response || 'none',
              role_id: userSlot?.role_id,
              ministry_roles: userSlot?.ministry_roles,
              schedules: s
            };
          });
          setEscalas(normalized);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar escalas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEscalas();
  }, [userMemberships, viewScope]);

  const todayStr = new Date().toISOString().split('T')[0];
  const filteredEscalas = escalas.filter((item: any) => {
    const s = item.schedules;
    if (!s) return false;
    const isFuture = s.date >= todayStr;
    const isPast = s.date < todayStr;
    const isConfirmed = item.response === 'confirmed';
    const isPending = item.response === 'pending';

    if (filter === 'Próximas') return isFuture;
    if (filter === 'Passadas') return isPast;
    if (filter === 'Confirmadas') return isConfirmed;
    if (filter === 'Pendentes') return isPending;
    return true;
  });

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => setViewScope('my')}
              className={cn(
                "text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full transition-all",
                viewScope === 'my' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Minhas Escalas
            </button>
            <button
              onClick={() => setViewScope('all')}
              className={cn(
                "text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full transition-all",
                viewScope === 'all' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Todas as Escalas
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            {viewScope === 'my' ? 'Minhas Escalas' : 'Todas as Escalas da Igreja'}
          </h1>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 md:pb-0 hide-scrollbar">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border",
                filter === f ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Carregando escalas...</p>
        </div>
      ) : filteredEscalas.length === 0 ? (
        <Card className="p-12 text-center border-dashed rounded-3xl bg-secondary/10">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-xl mb-2">Nenhuma escala encontrada</h3>
          <p className="text-sm font-semibold text-muted-foreground max-w-md mx-auto">
            {filter !== 'Todas' 
              ? `Não há escalas correspondentes ao filtro "${filter}".` 
              : 'Você ainda não possui escalas cadastradas para este período.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {filteredEscalas.map((item: any) => {
            const s = item.schedules;
            const userResponse = item.response;
            const isConfirmed = userResponse === 'confirmed';
            const isPending = userResponse === 'pending';
            const isDeclined = userResponse === 'declined';
            
            const teamMembers = (s.schedule_members || []).map((sm: any) => ({
              id: sm.id,
              name: sm.ministry_members?.profiles?.full_name || (sm.ministry_member_id ? 'Voluntário' : 'Vaga Aberta'),
              avatar: sm.ministry_members?.profiles?.avatar_url,
              role: sm.ministry_roles?.name || 'Membro',
              isOpen: !sm.ministry_member_id
            }));

            const openSlots = teamMembers.filter((m: any) => m.isOpen).length;
            const scaleStatus = openSlots === 0 ? 'Completa' : `Incompleta (${openSlots} vagas)`;
            const ministryName = s.ministries?.name || 'Ministério';
            const userRoleName = item.ministry_roles?.name || (userResponse === 'none' ? 'Geral' : 'Voluntário');

            const [year, month, day] = (s.date || '').split('-');
            const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            const monthAbbr = monthNames[parseInt(month, 10) - 1] || '';

            return (
              <Card 
                key={item.id} 
                hoverable 
                className="p-0 overflow-hidden flex flex-col md:flex-row rounded-3xl cursor-pointer border-border" 
                onClick={() => navigateTo('detalhes', s)}
              >
                <div className="bg-secondary/30 md:w-48 p-5 md:p-6 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-border shrink-0">
                  <div className="flex flex-col md:items-start">
                    <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">{monthAbbr}</span>
                    <span className="text-3xl font-extrabold">{day}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold bg-background md:bg-secondary md:mt-4 px-3 py-1.5 rounded-xl border border-border md:border-none">
                    <Clock className="w-4 h-4 text-primary" />
                    {formatTimePtBR(s.start_time)}
                  </div>
                </div>

                <div className="p-5 md:p-6 flex-1 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {userResponse !== 'none' && (
                      <Badge variant={isConfirmed ? 'success' : isPending ? 'warning' : 'destructive'}>
                        {isConfirmed ? 'Confirmada' : isPending ? 'Pendente' : 'Recusada'}
                      </Badge>
                    )}
                    <Badge variant={openSlots === 0 ? 'default' : 'warning'}>
                      Equipe {scaleStatus}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-extrabold mb-1">{s.title || 'Culto de Celebração'}</h3>
                  <p className="text-sm font-bold text-muted-foreground flex items-center gap-2 mb-6">
                    {ministryName} <span className="w-1 h-1 rounded-full bg-border"></span> {userRoleName}
                  </p>

                  <div className="flex items-center gap-4 border-t border-border pt-5">
                    <div className="flex -space-x-3">
                      {teamMembers.slice(0, 4).map((member: any, i: number) => (
                        <Avatar 
                          key={i} 
                          src={member.avatar} 
                          alt={member.name} 
                          size="md" 
                          fallback={member.name.charAt(0)}
                          className="border-2 border-card ring-2 ring-transparent group-hover:ring-primary/20 transition-all" 
                        />
                      ))}
                    </div>
                    <div className="text-sm">
                      <p className="font-bold">{teamMembers.filter((m: any) => !m.isOpen).map((m: any) => m.name.split(' ')[0]).slice(0, 3).join(', ')}</p>
                      <p className="text-xs font-semibold text-muted-foreground">Escalados neste culto</p>
                    </div>
                    <div className="ml-auto hidden sm:block">
                      <Button variant="outline" size="sm" className="pointer-events-none font-bold rounded-xl">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DetalhesView({ escala, onBack, onOpenTroca, onOpenSong, user, userMemberships }: any) {
  if (!escala) return null;

  const [currentEscala, setCurrentEscala] = useState(escala);

  const userMemberIds = (userMemberships || []).map((m: any) => m.id);
  const scheduleMembers = currentEscala.schedule_members || [];
  const mySlot = scheduleMembers.find((sm: any) => userMemberIds.includes(sm.ministry_member_id));

  const isConfirmed = mySlot?.response === 'confirmed';
  const isPending = mySlot?.response === 'pending';
  const isDeclined = mySlot?.response === 'declined';

  const ministryName = currentEscala.ministries?.name || 'Ministério';
  const formattedDate = formatFullDatePtBR(currentEscala.date);
  const formattedTime = formatTimePtBR(currentEscala.start_time);

  const openSlots = scheduleMembers.filter((sm: any) => !sm.ministry_member_id);
  const scaleStatus = openSlots.length === 0 ? 'Completa' : `Incompleta (${openSlots.length} vagas)`;

  const repertoire = currentEscala.schedule_songs || [];

  const handleConfirmPresence = async () => {
    if (!mySlot?.id) return;
    const { error } = previewData('schedule_members', 'update', {
        response: 'confirmed',
        response_at: new Date().toISOString()
      }, (row: any) => getField(row, 'id') === mySlot.id, { single: false, limit: undefined, order: undefined });

    if (error) {
      toast.error('Erro ao confirmar presença.');
    } else {
      toast.success('Presença confirmada com sucesso!');
      setCurrentEscala((prev: any) => ({
        ...prev,
        schedule_members: prev.schedule_members.map((sm: any) => 
          sm.id === mySlot.id ? { ...sm, response: 'confirmed' } : sm
        )
      }));
    }
  };

  const handleQueroServir = async (slotId: string, roleId: string) => {
    const matchingMember = (userMemberships || []).find((m: any) => 
      m.ministry_id === currentEscala.ministry_id || m.ministry_id === currentEscala.ministries?.id
    );

    if (!matchingMember) {
      toast.error('Você precisa fazer parte deste ministério para assumir esta vaga.');
      return;
    }

    const { error } = previewData('schedule_members', 'update', {
        ministry_member_id: matchingMember.id,
        response: 'confirmed',
        response_at: new Date().toISOString()
      }, (row: any) => getField(row, 'id') === slotId, { single: false, limit: undefined, order: undefined });

    if (error) {
      toast.error('Erro ao assumir vaga: ' + error.message);
    } else {
      toast.success('Você assumiu a vaga com sucesso!');
      const { data: updatedMembers } = previewData('schedule_members', 'read', undefined, (row: any) => getField(row, 'schedule_id') === currentEscala.id, { single: false, limit: undefined, order: undefined });

      if (updatedMembers) {
        setCurrentEscala((prev: any) => ({ ...prev, schedule_members: updatedMembers }));
      }
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1200px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="icon" onClick={onBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Detalhes da Escala</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{currentEscala.title || 'Culto de Celebração'}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={openSlots.length === 0 ? 'success' : 'warning'} className="px-3 py-1.5 text-xs font-extrabold">
            Equipe {scaleStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7 space-y-6 lg:space-y-8">
          <Card className="p-0 overflow-hidden border-border rounded-3xl">
            <div className="bg-secondary/30 p-6 border-b border-border flex flex-wrap gap-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Data</p>
                <div className="flex items-center gap-2 font-extrabold text-lg">
                  <Calendar className="w-5 h-5 text-primary" /> {formattedDate}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Horário</p>
                <div className="flex items-center gap-2 font-extrabold text-lg">
                  <Clock className="w-5 h-5 text-primary" /> {formattedTime}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Local</p>
                <div className="flex items-center gap-2 font-extrabold text-lg">
                  <MapPin className="w-5 h-5 text-primary" /> {currentEscala.location || 'Templo Principal'}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {mySlot ? (
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Sua Participação</p>
                      <p className="font-extrabold text-xl">{ministryName}</p>
                      <p className="font-bold text-muted-foreground">{mySlot.ministry_roles?.name || 'Voluntário'}</p>
                    </div>
                    <Badge variant={isConfirmed ? 'success' : isPending ? 'warning' : 'destructive'}>
                      {isConfirmed ? 'Confirmada' : isPending ? 'Pendente' : 'Recusada'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                    <Button 
                      size="md" 
                      className="flex-1 font-bold" 
                      onClick={handleConfirmPresence}
                    >
                      <CheckCircle2 className="w-5 h-5 mr-1" />
                      {isConfirmed ? 'Confirmado' : 'Confirmar presença'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="md" 
                      className="font-bold" 
                      onClick={() => onOpenTroca?.(mySlot)}
                    >
                      <ArrowRightLeft className="w-5 h-5 mr-1" /> Solicitar troca
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-secondary/30 rounded-2xl p-5 border border-dashed border-border text-center">
                  <p className="font-extrabold text-sm mb-1">Você não está escalado neste culto</p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Veja abaixo os voluntários da equipe ou assuma uma vaga aberta caso queira servir.
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-3xl">
            <SectionHeader title="Equipe Escalada" badge={openSlots.length > 0 ? `${openSlots.length} vagas` : undefined} />
            <div className="space-y-4 mt-6">
              {scheduleMembers.map((member: any) => {
                const isMemberOpen = !member.ministry_member_id;
                const profile = member.ministry_members?.profiles;
                const roleName = member.ministry_roles?.name || 'Membro';
                const memberConfirmed = member.response === 'confirmed';
                const memberPending = member.response === 'pending';

                return (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-3 sm:p-4 rounded-2xl border border-border bg-background hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar 
                        src={profile?.avatar_url} 
                        fallback={isMemberOpen ? '?' : profile?.full_name?.charAt(0) || 'V'} 
                        size="lg" 
                      />
                      <div>
                        <p className={cn("font-extrabold text-base", isMemberOpen && "text-destructive")}>
                          {isMemberOpen ? 'Vaga Aberta' : profile?.full_name || 'Voluntário'}
                        </p>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                          {roleName}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isMemberOpen ? (
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="font-bold hover:bg-primary hover:text-primary-foreground"
                          onClick={() => handleQueroServir(member.id, member.role_id)}
                        >
                          Quero servir
                        </Button>
                      ) : memberConfirmed ? (
                        <Badge variant="success"><Check className="w-3 h-3 inline mr-1"/> Confirmado</Badge>
                      ) : memberPending ? (
                        <Badge variant="warning">Pendente</Badge>
                      ) : (
                        <Badge variant="destructive">Recusado</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="h-full min-h-[400px] rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <SectionHeader title="Repertório do Culto" />
              <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center">
                <Music className="w-5 h-5 text-foreground" />
              </div>
            </div>

            {repertoire && repertoire.length > 0 ? (
              <div className="space-y-3">
                {repertoire.map((item: any, i: number) => {
                  const song = item.songs || item;
                  return (
                    <div 
                      key={item.id || i} 
                      onClick={() => onOpenSong?.(song)}
                      className="group p-4 rounded-2xl border border-border bg-background flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 font-extrabold text-muted-foreground text-lg">{item.position || i + 1}</div>
                        <div>
                          <p className="font-extrabold text-base">{song.title}</p>
                          <p className="text-xs font-bold text-muted-foreground">{song.artist}</p>
                        </div>
                      </div>
                      <Badge variant="default" className="font-extrabold text-sm px-3 py-1">
                        {song.musical_key || song.tone || 'G'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px] text-center p-6 border-2 border-dashed border-border rounded-3xl">
                <Music className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
                <p className="font-extrabold text-lg mb-1">Nenhum repertório</p>
                <p className="text-sm font-semibold text-muted-foreground">O líder do ministério ainda não adicionou as músicas deste culto.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function RepertorioView({ onOpenSong }: any) {
  const [viewMode, setViewMode] = useState<'playlists' | 'all_songs'>('playlists');
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [allSongs, setAllSongs] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);
  const [showPlaylistMobile, setShowPlaylistMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKey, setSelectedKey] = useState('Todos');
  const [loading, setLoading] = useState(true);

  const musicalKeys = ['Todos', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'Am', 'Em', 'Dm', 'Bm'];

  const loadRepertoireData = async () => {
    setLoading(true);
    try {
      // 1. Buscar todas as músicas cadastradas
      const { data: songsData } = previewData('songs', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['title', { ascending: true }] });

      setAllSongs(songsData || []);

      // 2. Buscar escalas publicadas com repertório
      const { data: schedulesData } = previewData('schedules', 'read', undefined, (row: any) => getField(row, 'status') === 'published', { single: false, limit: undefined, order: ['date', { ascending: false }] });

      const formattedPlaylists = (schedulesData || [])
        .filter((s: any) => s.schedule_songs && s.schedule_songs.length > 0)
        .map((s: any) => ({
          id: s.id,
          name: s.title || 'Culto de Celebração',
          event: s.ministries?.name || 'Culto',
          date: formatFullDatePtBR(s.date),
          songs: (s.schedule_songs || [])
            .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
            .map((ss: any) => ss.songs)
            .filter(Boolean)
        }));

      setPlaylists(formattedPlaylists);
      if (formattedPlaylists.length > 0) {
        setSelectedPlaylist(formattedPlaylists[0]);
      }
    } catch (err) {
      console.error('Erro ao carregar repertório:', err);
      toast.error('Erro ao carregar biblioteca de músicas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRepertoireData();
  }, []);

  const handlePlaylistClick = (playlist: any) => {
    setSelectedPlaylist(playlist);
    setShowPlaylistMobile(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtro de Músicas do Acervo
  const filteredAllSongs = allSongs.filter(song => {
    const matchesSearch = 
      (song.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.artist || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKey = selectedKey === 'Todos' || (song.musical_key || '').toUpperCase() === selectedKey.toUpperCase();
    return matchesSearch && matchesKey;
  });

  // Filtro de Playlists
  const filteredPlaylists = playlists.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Biblioteca Musical</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Repertório</h1>
        </div>

        <div className="flex items-center gap-2 bg-secondary/60 p-1.5 rounded-2xl border border-border w-fit">
          <button
            onClick={() => setViewMode('playlists')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-extrabold transition-all",
              viewMode === 'playlists' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Repertórios por Culto
          </button>
          <button
            onClick={() => setViewMode('all_songs')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-extrabold transition-all",
              viewMode === 'all_songs' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Todas as Músicas ({allSongs.length})
          </button>
        </div>
      </div>

      {viewMode === 'all_songs' ? (
        <div className="space-y-6 flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título da música ou artista..." 
                className="w-full h-12 bg-card border border-border rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              {musicalKeys.map(k => (
                <button
                  key={k}
                  onClick={() => setSelectedKey(k)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border whitespace-nowrap",
                    selectedKey === k ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:bg-secondary"
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-bold text-muted-foreground">Carregando acervo musical...</p>
            </div>
          ) : filteredAllSongs.length === 0 ? (
            <Card className="p-12 text-center border-dashed rounded-3xl bg-secondary/10 flex-1 flex flex-col items-center justify-center">
              <Music className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-extrabold text-xl mb-1">Nenhuma música encontrada</h3>
              <p className="text-sm font-semibold text-muted-foreground max-w-md">
                Tente ajustar os termos da busca ou selecione outro tom musical.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pb-6">
              {filteredAllSongs.map((song: any) => (
                <Card 
                  key={song.id} 
                  hoverable
                  onClick={() => onOpenSong?.(song)}
                  className="p-5 rounded-3xl border border-border cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border group-hover:bg-primary/20 transition-colors">
                      <Music className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-base truncate">{song.title}</h4>
                      <p className="text-xs font-bold text-muted-foreground truncate">{song.artist || 'Artista não especificado'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {song.musical_key && (
                      <Badge variant="default" className="font-extrabold text-xs px-2.5 py-1">
                        {song.musical_key}
                      </Badge>
                    )}
                    {song.bpm && (
                      <span className="text-[11px] font-bold text-muted-foreground hidden sm:inline">
                        {song.bpm} BPM
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0 relative">
          <div className={cn("md:w-80 lg:w-96 shrink-0 flex flex-col h-full", showPlaylistMobile ? "hidden md:flex" : "flex")}>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar repertório por culto..." 
                className="w-full h-12 bg-card border border-border rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pb-4 pr-2">
              {filteredPlaylists.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs font-bold text-muted-foreground">Nenhuma playlist encontrada</p>
                </div>
              ) : (
                filteredPlaylists.map(playlist => (
                  <div 
                    key={playlist.id} 
                    onClick={() => handlePlaylistClick(playlist)}
                    className={cn(
                      "p-4 rounded-3xl border transition-all cursor-pointer group flex items-center justify-between",
                      selectedPlaylist?.id === playlist.id
                        ? "bg-foreground text-background border-foreground shadow-md"
                        : "bg-card border-border hover:border-primary/50 text-foreground"
                    )}
                  >
                    <div>
                      <h3 className="font-extrabold text-base mb-1">{playlist.name}</h3>
                      <p className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        selectedPlaylist?.id === playlist.id ? "text-background/70" : "text-muted-foreground"
                      )}>
                        {playlist.date} • {playlist.songs.length} músicas
                      </p>
                    </div>
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      selectedPlaylist?.id === playlist.id ? "bg-background/20 text-background" : "bg-secondary group-hover:bg-primary/20 text-foreground"
                    )}>
                      <PlayCircle className="w-5 h-5" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={cn("flex-1 flex flex-col h-full", !showPlaylistMobile ? "hidden md:flex" : "flex animate-in slide-in-from-right-4 md:animate-none")}>
            {selectedPlaylist ? (
              <Card className="flex-1 flex flex-col p-0 overflow-hidden border-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-border rounded-3xl">
                <div className="bg-secondary/30 p-6 sm:p-8 border-b border-border shrink-0">
                  <button 
                    className="md:hidden flex items-center gap-2 text-sm font-bold text-muted-foreground mb-6 bg-background px-4 py-2 rounded-full border border-border"
                    onClick={() => setShowPlaylistMobile(false)}
                  >
                    <ChevronLeft className="w-4 h-4" /> Voltar para Playlists
                  </button>
                  
                  <Badge variant="primary" className="mb-4">{selectedPlaylist.event}</Badge>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">{selectedPlaylist.name}</h2>
                  <p className="font-semibold text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {selectedPlaylist.date}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
                  {selectedPlaylist.songs.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPlaylist.songs.map((song: any, i: number) => (
                        <div 
                          key={song.id || i} 
                          onClick={() => onOpenSong?.(song)}
                          className="group p-4 sm:p-5 rounded-3xl border border-border bg-background hover:border-primary/50 transition-all cursor-pointer hover:shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center font-extrabold text-lg text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-extrabold text-lg truncate">{song.title}</p>
                                <p className="text-sm font-bold text-muted-foreground truncate">{song.artist}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-6 shrink-0 bg-secondary/50 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none">
                              <div className="flex items-center gap-2">
                                <Badge className="font-extrabold text-sm px-3 bg-background border border-border sm:bg-secondary sm:border-transparent">
                                  {song.musical_key || song.tone || 'G'}
                                </Badge>
                              </div>
                              {song.bpm && (
                                <div className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground">
                                  <AlignLeft className="w-4 h-4" /> {song.bpm} BPM
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                        <Music className="w-10 h-10 text-muted-foreground opacity-50" />
                      </div>
                      <p className="font-extrabold text-2xl mb-2">Playlist Vazia</p>
                      <p className="font-medium text-muted-foreground max-w-sm">Ainda não foram adicionadas músicas para este evento.</p>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="flex-1 flex flex-col items-center justify-center text-center p-8 border-dashed rounded-3xl">
                <Music className="w-12 h-12 text-muted-foreground opacity-40 mb-3" />
                <p className="font-extrabold text-lg">Selecione uma playlist para ver o repertório</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FeedView({ user, userMemberships }: any) {
  const [ministryFilter, setMinistryFilter] = useState('Todos');
  const [ministriesList, setMinistriesList] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeed = async () => {
    setLoading(true);
    try {
      // 1. Carregar lista de ministérios
      const { data: minData } = previewData('ministries', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['name', {}] });

      setMinistriesList(minData || []);

      const dynamicPosts: any[] = [];
      const todayStr = new Date().toISOString().split('T')[0];

      // 2. Vagas abertas em escalas futuras
      const { data: openSlots } = previewData('schedule_members', 'read', undefined, (row: any) => getField(row, 'ministry_member_id') === null && getField(row, 'schedules.status') === 'published' && getField(row, 'schedules.date') >= todayStr, { single: false, limit: 6, order: ['schedules(date)', { ascending: true }] });

      (openSlots || []).forEach((slot: any) => {
        const s = slot.schedules;
        const minName = s.ministries?.name || 'Geral';
        const roleName = slot.ministry_roles?.name || 'Voluntário';
        dynamicPosts.push({
          id: `slot-${slot.id}`,
          type: 'escala',
          authorName: 'Escalaê • Vagas Abertas',
          authorAvatar: '',
          ministry: minName,
          time: `${formatDatePtBR(s.date)} • ${formatTimePtBR(s.start_time)}`,
          content: `🚨 Vaga aberta para o culto "${s.title || 'Culto de Celebração'}".\nPrecisamos de 1 ${roleName} para servir com a equipe. Se você tem disponibilidade, candidate-se abaixo!`,
          reactions: { heart: 4, fire: 7, pray: 3, music: 1 },
          slotData: slot
        });
      });

      // 3. Voluntário do mês
      const now = new Date();
      const { data: volMonth } = previewData('volunteer_of_month', 'read', undefined, (row: any) => getField(row, 'month') === now.getMonth() + 1 && getField(row, 'year') === now.getFullYear(), { single: true, limit: 1, order: undefined });

      if (volMonth && volMonth.profiles) {
        dynamicPosts.push({
          id: `vol-month-${volMonth.id}`,
          type: 'voluntario',
          authorName: 'Coordenação de Voluntários',
          authorAvatar: volMonth.profiles.avatar_url,
          ministry: volMonth.ministries?.name || 'Geral',
          time: 'Destaque do Mês',
          content: `🏆 Parabéns a ${volMonth.profiles.full_name}!\nFoi eleito(a) o(a) Voluntário(a) Destaque deste mês pelo ministério de ${volMonth.ministries?.name || 'Voluntariado'}.\n\n"${volMonth.reason || 'Servindo com dedicação e amor.'}"\n\nQue Deus continue abençoando seu chamado!`,
          reactions: { heart: 24, fire: 18, pray: 15, music: 8 }
        });
      }

      // 4. Aniversariantes do mês
      const { data: birthdays } = previewData('profiles', 'read', undefined, (row: any) => getField(row, 'birth_date') !== null, { single: false, limit: 4, order: undefined });

      if (birthdays && birthdays.length > 0) {
        const bdayNames = birthdays.map((b: any) => `${b.full_name} (${formatDatePtBR(b.birth_date)})`).join(', ');
        dynamicPosts.push({
          id: 'birthdays-post',
          type: 'aniversario',
          authorName: 'Secretaria da Igreja',
          authorAvatar: '',
          ministry: 'Geral',
          time: 'Aniversários do Mês',
          content: `🎂 Parabenizamos nossos irmãos aniversariantes deste mês:\n\n${bdayNames}\n\nDesejamos muitas bênçãos, saúde e paz em suas vidas! 🎉`,
          reactions: { heart: 16, fire: 5, pray: 12, music: 4 }
        });
      }

      // 5. Post de boas-vindas / Comunicação geral
      dynamicPosts.push({
        id: 'welcome-post',
        type: 'aviso',
        authorName: 'Pastoral & Liderança',
        authorAvatar: '',
        ministry: 'Geral',
        time: 'Aviso Importante',
        content: `🙌 Lembrete para todas as equipes:\nMantenham suas disponibilidades semanais atualizadas no perfil para facilitar o fechamento das escalas do próximo mês. Juntos somos mais fortes!`,
        reactions: { heart: 12, fire: 8, pray: 20, music: 2 }
      });

      setPosts(dynamicPosts);
    } catch (err) {
      console.error('Erro ao carregar Feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFeed();
  }, []);

  const handleQueroServir = async (slotId: string, ministryId: string) => {
    const matchingMember = (userMemberships || []).find((m: any) => m.ministry_id === ministryId && m.status === 'approved');
    if (!matchingMember) {
      toast.error('Você precisa fazer parte deste ministério para assumir esta vaga.');
      return;
    }

    const { error } = previewData('schedule_members', 'update', {
        ministry_member_id: matchingMember.id,
        response: 'confirmed',
        response_at: new Date().toISOString()
      }, (row: any) => getField(row, 'id') === slotId, { single: false, limit: undefined, order: undefined });

    if (error) {
      toast.error('Erro ao assumir vaga: ' + error.message);
    } else {
      toast.success('Você assumiu a vaga com sucesso!');
      setPosts(prev => prev.filter(p => p.id !== `slot-${slotId}`));
    }
  };

  const filterOptions = ['Todos', ...ministriesList.map(m => m.name)];
  const filteredPosts = posts.filter(p => ministryFilter === 'Todos' || p.ministry === ministryFilter);

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[800px] mx-auto w-full animate-in fade-in duration-300">
      <div className="mb-8">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Comunidade</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold">Feed da Igreja</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5 md:mx-0 md:px-0 md:pb-6 hide-scrollbar">
        {filterOptions.map(m => (
          <button
            key={m}
            onClick={() => setMinistryFilter(m)}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border",
              ministryFilter === m ? "bg-foreground text-background border-foreground shadow-sm" : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Carregando feed...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed rounded-3xl">
          <MessageSquare className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-extrabold text-xl mb-2">Feed vazio</h3>
          <p className="text-muted-foreground font-semibold text-sm max-w-sm">
            Não existem postagens para este ministério no momento.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <FeedPost 
              key={post.id} 
              post={post} 
              onQueroServir={post.slotData ? () => handleQueroServir(post.slotData.id, post.slotData.ministry_roles?.ministry_id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FeedPost({ post, onQueroServir }: any) {
  const [reacted, setReacted] = useState<string | null>(null);

  const getPostIcon = () => {
    switch (post.type) {
      case 'aviso': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'aniversario': return <Gift className="w-5 h-5 text-orange-500" />;
      case 'escala': return <Flame className="w-5 h-5 text-red-500" />;
      case 'voluntario': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'evento': return <Calendar className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const handleReaction = (type: string) => {
    if (reacted !== type) {
      toast('Reação adicionada!', { icon: '✨' });
    }
    setReacted(reacted === type ? null : type);
  };

  return (
    <Card className="p-0 rounded-3xl border-border overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar 
            src={post.authorAvatar} 
            fallback={post.type === 'escala' ? 'E' : post.authorName?.charAt(0) || '?'} 
            size="md" 
          />
          <div>
            <p className="font-extrabold text-base leading-tight">{post.authorName}</p>
            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 mt-0.5">
              {post.time} • <Badge variant="secondary" className="px-1.5 py-0 text-[9px] font-extrabold">{post.ministry}</Badge>
            </p>
          </div>
        </div>
        <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center shrink-0">
          {getPostIcon()}
        </div>
      </div>
      
      <div className="p-5 sm:p-6 text-sm sm:text-base font-medium leading-relaxed whitespace-pre-line">
        {post.content}
        
        {post.type === 'escala' && onQueroServir && (
          <div className="mt-4">
            <Button 
              variant="secondary" 
              onClick={onQueroServir}
              className="w-full font-extrabold hover:bg-primary hover:text-primary-foreground cursor-pointer"
            >
              Quero servir
            </Button>
          </div>
        )}
      </div>

      <div className="bg-secondary/30 px-5 py-4 sm:px-6 flex items-center gap-2 overflow-x-auto hide-scrollbar border-t border-border">
        {(['heart', 'fire', 'pray', 'music'] as const).map(reaction => {
          const emojis = { heart: '❤️', fire: '🔥', pray: '🙏', music: '🎶' };
          const isActive = reacted === reaction;
          return (
            <button 
              key={reaction}
              onClick={() => handleReaction(reaction)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border transition-all cursor-pointer",
                isActive ? "bg-primary/20 border-primary text-foreground" : "bg-card border-border hover:bg-secondary text-muted-foreground"
              )}
            >
              <span>{emojis[reaction]}</span>
              <span>{(post.reactions as Record<string, number>)[reaction] + (isActive ? 1 : 0)}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function NotificacoesView({ navigateTo, user, userMemberships = [] }: any) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const approvedIds = userMemberships.filter((m: any) => m.status === 'approved').map((m: any) => m.id);
    const notifs: any[] = [];
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      // 1. Escalas com confirmação pendente
      if (approvedIds.length > 0) {
        const { data: pendingSlots } = previewData('schedule_members', 'read', undefined, (row: any) => (approvedIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'response') === 'pending' && getField(row, 'schedules.status') === 'published' && getField(row, 'schedules.date') >= todayStr, { single: false, limit: undefined, order: undefined });

        (pendingSlots || []).forEach((slot: any) => {
          const s = slot.schedules;
          notifs.push({
            id: `pending-slot-${slot.id}`,
            type: 'nova_escala',
            read: false,
            title: `Confirmação de Presença: ${s.title || 'Culto'}`,
            description: `Você foi escalado para ${s.ministries?.name || 'sua equipe'} no dia ${formatDatePtBR(s.date)} às ${formatTimePtBR(s.start_time)}. Confirme sua presença!`,
            time: formatDatePtBR(s.date),
            action: () => navigateTo('escalas')
          });
        });
      }

      // 2. Pedidos de troca do usuário
      if (approvedIds.length > 0) {
        const { data: swaps } = previewData('schedule_swap_requests', 'read', undefined, (row: any) => (approvedIds).includes(getField(row, 'requester_id')), { single: false, limit: 3, order: ['created_at', { ascending: false }] });

        (swaps || []).forEach((swap: any) => {
          const sc = swap.schedule_members?.schedules;
          const isPending = swap.status === 'pending';
          const isApproved = swap.status === 'approved';
          notifs.push({
            id: `swap-${swap.id}`,
            type: isApproved ? 'troca_aprovada' : 'pedido_troca',
            read: !isPending,
            title: isApproved ? 'Pedido de Troca Aprovado' : isPending ? 'Pedido de Troca em Análise' : 'Pedido de Troca Recusado',
            description: `Seu pedido de troca para o culto "${sc?.title || 'Culto'}" (${formatDatePtBR(sc?.date || todayStr)}) está ${isApproved ? 'aprovado pelo líder' : isPending ? 'sendo analisado pela liderança' : 'recusado'}.`,
            time: swap.created_at ? formatDatePtBR(swap.created_at.split('T')[0]) : 'Hoje',
            action: () => navigateTo('escalas')
          });
        });
      }

      // 3. Vagas abertas urgentes
      const { data: openSlots } = previewData('schedule_members', 'read', undefined, (row: any) => getField(row, 'ministry_member_id') === null && getField(row, 'schedules.status') === 'published' && getField(row, 'schedules.date') >= todayStr, { single: false, limit: 2, order: undefined });

      (openSlots || []).forEach((os: any) => {
        const s = os.schedules;
        notifs.push({
          id: `open-${os.id}`,
          type: 'escala_aberta',
          read: true,
          title: `Vaga Aberta: ${s.ministries?.name || 'Equipe'}`,
          description: `Há vaga em aberto para o culto ${s.title || ''} em ${formatDatePtBR(s.date)}. Seja um voluntário!`,
          time: formatDatePtBR(s.date),
          action: () => navigateTo('escalas')
        });
      });

      // 4. Notificação de boas-vindas
      notifs.push({
        id: 'welcome-notif',
        type: 'aviso',
        read: true,
        title: 'Bem-vindo ao Escalaê! 👋',
        description: 'Seu aplicativo oficial para organização de escalas, repertório e ministérios.',
        time: 'Recente'
      });

      setNotifications(notifs);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, [user?.id, userMemberships]);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Todas as notificações foram marcadas como lidas.');
  };

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[800px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Avisos Diretos</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3">
            Notificações
            {unread.length > 0 && <Badge variant="primary" className="text-base px-3 py-0.5">{unread.length}</Badge>}
          </h1>
        </div>

        {unread.length > 0 && (
          <Button variant="secondary" size="sm" className="font-bold cursor-pointer" onClick={handleMarkAllAsRead}>
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Carregando notificações...</p>
        </div>
      ) : notifications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed rounded-3xl">
          <Bell className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-extrabold text-xl mb-2">Nenhuma notificação</h3>
          <p className="text-muted-foreground font-semibold text-sm max-w-sm">
            Você está em dia com todas as suas escalas e avisos.
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {unread.length > 0 && (
            <div>
              <SectionHeader title="Não Lidas" badge={String(unread.length)} />
              <div className="space-y-3 mt-4">
                {unread.map(notif => (
                  <NotificationCard key={notif.id} data={notif} />
                ))}
              </div>
            </div>
          )}

          {read.length > 0 && (
            <div>
              <SectionHeader title="Anteriores" />
              <div className="space-y-3 mt-4">
                {read.map(notif => (
                  <NotificationCard key={notif.id} data={notif} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationCard({ data }: any) {
  const getIcon = () => {
    switch (data.type) {
      case 'escala_aberta': return <Flame className="w-5 h-5 text-red-500" />;
      case 'troca_aprovada': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'nova_escala': return <Calendar className="w-5 h-5 text-primary" />;
      case 'pedido_troca': return <ArrowRightLeft className="w-5 h-5 text-orange-500" />;
      case 'aniversario': return <Gift className="w-5 h-5 text-pink-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div 
      onClick={data.action}
      className={cn(
        "p-4 rounded-3xl border flex gap-4 transition-all cursor-pointer group",
        !data.read ? "bg-card border-primary/30 shadow-[0_4px_20px_rgba(198,255,77,0.05)]" : "bg-card border-border hover:bg-secondary/50"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
        !data.read ? "bg-background border-border" : "bg-secondary border-transparent group-hover:bg-background"
      )}>
        {getIcon()}
      </div>
      <div className="flex-1 pt-0.5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
          <p className="font-extrabold text-base truncate">{data.title}</p>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary px-2 py-0.5 rounded-md w-fit shrink-0">{data.time}</span>
        </div>
        <p className="text-sm font-semibold text-muted-foreground truncate">{data.description}</p>
      </div>
      {!data.read && (
        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
      )}
    </div>
  );
}

// --- MODALS (Interactions) ---

function TrocaModal({ isOpen, onClose, slot, userMemberships }: any) {
  const [step, setStep] = useState('form');
  const [reason, setReason] = useState('');
  const [targetMemberId, setTargetMemberId] = useState('');
  const [availableVolunteers, setAvailableVolunteers] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setReason('');
      setTargetMemberId('');

      const loadVolunteers = async () => {
        const ministryId = slot?.ministry_roles?.ministry_id || slot?.schedules?.ministry_id;
        if (!ministryId) return;

        const { data } = previewData('ministry_members', 'read', undefined, (row: any) => getField(row, 'ministry_id') === ministryId && getField(row, 'status') === 'approved', { single: false, limit: undefined, order: undefined });

        const currentMemberId = slot?.ministry_member_id;
        setAvailableVolunteers((data || []).filter((m: any) => m.id !== currentMemberId));
      };

      void loadVolunteers();
    }
  }, [isOpen, slot]);

  const handleSubmitSwap = async () => {
    if (!slot?.id) {
      toast.error('Escala não selecionada.');
      return;
    }

    const requesterMemberId = slot.ministry_member_id;
    if (!requesterMemberId) {
      toast.error('Você não está vinculado a esta vaga.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = previewData('schedule_swap_requests', 'insert', {
          schedule_member_id: slot.id,
          requester_id: requesterMemberId,
          target_member_id: targetMemberId || null,
          reason: reason || 'Não poderei comparecer.',
          status: 'pending'
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      if (error) {
        toast.error('Erro ao enviar pedido de troca: ' + error.message);
      } else {
        setStep('success');
        toast.success('Pedido de troca enviado com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao solicitar troca:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={step === 'form' ? 'Precisa trocar essa escala?' : ''}>
      {step === 'form' ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Justificativa / Motivo</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full min-h-[100px] bg-secondary/50 border border-border rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none placeholder:text-muted-foreground"
              placeholder="Explique brevemente por que você não poderá participar deste culto..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Indicar Substituto (Opcional)</label>
            <select
              value={targetMemberId}
              onChange={(e) => setTargetMemberId(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
            >
              <option value="">Deixar em aberto para qualquer voluntário disponível</option>
              {availableVolunteers.map((vol: any) => (
                <option key={vol.id} value={vol.id}>
                  {vol.profiles?.full_name || 'Voluntário'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1 font-bold" onClick={onClose}>Cancelar</Button>
            <Button className="flex-1 font-bold" disabled={submitting} onClick={handleSubmitSwap}>
              {submitting ? 'Enviando...' : 'Enviar Pedido de Troca'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-extrabold mb-2">Pedido enviado para o líder 🙌</h3>
          <p className="text-muted-foreground font-medium mb-8">
            Seu pedido foi registrado e será analisado pela liderança.
          </p>
          <Button onClick={onClose} className="w-full font-bold">Entendido</Button>
        </div>
      )}
    </Modal>
  );
}

function SongDetailsModal({ song, onClose }: any) {
  if (!song) return null;

  const key = song.musical_key || song.tone || 'G';
  const bpm = song.bpm || '—';

  return (
    <Modal isOpen={!!song} onClose={onClose}>
      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border">
          <Music className="w-8 h-8 text-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 truncate">{song.title}</h2>
          <p className="text-base sm:text-lg font-bold text-muted-foreground truncate">{song.artist || 'Artista não especificado'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-secondary/50 p-4 rounded-2xl border border-border text-center">
          <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1">Tom Musical</p>
          <p className="text-2xl font-extrabold text-primary">{key}</p>
        </div>
        <div className="bg-secondary/50 p-4 rounded-2xl border border-border text-center">
          <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1">Andamento (BPM)</p>
          <p className="text-2xl font-extrabold">{bpm}</p>
        </div>
      </div>

      {song.notes && (
        <div className="mb-8 bg-card border border-border rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Observações do Arranjo / Líder
          </p>
          <p className="text-sm font-semibold leading-relaxed text-foreground/90">{song.notes}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="secondary" 
          className="flex-1 border-border bg-card hover:bg-secondary font-bold"
          onClick={() => {
            if (song.cifra_url) {
              window.open(song.cifra_url, '_blank');
            } else {
              toast.info('Link da cifra não cadastrado para esta música.');
            }
          }}
        >
          <FileText className="w-4 h-4 mr-2" />
          Ver Cifra
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1 border-border bg-card hover:bg-secondary font-bold text-red-500 hover:text-red-600"
          onClick={() => {
            if (song.youtube_url) {
              window.open(song.youtube_url, '_blank');
            } else {
              toast.info('Link do YouTube não cadastrado para esta música.');
            }
          }}
        >
          <Youtube className="w-4 h-4 mr-2" />
          Assistir no YouTube
        </Button>
      </div>
    </Modal>
  );
}
// --- SHARED COMPONENTS IN MAIN APP ---

function SidebarItem({ icon, label, active, badge, notificationCount, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={cn(
      "flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 group",
      active 
        ? "bg-primary text-primary-foreground font-bold shadow-[0_4px_14px_rgba(198,255,77,0.2)]" 
        : "text-muted-foreground hover:bg-secondary hover:text-foreground font-medium"
    )}>
      <div className="flex items-center gap-3.5">
        {React.cloneElement(icon, { 
          className: cn("w-5 h-5 transition-transform duration-300", active ? "stroke-[2.5px]" : "stroke-2 group-hover:scale-110 group-hover:text-primary") 
        })}
        <span>{label}</span>
      </div>
      {badge && <Badge variant="primary">{badge}</Badge>}
      {notificationCount && (
        <span className="bg-destructive text-destructive-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">{notificationCount}</span>
      )}
    </div>
  );
}

function BottomNavItem({ icon, label, active, notification, onClick }: any) {
  return (
    <div onClick={onClick} className="flex flex-col items-center justify-center w-16 relative cursor-pointer group gap-1.5">
      <div className={cn(
        "flex items-center justify-center w-12 h-10 rounded-2xl transition-all duration-300",
        active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground group-hover:bg-secondary group-hover:text-foreground"
      )}>
        {React.cloneElement(icon, { className: cn("w-5 h-5", active ? "stroke-[2.5px]" : "stroke-2") })}
      </div>
      <span className={cn("text-[10px] transition-colors", active ? "text-foreground font-extrabold" : "text-muted-foreground font-semibold")}>{label}</span>
      {notification && <span className="absolute top-0 right-3 w-2.5 h-2.5 bg-destructive border-2 border-background rounded-full"></span>}
    </div>
  );
}

function SectionHeader({ title, badge }: { title: string, badge?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="text-xl sm:text-2xl font-extrabold">{title}</h2>
      {badge && <Badge variant="destructive">{badge}</Badge>}
    </div>
  );
}

function ProximoCultoCard({ proximaEscala, loading, onClick, onConfirm, onTrocaClick }: any) {
  if (loading) {
    return (
      <Card className="p-8 text-center bg-card border-border">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm font-bold text-muted-foreground">Carregando sua próxima escala...</p>
      </Card>
    )
  }

  if (!proximaEscala || !proximaEscala.schedules) {
    return (
      <Card className="p-8 text-center bg-secondary/20 border-dashed border-border rounded-3xl">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <Calendar className="w-7 h-7" />
        </div>
        <h3 className="font-extrabold text-xl mb-1">Você não possui escalas futuras</h3>
        <p className="text-sm font-semibold text-muted-foreground mb-4">
          Quando seu líder publicar uma escala com você, ela aparecerá aqui.
        </p>
      </Card>
    )
  }

  const schedule = proximaEscala.schedules
  const isConfirmed = proximaEscala.response === 'confirmed'
  const isPending = proximaEscala.response === 'pending'
  const ministryName = schedule.ministries?.name || 'Ministério'
  const roleName = proximaEscala.ministry_roles?.name || 'Voluntário'
  const formattedDate = formatFullDatePtBR(schedule.date)
  const formattedTime = formatTimePtBR(schedule.start_time)

  return (
    <Card hoverable className="p-0 border-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-border">
      <div className="bg-primary px-6 sm:px-8 py-5 flex items-center justify-between" onClick={onClick}>
        <Badge variant={isConfirmed ? 'success' : isPending ? 'warning' : 'destructive'} className={isConfirmed ? 'bg-primary-foreground/20 text-primary-foreground' : undefined}>
          {isConfirmed ? 'Confirmado' : isPending ? 'Pendente' : 'Recusado'}
        </Badge>
        <div className="flex items-center gap-2 text-primary-foreground/90 text-sm font-bold">
          <Clock className="w-4 h-4" /> {formattedDate}
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 gap-6" onClick={onClick}>
          <div>
            <h3 className="font-extrabold text-2xl sm:text-3xl mb-4 tracking-tight">{schedule.title || 'Culto de Celebração'}</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-secondary/50 text-foreground px-4 py-2 rounded-xl">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{formattedDate} • {formattedTime}</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 text-foreground px-4 py-2 rounded-xl">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{schedule.location || 'Templo Principal'}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-secondary items-center justify-center text-foreground shrink-0 rotate-3">
            {getMinistryIconComponent(ministryName)}
          </div>
        </div>

        <div className="bg-secondary/30 rounded-2xl p-5 mb-8 border border-border/50 flex items-center gap-4" onClick={onClick}>
          <div className="w-1.5 bg-primary rounded-full h-12"></div>
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Ministério & Função</p>
            <p className="font-extrabold text-lg sm:text-xl">{ministryName} • {roleName}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button 
            size="lg" 
            className={cn("flex-1 text-base font-extrabold", isConfirmed && "opacity-90")} 
            onClick={(e: any) => { 
              e.stopPropagation() 
              onConfirm?.() 
            }}
          >
            <CheckCircle2 className="w-5 h-5 mr-1" />
            {isConfirmed ? 'Presença Confirmada' : 'Confirmar presença'}
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            className="sm:w-auto font-bold" 
            onClick={(e: any) => { 
              e.stopPropagation() 
              onTrocaClick?.() 
            }}
          >
            <ArrowRightLeft className="w-5 h-5 sm:mr-0 mr-2" />
            <span className="sm:hidden">Solicitar troca</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function EscalaAbertaCard({ slot, onQueroServir }: any) {
  const [applied, setApplied] = useState(false);
  const schedule = slot?.schedules;
  const ministry = schedule?.ministries?.name || 'Ministério';
  const role = slot?.ministry_roles?.name || 'Voluntário';
  const formattedDate = formatDatePtBR(schedule?.date);
  const formattedTime = formatTimePtBR(schedule?.start_time);

  return (
    <Card className={cn(
      "flex flex-col h-full bg-gradient-to-b from-card to-card/50 rounded-3xl",
      applied ? "border-primary/50" : "hover:border-primary/50"
    )}>
      {applied ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h4 className="font-extrabold text-xl mb-2">Vaga assumida! 🙌</h4>
          <p className="text-sm font-semibold text-muted-foreground mb-4">Você foi adicionado(a) à escala.</p>
          <Badge variant="success">Confirmado</Badge>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6 bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-2xl w-fit">
            <Flame className="w-5 h-5" />
            <p className="font-extrabold text-sm tracking-widest uppercase">Escala Aberta</p>
          </div>
          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center gap-3 text-sm font-bold">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><Clock className="w-4 h-4" /></div>
              <div><p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Quando</p><p>{formattedDate} • {formattedTime}</p></div>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><Users className="w-4 h-4" /></div>
              <div><p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">{ministry}</p><p className="text-destructive font-extrabold">Falta: {role}</p></div>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => { 
              setApplied(true); 
              onQueroServir?.(); 
            }} 
            className="w-full hover:bg-primary hover:text-primary-foreground hover:border-primary font-extrabold cursor-pointer"
          >
            Quero servir
          </Button>
        </>
      )}
    </Card>
  );
}

function VoluntarioMesCard({ highlight }: any) {
  const name = highlight?.profiles?.full_name || 'Destaque do Mês';
  const avatar = highlight?.profiles?.avatar_url;
  const reason = highlight?.reason || 'Servindo a igreja com amor e excelência';

  return (
    <Card hoverable className="relative p-0 border-none bg-primary text-primary-foreground overflow-hidden rounded-3xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6"><Trophy className="w-5 h-5 fill-current" /><h3 className="font-extrabold uppercase tracking-widest text-xs">Destaque do Mês</h3></div>
        <div className="flex items-center gap-5">
          <Avatar 
            src={avatar || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&auto=format"} 
            alt={name} 
            size="xl" 
            className="border-4 border-primary-foreground/20 shadow-xl" 
            fallback={name.charAt(0)}
          />
          <div>
            <p className="font-extrabold text-2xl mb-1">{name}</p>
            <Badge className="bg-primary-foreground text-primary shadow-sm text-xs px-3 font-bold">
              {reason}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AniversariosCard({ birthdays = [] }: any) {
  return (
    <Card hoverable className="h-full flex flex-col rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
            <Gift className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-lg">Aniversários</h3>
        </div>
      </div>
      <div className="space-y-4 flex-1 justify-center flex flex-col">
        {birthdays.length === 0 ? (
          <p className="text-xs font-semibold text-muted-foreground text-center py-4">Nenhum aniversariante registrado</p>
        ) : (
          birthdays.slice(0, 3).map((person: any) => (
            <div key={person.id} className="flex items-center gap-4 group cursor-pointer">
              <Avatar 
                src={person.avatar_url} 
                alt={person.full_name} 
                size="lg" 
                fallback={person.full_name?.charAt(0) || 'U'}
                className="group-hover:border-primary transition-colors" 
              />
              <div className="flex-1">
                <p className="text-base font-extrabold">{person.full_name}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                  {formatDatePtBR(person.birth_date)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

function AvisoCard({ title, time, content, icon, primary }: any) {
  return (
    <div className="p-4 rounded-3xl border border-border bg-card hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group flex gap-4">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors", primary ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-foreground border-border group-hover:bg-secondary/80")}>{icon}</div>
      <div className="flex-1 pt-1">
        <div className="flex items-center justify-between mb-1.5"><p className="font-extrabold text-base">{title}</p><span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-1 rounded-md">{time}</span></div>
        <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function PerfilView({ 
  navigateTo, 
  user, 
  userProfile, 
  userMemberships = [], 
  onRefreshProfile, 
  onSignOut, 
  toggleTheme, 
  isDarkMode 
}: any) {
  const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const SHIFTS = ['Manhã', 'Tarde', 'Noite'];
  
  const [availability, setAvailability] = useState<Record<string, string[]>>({
    Dom: ['Manhã', 'Noite'],
    Seg: [],
    Ter: ['Noite'],
    Qua: ['Tarde', 'Noite'],
    Qui: ['Noite'],
    Sex: ['Noite'],
    Sáb: ['Tarde', 'Noite']
  });

  const [savingAvailability, setSavingAvailability] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [birthDate, setBirthDate] = useState(userProfile?.birth_date || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Metrics
  const [stats, setStats] = useState({
    confirmedCount: 0,
    attendanceRate: 100,
    loading: true
  });

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setPhone(userProfile.phone || '');
      setBirthDate(userProfile.birth_date || '');
      if (userProfile.availability && typeof userProfile.availability === 'object') {
        setAvailability(userProfile.availability);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) return;
      const approvedIds = userMemberships.filter((m: any) => m.status === 'approved').map((m: any) => m.id);
      if (approvedIds.length === 0) {
        setStats({ confirmedCount: 0, attendanceRate: 100, loading: false });
        return;
      }

      try {
        const { count: confirmed } = previewData('schedule_members', 'read', undefined, (row: any) => (approvedIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'response') === 'confirmed', { single: false, limit: undefined, order: undefined });

        const { count: declined } = previewData('schedule_members', 'read', undefined, (row: any) => (approvedIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'response') === 'declined', { single: false, limit: undefined, order: undefined });

        const total = (confirmed || 0) + (declined || 0);
        const rate = total > 0 ? Math.round(((confirmed || 0) / total) * 100) : 100;

        setStats({
          confirmedCount: confirmed || 0,
          attendanceRate: rate,
          loading: false
        });
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    void loadStats();
  }, [user?.id, userMemberships]);

  const toggleAvailability = (day: string, shift: string) => {
    setAvailability(prev => {
      const dayShifts = prev[day] || [];
      const newShifts = dayShifts.includes(shift) 
        ? dayShifts.filter(s => s !== shift)
        : [...dayShifts, shift];
      return { ...prev, [day]: newShifts };
    });
  };

  const handleSaveAvailability = async () => {
    if (!user?.id) return;
    setSavingAvailability(true);
    try {
      const { error } = previewData('profiles', 'update', {
          availability,
          updated_at: new Date().toISOString()
        }, (row: any) => getField(row, 'id') === user.id, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.success('Disponibilidade semanal salva com sucesso!');
      onRefreshProfile?.();
    } catch (err: any) {
      toast.error('Erro ao salvar disponibilidade: ' + err.message);
    } finally {
      setSavingAvailability(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSavingProfile(true);
    try {
      const { error } = previewData('profiles', 'update', {
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          birth_date: birthDate || null,
          updated_at: new Date().toISOString()
        }, (row: any) => getField(row, 'id') === user.id, { single: false, limit: undefined, order: undefined });

      if (error) {
        toast.error('Erro ao salvar perfil: ' + error.message);
      } else {
        toast.success('Perfil atualizado com sucesso!');
        setEditModalOpen(false);
        onRefreshProfile?.();
      }
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const approvedMinistries = userMemberships.filter((m: any) => m.status === 'approved');
  const primaryMinistry = approvedMinistries.length > 0 ? approvedMinistries[0].ministries?.name : 'Voluntário';

  const totalXp = stats.confirmedCount * 250;
  const currentLevel = Math.max(1, Math.floor(totalXp / 1000) + 1);
  const xpInCurrentLevel = totalXp % 1000;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / 1000) * 100));

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1000px] mx-auto w-full animate-in fade-in duration-300">
      {/* Header / Banner */}
      <div className="relative mb-20 md:mb-24">
        <div className="h-32 md:h-48 w-full bg-primary rounded-3xl overflow-hidden relative border-4 border-card shadow-sm">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.05)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.05)_75%,transparent_75%,transparent)] bg-[length:24px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"></div>
        </div>
        <div className="absolute -bottom-12 md:-bottom-16 left-6 md:left-10 flex items-end gap-5">
          <Avatar 
            src={userProfile?.avatar_url} 
            fallback={userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'V'}
            size="xl" 
            className="w-24 h-24 md:w-32 md:h-32 border-4 border-card shadow-lg text-2xl font-black bg-secondary"
          />
          <div className="mb-2 hidden sm:block">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {userProfile?.full_name || 'Voluntário'}
            </h1>
            <p className="font-semibold text-muted-foreground">{primaryMinistry}</p>
          </div>
        </div>
        <div className="absolute -bottom-6 right-6 flex gap-2">
          <Button variant="secondary" size="icon" className="cursor-pointer" onClick={() => setEditModalOpen(true)}>
            <Edit2 className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="icon" className="cursor-pointer" onClick={() => navigateTo('configuracoes')}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="sm:hidden mb-8 px-2">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {userProfile?.full_name || 'Voluntário'}
        </h1>
        <p className="font-semibold text-muted-foreground">{primaryMinistry}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          
          {/* Histórico */}
          <section>
            <SectionHeader title="Seu Histórico" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-card to-secondary/30 rounded-3xl border-border">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-3xl font-extrabold">{stats.confirmedCount}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Escalas Concluídas</p>
              </Card>

              <Card className="flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-card to-secondary/30 rounded-3xl border-border">
                <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="text-3xl font-extrabold">{stats.attendanceRate}%</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Presença</p>
              </Card>

              <Card className="flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-card to-secondary/30 rounded-3xl border-border">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-3xl font-extrabold">{approvedMinistries.length}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Ministérios Ativos</p>
              </Card>
            </div>
          </section>

          {/* Disponibilidade */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <SectionHeader title="Disponibilidade Semanal" />
              <Button 
                variant="primary" 
                size="sm" 
                className="font-bold cursor-pointer"
                disabled={savingAvailability}
                onClick={handleSaveAvailability}
              >
                {savingAvailability ? 'Salvando...' : 'Salvar Disponibilidade'}
              </Button>
            </div>
            
            <Card className="p-0 overflow-x-auto hide-scrollbar border-border rounded-3xl">
              <div className="min-w-[600px] p-6">
                <div className="grid grid-cols-8 gap-4 mb-4">
                  <div></div>
                  {DAYS_OF_WEEK.map(day => (
                    <div key={day} className="text-center text-xs font-extrabold text-muted-foreground uppercase tracking-widest">{day}</div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  {SHIFTS.map(shift => (
                    <div key={shift} className="grid grid-cols-8 gap-4 items-center">
                      <div className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest text-right pr-2">
                        {shift}
                      </div>
                      {DAYS_OF_WEEK.map(day => {
                        const isAvailable = availability[day]?.includes(shift);
                        return (
                          <div 
                            key={`${day}-${shift}`}
                            onClick={() => toggleAvailability(day, shift)}
                            className={cn(
                              "h-12 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all active:scale-95",
                              isAvailable 
                                ? "bg-primary border-primary text-primary-foreground shadow-sm" 
                                : "bg-card border-border/60 hover:border-primary/50 text-transparent"
                            )}
                          >
                            {isAvailable && <Check className="w-5 h-5 stroke-[3]" />}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>
        </div>

        <div className="md:col-span-4 space-y-8">
          
          <Card hoverable className="bg-foreground text-background border-foreground cursor-pointer rounded-3xl" onClick={() => navigateTo('conquistas')}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary">
                <Award className="w-5 h-5" />
                <span className="font-extrabold uppercase tracking-widest text-xs">Suas Conquistas</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="text-center mb-6">
              <p className="text-sm font-bold text-muted-foreground mb-1">Nível Atual</p>
              <h2 className="text-5xl font-extrabold mb-2">Nv. {currentLevel}</h2>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span>{totalXp} XP</span>
                <span>Nv. {currentLevel + 1}</span>
              </div>
              <div className="h-3 bg-secondary/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-border">
            <h3 className="font-extrabold text-lg mb-4">Ministérios Ativos</h3>
            {approvedMinistries.length === 0 ? (
              <p className="text-xs font-bold text-muted-foreground">Nenhum ministério ativo ainda.</p>
            ) : (
              <div className="space-y-3">
                {approvedMinistries.map((m: any) => (
                  <div key={m.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-secondary/30 border border-border">
                    <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center border border-border shrink-0">
                      {getMinistryIconComponent(m.ministries?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-sm truncate">{m.ministries?.name || 'Ministério'}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                        {m.role === 'leader' ? 'Líder de Equipe' : 'Voluntário Ativo'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>
      </div>

      {/* Modal de Edição de Dados */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Perfil">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Nome Completo
            </label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              WhatsApp / Celular
            </label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Data de Nascimento
            </label>
            <input 
              type="date" 
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1 font-bold" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold" disabled={savingProfile}>
              {savingProfile ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Configurações da Conta */}
      <Modal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} title="Configurações da Conta">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/40 border border-border">
            <div>
              <p className="font-extrabold text-sm">Tema do Aplicativo</p>
              <p className="text-xs text-muted-foreground">Alternar entre claro e escuro</p>
            </div>
            <Button variant="outline" size="sm" className="font-bold" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="w-4 h-4 mr-1.5" /> : <Moon className="w-4 h-4 mr-1.5" />}
              {isDarkMode ? 'Tema Claro' : 'Tema Escuro'}
            </Button>
          </div>

          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-between">
            <div>
              <p className="font-extrabold text-sm text-destructive">Desconectar da Conta</p>
              <p className="text-xs text-muted-foreground">Sair do aplicativo neste aparelho</p>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              className="font-bold cursor-pointer"
              onClick={() => {
                setSettingsModalOpen(false);
                onSignOut?.();
              }}
            >
              <LogOut className="w-4 h-4 mr-1.5" /> Sair
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ConquistasView({ navigateTo, user, userMemberships = [] }: any) {
  const [stats, setStats] = useState({
    totalConfirmed: 0,
    monthAwardsCount: 0,
    loading: true
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) return;
      const approvedIds = userMemberships.filter((m: any) => m.status === 'approved').map((m: any) => m.id);
      
      try {
        let confirmedCount = 0;
        if (approvedIds.length > 0) {
          const { count } = previewData('schedule_members', 'read', undefined, (row: any) => (approvedIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'response') === 'confirmed', { single: false, limit: undefined, order: undefined });
          confirmedCount = count || 0;
        }

        const { count: awardsCount } = previewData('volunteer_of_month', 'read', undefined, (row: any) => getField(row, 'volunteer_id') === user.id, { single: false, limit: undefined, order: undefined });

        setStats({
          totalConfirmed: confirmedCount,
          monthAwardsCount: awardsCount || 0,
          loading: false
        });
      } catch (err) {
        console.error('Erro ao carregar conquistas:', err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    void loadStats();
  }, [user?.id, userMemberships]);

  const xpPerScale = 250;
  const xpPerAward = 1000;
  const totalXp = (stats.totalConfirmed * xpPerScale) + (stats.monthAwardsCount * xpPerAward);
  
  const currentLevel = Math.max(1, Math.floor(totalXp / 1000) + 1);
  const xpInCurrentLevel = totalXp % 1000;
  const xpNeededForNext = 1000;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

  const allBadges = [
    {
      id: 'first-step',
      title: 'Primeiro Passo',
      desc: 'Serviu na sua 1ª escala na igreja',
      icon: <Flame className="w-8 h-8 text-orange-500" />,
      bg: 'bg-orange-500/10',
      unlocked: stats.totalConfirmed >= 1,
      progress: Math.min(1, stats.totalConfirmed),
      max: 1
    },
    {
      id: 'faithful-5',
      title: 'Fiel no Chamado',
      desc: 'Completou 5 escalas servindo',
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      bg: 'bg-blue-500/10',
      unlocked: stats.totalConfirmed >= 5,
      progress: Math.min(5, stats.totalConfirmed),
      max: 5
    },
    {
      id: 'multi-ministry',
      title: 'Coração de Servo',
      desc: 'Participa de 2 ou mais ministérios',
      icon: <Users className="w-8 h-8 text-green-500" />,
      bg: 'bg-green-500/10',
      unlocked: userMemberships.filter((m: any) => m.status === 'approved').length >= 2,
      progress: Math.min(2, userMemberships.filter((m: any) => m.status === 'approved').length),
      max: 2
    },
    {
      id: 'veteran-20',
      title: 'Veterano do Altar',
      desc: 'Completou 20 escalas servindo',
      icon: <Music className="w-8 h-8 text-purple-500" />,
      bg: 'bg-purple-500/10',
      unlocked: stats.totalConfirmed >= 20,
      progress: Math.min(20, stats.totalConfirmed),
      max: 20
    },
    {
      id: 'volunteer-month',
      title: 'Destaque do Mês',
      desc: 'Foi eleito voluntário do mês',
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      bg: 'bg-yellow-500/10',
      unlocked: stats.monthAwardsCount >= 1,
      progress: Math.min(1, stats.monthAwardsCount),
      max: 1
    }
  ];

  const unlockedBadges = allBadges.filter((b: any) => b.unlocked);
  const lockedBadges = allBadges.filter(b => !b.unlocked);

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1000px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="secondary" size="icon" onClick={() => navigateTo('perfil')}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Gamificação</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Suas Conquistas</h1>
        </div>
      </div>

      <Card className="bg-foreground text-background border-foreground mb-10 overflow-hidden relative rounded-3xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-20 translate-x-10"></div>
        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-primary flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Nível</span>
              <span className="text-3xl font-extrabold text-primary">{currentLevel}</span>
            </div>
            <div>
              <p className="text-2xl font-extrabold mb-1">
                {currentLevel === 1 ? 'Voluntário Iniciante' : currentLevel < 4 ? 'Voluntário Dedicado' : 'Líder de Excelência'}
              </p>
              <p className="text-sm font-medium text-muted-foreground max-w-sm">
                Você já completou {stats.totalConfirmed} {stats.totalConfirmed === 1 ? 'escala' : 'escalas'} no altar.
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-72">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              <span>{totalXp} XP</span>
              <span className="text-primary">Faltam {xpNeededForNext - xpInCurrentLevel} XP</span>
            </div>
            <div className="h-4 bg-secondary/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20"></div>
              </div>
            </div>
          </div>
          
        </div>
      </Card>

      <div className="space-y-10">
        <section>
          <SectionHeader title="Desbloqueadas" badge={String(unlockedBadges.length)} />
          {unlockedBadges.length === 0 ? (
            <Card className="p-8 text-center border-dashed rounded-3xl">
              <Trophy className="w-10 h-10 text-muted-foreground opacity-40 mx-auto mb-3" />
              <p className="font-extrabold text-lg">Nenhuma conquista desbloqueada ainda</p>
              <p className="text-sm text-muted-foreground">Confirme presença e sirva nas escalas para conquistar suas primeiras badges!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedBadges.map(badge => (
                <Card key={badge.id} className="text-center p-6 sm:p-8 flex flex-col items-center hover:-translate-y-1 transition-transform rounded-3xl border-border">
                  <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm", badge.bg)}>
                    {badge.icon}
                  </div>
                  <h3 className="font-extrabold text-lg mb-2">{badge.title}</h3>
                  <p className="text-sm font-semibold text-muted-foreground">{badge.desc}</p>
                  <div className="mt-4 pt-4 border-t border-border w-full flex justify-center">
                    <Badge variant="success">Desbloqueada ✓</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {lockedBadges.length > 0 && (
          <section>
            <SectionHeader title="Em Progresso" badge={String(lockedBadges.length)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lockedBadges.map(badge => (
                <Card key={badge.id} className="flex gap-5 p-5 items-center opacity-80 rounded-3xl border-border">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shrink-0 text-muted-foreground border border-border">
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-base mb-1">{badge.title}</h3>
                    <p className="text-xs font-semibold text-muted-foreground mb-4">{badge.desc}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>{badge.progress} / {badge.max}</span>
                        <span>{Math.round((badge.progress / badge.max) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all" 
                          style={{ width: `${(badge.progress / badge.max) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

    </div>
  );
}

// --- NOVO FLUXO DE CADASTRO E MINISTÉRIOS ---

function getMinistryIconComponent(name: string) {
  const normalized = (name || '').toLowerCase()
  if (normalized.includes('louvor') || normalized.includes('música') || normalized.includes('som')) return <Mic className="w-7 h-7" />
  if (normalized.includes('mídia') || normalized.includes('transmissão') || normalized.includes('vídeo') || normalized.includes('projeção')) return <MonitorPlay className="w-7 h-7" />
  if (normalized.includes('comunicação') || normalized.includes('foto') || normalized.includes('marketing')) return <Camera className="w-7 h-7" />
  if (normalized.includes('recepção') || normalized.includes('acolhimento') || normalized.includes('boas-vindas') || normalized.includes('portaria')) return <HeartHandshake className="w-7 h-7" />
  if (normalized.includes('infantil') || normalized.includes('kids') || normalized.includes('jovens')) return <Users className="w-7 h-7" />
  return <Users className="w-7 h-7" />
}

function RegisterView({ onNext, onRegistered }: any) {
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

function SelectMinistryView({ onNext }: any) {
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

    const { error: insertError } = previewData('ministry_members', 'insert', rows, (row: any) => true, { single: false, limit: undefined, order: undefined })

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

function PendingApprovalView({ ministries = [], userMemberships = [], onRefreshMemberships, onSignOut }: any) {
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

function MeusMinisteriosView({ user, userMemberships = [], onRefreshMemberships }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [allMinistries, setAllMinistries] = useState<any[]>([]);
  const [selectedMinistryId, setSelectedMinistryId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const approvedMinistries = userMemberships.filter((m: any) => m.status === 'approved');
  const pendingMinistries = userMemberships.filter((m: any) => m.status === 'pending');

  const existingMinistryIds = userMemberships.map((m: any) => m.ministry_id);
  const availableToJoin = allMinistries.filter((min: any) => !existingMinistryIds.includes(min.id));

  const handleOpenModal = async () => {
    setModalOpen(true);
    setLoading(true);
    try {
      const { data } = previewData('ministries', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['name', {}] });
      setAllMinistries(data || []);
      const available = (data || []).filter((min: any) => !existingMinistryIds.includes(min.id));
      if (available.length > 0) {
        setSelectedMinistryId(available[0].id);
      }
    } catch (err) {
      console.error('Erro ao buscar ministérios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedMinistryId) {
      toast.error('Selecione um ministério.');
      return;
    }
    if (!user?.id) return;

    setSubmitting(true);
    try {
      const { error } = previewData('ministry_members', 'insert', {
          user_id: user.id,
          ministry_id: selectedMinistryId,
          role: 'volunteer',
          status: 'pending'
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      if (error) {
        toast.error('Erro ao solicitar entrada: ' + error.message);
      } else {
        toast.success('Solicitação enviada com sucesso! Aguarde a aprovação do líder.');
        setModalOpen(false);
        onRefreshMemberships?.();
      }
    } catch (err) {
      console.error('Erro ao enviar solicitação:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1000px] mx-auto w-full animate-in fade-in duration-300">
      <div className="mb-10">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Sua Jornada</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold">Meus Ministérios</h1>
      </div>

      <div className="space-y-10">
        <section>
          <SectionHeader title="Ministérios Ativos" badge={String(approvedMinistries.length)} />
          {approvedMinistries.length === 0 ? (
            <Card className="p-8 text-center border-dashed rounded-3xl">
              <Users className="w-10 h-10 text-muted-foreground opacity-40 mx-auto mb-3" />
              <p className="font-extrabold text-lg">Nenhum ministério ativo</p>
              <p className="text-sm text-muted-foreground">Você ainda não faz parte de nenhum ministério aprovado.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {approvedMinistries.map((m: any) => {
                const min = m.ministries;
                const minName = min?.name || 'Ministério';
                const isLeader = m.role === 'leader' || m.role === 'admin';
                return (
                  <Card key={m.id} hoverable className="flex items-center justify-between group p-6 rounded-3xl border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
                        {getMinistryIconComponent(minName)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-xl mb-1">{minName}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="success">Aprovado</Badge>
                          {isLeader && <Badge variant="primary">Líder</Badge>}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {pendingMinistries.length > 0 && (
          <section>
            <SectionHeader title="Solicitações Pendentes" badge={String(pendingMinistries.length)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pendingMinistries.map((m: any) => {
                const min = m.ministries;
                const minName = min?.name || 'Ministério';
                return (
                  <Card key={m.id} className="flex items-center justify-between p-6 rounded-3xl border-border bg-card/60">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-secondary text-foreground rounded-2xl flex items-center justify-center shrink-0 border border-border">
                        {getMinistryIconComponent(minName)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-xl mb-1">{minName}</h3>
                        {m.created_at && (
                          <p className="text-xs font-bold text-muted-foreground mb-1.5">
                            Solicitado em {formatDatePtBR(m.created_at.split('T')[0])}
                          </p>
                        )}
                        <Badge variant="warning">Aguardando aprovação</Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        <div className="pt-10 border-t border-border flex justify-center">
          <Button variant="secondary" size="lg" className="font-extrabold rounded-2xl cursor-pointer" onClick={handleOpenModal}>
            <Users className="w-5 h-5 mr-2" />
            Solicitar entrada em novo ministério
          </Button>
        </div>
      </div>

      {/* Modal de Solicitação de Novo Ministério */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Entrar em um Novo Ministério">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-muted-foreground">
            Escolha o ministério que deseja integrar. Sua solicitação será encaminhada para análise do líder responsável.
          </p>

          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs font-bold text-muted-foreground">Buscando ministérios...</p>
            </div>
          ) : availableToJoin.length === 0 ? (
            <div className="p-6 bg-secondary/30 rounded-2xl text-center border border-dashed border-border">
              <p className="font-extrabold text-sm mb-1">Todos os ministérios solicitados 🎉</p>
              <p className="text-xs font-semibold text-muted-foreground">
                Você já faz parte ou possui solicitação para todos os ministérios disponíveis.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {availableToJoin.map((min: any) => (
                <div
                  key={min.id}
                  onClick={() => setSelectedMinistryId(min.id)}
                  className={cn(
                    "p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all",
                    selectedMinistryId === min.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40 bg-card"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      {getMinistryIconComponent(min.name)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm">{min.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{min.description || 'Ministério da igreja local'}</p>
                    </div>
                  </div>
                  {selectedMinistryId === min.id && (
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1 font-bold" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="flex-1 font-bold" 
              disabled={submitting || availableToJoin.length === 0} 
              onClick={handleSendRequest}
            >
              {submitting ? 'Enviando...' : 'Enviar Solicitação'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// --- ADMIN VIEWS ---

function AdminDashboardView({ navigateTo, user, userProfile, toggleTheme, isDarkMode }: any) {
  const [metrics, setMetrics] = useState({
    upcomingScalesCount: 0,
    pendingConfirmationsCount: 0,
    pendingSwapsCount: 0,
    openSlotsCount: 0,
    loading: true
  });

  const [pendingSwaps, setPendingSwaps] = useState<any[]>([]);
  const [openSlots, setOpenSlots] = useState<any[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<any[]>([]);
  const [volunteerMonth, setVolunteerMonth] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  const firstName = userProfile?.full_name?.split(' ')[0] || 'Líder';

  const loadAdminDashboard = async () => {
    setLoadingData(true);
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      // 1. Escalas futuras
      const { count: upcomingCount } = previewData('schedules', 'read', undefined, (row: any) => getField(row, 'date') >= todayStr, { single: false, limit: undefined, order: undefined });

      // 2. Confirmações pendentes
      const { count: pendingConf } = previewData('schedule_members', 'read', undefined, (row: any) => getField(row, 'response') === 'pending', { single: false, limit: undefined, order: undefined });

      // 3. Trocas pendentes
      const { data: swapsData } = previewData('schedule_swap_requests', 'read', undefined, (row: any) => getField(row, 'status') === 'pending', { single: false, limit: undefined, order: ['created_at', { ascending: false }] });

      setPendingSwaps(swapsData || []);

      // 4. Vagas abertas em escalas futuras
      const { data: openSlotsData } = previewData('schedule_members', 'read', undefined, (row: any) => getField(row, 'ministry_member_id') === null && getField(row, 'schedules.date') >= todayStr, { single: false, limit: 3, order: ['schedules(date)', { ascending: true }] });

      setOpenSlots(openSlotsData || []);

      // 5. Próximas escalas detalhadas
      const { data: schedulesList } = previewData('schedules', 'read', undefined, (row: any) => getField(row, 'date') >= todayStr, { single: false, limit: 4, order: ['date', { ascending: true }] });

      setUpcomingSchedules(schedulesList || []);

      // 6. Voluntário do Mês
      const now = new Date();
      const { data: volMonth } = previewData('volunteer_of_month', 'read', undefined, (row: any) => getField(row, 'month') === now.getMonth() + 1 && getField(row, 'year') === now.getFullYear(), { single: true, limit: undefined, order: undefined });

      setVolunteerMonth(volMonth);

      setMetrics({
        upcomingScalesCount: upcomingCount || 0,
        pendingConfirmationsCount: pendingConf || 0,
        pendingSwapsCount: (swapsData || []).length,
        openSlotsCount: (openSlotsData || []).length,
        loading: false
      });
    } catch (err) {
      console.error('Erro ao carregar Dashboard Admin:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    void loadAdminDashboard();
  }, []);

  const handleApproveSwap = async (swap: any) => {
    try {
      const { error: swapError } = previewData('schedule_swap_requests', 'update', { status: 'approved' }, (row: any) => getField(row, 'id') === swap.id, { single: false, limit: undefined, order: undefined });

      if (swapError) throw swapError;

      if (swap.target_member_id && swap.schedule_member_id) {
        previewData('schedule_members', 'update', {
            ministry_member_id: swap.target_member_id,
            response: 'confirmed',
            response_at: new Date().toISOString()
          }, (row: any) => getField(row, 'id') === swap.schedule_member_id, { single: false, limit: undefined, order: undefined });
      } else if (swap.schedule_member_id) {
        previewData('schedule_members', 'update', {
            ministry_member_id: null,
            response: 'pending',
            response_at: null
          }, (row: any) => getField(row, 'id') === swap.schedule_member_id, { single: false, limit: undefined, order: undefined });
      }

      toast.success('Troca aprovada com sucesso!');
      void loadAdminDashboard();
    } catch (err: any) {
      toast.error('Erro ao aprovar troca: ' + err.message);
    }
  };

  const handleRejectSwap = async (swapId: string) => {
    try {
      const { error } = previewData('schedule_swap_requests', 'update', { status: 'rejected' }, (row: any) => getField(row, 'id') === swapId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.info('Solicitação de troca recusada.');
      void loadAdminDashboard();
    } catch (err: any) {
      toast.error('Erro ao recusar troca: ' + err.message);
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Painel da Liderança
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Olá, {firstName} 👋</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="font-bold" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="w-4 h-4 mr-1.5" /> : <Moon className="w-4 h-4 mr-1.5" />}
            {isDarkMode ? 'Tema Claro' : 'Tema Escuro'}
          </Button>
          <Button variant="primary" size="sm" className="font-bold" onClick={() => navigateTo('admin_escala_create')}>
            <Plus className="w-4 h-4 mr-1.5" /> Nova Escala
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <Card 
          hoverable 
          onClick={() => navigateTo('admin_escalas')}
          className="p-6 bg-gradient-to-br from-card to-secondary/30 rounded-3xl border-border cursor-pointer"
        >
          <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-4">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold mb-1">{metrics.upcomingScalesCount}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Escalas Próximas</p>
        </Card>
        
        <Card 
          hoverable 
          onClick={() => navigateTo('admin_escalas')}
          className="p-6 bg-gradient-to-br from-card to-secondary/30 rounded-3xl border-border cursor-pointer"
        >
          <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold mb-1">{metrics.pendingConfirmationsCount}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Confirmações Pendentes</p>
        </Card>

        <Card 
          hoverable 
          onClick={() => navigateTo('admin_solicitacoes')}
          className="p-6 bg-gradient-to-br from-card to-secondary/30 rounded-3xl border-border cursor-pointer"
        >
          <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold mb-1">{metrics.pendingSwapsCount}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Trocas Pendentes</p>
        </Card>

        <Card 
          hoverable 
          onClick={() => navigateTo('admin_escalas')}
          className="p-6 bg-gradient-to-br from-card to-secondary/30 border-red-500/30 rounded-3xl cursor-pointer"
        >
          <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold mb-1 text-red-500">{metrics.openSlotsCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Vagas em Aberto</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Column - Pendências e Próximas */}
        <div className="lg:col-span-8 space-y-8">
          
          <section>
            <SectionHeader 
              title="Pendências Urgentes" 
              badge={String(pendingSwaps.length + openSlots.length)} 
            />
            <div className="space-y-4 mt-4">
              {pendingSwaps.length === 0 && openSlots.length === 0 ? (
                <Card className="p-8 text-center border-dashed rounded-3xl">
                  <CheckCircle2 className="w-10 h-10 text-green-500 opacity-60 mx-auto mb-3" />
                  <p className="font-extrabold text-base">Tudo sob controle!</p>
                  <p className="text-xs text-muted-foreground">Não há pedidos de troca ou vagas abertas pendentes.</p>
                </Card>
              ) : (
                <>
                  {pendingSwaps.map((swap: any) => {
                    const reqName = swap.requester?.profiles?.full_name || 'Voluntário';
                    const targetName = swap.target?.profiles?.full_name;
                    const sc = swap.schedule_members?.schedules;
                    return (
                      <Card key={swap.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-orange-500/30 rounded-3xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                            <ArrowRightLeft className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-base mb-0.5">Pedido de Troca</h4>
                            <p className="text-sm font-semibold text-muted-foreground">
                              <strong className="text-foreground">{reqName}</strong> solicitou troca para o culto{' '}
                              <strong>{sc?.title || 'Culto'}</strong> ({sc?.date ? formatDatePtBR(sc.date) : ''}).
                              {targetName && <span className="block text-xs mt-0.5 text-primary">Indicou substituto: {targetName}</span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto shrink-0">
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none font-bold" onClick={() => handleRejectSwap(swap.id)}>
                            Recusar
                          </Button>
                          <Button size="sm" className="flex-1 sm:flex-none font-bold" onClick={() => handleApproveSwap(swap)}>
                            Aprovar
                          </Button>
                        </div>
                      </Card>
                    );
                  })}

                  {openSlots.map((os: any) => {
                    const s = os.schedules;
                    const roleName = os.ministry_roles?.name || 'Voluntário';
                    return (
                      <Card key={os.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-red-500/30 rounded-3xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                            <Flame className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-base mb-0.5 text-red-500">Vaga Aberta</h4>
                            <p className="text-sm font-semibold text-muted-foreground">
                              Falta 1 <strong>{roleName}</strong> na escala de {s?.ministries?.name || 'Ministério'} ({s?.title} - {s?.date ? formatDatePtBR(s.date) : ''}).
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full sm:w-auto font-bold cursor-pointer"
                          onClick={() => navigateTo('admin_escalas')}
                        >
                          Ver escala
                        </Button>
                      </Card>
                    );
                  })}
                </>
              )}
            </div>
          </section>

          <section>
            <SectionHeader title="Próximas Escalas" />
            <div className="space-y-4 mt-4">
              {upcomingSchedules.length === 0 ? (
                <Card className="p-8 text-center border-dashed rounded-3xl">
                  <Calendar className="w-10 h-10 text-muted-foreground opacity-40 mx-auto mb-3" />
                  <p className="font-extrabold text-base">Nenhuma escala agendada</p>
                  <p className="text-xs text-muted-foreground">Crie uma nova escala para o próximo culto da igreja.</p>
                </Card>
              ) : (
                upcomingSchedules.map((escala: any) => {
                  const members = escala.schedule_members || [];
                  const openCount = members.filter((m: any) => !m.ministry_member_id).length;
                  const isComplete = openCount === 0 && members.length > 0;

                  return (
                    <Card 
                      key={escala.id} 
                      hoverable
                      onClick={() => navigateTo('admin_escalas')}
                      className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-primary/50 cursor-pointer rounded-3xl border-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-secondary rounded-2xl flex flex-col items-center justify-center shrink-0 border border-border">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">
                            {formatDatePtBR(escala.date).split(' ')[1] || 'MÊS'}
                          </span>
                          <span className="text-lg font-extrabold leading-none">
                            {formatDatePtBR(escala.date).split(' ')[0] || '01'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-base mb-1">{escala.title || 'Culto de Celebração'}</h4>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            {escala.ministries?.name || 'Geral'} <span className="w-1 h-1 bg-border rounded-full"></span> {formatTimePtBR(escala.start_time)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
                        <div className="flex -space-x-2">
                          {members.slice(0, 4).map((m: any, i: number) => (
                            <Avatar 
                              key={m.id || i} 
                              src={m.ministry_members?.profiles?.avatar_url} 
                              fallback={m.ministry_members?.profiles?.full_name?.charAt(0) || '?'} 
                              size="sm" 
                              className="border-2 border-card" 
                            />
                          ))}
                        </div>
                        <Badge variant={isComplete ? 'success' : 'warning'}>
                          {isComplete ? 'Completa' : `${openCount} vaga(s)`}
                        </Badge>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Voluntário do Mês */}
        <div className="lg:col-span-4 space-y-8">
          <section>
            <SectionHeader title="Destaque do Mês" />
            <Card className="text-center p-8 bg-gradient-to-b from-card to-secondary/30 rounded-3xl border-border mt-4">
              <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 relative">
                <Trophy className="w-10 h-10 text-primary" />
                <div className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-full border border-border">
                  <Award className="w-4 h-4 text-primary" />
                </div>
              </div>

              {volunteerMonth ? (
                <div>
                  <h3 className="font-extrabold text-xl mb-1">{volunteerMonth.profiles?.full_name}</h3>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                    {volunteerMonth.ministries?.name || 'Ministério'}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground italic mb-6">
                    "{volunteerMonth.reason || 'Destaque pelo serviço com excelência.'}"
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="font-extrabold text-xl mb-2">Voluntário do Mês</h3>
                  <p className="text-sm font-medium text-muted-foreground mb-6">
                    Reconheça e honre o voluntário destaque deste mês na igreja!
                  </p>
                </div>
              )}

              <Button 
                className="w-full font-bold cursor-pointer"
                onClick={() => navigateTo('admin_voluntarios')}
              >
                <Users className="w-4 h-4 mr-2" /> Gerenciar Voluntários
              </Button>
            </Card>
          </section>
        </div>

      </div>
    </div>
  );
}

// --- ADMIN MINISTRIES ---



function AdminMinisteriosView({ navigateTo }: any) {
  const [ministries, setMinistries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎵');
  const [color, setColor] = useState('#C6FF4D');
  const [submitting, setSubmitting] = useState(false);

  const loadMinistries = async () => {
    setLoading(true);
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      const { data, error } = previewData('ministries', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['name', {}] });

      if (error) throw error;

      const formatted = (data || []).map((m: any) => {
        const approvedCount = (m.ministry_members || []).filter((mm: any) => mm.status === 'approved').length;
        const upcomingCount = (m.schedules || []).filter((s: any) => s.date >= todayStr).length;
        return {
          ...m,
          membersCount: approvedCount,
          upcomingScalesCount: upcomingCount
        };
      });

      setMinistries(formatted);
    } catch (err) {
      console.error('Erro ao carregar ministérios:', err);
      toast.error('Erro ao carregar lista de ministérios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMinistries();
  }, []);

  const handleCreateMinistry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Informe o nome do ministério.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = previewData('ministries', 'insert', {
          name: name.trim(),
          description: description.trim() || null,
          icon: icon.trim() || 'Users',
          color: color.trim() || '#C6FF4D'
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success('Ministério criado com sucesso!');
      setCreateModalOpen(false);
      setName('');
      setDescription('');
      void loadMinistries();
    } catch (err: any) {
      toast.error('Erro ao criar ministério: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Painel de Controle
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Ministérios</h1>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="font-bold cursor-pointer">
          <Plus className="w-5 h-5 mr-1.5" /> Criar ministério
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Carregando ministérios...</p>
        </div>
      ) : ministries.length === 0 ? (
        <Card className="p-12 text-center border-dashed rounded-3xl">
          <Users className="w-12 h-12 text-muted-foreground opacity-40 mx-auto mb-3" />
          <h3 className="font-extrabold text-xl mb-1">Nenhum ministério cadastrado</h3>
          <p className="text-sm text-muted-foreground mb-6">Crie o primeiro ministério da igreja para começar a montar as escalas.</p>
          <Button onClick={() => setCreateModalOpen(true)} className="font-bold">
            <Plus className="w-4 h-4 mr-1.5" /> Criar Ministério
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ministries.map(m => (
            <Card 
              key={m.id} 
              hoverable 
              onClick={() => navigateTo('admin_ministerio_detalhes', m)} 
              className="flex flex-col h-full cursor-pointer hover:-translate-y-1 transition-transform rounded-3xl border-border p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-primary bg-primary/20 shadow-sm shrink-0 border border-primary/20">
                  {getMinistryIconComponent(m.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-xl truncate">{m.name}</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest truncate">
                    {m.description || 'Ministério da igreja'}
                  </p>
                </div>
              </div>
              
              <div className="mt-auto pt-6 grid grid-cols-2 gap-4 border-t border-border">
                <div>
                  <p className="text-2xl font-extrabold mb-0.5">{m.membersCount}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Membros Ativos</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold mb-0.5">{m.upcomingScalesCount}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Escalas Próximas</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Criação de Ministério */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Novo Ministério">
        <form onSubmit={handleCreateMinistry} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Nome do Ministério *
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary" 
              placeholder="Ex: Louvor e Adoração" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Descrição / Propósito
            </label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary" 
              placeholder="Ex: Equipe de músicos, vocais e instrumentistas..." 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Ícone / Emoji
              </label>
              <input 
                type="text" 
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="🎵" 
                maxLength={4} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Cor Temática
              </label>
              <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-2xl px-4 py-3">
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-6 h-6 rounded-lg cursor-pointer bg-transparent border-0 p-0" 
                />
                <input 
                  type="text" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold focus:outline-none" 
                  placeholder="#C6FF4D" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="secondary" className="flex-1 font-bold" onClick={() => setCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar Ministério'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function AdminMinisterioDetalhesView({ ministry, navigateTo }: any) {
  const [activeTab, setActiveTab] = useState<'funcoes' | 'membros' | 'escalas'>('funcoes');
  const [roles, setRoles] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Role Modal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [submittingRole, setSubmittingRole] = useState(false);

  // Edit Ministry Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(ministry?.name || '');
  const [description, setDescription] = useState(ministry?.description || '');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const loadMinistryDetails = async () => {
    if (!ministry?.id) return;
    setLoading(true);

    try {
      // 1. Carregar Funções
      const { data: rolesData } = previewData('ministry_roles', 'read', undefined, (row: any) => getField(row, 'ministry_id') === ministry.id, { single: false, limit: undefined, order: ['name', {}] });

      setRoles(rolesData || []);

      // 2. Carregar Membros
      const { data: membersData } = previewData('ministry_members', 'read', undefined, (row: any) => getField(row, 'ministry_id') === ministry.id, { single: false, limit: undefined, order: ['created_at', { ascending: false }] });

      setMembers(membersData || []);

      // 3. Carregar Escalas
      const { data: schedulesData } = previewData('schedules', 'read', undefined, (row: any) => getField(row, 'ministry_id') === ministry.id, { single: false, limit: 10, order: ['date', { ascending: false }] });

      setSchedules(schedulesData || []);
    } catch (err) {
      console.error('Erro ao carregar detalhes do ministério:', err);
      toast.error('Erro ao carregar dados do ministério.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMinistryDetails();
  }, [ministry?.id]);

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim() || !ministry?.id) return;

    setSubmittingRole(true);
    try {
      const { error } = previewData('ministry_roles', 'insert', {
          ministry_id: ministry.id,
          name: newRoleName.trim()
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success('Função adicionada com sucesso!');
      setIsRoleModalOpen(false);
      setNewRoleName('');
      void loadMinistryDetails();
    } catch (err: any) {
      toast.error('Erro ao criar função: ' + err.message);
    } finally {
      setSubmittingRole(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      const { error } = previewData('ministry_roles', 'delete', undefined, (row: any) => getField(row, 'id') === roleId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success('Função removida!');
      setRoles(prev => prev.filter(r => r.id !== roleId));
    } catch (err: any) {
      toast.error('Erro ao remover função: ' + err.message);
    }
  };

  const handleToggleMemberRole = async (memberId: string, currentRole: string) => {
    const newRole = currentRole === 'leader' ? 'volunteer' : 'leader';
    try {
      const { error } = previewData('ministry_members', 'update', { role: newRole }, (row: any) => getField(row, 'id') === memberId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success(newRole === 'leader' ? 'Membro promovido a Líder!' : 'Papel alterado para Voluntário.');
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    } catch (err: any) {
      toast.error('Erro ao alterar papel do membro: ' + err.message);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = previewData('ministry_members', 'delete', undefined, (row: any) => getField(row, 'id') === memberId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success('Membro removido do ministério.');
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err: any) {
      toast.error('Erro ao remover membro: ' + err.message);
    }
  };

  const handleSaveMinistryEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ministry?.id) return;

    setSubmittingEdit(true);
    try {
      const { error } = previewData('ministries', 'update', {
          name: name.trim(),
          description: description.trim() || null
        }, (row: any) => getField(row, 'id') === ministry.id, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success('Ministério atualizado com sucesso!');
      setIsEditModalOpen(false);
      ministry.name = name.trim();
      ministry.description = description.trim();
    } catch (err: any) {
      toast.error('Erro ao atualizar ministério: ' + err.message);
    } finally {
      setSubmittingEdit(false);
    }
  };

  if (!ministry) {
    return (
      <div className="p-10 text-center">
        <p className="text-muted-foreground font-bold">Nenhum ministério selecionado.</p>
        <Button onClick={() => navigateTo('admin_ministerios')} className="mt-4">
          Voltar para Ministérios
        </Button>
      </div>
    );
  }

  const tabs: Array<{ id: 'funcoes' | 'membros' | 'escalas'; label: string; count?: number }> = [
    { id: 'funcoes', label: 'Funções / Posições', count: roles.length },
    { id: 'membros', label: 'Membros da Equipe', count: members.length },
    { id: 'escalas', label: 'Escalas do Ministério', count: schedules.length }
  ];

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="icon" className="cursor-pointer" onClick={() => navigateTo('admin_ministerios')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-primary bg-primary/20 shadow-sm shrink-0 border border-primary/20">
              {getMinistryIconComponent(ministry.name)}
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Gerenciar Ministério</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{ministry.name}</h1>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="font-bold cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
          <Edit2 className="w-4 h-4 mr-2" /> Editar ministério
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3">
          <Card className="p-2 sticky top-6 rounded-3xl border-border">
            <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto hide-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 lg:flex-none text-left px-4 py-3 rounded-2xl font-bold transition-all whitespace-nowrap text-sm flex items-center justify-between cursor-pointer",
                    activeTab === tab.id 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-md ml-2 font-black",
                      activeTab === tab.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Tab Content Area */}
        <div className="lg:col-span-9">
          {activeTab === 'funcoes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold">Funções do Ministério</h2>
                  <p className="text-sm font-semibold text-muted-foreground mt-1">
                    Posições e papéis necessários para escalar nesta equipe.
                  </p>
                </div>
                <Button onClick={() => setIsRoleModalOpen(true)} className="font-bold cursor-pointer w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-1.5" /> Nova Função
                </Button>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : roles.length === 0 ? (
                <Card className="p-8 text-center border-dashed rounded-3xl">
                  <Layers className="w-10 h-10 text-muted-foreground opacity-40 mx-auto mb-3" />
                  <p className="font-extrabold text-base">Nenhuma função configurada</p>
                  <p className="text-xs text-muted-foreground mb-4">Adicione funções como "Vocal", "Teclado", "Câmera" para criar escalas.</p>
                  <Button onClick={() => setIsRoleModalOpen(true)} size="sm">
                    <Plus className="w-4 h-4 mr-1.5" /> Adicionar Função
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roles.map((r: any) => (
                    <Card key={r.id} className="p-4 sm:p-5 flex items-center justify-between group rounded-3xl border-border">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-11 h-11 bg-secondary rounded-2xl flex items-center justify-center shrink-0 font-black text-primary border border-border">
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-extrabold text-base truncate">{r.name}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteRole(r.id)}
                        className="w-9 h-9 bg-destructive/10 text-destructive rounded-xl flex items-center justify-center hover:bg-destructive/20 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'membros' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold">Membros da Equipe</h2>
                <p className="text-sm font-semibold text-muted-foreground mt-1">
                  Voluntários e líderes cadastrados neste ministério.
                </p>
              </div>

              {members.length === 0 ? (
                <Card className="p-8 text-center border-dashed rounded-3xl">
                  <Users className="w-10 h-10 text-muted-foreground opacity-40 mx-auto mb-3" />
                  <p className="font-extrabold text-base">Nenhum membro ativo</p>
                  <p className="text-xs text-muted-foreground">Voluntários que solicitarem entrada aparecerão aqui.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {members.map(m => {
                    const profile = m.profiles;
                    const isLeader = m.role === 'leader';
                    return (
                      <Card key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border-border">
                        <div className="flex items-center gap-4">
                          <Avatar 
                            src={profile?.avatar_url} 
                            fallback={profile?.full_name?.charAt(0) || 'V'}
                            size="md" 
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-extrabold text-base">{profile?.full_name || 'Voluntário'}</p>
                              <Badge variant={isLeader ? 'primary' : 'secondary'}>
                                {isLeader ? 'Líder' : 'Voluntário'}
                              </Badge>
                            </div>
                            {profile?.phone && (
                              <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                                {profile.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="font-bold text-xs"
                            onClick={() => handleToggleMemberRole(m.id, m.role)}
                          >
                            {isLeader ? 'Tornar Voluntário' : 'Promover a Líder'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive border-destructive/20 hover:bg-destructive/10"
                            onClick={() => handleRemoveMember(m.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'escalas' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold">Escalas do Ministério</h2>
                  <p className="text-sm font-semibold text-muted-foreground mt-1">
                    Cultos e eventos agendados para esta equipe.
                  </p>
                </div>
                <Button onClick={() => navigateTo('admin_escala_create')} className="font-bold cursor-pointer">
                  <Plus className="w-4 h-4 mr-1.5" /> Criar Escala
                </Button>
              </div>

              {schedules.length === 0 ? (
                <Card className="p-8 text-center border-dashed rounded-3xl">
                  <Calendar className="w-10 h-10 text-muted-foreground opacity-40 mx-auto mb-3" />
                  <p className="font-extrabold text-base">Nenhuma escala cadastrada</p>
                  <p className="text-xs text-muted-foreground mb-4">Crie a primeira escala para este ministério.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {schedules.map(sc => (
                    <Card key={sc.id} className="p-4 flex items-center justify-between rounded-3xl border-border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary rounded-2xl flex flex-col items-center justify-center shrink-0 border border-border">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">{formatDatePtBR(sc.date).split(' ')[1]}</span>
                          <span className="text-base font-extrabold">{formatDatePtBR(sc.date).split(' ')[0]}</span>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-base">{sc.title || 'Culto de Celebração'}</h4>
                          <p className="text-xs text-muted-foreground font-semibold">
                            {formatTimePtBR(sc.start_time)} • {(sc.schedule_members || []).length} posições
                          </p>
                        </div>
                      </div>
                      <Badge variant={sc.status === 'published' ? 'success' : 'secondary'}>
                        {sc.status === 'published' ? 'Publicada' : 'Rascunho'}
                      </Badge>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova Função */}
      <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} title="Nova Função no Ministério">
        <form onSubmit={handleAddRole} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Nome da Função / Posição *
            </label>
            <input 
              type="text" 
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary"
              placeholder="Ex: Teclado, Câmera 1, Recepção Principal" 
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="secondary" className="flex-1 font-bold" onClick={() => setIsRoleModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold" disabled={submittingRole}>
              {submittingRole ? 'Salvando...' : 'Adicionar Função'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar Ministério */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Ministério">
        <form onSubmit={handleSaveMinistryEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Nome do Ministério *
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Descrição
            </label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary" 
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="secondary" className="flex-1 font-bold" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold" disabled={submittingEdit}>
              {submittingEdit ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// --- ADMIN ESCALAS ---

function AdminEscalasView({ navigateTo }: any) {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [ministries, setMinistries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedMinistryId, setSelectedMinistryId] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedFill, setSelectedFill] = useState('Todos');

  const loadAdminEscalas = async () => {
    setLoading(true);
    try {
      // 1. Carregar Ministérios
      const { data: minList } = previewData('ministries', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['name', {}] });

      setMinistries(minList || []);

      // 2. Carregar Escalas
      const { data: schedulesData, error } = previewData('schedules', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['date', { ascending: false }] });

      if (error) throw error;
      setSchedules(schedulesData || []);
    } catch (err) {
      console.error('Erro ao carregar escalas:', err);
      toast.error('Erro ao carregar lista de escalas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAdminEscalas();
  }, []);

  const handleTogglePublish = async (scheduleId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const { error } = previewData('schedules', 'update', { status: nextStatus }, (row: any) => getField(row, 'id') === scheduleId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success(nextStatus === 'published' ? 'Escala publicada aos voluntários!' : 'Escala retornada a rascunho.');
      setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, status: nextStatus } : s));
    } catch (err: any) {
      toast.error('Erro ao alterar status da escala: ' + err.message);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta escala?')) return;
    try {
      const { error } = previewData('schedules', 'delete', undefined, (row: any) => getField(row, 'id') === scheduleId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success('Escala excluída com sucesso.');
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    } catch (err: any) {
      toast.error('Erro ao excluir escala: ' + err.message);
    }
  };

  // Filtered schedules
  const filteredSchedules = schedules.filter(s => {
    if (selectedMinistryId !== 'Todos' && s.ministries?.id !== selectedMinistryId) return false;
    if (selectedStatus !== 'Todos' && s.status !== selectedStatus) return false;
    
    const members = s.schedule_members || [];
    const openSlots = members.filter((m: any) => !m.ministry_member_id).length;
    const isComplete = openSlots === 0 && members.length > 0;

    if (selectedFill === 'Completas' && !isComplete) return false;
    if (selectedFill === 'Vagas' && (isComplete || members.length === 0)) return false;

    return true;
  });

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Gerenciamento
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Escalas de Culto</h1>
        </div>
        <Button onClick={() => navigateTo('admin_escala_create')} className="font-bold cursor-pointer">
          <Plus className="w-5 h-5 mr-1.5" /> Nova Escala
        </Button>
      </div>

      {/* Filter Card */}
      <Card className="mb-8 p-4 bg-secondary/30 flex flex-col sm:flex-row gap-4 border border-border rounded-3xl">
        <div className="flex-1">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
            Ministério
          </label>
          <select 
            value={selectedMinistryId} 
            onChange={(e) => setSelectedMinistryId(e.target.value)}
            className="w-full h-11 bg-background border border-border rounded-2xl px-3 text-sm font-bold focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos os Ministérios</option>
            {ministries.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
            Status de Publicação
          </label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full h-11 bg-background border border-border rounded-2xl px-3 text-sm font-bold focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos os Status</option>
            <option value="published">Publicadas</option>
            <option value="draft">Rascunhos</option>
            <option value="completed">Concluídas</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
            Preenchimento
          </label>
          <select 
            value={selectedFill} 
            onChange={(e) => setSelectedFill(e.target.value)}
            className="w-full h-11 bg-background border border-border rounded-2xl px-3 text-sm font-bold focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todas as Escalas</option>
            <option value="Completas">Completas (Sem Vagas)</option>
            <option value="Vagas">Com Vagas Abertas</option>
          </select>
        </div>
      </Card>

      {/* Schedules List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Carregando escalas...</p>
        </div>
      ) : filteredSchedules.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed rounded-3xl">
          <Calendar className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-extrabold text-xl mb-2">Nenhuma escala encontrada</h3>
          <p className="text-muted-foreground font-semibold text-sm max-w-sm mb-6">
            Não existem escalas que correspondam aos filtros selecionados.
          </p>
          <Button onClick={() => navigateTo('admin_escala_create')} className="font-bold">
            <Plus className="w-4 h-4 mr-1.5" /> Criar Primeira Escala
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSchedules.map(escala => {
            const members = escala.schedule_members || [];
            const openSlots = members.filter((m: any) => !m.ministry_member_id).length;
            const confirmedCount = members.filter((m: any) => m.response === 'confirmed').length;
            const isComplete = openSlots === 0 && members.length > 0;
            const isPublished = escala.status === 'published';

            return (
              <Card key={escala.id} className="p-0 overflow-hidden flex flex-col md:flex-row group rounded-3xl border-border">
                {/* Date Block */}
                <div className="bg-secondary/30 md:w-36 p-5 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-border shrink-0">
                  <div className="flex flex-col md:items-start">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {formatDatePtBR(escala.date).split(' ')[1] || 'MÊS'}
                    </span>
                    <span className="text-3xl font-extrabold">
                      {formatDatePtBR(escala.date).split(' ')[0] || '01'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-muted-foreground md:mt-2">
                    {formatTimePtBR(escala.start_time)}
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="px-2 py-0 text-[10px] font-bold">
                        {escala.ministries?.name || 'Geral'}
                      </Badge>
                      <Badge variant={isPublished ? 'success' : 'secondary'} className="px-2 py-0 text-[10px] font-bold">
                        {isPublished ? 'Publicada' : 'Rascunho'}
                      </Badge>
                      <Badge 
                        variant={isComplete ? 'success' : openSlots > 0 ? 'warning' : 'secondary'} 
                        className="px-2 py-0 text-[10px] font-bold"
                      >
                        {isComplete ? 'Completa' : `${openSlots} vaga(s) aberta(s)`}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-extrabold mb-3">{escala.title || 'Culto de Celebração'}</h3>

                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {members.filter((m: any) => m.ministry_member_id).slice(0, 5).map((m: any, i: number) => {
                          const p = m.ministry_members?.profiles;
                          return (
                            <Avatar 
                              key={m.id || i} 
                              src={p?.avatar_url} 
                              fallback={p?.full_name?.charAt(0) || 'V'} 
                              size="sm" 
                              className="border-2 border-card" 
                            />
                          );
                        })}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">
                        {confirmedCount} de {members.length} confirmados
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t sm:border-t-0 border-border pt-4 sm:pt-0 shrink-0">
                    <Button 
                      variant={isPublished ? "outline" : "primary"} 
                      size="sm" 
                      className="font-bold text-xs cursor-pointer"
                      onClick={() => handleTogglePublish(escala.id, escala.status)}
                    >
                      {isPublished ? 'Despublicar' : 'Publicar'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="w-9 h-9 cursor-pointer"
                      onClick={() => navigateTo('detalhes', escala)}
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="w-9 h-9 bg-destructive/10 border-transparent hover:bg-destructive/20 cursor-pointer"
                      onClick={() => handleDeleteSchedule(escala.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminEscalaCreateView({ navigateTo }: any) {
  const [step, setStep] = useState(1);
  const [ministries, setMinistries] = useState<any[]>([]);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const [allSongs, setAllSongs] = useState<any[]>([]);
  const [songSearch, setSongSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedMinistryId, setSelectedMinistryId] = useState('');
  const [title, setTitle] = useState('Culto de Celebração');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('21:00');
  const [location, setLocation] = useState('Templo Principal');

  // Slots: array of { roleId, roleName, memberId, memberName }
  const [slots, setSlots] = useState<Array<{ roleId: string; roleName: string; memberId: string; memberName: string }>>([]);

  // Selected Song IDs
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { data: minList } = previewData('ministries', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['name', {}] });
        setMinistries(minList || []);
        if (minList && minList.length > 0) {
          setSelectedMinistryId(minList[0].id);
        }

        const { data: songsData } = previewData('songs', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['title', {}] });
        setAllSongs(songsData || []);
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
      }
    };

    void loadInitialData();
  }, []);

  // When selectedMinistryId changes, load its roles and members
  useEffect(() => {
    if (!selectedMinistryId) return;

    const loadMinistryRolesAndMembers = async () => {
      try {
        const { data: rolesData } = previewData('ministry_roles', 'read', undefined, (row: any) => getField(row, 'ministry_id') === selectedMinistryId, { single: false, limit: undefined, order: ['name', {}] });

        setAvailableRoles(rolesData || []);

        const { data: membersData } = previewData('ministry_members', 'read', undefined, (row: any) => getField(row, 'ministry_id') === selectedMinistryId && getField(row, 'status') === 'approved', { single: false, limit: undefined, order: undefined });

        setAvailableMembers(membersData || []);

        // Pre-fill initial slots from existing roles
        if (rolesData && rolesData.length > 0) {
          setSlots(rolesData.map((r: any) => ({
            roleId: r.id,
            roleName: r.name,
            memberId: '',
            memberName: ''
          })));
        } else {
          setSlots([]);
        }
      } catch (err) {
        console.error('Erro ao carregar funções do ministério:', err);
      }
    };

    void loadMinistryRolesAndMembers();
  }, [selectedMinistryId]);

  const handleAddSlot = () => {
    const firstRole = availableRoles.length > 0 ? availableRoles[0] : null;
    setSlots(prev => [
      ...prev,
      {
        roleId: firstRole?.id || '',
        roleName: firstRole?.name || 'Função',
        memberId: '',
        memberName: ''
      }
    ]);
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSlotRoleChange = (index: number, roleId: string) => {
    const roleObj = availableRoles.find(r => r.id === roleId);
    setSlots(prev => prev.map((s, i) => i === index ? {
      ...s,
      roleId,
      roleName: roleObj?.name || s.roleName
    } : s));
  };

  const handleSlotMemberChange = (index: number, memberId: string) => {
    const memberObj = availableMembers.find(m => m.id === memberId);
    setSlots(prev => prev.map((s, i) => i === index ? {
      ...s,
      memberId,
      memberName: memberObj?.profiles?.full_name || ''
    } : s));
  };

  const toggleSongSelection = (songId: string) => {
    setSelectedSongIds(prev => 
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    );
  };

  const handlePublish = async (asDraft = false) => {
    if (!selectedMinistryId) {
      toast.error('Selecione um ministério.');
      return;
    }
    if (!date) {
      toast.error('Selecione uma data para a escala.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Inserir Escala
      const { data: newSchedule, error: sError } = previewData('schedules', 'insert', {
          ministry_id: selectedMinistryId,
          title: title.trim() || 'Culto de Celebração',
          date: date,
          start_time: startTime,
          end_time: endTime || null,
          location: location.trim() || 'Templo Principal',
          status: asDraft ? 'draft' : 'published'
        }, (row: any) => true, { single: true, limit: undefined, order: undefined });

      if (sError) throw sError;

      // 2. Inserir Membros da Escala
      if (slots.length > 0) {
        const memberRows = slots.map(s => ({
          schedule_id: newSchedule.id,
          role_id: s.roleId || null,
          ministry_member_id: s.memberId || null,
          response: 'pending'
        }));

        const { error: smError } = previewData('schedule_members', 'insert', memberRows, (row: any) => true, { single: false, limit: undefined, order: undefined });

        if (smError) throw smError;
      }

      // 3. Inserir Músicas da Escala
      if (selectedSongIds.length > 0) {
        const songRows = selectedSongIds.map((songId, idx) => ({
          schedule_id: newSchedule.id,
          song_id: songId,
          position: idx + 1
        }));

        const { error: songsError } = previewData('schedule_songs', 'insert', songRows, (row: any) => true, { single: false, limit: undefined, order: undefined });

        if (songsError) throw songsError;
      }

      toast.success(asDraft ? 'Escala salva como rascunho!' : 'Escala publicada com sucesso!');
      navigateTo('admin_escalas');
    } catch (err: any) {
      console.error('Erro ao salvar escala:', err);
      toast.error('Erro ao criar escala: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMinistry = ministries.find(m => m.id === selectedMinistryId);
  const filteredSongs = allSongs.filter(s => 
    s.title.toLowerCase().includes(songSearch.toLowerCase()) || 
    (s.artist && s.artist.toLowerCase().includes(songSearch.toLowerCase()))
  );

  return (
    <div className="flex flex-col lg:flex-row h-full animate-in fade-in duration-300">
      
      {/* Wizard Sidebar */}
      <div className="lg:w-72 xl:w-80 bg-secondary/20 border-b lg:border-b-0 lg:border-r border-border p-6 sm:p-8 shrink-0 flex flex-col">
        <Button variant="ghost" className="w-fit mb-8 px-0 hover:bg-transparent cursor-pointer font-bold" onClick={() => navigateTo('admin_escalas')}>
          <ChevronLeft className="w-5 h-5 mr-1" /> Cancelar
        </Button>
        
        <h2 className="text-2xl font-extrabold mb-8">Nova Escala</h2>

        <div className="flex flex-row lg:flex-col gap-4 lg:gap-0 overflow-x-auto hide-scrollbar">
          {[
            { s: 1, title: 'Informações Básicas', desc: 'Data, hora e ministério' },
            { s: 2, title: 'Montar Equipe', desc: 'Funções e voluntários' },
            { s: 3, title: 'Repertório', desc: 'Vincular músicas do culto' },
            { s: 4, title: 'Revisar & Publicar', desc: 'Confirmação final' }
          ].map(item => (
            <div key={item.s} className="flex gap-4 mb-0 lg:mb-8 min-w-[200px] lg:min-w-0 opacity-50 transition-opacity" style={{ opacity: step >= item.s ? 1 : 0.4 }}>
              <div className="flex flex-col items-center">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors", step === item.s ? "bg-primary border-primary text-primary-foreground" : step > item.s ? "bg-foreground border-foreground text-background" : "border-border text-muted-foreground")}>
                  {step > item.s ? <Check className="w-4 h-4" /> : item.s}
                </div>
                {item.s < 4 && <div className="w-0.5 h-full bg-border mt-2 hidden lg:block"></div>}
              </div>
              <div>
                <p className={cn("font-extrabold text-sm mb-0.5", step === item.s && "text-primary")}>{item.title}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 lg:p-12 relative flex flex-col">
        
        {/* Step 1 */}
        {step === 1 && (
          <div className="max-w-2xl w-full mx-auto animate-in slide-in-from-right-8 duration-300">
            <SectionHeader title="Informações Básicas" />

            <div className="space-y-6 mt-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                  Ministério Responsável *
                </label>
                <select 
                  value={selectedMinistryId} 
                  onChange={(e) => setSelectedMinistryId(e.target.value)}
                  className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
                >
                  {ministries.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                  Título do Culto ou Evento *
                </label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                  placeholder="Ex: Culto de Celebração, Culto da Família" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                    Data do Culto *
                  </label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                    Horário de Início *
                  </label>
                  <input 
                    type="time" 
                    value={startTime} 
                    onChange={e => setStartTime(e.target.value)} 
                    className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                    Horário de Término
                  </label>
                  <input 
                    type="time" 
                    value={endTime} 
                    onChange={e => setEndTime(e.target.value)} 
                    className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                    Localização
                  </label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                    placeholder="Ex: Templo Principal" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="max-w-3xl w-full mx-auto animate-in slide-in-from-right-8 duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <SectionHeader title="Montar Equipe" />
                <p className="text-xs text-muted-foreground font-semibold mt-1">
                  Defina as funções e escale os voluntários para o culto.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleAddSlot} className="font-bold cursor-pointer">
                <Plus className="w-4 h-4 mr-1.5" /> Adicionar Vaga
              </Button>
            </div>
            
            {slots.length === 0 ? (
              <Card className="p-8 text-center border-dashed rounded-3xl">
                <Users className="w-10 h-10 text-muted-foreground opacity-40 mx-auto mb-3" />
                <p className="font-extrabold text-base">Nenhuma posição configurada</p>
                <p className="text-xs text-muted-foreground mb-4">Clique no botão acima para adicionar a primeira vaga.</p>
                <Button onClick={handleAddSlot} size="sm">
                  <Plus className="w-4 h-4 mr-1.5" /> Adicionar Posição
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {slots.map((slot, i) => (
                  <Card key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-3xl border-border">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                        Função / Posição
                      </label>
                      <select 
                        value={slot.roleId} 
                        onChange={(e) => handleSlotRoleChange(i, e.target.value)}
                        className="w-full h-12 bg-background border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
                      >
                        <option value="">-- Selecione uma função --</option>
                        {availableRoles.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                        Voluntário Escalado
                      </label>
                      <select 
                        value={slot.memberId} 
                        onChange={(e) => handleSlotMemberChange(i, e.target.value)}
                        className="w-full h-12 bg-background border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
                      >
                        <option value="">-- Vaga Aberta (Disponível no Feed) --</option>
                        {availableMembers.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.profiles?.full_name || 'Voluntário'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-5 sm:pt-6">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-10 h-10 text-destructive hover:bg-destructive/10 cursor-pointer"
                        onClick={() => handleRemoveSlot(i)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="max-w-2xl w-full mx-auto animate-in slide-in-from-right-8 duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <SectionHeader title="Repertório do Culto" />
                <p className="text-xs text-muted-foreground font-semibold mt-1">
                  Selecione as músicas do acervo para esta escala ({selectedSongIds.length} selecionadas).
                </p>
              </div>
            </div>

            <div className="mb-4">
              <input 
                type="text" 
                value={songSearch}
                onChange={e => setSongSearch(e.target.value)}
                placeholder="Buscar música por título ou artista..."
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
              {filteredSongs.length === 0 ? (
                <Card className="p-8 text-center border-dashed rounded-2xl">
                  <p className="text-sm font-bold text-muted-foreground">Nenhuma música encontrada no acervo.</p>
                </Card>
              ) : (
                filteredSongs.map(song => {
                  const isSelected = selectedSongIds.includes(song.id);
                  return (
                    <div 
                      key={song.id}
                      onClick={() => toggleSongSelection(song.id)}
                      className={cn(
                        "p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all",
                        isSelected 
                          ? "bg-primary/10 border-primary shadow-sm" 
                          : "bg-card border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center border font-bold text-xs",
                          isSelected ? "bg-primary text-primary-foreground border-primary" : "border-border"
                        )}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="font-extrabold text-sm">{song.title}</p>
                          <p className="text-xs text-muted-foreground font-semibold">{song.artist || 'Artista'}</p>
                        </div>
                      </div>
                      {song.musical_key && (
                        <Badge variant="secondary" className="font-black text-xs">
                          {song.musical_key}
                        </Badge>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="max-w-3xl w-full mx-auto animate-in slide-in-from-right-8 duration-300">
            <SectionHeader title="Revisão Final" />
            
            <Card className="mb-6 p-0 overflow-hidden rounded-3xl border-border mt-4">
              <div className="bg-secondary/30 p-6 sm:p-8 border-b border-border">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="primary">{selectedMinistry?.name || 'Ministério'}</Badge>
                  <Badge variant="secondary">{location}</Badge>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">{title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> {date ? formatDatePtBR(date) : ''}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> {startTime} {endTime ? `- ${endTime}` : ''}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Equipe Escalada ({slots.length} posições)
                  </h4>
                  <div className="space-y-2">
                    {slots.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl border border-border bg-background">
                        <div className="flex items-center gap-3">
                          <Avatar fallback={s.roleName ? s.roleName.charAt(0) : '?'} size="sm" />
                          <div>
                            <p className="font-extrabold text-sm">{s.memberName || 'Vaga Aberta'}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.roleName}</p>
                          </div>
                        </div>
                        {s.memberId ? (
                          <Badge variant="secondary" className="text-xs">Escalado</Badge>
                        ) : (
                          <Badge variant="warning" className="text-xs">Vaga Aberta</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedSongIds.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      Repertório ({selectedSongIds.length} músicas)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSongIds.map(id => {
                        const song = allSongs.find((s: any) => s.id === id);
                        return song ? (
                          <Badge key={id} variant="secondary" className="px-3 py-1 text-xs font-bold">
                            🎵 {song.title} {song.musical_key ? `(${song.musical_key})` : ''}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-auto pt-8 flex justify-between items-center w-full max-w-3xl mx-auto">
          <Button 
            variant="secondary" 
            onClick={() => setStep(step - 1)} 
            disabled={step === 1} 
            className="w-32 font-bold cursor-pointer"
          >
            Voltar
          </Button>
          
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)} className="w-32 font-bold cursor-pointer">
              Próximo
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => handlePublish(true)} 
                disabled={submitting} 
                className="font-bold cursor-pointer"
              >
                Salvar Rascunho
              </Button>
              <Button 
                onClick={() => handlePublish(false)} 
                disabled={submitting} 
                className="bg-foreground text-background font-bold shadow-lg hover:brightness-110 cursor-pointer"
              >
                <Check className="w-4 h-4 mr-1.5" /> Publicar Escala
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


// Edit recurring scale logic dummy component to be used when Edit2 is clicked
function EditChoiceModal({ isOpen, onClose }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Escala">
      <div className="space-y-6 animate-in slide-in-from-bottom-4">
        <p className="font-medium text-muted-foreground mb-4">Esta é uma escala recorrente. Você deseja editar apenas esta ocorrência ou todas as futuras?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card hoverable className="text-center p-6 border-primary/20 hover:border-primary/60 cursor-pointer" onClick={onClose}>
            <Calendar className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h4 className="font-extrabold text-sm mb-1">Apenas esta</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Afeta um único evento</p>
          </Card>
          <Card hoverable className="text-center p-6 border-primary/20 hover:border-primary/60 cursor-pointer" onClick={onClose}>
            <Repeat className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h4 className="font-extrabold text-sm mb-1">Toda a recorrência</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Afeta eventos futuros</p>
          </Card>
        </div>
      </div>
    </Modal>
  )
}

// --- ADMIN VOLUNTARIOS ---

function AdminVoluntariosView({ navigateTo }: any) {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [ministries, setMinistries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterMin, setFilterMin] = useState('Todos');
  const [filterRole, setFilterRole] = useState('Todos');
  const [search, setSearch] = useState('');

  const loadVolunteers = async () => {
    setLoading(true);
    try {
      // 1. Carregar Ministérios
      const { data: minList } = previewData('ministries', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['name', {}] });
      setMinistries(minList || []);

      // 2. Carregar Perfis com Membros
      const { data, error } = previewData('profiles', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['full_name', {}] });

      if (error) throw error;
      setVolunteers(data || []);
    } catch (err) {
      console.error('Erro ao carregar voluntários:', err);
      toast.error('Erro ao carregar lista de voluntários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadVolunteers();
  }, []);

  const filteredVolunteers = volunteers.filter(v => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = v.full_name?.toLowerCase().includes(q);
      const matchPhone = v.phone?.toLowerCase().includes(q);
      if (!matchName && !matchPhone) return false;
    }

    if (filterMin !== 'Todos') {
      const hasMinistry = (v.ministry_members || []).some(
        (mm: any) => mm.status === 'approved' && mm.ministries?.id === filterMin
      );
      if (!hasMinistry) return false;
    }

    if (filterRole === 'Líderes') {
      const isLeader = (v.ministry_members || []).some((mm: any) => mm.role === 'leader' && mm.status === 'approved');
      if (!isLeader) return false;
    } else if (filterRole === 'Voluntários') {
      const isOnlyVolunteer = (v.ministry_members || []).every((mm: any) => mm.role !== 'leader');
      if (!isOnlyVolunteer) return false;
    }

    return true;
  });

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Gerenciamento
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Diretório de Voluntários</h1>
        </div>
      </div>

      <Card className="mb-8 p-4 bg-secondary/30 flex flex-col sm:flex-row gap-4 border border-border rounded-3xl">
        <div className="flex-1 relative">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
            Pesquisar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou WhatsApp..."
              className="w-full h-11 bg-background border border-border rounded-2xl pl-9 pr-3 text-sm font-bold focus:outline-none focus:border-primary placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
            Ministério
          </label>
          <select 
            value={filterMin} 
            onChange={e => setFilterMin(e.target.value)} 
            className="w-full h-11 bg-background border border-border rounded-2xl px-3 text-sm font-bold focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos os Ministérios</option>
            {ministries.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
            Função / Privilégio
          </label>
          <select 
            value={filterRole} 
            onChange={e => setFilterRole(e.target.value)} 
            className="w-full h-11 bg-background border border-border rounded-2xl px-3 text-sm font-bold focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos</option>
            <option value="Líderes">Apenas Líderes</option>
            <option value="Voluntários">Apenas Voluntários</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Carregando voluntários...</p>
        </div>
      ) : filteredVolunteers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed rounded-3xl">
          <Users className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-extrabold text-xl mb-2">Nenhum voluntário encontrado</h3>
          <p className="text-muted-foreground font-semibold text-sm max-w-sm">
            Tente ajustar os filtros ou os termos da pesquisa.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredVolunteers.map(v => {
            const approvedMinistries = (v.ministry_members || []).filter((mm: any) => mm.status === 'approved');
            const isLeader = approvedMinistries.some((mm: any) => mm.role === 'leader');

            return (
              <Card 
                key={v.id} 
                hoverable 
                onClick={() => navigateTo('admin_voluntario_perfil', v)} 
                className="p-5 flex items-start gap-4 rounded-3xl border-border cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Avatar 
                  src={v.avatar_url} 
                  fallback={v.full_name?.charAt(0) || 'V'} 
                  size="lg" 
                />
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-extrabold text-base truncate">{v.full_name || 'Voluntário'}</h3>
                    {isLeader && <ShieldCheck className="w-4 h-4 text-primary shrink-0" />}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {approvedMinistries.length === 0 ? (
                      <Badge variant="secondary" className="px-2 py-0 text-[9px]">Sem ministério</Badge>
                    ) : (
                      approvedMinistries.map((m: any) => (
                        <Badge key={m.id} variant="secondary" className="px-2 py-0 text-[9px]">
                          {m.ministries?.name}
                        </Badge>
                      ))
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <span>{v.phone || 'Sem WhatsApp'}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminVoluntarioPerfilView({ voluntario, navigateTo }: any) {
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({ confirmedCount: 0, attendanceRate: 100 });
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [honorModalOpen, setHonorModalOpen] = useState(false);
  const [honorReason, setHonorReason] = useState('Destaque pelo serviço e dedicação exemplar!');
  const [honorMinistryId, setHonorMinistryId] = useState('');
  const [submittingHonor, setSubmittingHonor] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      if (!voluntario?.id) return;
      setLoadingHistory(true);

      try {
        const approvedMemberIds = (voluntario.ministry_members || [])
          .filter((mm: any) => mm.status === 'approved')
          .map((mm: any) => mm.id);

        if (approvedMemberIds.length === 0) {
          setHistory([]);
          setStats({ confirmedCount: 0, attendanceRate: 100 });
          setLoadingHistory(false);
          return;
        }

        const { data: scheduleMembersData } = previewData('schedule_members', 'read', undefined, (row: any) => (approvedMemberIds).includes(getField(row, 'ministry_member_id')), { single: false, limit: undefined, order: ['schedules(date)', { ascending: false }] });

        const historyList = scheduleMembersData || [];
        setHistory(historyList);

        const confirmed = historyList.filter((m: any) => m.response === 'confirmed').length;
        const total = historyList.length;
        const rate = total > 0 ? Math.round((confirmed / total) * 100) : 100;

        setStats({
          confirmedCount: confirmed,
          attendanceRate: rate
        });
      } catch (err) {
        console.error('Erro ao carregar histórico do voluntário:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    void loadHistory();
  }, [voluntario?.id]);

  const handleHonorVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voluntario?.id) return;

    setSubmittingHonor(true);
    const now = new Date();
    try {
      const minId = honorMinistryId || (voluntario.ministry_members?.[0]?.ministries?.id) || null;
      const { error } = previewData('volunteer_of_month', 'insert', {
          volunteer_id: voluntario.id,
          ministry_id: minId,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          reason: honorReason.trim()
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success(`${voluntario.full_name} foi eleito Voluntário do Mês!`);
      setHonorModalOpen(false);
    } catch (err: any) {
      toast.error('Erro ao eleger voluntário: ' + err.message);
    } finally {
      setSubmittingHonor(false);
    }
  };

  if (!voluntario) {
    return (
      <div className="p-10 text-center">
        <p className="text-muted-foreground font-bold">Nenhum voluntário selecionado.</p>
        <Button onClick={() => navigateTo('admin_voluntarios')} className="mt-4">
          Voltar para Voluntários
        </Button>
      </div>
    );
  }

  const approvedMinistries = (voluntario.ministry_members || []).filter((mm: any) => mm.status === 'approved');

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1100px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="icon" className="cursor-pointer" onClick={() => navigateTo('admin_voluntarios')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
              Perfil do Voluntário
            </p>
            <h1 className="text-3xl font-extrabold">{voluntario.full_name || 'Voluntário'}</h1>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          className="font-bold cursor-pointer"
          onClick={() => setHonorModalOpen(true)}
        >
          <Trophy className="w-4 h-4 mr-1.5" /> Eleger Voluntário do Mês
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="md:col-span-4 space-y-6">
          <Card className="text-center p-8 flex flex-col items-center rounded-3xl border-border">
            <Avatar 
              src={voluntario.avatar_url} 
              fallback={voluntario.full_name?.charAt(0) || 'V'} 
              size="xl" 
              className="mb-4 w-24 h-24 text-2xl font-black bg-secondary" 
            />
            <h2 className="text-xl font-extrabold mb-1">{voluntario.full_name || 'Voluntário'}</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
              {approvedMinistries.map((m: any) => m.ministries?.name).join(', ') || 'Voluntário da Igreja'}
            </p>
            
            <div className="w-full space-y-3 mt-4 pt-6 border-t border-border text-left">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">WhatsApp / Telefone</p>
                <p className="text-sm font-semibold truncate">{voluntario.phone || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Data de Nascimento</p>
                <p className="text-sm font-semibold truncate">{voluntario.birth_date ? formatDatePtBR(voluntario.birth_date) : 'Não informada'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="md:col-span-8 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 sm:p-6 text-center bg-secondary/30 rounded-3xl border-border">
              <p className="text-3xl font-extrabold mb-1">{stats.confirmedCount}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Escalas Servidas</p>
            </Card>
            <Card className="p-4 sm:p-6 text-center bg-secondary/30 rounded-3xl border-border">
              <p className="text-3xl font-extrabold mb-1">{stats.attendanceRate}%</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Presença</p>
            </Card>
            <Card className="p-4 sm:p-6 text-center bg-secondary/30 rounded-3xl border-border">
              <p className="text-3xl font-extrabold mb-1">{approvedMinistries.length}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ministérios</p>
            </Card>
          </div>

          {/* Ministérios */}
          <Card className="rounded-3xl border-border p-6">
            <SectionHeader title="Ministérios Ativos" />
            <div className="space-y-3 mt-4">
              {approvedMinistries.length === 0 ? (
                <p className="text-xs font-bold text-muted-foreground">Nenhum ministério ativo.</p>
              ) : (
                approvedMinistries.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                        {getMinistryIconComponent(m.ministries?.name)}
                      </div>
                      <span className="font-extrabold text-base">{m.ministries?.name}</span>
                    </div>
                    <Badge variant={m.role === 'leader' ? 'primary' : 'secondary'}>
                      {m.role === 'leader' ? 'Líder' : 'Voluntário'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Histórico Recente */}
          <Card className="rounded-3xl border-border p-6">
            <SectionHeader title="Histórico de Escalas" />
            <div className="space-y-3 mt-4">
              {loadingHistory ? (
                <div className="py-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <div className="p-8 text-center border-dashed border-2 border-border rounded-2xl">
                  <Calendar className="w-8 h-8 text-muted-foreground opacity-40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground font-semibold">Nenhuma escala registrada para este voluntário.</p>
                </div>
              ) : (
                history.map((h: any) => {
                  const s = h.schedules;
                  return (
                    <div key={h.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-background">
                      <div>
                        <p className="font-extrabold text-sm">{s?.title || 'Culto de Celebração'}</p>
                        <p className="text-xs text-muted-foreground font-semibold">
                          {s?.date ? formatDatePtBR(s.date) : ''} • {h.ministry_roles?.name || 'Posição'}
                        </p>
                      </div>
                      <Badge variant={h.response === 'confirmed' ? 'success' : h.response === 'declined' ? 'destructive' : 'warning'}>
                        {h.response === 'confirmed' ? 'Confirmado' : h.response === 'declined' ? 'Recusado' : 'Pendente'}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Eleição de Voluntário do Mês */}
      <Modal isOpen={honorModalOpen} onClose={() => setHonorModalOpen(false)} title="Eleger Voluntário do Mês">
        <form onSubmit={handleHonorVolunteer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Ministério do Destaque
            </label>
            <select 
              value={honorMinistryId} 
              onChange={e => setHonorMinistryId(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary"
            >
              {approvedMinistries.map((m: any) => (
                <option key={m.id} value={m.ministries?.id}>{m.ministries?.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Motivo da Homenagem / Reconhecimento
            </label>
            <textarea 
              value={honorReason}
              onChange={e => setHonorReason(e.target.value)}
              rows={3}
              required
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary"
              placeholder="Ex: Pela dedicação e pontualidade exemplar nos cultos deste mês!"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="secondary" className="flex-1 font-bold" onClick={() => setHonorModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold" disabled={submittingHonor}>
              {submittingHonor ? 'Salvando...' : 'Confirmar Homenagem'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// --- ADMIN SOLICITACOES ---

function AdminSolicitacoesView({ navigateTo }: any) {
  const [filterType, setFilterType] = useState<'Todas' | 'Entrada em Ministério' | 'Troca de Escala'>('Todas');
  const [filterStatus, setFilterStatus] = useState<'Pendentes' | 'Aprovadas' | 'Recusadas' | 'Todas'>('Pendentes');

  const [memberRequests, setMemberRequests] = useState<any[]>([]);
  const [swapRequests, setSwapRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    try {
      // 1. Pedidos de entrada em ministério
      const { data: mReqs } = previewData('ministry_members', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['created_at', { ascending: false }] });

      setMemberRequests(mReqs || []);

      // 2. Pedidos de troca
      const { data: sReqs } = previewData('schedule_swap_requests', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['created_at', { ascending: false }] });

      setSwapRequests(sReqs || []);
    } catch (err) {
      console.error('Erro ao carregar solicitações:', err);
      toast.error('Erro ao carregar solicitações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  const handleApproveMember = async (id: string) => {
    try {
      const { error } = previewData('ministry_members', 'update', { status: 'approved' }, (row: any) => getField(row, 'id') === id, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success('Voluntário aprovado no ministério!');
      setMemberRequests(prev => prev.map(m => m.id === id ? { ...m, status: 'approved' } : m));
    } catch (err: any) {
      toast.error('Erro ao aprovar: ' + err.message);
    }
  };

  const handleRejectMember = async (id: string) => {
    try {
      const { error } = previewData('ministry_members', 'delete', undefined, (row: any) => getField(row, 'id') === id, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.info('Solicitação de entrada recusada.');
      setMemberRequests(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      toast.error('Erro ao recusar: ' + err.message);
    }
  };

  const handleApproveSwap = async (swap: any) => {
    try {
      const { error: swapError } = previewData('schedule_swap_requests', 'update', { status: 'approved' }, (row: any) => getField(row, 'id') === swap.id, { single: false, limit: undefined, order: undefined });

      if (swapError) throw swapError;

      if (swap.target_member_id && swap.schedule_member_id) {
        previewData('schedule_members', 'update', {
            ministry_member_id: swap.target_member_id,
            response: 'confirmed',
            response_at: new Date().toISOString()
          }, (row: any) => getField(row, 'id') === swap.schedule_member_id, { single: false, limit: undefined, order: undefined });
      } else if (swap.schedule_member_id) {
        previewData('schedule_members', 'update', {
            ministry_member_id: null,
            response: 'pending',
            response_at: null
          }, (row: any) => getField(row, 'id') === swap.schedule_member_id, { single: false, limit: undefined, order: undefined });
      }

      toast.success('Troca de escala aprovada!');
      setSwapRequests(prev => prev.map(s => s.id === swap.id ? { ...s, status: 'approved' } : s));
    } catch (err: any) {
      toast.error('Erro ao aprovar troca: ' + err.message);
    }
  };

  const handleRejectSwap = async (swapId: string) => {
    try {
      const { error } = previewData('schedule_swap_requests', 'update', { status: 'rejected' }, (row: any) => getField(row, 'id') === swapId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.info('Solicitação de troca recusada.');
      setSwapRequests(prev => prev.map(s => s.id === swapId ? { ...s, status: 'rejected' } : s));
    } catch (err: any) {
      toast.error('Erro ao recusar troca: ' + err.message);
    }
  };

  // Unified items
  const combinedItems: any[] = [];

  if (filterType === 'Todas' || filterType === 'Entrada em Ministério') {
    memberRequests.forEach(m => {
      const matchStatus = 
        filterStatus === 'Todas' || 
        (filterStatus === 'Pendentes' && m.status === 'pending') ||
        (filterStatus === 'Aprovadas' && m.status === 'approved');
      
      if (matchStatus) {
        combinedItems.push({
          type: 'ENTRADA EM MINISTÉRIO',
          id: m.id,
          createdAt: m.created_at,
          status: m.status === 'pending' ? 'Pendente' : 'Aprovada',
          personName: m.profiles?.full_name || 'Voluntário',
          personAvatar: m.profiles?.avatar_url,
          personPhone: m.profiles?.phone,
          ministryName: m.ministries?.name || 'Ministério',
          raw: m
        });
      }
    });
  }

  if (filterType === 'Todas' || filterType === 'Troca de Escala') {
    swapRequests.forEach(s => {
      const matchStatus = 
        filterStatus === 'Todas' || 
        (filterStatus === 'Pendentes' && s.status === 'pending') ||
        (filterStatus === 'Aprovadas' && s.status === 'approved') ||
        (filterStatus === 'Recusadas' && s.status === 'rejected');

      if (matchStatus) {
        const sc = s.schedule_members?.schedules;
        combinedItems.push({
          type: 'TROCA DE ESCALA',
          id: s.id,
          createdAt: s.created_at,
          status: s.status === 'pending' ? 'Pendente' : s.status === 'approved' ? 'Aprovada' : 'Recusada',
          personName: s.requester?.profiles?.full_name || 'Voluntário',
          personAvatar: s.requester?.profiles?.avatar_url,
          targetName: s.target?.profiles?.full_name,
          ministryName: sc?.ministries?.name || 'Ministério',
          eventTitle: sc?.title,
          eventDate: sc?.date,
          eventTime: sc?.start_time,
          roleName: s.schedule_members?.ministry_roles?.name,
          justification: s.reason,
          raw: s
        });
      }
    });
  }

  // Sort by date desc
  combinedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const types = ['Todas', 'Entrada em Ministério', 'Troca de Escala'] as const;
  const statuses = ['Pendentes', 'Aprovadas', 'Recusadas', 'Todas'] as const;

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Gerenciamento
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Central de Solicitações</h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0 flex-1">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer",
                filterType === t 
                  ? "bg-foreground text-background border-foreground" 
                  : "bg-card text-muted-foreground border-border hover:bg-secondary"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar shrink-0">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer",
                filterStatus === s 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card text-muted-foreground border-border hover:bg-secondary"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Carregando solicitações...</p>
        </div>
      ) : combinedItems.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed rounded-3xl">
          <ListChecks className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-extrabold text-xl mb-2">Tudo limpo por aqui!</h3>
          <p className="text-muted-foreground font-semibold text-sm max-w-sm">
            Não existem solicitações que correspondam aos filtros selecionados.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {combinedItems.map((item) => {
            const isPending = item.status === 'Pendente';
            const isSwap = item.type === 'TROCA DE ESCALA';

            return (
              <Card key={`${item.type}-${item.id}`} className="p-0 overflow-hidden flex flex-col md:flex-row group rounded-3xl border-border">
                {/* Left block */}
                <div className="bg-secondary/30 md:w-60 p-5 border-b md:border-b-0 md:border-r border-border shrink-0 flex flex-col justify-center">
                  <Badge variant={isSwap ? 'warning' : 'primary'} className="w-fit mb-3 text-[10px] font-bold">
                    {item.type}
                  </Badge>
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={item.personAvatar} 
                      fallback={item.personName.charAt(0)} 
                      size="sm" 
                    />
                    <div className="min-w-0">
                      <p className="font-extrabold text-sm leading-tight truncate">{item.personName}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                        {item.createdAt ? formatDatePtBR(item.createdAt) : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right block */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <p className="font-extrabold text-lg mb-1">{item.ministryName}</p>
                    
                    {isSwap ? (
                      <div>
                        {item.eventTitle && (
                          <p className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" /> {item.eventTitle} ({item.eventDate ? formatDatePtBR(item.eventDate) : ''} às {item.eventTime ? formatTimePtBR(item.eventTime) : ''})
                          </p>
                        )}
                        {item.targetName && (
                          <p className="text-xs text-primary font-bold mb-2">
                            Substituto indicado: {item.targetName}
                          </p>
                        )}
                        {item.justification && (
                          <div className="bg-secondary/50 p-3 rounded-2xl border border-border mt-3">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1.5">
                              <MessageSquare className="w-3 h-3" /> Justificativa
                            </p>
                            <p className="text-sm font-medium italic">"{item.justification}"</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground font-semibold">
                          Solicitou entrada no ministério {item.ministryName}.
                        </p>
                        {item.personPhone && (
                          <p className="text-xs text-muted-foreground font-bold mt-1">
                            WhatsApp: {item.personPhone}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {isPending ? (
                    <div className="flex flex-row md:flex-col gap-2 shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 font-bold border-destructive text-destructive hover:bg-destructive/10 cursor-pointer" 
                        onClick={() => isSwap ? handleRejectSwap(item.id) : handleRejectMember(item.id)}
                      >
                        Recusar
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 font-bold cursor-pointer" 
                        onClick={() => isSwap ? handleApproveSwap(item.raw) : handleApproveMember(item.id)}
                      >
                        Aprovar
                      </Button>
                    </div>
                  ) : (
                    <div className="shrink-0 flex items-center justify-end">
                      <Badge variant={item.status === 'Aprovada' ? 'success' : 'destructive'} className="text-sm px-4 py-1.5 font-bold">
                        {item.status}
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


// --- ADMIN REPERTORIO ---
function AdminRepertorioView() {
  const [activeTab, setActiveTab] = useState<'playlists' | 'biblioteca'>('biblioteca');
  const [schedulesWithSongs, setSchedulesWithSongs] = useState<any[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [songSearch, setSongSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State for Songs CRUD
  const [isSongModalOpen, setSongModalOpen] = useState(false);
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [songForm, setSongForm] = useState({
    title: '',
    artist: '',
    musical_key: '',
    bpm: '',
    cifra_url: '',
    youtube_url: '',
    notes: ''
  });
  const [submittingSong, setSubmittingSong] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Carregar Acervo Geral de Músicas
      const { data: songsData, error: sErr } = previewData('songs', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['title', {}] });

      if (sErr) throw sErr;
      setSongs(songsData || []);

      // 2. Carregar Escalas com Músicas
      const { data: schedData, error: scErr } = previewData('schedules', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['date', { ascending: false }] });

      if (scErr) throw scErr;
      setSchedulesWithSongs(schedData || []);

      // Update selected schedule reference if active
      if (selectedSchedule) {
        const updated = (schedData || []).find((s: any) => s.id === selectedSchedule.id);
        setSelectedSchedule(updated || null);
      }
    } catch (err) {
      console.error('Erro ao carregar repertório:', err);
      toast.error('Erro ao carregar repertório.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleOpenCreateSong = () => {
    setEditingSongId(null);
    setSongForm({
      title: '',
      artist: '',
      musical_key: 'G',
      bpm: '120',
      cifra_url: '',
      youtube_url: '',
      notes: ''
    });
    setSongModalOpen(true);
  };

  const handleOpenEditSong = (song: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSongId(song.id);
    setSongForm({
      title: song.title || '',
      artist: song.artist || '',
      musical_key: song.musical_key || '',
      bpm: song.bpm ? String(song.bpm) : '',
      cifra_url: song.cifra_url || '',
      youtube_url: song.youtube_url || '',
      notes: song.notes || ''
    });
    setSongModalOpen(true);
  };

  const handleSaveSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songForm.title.trim()) {
      toast.error('Título da música é obrigatório.');
      return;
    }

    setSubmittingSong(true);
    try {
      const payload = {
        title: songForm.title.trim(),
        artist: songForm.artist.trim() || null,
        musical_key: songForm.musical_key.trim() || null,
        bpm: songForm.bpm ? parseInt(songForm.bpm, 10) : null,
        cifra_url: songForm.cifra_url.trim() || null,
        youtube_url: songForm.youtube_url.trim() || null,
        notes: songForm.notes.trim() || null
      };

      if (editingSongId) {
        const { error } = previewData('songs', 'update', payload, (row: any) => getField(row, 'id') === editingSongId, { single: false, limit: undefined, order: undefined });
        if (error) throw error;
        toast.success('Música atualizada com sucesso!');
      } else {
        const { error } = previewData('songs', 'insert', payload, (row: any) => true, { single: false, limit: undefined, order: undefined });
        if (error) throw error;
        toast.success('Música cadastrada no acervo!');
      }

      setSongModalOpen(false);
      await loadData();
    } catch (err: any) {
      console.error('Erro ao salvar música:', err);
      toast.error('Erro ao salvar música: ' + err.message);
    } finally {
      setSubmittingSong(false);
    }
  };

  const handleDeleteSong = async (songId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Tem certeza que deseja remover esta música do acervo geral?')) return;

    try {
      const { error } = previewData('songs', 'delete', undefined, (row: any) => getField(row, 'id') === songId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.success('Música removida do acervo.');
      await loadData();
    } catch (err: any) {
      toast.error('Erro ao excluir música: ' + err.message);
    }
  };

  const handleAddSongToSchedule = async (song: any) => {
    if (!selectedSchedule) {
      toast.info('Selecione um culto/escala na coluna esquerda para adicionar músicas.');
      return;
    }

    const currentSongs = selectedSchedule.schedule_songs || [];
    const alreadyIn = currentSongs.some((ss: any) => ss.songs?.id === song.id);
    if (alreadyIn) {
      toast.error('Esta música já está nesta escala!');
      return;
    }

    try {
      const nextPos = currentSongs.length + 1;
      const { error } = previewData('schedule_songs', 'insert', {
          schedule_id: selectedSchedule.id,
          song_id: song.id,
          position: nextPos
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.success(`"${song.title}" adicionada à playlist!`);
      await loadData();
    } catch (err: any) {
      toast.error('Erro ao vincular música: ' + err.message);
    }
  };

  const handleRemoveSongFromSchedule = async (scheduleSongId: string) => {
    try {
      const { error } = previewData('schedule_songs', 'delete', undefined, (row: any) => getField(row, 'id') === scheduleSongId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.success('Música removida da escala.');
      await loadData();
    } catch (err: any) {
      toast.error('Erro ao remover música: ' + err.message);
    }
  };

  const filteredSongs = songs.filter(s => {
    const q = songSearch.toLowerCase();
    const matchTitle = s.title?.toLowerCase().includes(q);
    const matchArtist = s.artist?.toLowerCase().includes(q);
    const matchKey = s.musical_key?.toLowerCase().includes(q);
    return matchTitle || matchArtist || matchKey;
  });

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in duration-300 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Gerenciamento
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Repertório & Louvor</h1>
        </div>
        <Button onClick={handleOpenCreateSong} className="font-bold cursor-pointer">
          <Plus className="w-4 h-4 mr-1.5" /> Nova Música no Acervo
        </Button>
      </div>

      {/* Mobile Tabs */}
      <div className="flex md:hidden bg-secondary/50 p-1 rounded-2xl mb-6 border border-border shrink-0">
        <button 
          className={cn("flex-1 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer", activeTab === 'biblioteca' ? "bg-background shadow-sm border border-border" : "text-muted-foreground")} 
          onClick={() => setActiveTab('biblioteca')}
        >
          Acervo Geral ({songs.length})
        </button>
        <button 
          className={cn("flex-1 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer", activeTab === 'playlists' ? "bg-background shadow-sm border border-border" : "text-muted-foreground")} 
          onClick={() => setActiveTab('playlists')}
        >
          Playlists por Culto ({schedulesWithSongs.length})
        </button>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        
        {/* Left Col - Playlists por Culto */}
        <div className={cn("w-full md:w-[420px] lg:w-[460px] shrink-0 flex-col h-full", activeTab === 'playlists' ? "flex" : "hidden md:flex")}>
          {!selectedSchedule ? (
            <div className="flex flex-col h-full animate-in slide-in-from-left-4">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <div>
                  <h2 className="text-xl font-extrabold">Playlists dos Cultos</h2>
                  <p className="text-xs text-muted-foreground font-semibold">Selecione para gerenciar o repertório</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 pb-8">
                {loading ? (
                  <div className="py-12 flex justify-center">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : schedulesWithSongs.length === 0 ? (
                  <Card className="p-8 text-center border-dashed rounded-3xl">
                    <ListMusic className="w-8 h-8 text-muted-foreground opacity-40 mx-auto mb-2" />
                    <p className="font-bold text-sm">Nenhum culto cadastrado.</p>
                  </Card>
                ) : (
                  schedulesWithSongs.map(schedule => {
                    const songCount = schedule.schedule_songs?.length || 0;
                    return (
                      <Card 
                        key={schedule.id} 
                        hoverable 
                        onClick={() => setSelectedSchedule(schedule)} 
                        className="p-4 flex justify-between items-center cursor-pointer rounded-2xl border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="min-w-0 pr-3">
                          <h3 className="font-extrabold text-base mb-1 truncate">{schedule.title}</h3>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {schedule.date ? formatDatePtBR(schedule.date) : ''} • {songCount} {songCount === 1 ? 'música' : 'músicas'}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-in slide-in-from-right-4 bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-secondary/30 p-5 sm:p-6 border-b border-border shrink-0">
                <button 
                  onClick={() => setSelectedSchedule(null)} 
                  className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 hover:text-foreground cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Voltar para Cultos
                </button>
                <h3 className="text-xl font-extrabold truncate mb-1">{selectedSchedule.title}</h3>
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> {selectedSchedule.date ? formatDatePtBR(selectedSchedule.date) : ''} às {selectedSchedule.start_time ? formatTimePtBR(selectedSchedule.start_time) : ''}
                </p>
                <div className="mt-3">
                  <Badge variant="primary" className="text-[10px] font-bold">
                    {selectedSchedule.schedule_songs?.length || 0} músicas selecionadas
                  </Badge>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {(!selectedSchedule.schedule_songs || selectedSchedule.schedule_songs.length === 0) ? (
                  <div className="text-center p-8 opacity-60">
                    <ListMusic className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-bold text-sm">Playlist vazia</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Clique no botão "+" em qualquer música do acervo ao lado para adicioná-la aqui.
                    </p>
                  </div>
                ) : (
                  [...selectedSchedule.schedule_songs]
                    .sort((a, b) => a.position - b.position)
                    .map((ss: any, index: number) => {
                      const song = ss.songs;
                      if (!song) return null;
                      return (
                        <div 
                          key={ss.id} 
                          className="flex items-center gap-3 p-3 bg-background border border-border rounded-2xl hover:border-primary/50 group transition-colors"
                        >
                          <div className="w-6 font-black text-xs text-muted-foreground text-center shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-sm truncate">{song.title}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                              {song.artist || 'Artista'} • Tom: {song.musical_key || 'N/D'}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 shrink-0 text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={() => handleRemoveSongFromSchedule(ss.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Col - Acervo Geral */}
        <div className={cn("flex-1 flex-col h-full bg-card border border-border rounded-3xl p-6 overflow-hidden shadow-sm", activeTab === 'biblioteca' ? "flex" : "hidden md:flex")}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 shrink-0">
            <div>
              <h2 className="text-xl font-extrabold">Acervo Geral de Músicas</h2>
              <p className="text-xs text-muted-foreground font-semibold">
                {songs.length} {songs.length === 1 ? 'música cadastrada' : 'músicas cadastradas'}
              </p>
            </div>
          </div>
          
          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              value={songSearch} 
              onChange={e => setSongSearch(e.target.value)}
              placeholder="Buscar por título, artista ou tom..." 
              className="w-full h-11 bg-secondary/50 border border-border rounded-2xl pl-11 pr-4 text-sm font-bold focus:outline-none focus:border-primary placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2.5">
            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredSongs.length === 0 ? (
              <Card className="p-8 text-center border-dashed rounded-3xl">
                <Music className="w-8 h-8 text-muted-foreground opacity-40 mx-auto mb-2" />
                <p className="font-bold text-sm">Nenhuma música encontrada.</p>
              </Card>
            ) : (
              filteredSongs.map(song => (
                <div 
                  key={song.id} 
                  className="p-4 bg-background border border-border rounded-2xl flex items-center justify-between group hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-extrabold text-base truncate mb-0.5">{song.title}</p>
                    <p className="text-xs font-bold text-muted-foreground truncate">{song.artist || 'Artista não informado'}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {song.cifra_url && (
                        <a 
                          href={song.cifra_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                          onClick={e => e.stopPropagation()}
                        >
                          <FileText className="w-3 h-3" /> Cifra
                        </a>
                      )}
                      {song.youtube_url && (
                        <a 
                          href={song.youtube_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1"
                          onClick={e => e.stopPropagation()}
                        >
                          <Video className="w-3 h-3" /> YouTube
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    {song.musical_key && (
                      <Badge className="bg-secondary text-xs font-black px-2.5 py-1">
                        {song.musical_key}
                      </Badge>
                    )}
                    {song.bpm && (
                      <Badge className="bg-secondary text-xs font-black px-2.5 py-1 hidden sm:inline-flex">
                        {song.bpm} bpm
                      </Badge>
                    )}
                    
                    <div className="flex gap-1.5 ml-2">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="w-9 h-9 cursor-pointer" 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleOpenEditSong(song, e)}
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-9 h-9 text-destructive hover:bg-destructive/10 cursor-pointer" 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDeleteSong(song.id, e)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {selectedSchedule && (
                        <Button 
                          size="icon" 
                          className="w-9 h-9 bg-primary text-primary-foreground hover:brightness-110 cursor-pointer" 
                          onClick={() => handleAddSongToSchedule(song)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Criação / Edição de Música */}
      <Modal 
        isOpen={isSongModalOpen} 
        onClose={() => setSongModalOpen(false)} 
        title={editingSongId ? "Editar Música" : "Nova Música no Acervo"}
      >
        <form onSubmit={handleSaveSong} className="space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar p-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Título da Música *
              </label>
              <input 
                type="text" 
                required
                value={songForm.title} 
                onChange={e => setSongForm({ ...songForm, title: e.target.value })}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="Ex: Bondade de Deus, Ele Vive"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Artista / Compositor
              </label>
              <input 
                type="text" 
                value={songForm.artist} 
                onChange={e => setSongForm({ ...songForm, artist: e.target.value })}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="Ex: Isaías Saad, Bethel Music"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Tom Musical
              </label>
              <input 
                type="text" 
                value={songForm.musical_key} 
                onChange={e => setSongForm({ ...songForm, musical_key: e.target.value })}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="Ex: G, D, Bm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                BPM (Andamento)
              </label>
              <input 
                type="number" 
                value={songForm.bpm} 
                onChange={e => setSongForm({ ...songForm, bpm: e.target.value })}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="Ex: 72, 120"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Link da Cifra (Cifra Club ou PDF)
              </label>
              <input 
                type="url" 
                value={songForm.cifra_url} 
                onChange={e => setSongForm({ ...songForm, cifra_url: e.target.value })}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="https://www.cifraclub.com.br/..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Link do YouTube
              </label>
              <input 
                type="url" 
                value={songForm.youtube_url} 
                onChange={e => setSongForm({ ...songForm, youtube_url: e.target.value })}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Observações / Estrutura
              </label>
              <textarea 
                rows={3}
                value={songForm.notes} 
                onChange={e => setSongForm({ ...songForm, notes: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-primary resize-none"
                placeholder="Ex: Introdução com teclado suave, solo na segunda estrofe..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-4">
            <Button type="button" variant="secondary" className="flex-1 font-bold cursor-pointer" onClick={() => setSongModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold cursor-pointer" disabled={submittingSong}>
              {submittingSong ? 'Salvando...' : 'Salvar Música'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


// --- ADMIN FEED ---
function AdminFeedView({ user, userProfile, navigateTo }: any) {
  const [filterMin, setFilterMin] = useState('Todos');
  const [posts, setPosts] = useState<any[]>([]);
  const [ministries, setMinistries] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isVoluntarioModalOpen, setVoluntarioModalOpen] = useState(false);

  // Post form state
  const [postType, setPostType] = useState('📢 Aviso');
  const [postMinistryId, setPostMinistryId] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);

  // Volunteer of the Month form state
  const [honorVolunteerId, setHonorVolunteerId] = useState('');
  const [honorMinistryId, setHonorMinistryId] = useState('');
  const [honorTitle, setHonorTitle] = useState('Destaque do Mês');
  const [honorMessage, setHonorMessage] = useState('');
  const [submittingHonor, setSubmittingHonor] = useState(false);

  const loadFeedAndMetadata = async () => {
    setLoading(true);
    try {
      const { data: minList } = previewData('ministries', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['name', {}] });
      setMinistries(minList || []);

      const { data: volList } = previewData('profiles', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['full_name', {}] });
      setVolunteers(volList || []);
      if (volList && volList.length > 0) {
        setHonorVolunteerId(volList[0].id);
      }

      const { data: postsData, error } = previewData('feed_posts', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['created_at', { ascending: false }] });

      if (error) throw error;
      setPosts(postsData || []);
    } catch (err) {
      console.error('Erro ao carregar feed admin:', err);
      toast.error('Erro ao carregar postagens do feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFeedAndMetadata();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      toast.error('Título e mensagem são obrigatórios.');
      return;
    }

    setSubmittingPost(true);
    try {
      const { error } = previewData('feed_posts', 'insert', {
          author_id: user?.id,
          ministry_id: postMinistryId ? postMinistryId : null,
          type: postType,
          title: postTitle.trim(),
          content: postContent.trim()
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success('Publicação criada com sucesso!');
      setPostTitle('');
      setPostContent('');
      setPostMinistryId('');
      setPostModalOpen(false);
      await loadFeedAndMetadata();
    } catch (err: any) {
      toast.error('Erro ao publicar: ' + err.message);
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta publicação?')) return;

    try {
      const { error } = previewData('feed_posts', 'delete', undefined, (row: any) => getField(row, 'id') === postId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.success('Publicação removida com sucesso.');
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err: any) {
      toast.error('Erro ao excluir: ' + err.message);
    }
  };

  const handlePublishHonor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!honorVolunteerId) {
      toast.error('Selecione um voluntário.');
      return;
    }

    setSubmittingHonor(true);
    const now = new Date();
    try {
      const selectedVol = volunteers.find(v => v.id === honorVolunteerId);

      // 1. Inserir em volunteer_of_month
      previewData('volunteer_of_month', 'insert', {
          volunteer_id: honorVolunteerId,
          ministry_id: honorMinistryId || null,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          reason: (honorTitle + ' - ' + honorMessage).trim()
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      // 2. Criar post no feed comemorando
      previewData('feed_posts', 'insert', {
          author_id: user?.id,
          ministry_id: honorMinistryId || null,
          type: '🎉 Aniversário',
          title: `🏆 Voluntário em Destaque: ${selectedVol?.full_name || 'Voluntário'}!`,
          content: `${honorTitle}\n\n${honorMessage || 'Parabéns pela dedicação e excelente serviço prestado à igreja!'}`
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      toast.success('Homenagem publicada no mural!');
      setHonorTitle('Destaque do Mês');
      setHonorMessage('');
      setVoluntarioModalOpen(false);
      await loadFeedAndMetadata();
    } catch (err: any) {
      toast.error('Erro ao registrar homenagem: ' + err.message);
    } finally {
      setSubmittingHonor(false);
    }
  };

  const ministryFilterOptions = ['Todos', ...ministries.map(m => m.name), 'Geral'];

  const filteredPosts = posts.filter(p => {
    if (filterMin === 'Todos') return true;
    if (filterMin === 'Geral') return !p.ministries;
    return p.ministries?.name === filterMin;
  });

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1000px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Gerenciamento
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Feed da Comunidade</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setVoluntarioModalOpen(true)} className="font-bold cursor-pointer">
            <Trophy className="w-4 h-4 mr-2 text-yellow-500" /> Voluntário do Mês
          </Button>
          <Button onClick={() => setPostModalOpen(true)} className="font-bold cursor-pointer">
            <Plus className="w-4 h-4 mr-1.5" /> Novo Post
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
        {ministryFilterOptions.map(m => (
          <button
            key={m}
            onClick={() => setFilterMin(m)}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer",
              filterMin === m 
                ? "bg-foreground text-background border-foreground shadow-sm" 
                : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Carregando postagens...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed rounded-3xl">
          <MessageSquare className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-extrabold text-xl mb-2">Feed vazio</h3>
          <p className="text-muted-foreground font-semibold text-sm max-w-sm">
            Não existem postagens para este filtro ainda. Crie uma nova publicação acima!
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map(post => {
            const feedPostData = {
              id: post.id,
              authorName: post.profiles?.full_name || 'Liderança',
              authorAvatar: post.profiles?.avatar_url,
              ministry: post.ministries?.name || 'Geral',
              time: post.created_at ? formatDatePtBR(post.created_at.split('T')[0]) : 'Hoje',
              type: post.type === '📢 Aviso' ? 'aviso' : post.type === '🎉 Aniversário' ? 'aniversario' : post.type === '🔥 Escala aberta' ? 'escala' : post.type === '🏆 Voluntário' ? 'voluntario' : 'evento',
              title: post.title,
              content: `${post.title ? post.title + '\n\n' : ''}${post.content || ''}`,
              reactions: { heart: post.feed_likes?.length || 0, fire: 0, pray: 0, music: 0 }
            };

            return (
              <div key={post.id} className="relative group">
                <div className="absolute top-4 right-16 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="xs"
                    className="shadow-md text-destructive hover:bg-destructive/10 cursor-pointer rounded-full"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Excluir
                  </Button>
                </div>
                <FeedPost post={feedPostData} />
              </div>
            );
          })}
        </div>
      )}

      {/* Post Modal */}
      <Modal isOpen={isPostModalOpen} onClose={() => setPostModalOpen(false)} title="Novo Post no Feed">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                Tipo de Post
              </label>
              <select 
                value={postType} 
                onChange={e => setPostType(e.target.value)}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
              >
                <option value="📢 Aviso">📢 Aviso</option>
                <option value="📅 Evento">📅 Evento</option>
                <option value="🔥 Escala aberta">🔥 Escala aberta</option>
                <option value="🎉 Aniversário">🎉 Celebração / Destaque</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                Ministério Alvo
              </label>
              <select 
                value={postMinistryId} 
                onChange={e => setPostMinistryId(e.target.value)}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
              >
                <option value="">Geral (Todos os voluntários)</option>
                {ministries.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
              Título do Post *
            </label>
            <input 
              type="text" 
              required
              value={postTitle} 
              onChange={e => setPostTitle(e.target.value)}
              placeholder="Ex: Ensaio geral confirmado para esta quinta-feira!"
              className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
              Mensagem *
            </label>
            <textarea 
              rows={4}
              required
              value={postContent} 
              onChange={e => setPostContent(e.target.value)}
              placeholder="Escreva a mensagem que deseja compartilhar com a equipe..."
              className="w-full bg-secondary/50 border border-border rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-4">
            <Button type="button" variant="secondary" className="flex-1 font-bold cursor-pointer" onClick={() => setPostModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold cursor-pointer" disabled={submittingPost}>
              {submittingPost ? 'Publicando...' : 'Publicar Post'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Voluntario do Mes Modal */}
      <Modal isOpen={isVoluntarioModalOpen} onClose={() => setVoluntarioModalOpen(false)} title="Eleger Voluntário do Mês">
        <form onSubmit={handlePublishHonor} className="space-y-4">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center relative shadow-inner">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
          </div>
          <p className="text-center font-semibold text-muted-foreground text-xs mb-4">
            Celebre publicamente o esforço e dedicação de quem fez a diferença na equipe.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                Voluntário Homenageado *
              </label>
              <select 
                value={honorVolunteerId} 
                onChange={e => setHonorVolunteerId(e.target.value)}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
              >
                {volunteers.map(v => (
                  <option key={v.id} value={v.id}>{v.full_name || 'Voluntário'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                Ministério
              </label>
              <select 
                value={honorMinistryId} 
                onChange={e => setHonorMinistryId(e.target.value)}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
              >
                <option value="">Geral / Todos</option>
                {ministries.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
              Título da Conquista
            </label>
            <input 
              type="text" 
              value={honorTitle} 
              onChange={e => setHonorTitle(e.target.value)}
              className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
              placeholder="Ex: Maior assiduidade, Sempre pronto a ajudar..." 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
              Mensagem de Reconhecimento
            </label>
            <textarea 
              rows={3}
              value={honorMessage} 
              onChange={e => setHonorMessage(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-primary resize-none"
              placeholder="Ex: Agradecemos de coração por todo amor e dedicação que você coloca no ministério todos os finais de semana!"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-4">
            <Button type="button" variant="secondary" className="flex-1 font-bold cursor-pointer" onClick={() => setVoluntarioModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold cursor-pointer" disabled={submittingHonor}>
              {submittingHonor ? 'Publicando...' : 'Publicar Homenagem'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

// --- ADMIN RELATORIOS ---

function AdminRelatoriosView({ navigateTo }: any) {
  const [filterPeriod, setFilterPeriod] = useState('Últimos 30 dias');
  const [filterMin, setFilterMin] = useState('Todos os Ministérios');
  const [loading, setLoading] = useState(true);

  const [schedules, setSchedules] = useState<any[]>([]);
  const [scheduleMembers, setScheduleMembers] = useState<any[]>([]);
  const [swapRequests, setSwapRequests] = useState<any[]>([]);
  const [ministries, setMinistries] = useState<any[]>([]);

  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      try {
        const { data: minData } = previewData('ministries', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['name', {}] });
        setMinistries(minData || []);

        const { data: schedData } = previewData('schedules', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['date', { ascending: true }] });
        setSchedules(schedData || []);

        const { data: smData } = previewData('schedule_members', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: undefined });
        setScheduleMembers(smData || []);

        const { data: swapData } = previewData('schedule_swap_requests', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: undefined });
        setSwapRequests(swapData || []);
      } catch (err) {
        console.error('Erro ao carregar dados do relatório:', err);
      } finally {
        setLoading(false);
      }
    };

    void loadReportData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter schedules based on ministry selection
  const filteredSchedules = schedules.filter(s => {
    if (filterMin === 'Todos os Ministérios') return true;
    return s.ministries?.name === filterMin;
  });

  const filteredScheduleIds = new Set(filteredSchedules.map(s => s.id));
  const relevantMembers = scheduleMembers.filter(sm => filteredScheduleIds.has(sm.schedule_id));

  // KPIs
  const pastSchedules = filteredSchedules.filter(s => s.date <= todayStr);
  const totalCompletedSchedules = pastSchedules.length || filteredSchedules.length;
  
  const confirmedResponses = relevantMembers.filter(m => m.response === 'confirmed').length;
  const declinedResponses = relevantMembers.filter(m => m.response === 'declined').length;
  const totalSlots = relevantMembers.length;
  const attendanceRate = totalSlots > 0 ? Math.round((confirmedResponses / totalSlots) * 100) : 95;

  const totalSwaps = swapRequests.length;

  // Incomplete future schedules
  const futureSchedules = filteredSchedules.filter(s => s.date >= todayStr);
  const openSlotsFuture = futureSchedules.filter(s => {
    const slots = scheduleMembers.filter(sm => sm.schedule_id === s.id);
    return slots.some(sm => !sm.ministry_member_id);
  });

  // Escalas por Ministério Pie Data
  const ministryColorMap: Record<string, string> = {
    'Louvor': '#3b82f6',
    'Mídia': '#a855f7',
    'Recepção': '#f97316',
    'Comunicação': '#22c55e',
    'Infantil': '#ec4899',
    'Intercessão': '#eab308'
  };

  const ministryCounts: Record<string, { count: number; color: string }> = {};
  schedules.forEach(s => {
    const name = s.ministries?.name || 'Geral';
    const color = s.ministries?.color || ministryColorMap[name] || '#8884d8';
    if (!ministryCounts[name]) {
      ministryCounts[name] = { count: 0, color };
    }
    ministryCounts[name].count += 1;
  });

  const pieData = Object.entries(ministryCounts).map(([name, val]) => ({
    name,
    value: val.count,
    color: val.color
  }));

  // Presenca semanal mock data adjusted to actual rate
  const presencaData = [
    { name: 'Sem 1', prev: 85, real: Math.min(100, Math.max(60, attendanceRate - 3)) },
    { name: 'Sem 2', prev: 85, real: Math.min(100, Math.max(60, attendanceRate + 2)) },
    { name: 'Sem 3', prev: 85, real: Math.min(100, Math.max(60, attendanceRate - 1)) },
    { name: 'Sem 4', prev: 85, real: Math.min(100, Math.max(60, attendanceRate + 4)) },
  ];

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Painel de Controle
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Relatórios & Métricas</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            value={filterPeriod} 
            onChange={(e) => setFilterPeriod(e.target.value)} 
            className="h-11 bg-card border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary cursor-pointer"
          >
            <option>Últimos 30 dias</option>
            <option>Este Mês</option>
            <option>Mês Passado</option>
            <option>Este Ano</option>
          </select>
          <select 
            value={filterMin} 
            onChange={(e) => setFilterMin(e.target.value)} 
            className="h-11 bg-card border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="Todos os Ministérios">Todos os Ministérios</option>
            {ministries.map(m => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Calculando métricas em tempo real...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <Card className="p-5 bg-gradient-to-br from-card to-secondary/30 rounded-3xl border-border">
              <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold mb-1">{totalCompletedSchedules}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                Escalas Realizadas <TrendingUp className="w-3 h-3 text-green-500 ml-1" />
              </p>
            </Card>
            
            <Card className="p-5 bg-gradient-to-br from-card to-secondary/30 rounded-3xl border-border">
              <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold mb-1">{attendanceRate}%</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                Média de Presença
              </p>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-card to-secondary/30 rounded-3xl border-border">
              <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center mb-4">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold mb-1">{totalSwaps}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                Trocas Solicitadas
              </p>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-card to-secondary/30 border-red-500/20 rounded-3xl">
              <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-4">
                <XCircle className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold mb-1 text-red-500">{declinedResponses}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-1">
                Recusas de Escala
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            
            {/* Gráfico 1 - Presença */}
            <Card className="p-6 rounded-3xl border-border">
              <div className="mb-6">
                <h3 className="text-lg font-extrabold">Assiduidade por Período</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Comparativo de presença real vs. projetada
                </p>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={presencaData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 'bold', fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 'bold' }} 
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Line key="real-line" type="monotone" dataKey="real" name="Presença Real (%)" stroke="var(--primary)" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line key="prev-line" type="monotone" dataKey="prev" name="Meta (%)" stroke="var(--muted-foreground)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Gráfico 2 - Distribuição */}
            <Card className="p-6 rounded-3xl border-border">
              <div className="mb-2">
                <h3 className="text-lg font-extrabold">Escalas por Ministério</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Distribuição do volume de escalas no período
                </p>
              </div>
              <div className="h-[250px] w-full flex items-center justify-between">
                <div className="h-full flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={pieData.length > 0 ? pieData : [{ name: 'Sem dados', value: 1, color: '#8884d8' }]} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" nameKey="name">
                        {(pieData.length > 0 ? pieData : [{ name: 'Sem dados', value: 1, color: '#8884d8' }]).map((entry, index) => (
                          <Cell key={`pie-cell-${index}-${entry.name.replace(/\s+/g, '-').toLowerCase()}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 'bold' }} 
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Custom Legend */}
                <div className="flex flex-col gap-2.5 ml-4 shrink-0 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                  {pieData.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-extrabold">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

          </div>

          {/* Painel Extra - Alertas */}
          <div className="w-full">
            <Card className={cn("p-6 rounded-3xl", openSlotsFuture.length > 0 ? "bg-red-500/5 border-red-500/20" : "bg-card border-border")}>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className={cn("w-5 h-5", openSlotsFuture.length > 0 ? "text-red-500" : "text-green-500")} />
                <h3 className={cn("text-lg font-extrabold", openSlotsFuture.length > 0 ? "text-red-500" : "text-foreground")}>
                  {openSlotsFuture.length > 0 
                    ? `Atenção: ${openSlotsFuture.length} ${openSlotsFuture.length === 1 ? 'Escala Incompleta' : 'Escalas Incompletas'}`
                    : 'Todas as próximas escalas estão preenchidas!'}
                </h3>
              </div>
              <p className="text-sm font-semibold text-muted-foreground mb-4">
                {openSlotsFuture.length > 0 
                  ? `Existem cultos próximos nos ministérios (${Array.from(new Set(openSlotsFuture.map(s => s.ministries?.name).filter(Boolean))).join(', ')}) com vagas em aberto.`
                  : 'A equipe está 100% montada para os próximos eventos.'}
              </p>
              {openSlotsFuture.length > 0 && (
                <Button 
                  variant="outline" 
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10 font-bold cursor-pointer"
                  onClick={() => navigateTo && navigateTo('admin_escalas')}
                >
                  Ver escalas com problema
                </Button>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

// --- CONFIGURAÇÕES ---

function ConfiguracoesView({ toggleTheme, isDarkMode, navigateTo, user, userProfile, onRefreshProfile, showLogin }: any) {
  const { showLogin: authSignOut } = usePreview();
  const [pushNotif, setPushNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#C6FF4D');

  const [cfgFullName, setCfgFullName] = useState(userProfile?.full_name || '');
  const [cfgPhone, setCfgPhone] = useState(userProfile?.phone || '');
  const [savingAccount, setSavingAccount] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setCfgFullName(userProfile.full_name || '');
      setCfgPhone(userProfile.phone || '');
    }
  }, [userProfile]);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSavingAccount(true);
    try {
      const { error } = previewData('profiles', 'update', {
          full_name: cfgFullName.trim(),
          phone: cfgPhone.trim() || null,
          updated_at: new Date().toISOString()
        }, (row: any) => getField(row, 'id') === user.id, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.success('Dados salvos com sucesso!');
      onRefreshProfile?.();
    } catch (err: any) {
      toast.error('Erro ao salvar alterações: ' + err.message);
    } finally {
      setSavingAccount(false);
    }
  };
  

  const colors = [
    { name: 'Neon Green', hex: '#C6FF4D' },
    { name: 'Ocean Blue', hex: '#3b82f6' },
    { name: 'Amethyst', hex: '#a855f7' },
    { name: 'Sunset', hex: '#f97316' },
    { name: 'Rose', hex: '#ec4899' }
  ];

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex);
    document.documentElement.style.setProperty('--primary', hex);
  };

  const handleLogout = async () => {
    try {
      if (showLogin) {
        await showLogin();
      } else {
        await authSignOut();
      }
      toast.success('Sessão encerrada com sucesso.');
    } catch (err) {
      toast.error('Erro ao sair da conta.');
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[800px] mx-auto w-full animate-in fade-in duration-300">
      
      <div className="flex items-center gap-4 mb-8">
        <Button variant="secondary" size="icon" onClick={() => navigateTo('perfil')} className="md:hidden cursor-pointer">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            Preferências
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Configurações</h1>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Aparência */}
        <section>
          <SectionHeader title="Aparência" />
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-base mb-1">Modo Escuro</h4>
                <p className="text-sm font-semibold text-muted-foreground">Alternar entre tema claro e escuro</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={cn("w-14 h-8 rounded-full transition-colors relative cursor-pointer", isDarkMode ? "bg-primary" : "bg-secondary border border-border")}
              >
                <div className={cn("absolute top-1 w-6 h-6 rounded-full bg-background shadow-sm transition-all flex items-center justify-center", isDarkMode ? "left-7" : "left-1")}>
                  {isDarkMode ? <Moon className="w-3.5 h-3.5 text-foreground" /> : <Sun className="w-3.5 h-3.5 text-foreground" />}
                </div>
              </button>
            </div>

            <div className="pt-6 border-t border-border">
              <h4 className="font-extrabold text-base mb-1">Cor de Destaque</h4>
              <p className="text-sm font-semibold text-muted-foreground mb-4">Personalize a cor principal do aplicativo</p>
              <div className="flex gap-3 flex-wrap">
                {colors.map(c => (
                  <button 
                    key={c.hex}
                    onClick={() => handleColorChange(c.hex)}
                    className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer", selectedColor === c.hex ? "ring-2 ring-offset-2 ring-offset-background scale-110 shadow-md" : "hover:scale-105 border border-border/10")}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor === c.hex && <Check className="w-5 h-5 text-[#111111]" />}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Notificações */}
        <section>
          <SectionHeader title="Notificações" />
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base mb-1">Notificações Push</h4>
                  <p className="text-sm font-semibold text-muted-foreground">Alertas diretos no seu celular ou navegador</p>
                </div>
              </div>
              <button 
                onClick={() => setPushNotif(!pushNotif)}
                className={cn("w-12 h-6 rounded-full transition-colors relative cursor-pointer", pushNotif ? "bg-primary" : "bg-secondary border border-border")}
              >
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-background shadow-sm transition-all", pushNotif ? "left-7" : "left-1")}></div>
              </button>
            </div>

            <div className="pt-6 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base mb-1">Lembretes por WhatsApp</h4>
                  <p className="text-sm font-semibold text-muted-foreground">Receba a sua escala da semana direto no WhatsApp</p>
                </div>
              </div>
              <button 
                onClick={() => setWhatsappNotif(!whatsappNotif)}
                className={cn("w-12 h-6 rounded-full transition-colors relative cursor-pointer", whatsappNotif ? "bg-primary" : "bg-secondary border border-border")}
              >
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-background shadow-sm transition-all", whatsappNotif ? "left-7" : "left-1")}></div>
              </button>
            </div>
          </Card>
        </section>

        {/* Dados da Conta */}
        <section>
          <SectionHeader title="Dados da Conta" />
          <form onSubmit={handleSaveAccount}>
            <Card className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative group cursor-pointer shrink-0">
                  <Avatar 
                    src={userProfile?.avatar_url} 
                    alt={userProfile?.full_name || "Perfil"} 
                    size="xl" 
                    className="w-24 h-24" 
                    fallback={userProfile?.full_name?.charAt(0) || "U"}
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">Nome de Exibição</label>
                    <input 
                      type="text" 
                      value={cfgFullName} 
                      onChange={e => setCfgFullName(e.target.value)}
                      required
                      className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">E-mail</label>
                  <input type="email" value={user?.email || ""} disabled className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 text-sm font-bold text-muted-foreground cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">Telefone / WhatsApp</label>
                  <input 
                    type="tel" 
                    value={cfgPhone} 
                    onChange={e => setCfgPhone(e.target.value)}
                    placeholder="(11) 98888-7777"
                    className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={savingAccount} className="cursor-pointer font-bold">
                  {savingAccount ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </Card>
          </form>
        </section>

        <div className="pt-6 border-t border-border flex justify-center">
          <Button variant="ghost" onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" /> Encerrar Sessão
          </Button>
        </div>

      </div>
    </div>
  );
}



