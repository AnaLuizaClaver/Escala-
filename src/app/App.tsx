import {
Award,
Bell,
Calendar,
Home,
LayoutDashboard,ListChecks,
LogOut,
MessageSquare,
Moon,
Music,
PieChart,
Settings,
ShieldCheck,
Sun,
User,
Users
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React,{ useEffect,useState } from 'react';
import { BrowserRouter,Navigate,Outlet,Route,Routes,useLocation,useNavigate } from 'react-router';
import { Toaster,toast } from 'sonner';
import { PreviewProvider } from '../context/PreviewContext';
import { usePreview } from '../hooks/usePreview';
import { getField,previewData } from '../mocks/previewData';
import { usePreviewDataRevision } from '../shared/state/dataRevision';
import LoginView from './LoginView';
import AuthLayout from './AuthLayout';
import BrandLogo from '../shared/ui/BrandLogo';
import { supabase } from '../lib/supabase';
import { LocalDataNotice } from '../shared/ui/LocalDataNotice';
import AdminOutlet from './router/AdminOutlet';
import RouteContent from './router/RouteContent';
import { isPublicPath,pathForView,viewForPath } from './router/routes';

import { PendingApprovalView,RegisterView,SelectMinistryView } from '../features/auth';
import { Avatar,BottomNavItem,Button,SidebarItem,cn } from '../shared/ui';
const TrocaModal = React.lazy(() => import('../features/escalas').then(m => ({ default: m.TrocaModal })));
const SongDetailsModal = React.lazy(() => import('../features/repertorio').then(m => ({ default: m.SongDetailsModal })));
const OnlineAccess = React.lazy(() => import('../features/auth/OnlineAccess'));

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
  if (supabase) {
    return (
      <React.Suspense fallback={<p role="status" className="p-6">Carregando acesso…</p>}>
        <OnlineAccess client={supabase} />
      </React.Suspense>
    );
  }

  return (
    <BrowserRouter><LocalDataNotice /><PreviewProvider><Routes><Route path="/" element={<AppInner />}><Route index element={<Navigate to="/inicio" replace />} /><Route path="inicio" element={<RouteContent />} /><Route path="escalas" element={<RouteContent />} /><Route path="escalas/nova" element={<RouteContent />} /><Route path="escalas/:id" element={<RouteContent />} /><Route path="repertorio" element={<RouteContent />} /><Route path="feed" element={<RouteContent />} /><Route path="ministerios" element={<RouteContent />} /><Route path="conquistas" element={<RouteContent />} /><Route path="notificacoes" element={<RouteContent />} /><Route path="perfil" element={<RouteContent />} /><Route path="configuracoes" element={<RouteContent />} /><Route path="admin" element={<AdminOutlet />}><Route index element={<RouteContent />} /><Route path="ministerios" element={<RouteContent />} /><Route path="ministerios/:id" element={<RouteContent />} /><Route path="escalas" element={<RouteContent />} /><Route path="escalas/nova" element={<RouteContent />} /><Route path="voluntarios" element={<RouteContent />} /><Route path="voluntarios/:id" element={<RouteContent />} /><Route path="solicitacoes" element={<RouteContent />} /><Route path="repertorio" element={<RouteContent />} /><Route path="feed" element={<RouteContent />} /><Route path="relatorios" element={<RouteContent />} /></Route><Route path="login" element={<RouteContent />} /><Route path="cadastro" element={<RouteContent />} /><Route path="recuperar-senha" element={<RouteContent />} /><Route path="escolher-ministerio" element={<RouteContent />} /><Route path="aguardando-aprovacao" element={<RouteContent />} /><Route path="*" element={<Navigate to="/inicio" replace />} /></Route></Routes></PreviewProvider></BrowserRouter>
  )
}

function AppInner() {
  const dataRevision = usePreviewDataRevision(state => state.revision);
  const pendingRequestsCount = previewData('ministry_members', 'read', undefined, row => row.status === 'pending').count + previewData('schedule_swap_requests', 'read', undefined, row => row.status === 'pending').count;
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const currentView = viewForPath(location.pathname);
  const isAdminMode = location.pathname.startsWith('/admin');
  const routeId = decodeURIComponent(location.pathname.split('/').slice(-1)[0] || '');
  const detailCollection = currentView === 'admin_ministerio_detalhes' ? 'ministries' : currentView === 'admin_voluntario_perfil' ? 'profiles' : 'schedules';
  const selectedEscala = (['detalhes', 'admin_ministerio_detalhes', 'admin_voluntario_perfil'].includes(currentView) ? previewData(detailCollection, 'read', undefined, row => row.id === routeId, { single: true }).data : null) || location.state?.selected;

  // Modals state
  const [trocaModalOpen, setTrocaModalOpen] = useState(false);
  const [selectedTrocaSlot, setSelectedTrocaSlot] = useState<any>(null);
  const [selectedSongModal, setSelectedSongModal] = useState<any>(null);

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
    navigate(pathForView(view, data), { state: data ? { selected: data } : undefined });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const { showApp, user, showLogin } = usePreview()
  const previousShowApp = React.useRef(showApp);
  useEffect(() => {
    if (previousShowApp.current !== showApp) {
      navigate(showApp ? '/inicio' : '/login');
      previousShowApp.current = showApp;
    }
  }, [showApp, navigate]);

  const authMode = location.pathname === '/cadastro' ? 'register' : location.pathname === '/escolher-ministerio' ? 'select_ministry' : location.pathname === '/aguardando-aprovacao' ? 'pending_approval' : 'login';
  const setAuthMode = (mode: 'login' | 'register' | 'select_ministry' | 'pending_approval') => navigate(({ login: '/login', register: '/cadastro', select_ministry: '/escolher-ministerio', pending_approval: '/aguardando-aprovacao' })[mode]);
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
  }, [user?.id, dataRevision])

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

  if (!showApp || isPublicPath(location.pathname)) {
    return (
      <AuthLayout controls={
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      }>
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
      </AuthLayout>
    )
  }

  // Se o usuário está autenticado, mas não possui ministérios aprovados
  const hasApprovedMinistry = userMemberships.some((m: any) => m.status === 'approved')
  const hasPendingMinistry = userMemberships.some((m: any) => m.status === 'pending')

  if (!hasApprovedMinistry && userMemberships.length === 0 && authMode !== 'pending_approval') {
    return (
      <div className="flex min-h-screen w-full bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">
        <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar p-6 sm:p-12">
          <div className="flex justify-between items-center max-w-2xl mx-auto w-full mb-4 rounded-2xl bg-brand-surface px-4">
            <div className="flex items-center gap-2">
              <BrandLogo />
            </div>
            <Button variant="ghost" size="sm" onClick={() => showLogin()} className="text-white hover:bg-white/10 hover:text-white font-bold">
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
          <div className="flex justify-between items-center max-w-md mx-auto w-full mb-4 rounded-2xl bg-brand-surface px-4">
            <div className="flex items-center gap-2">
              <BrandLogo />
            </div>
            <Button variant="ghost" size="sm" onClick={() => showLogin()} className="text-white hover:bg-white/10 hover:text-white font-bold">
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
        <div className="h-24 flex items-center px-8 bg-brand-surface cursor-pointer" onClick={() => navigateTo('home')}>
          <div className="flex items-center gap-3">
            <BrandLogo />
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
              <SidebarItem icon={<ListChecks />} label="Solicitações" active={currentView === 'admin_solicitacoes'} badge={pendingRequestsCount > 0 ? String(pendingRequestsCount) : undefined} onClick={() => navigateTo('admin_solicitacoes')} />
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
            onClick={() => { navigateTo(isAdminMode ? 'home' : 'admin_dashboard'); }}
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
        <header className="md:hidden h-20 flex items-center justify-between px-5 sm:px-6 bg-brand-surface text-white z-20 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
            <BrandLogo />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigateTo(isAdminMode ? 'home' : 'admin_dashboard')} aria-label={isAdminMode ? 'Abrir área do voluntário' : 'Abrir administração'}>
              {isAdminMode ? 'Voluntário' : 'Admin'}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        <div key={dataRevision} className="flex-1 overflow-y-auto custom-scrollbar pb-24 md:pb-6">
          <Outlet context={{ currentView, navigateTo, setTrocaModalOpen, toggleTheme, isDarkMode, user, userProfile, userMemberships, unreadNotificationsCount, selectedEscala, setSelectedTrocaSlot, setSelectedSongModal, refreshUserData, showLogin }} />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border z-30 pb-safe" aria-label={isAdminMode ? 'Navegação administrativa' : 'Navegação do voluntário'}>
        <div className="flex justify-around items-center px-2 py-3 overflow-x-auto">
          {isAdminMode ? <>
            <BottomNavItem icon={<LayoutDashboard />} label="Painel" active={currentView === 'admin_dashboard'} onClick={() => navigateTo('admin_dashboard')} />
            <BottomNavItem icon={<Users />} label="Ministérios" active={currentView.startsWith('admin_ministerio')} onClick={() => navigateTo('admin_ministerios')} />
            <BottomNavItem icon={<Calendar />} label="Escalas" active={currentView.startsWith('admin_escala')} onClick={() => navigateTo('admin_escalas')} />
            <BottomNavItem icon={<User />} label="Pessoas" active={currentView.startsWith('admin_voluntario')} onClick={() => navigateTo('admin_voluntarios')} />
            <BottomNavItem icon={<ListChecks />} label="Pedidos" active={currentView === 'admin_solicitacoes'} onClick={() => navigateTo('admin_solicitacoes')} />
            <BottomNavItem icon={<Music />} label="Músicas" active={currentView === 'admin_repertorio'} onClick={() => navigateTo('admin_repertorio')} />
            <BottomNavItem icon={<MessageSquare />} label="Feed" active={currentView === 'admin_feed'} onClick={() => navigateTo('admin_feed')} />
            <BottomNavItem icon={<PieChart />} label="Relatórios" active={currentView === 'admin_relatorios'} onClick={() => navigateTo('admin_relatorios')} />
          </> : <>
          <BottomNavItem icon={<Home />} label="Início" active={currentView === 'home'} onClick={() => navigateTo('home')} />
          <BottomNavItem icon={<Calendar />} label="Escalas" active={currentView === 'escalas' || currentView === 'detalhes'} onClick={() => navigateTo('escalas')} />
          <BottomNavItem icon={<MessageSquare />} label="Feed" active={currentView === 'feed'} onClick={() => navigateTo('feed')} />
          <BottomNavItem icon={<Music />} label="Repertório" active={currentView === 'repertorio'} onClick={() => navigateTo('repertorio')} />
          <BottomNavItem icon={<User />} label="Perfil" active={currentView === 'perfil' || currentView === 'conquistas'} onClick={() => navigateTo('perfil')} />
          </>}
        </div>
      </nav>

      {/* Global Modals */}
      <React.Suspense fallback={null}><AnimatePresence>
        {trocaModalOpen && (
          <TrocaModal 
            isOpen={trocaModalOpen} 
            onClose={() => setTrocaModalOpen(false)} 
            slot={selectedTrocaSlot}
            userMemberships={userMemberships}
          />
        )}
        {selectedSongModal && <SongDetailsModal song={selectedSongModal} onClose={() => setSelectedSongModal(null)} />}
      </AnimatePresence></React.Suspense>

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

