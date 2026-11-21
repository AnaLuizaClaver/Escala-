import React from 'react';
import { useOutletContext } from 'react-router';
const HomeView = React.lazy(() => import('../../features/dashboard').then(m => ({ default: m.HomeView })));
const EscalasView = React.lazy(() => import('../../features/escalas').then(m => ({ default: m.EscalasView })));
const DetalhesView = React.lazy(() => import('../../features/escalas').then(m => ({ default: m.DetalhesView })));
const RepertorioView = React.lazy(() => import('../../features/repertorio').then(m => ({ default: m.RepertorioView })));
const FeedView = React.lazy(() => import('../../features/feed').then(m => ({ default: m.FeedView })));
const NotificacoesView = React.lazy(() => import('../../features/notificacoes').then(m => ({ default: m.NotificacoesView })));
const PerfilView = React.lazy(() => import('../../features/perfil').then(m => ({ default: m.PerfilView })));
const ConfiguracoesView = React.lazy(() => import('../../features/perfil').then(m => ({ default: m.ConfiguracoesView })));
const ConquistasView = React.lazy(() => import('../../features/conquistas').then(m => ({ default: m.ConquistasView })));
const MeusMinisteriosView = React.lazy(() => import('../../features/ministerios').then(m => ({ default: m.MeusMinisteriosView })));
const AdminMinisteriosView = React.lazy(() => import('../../features/ministerios').then(m => ({ default: m.AdminMinisteriosView })));
const AdminMinisterioDetalhesView = React.lazy(() => import('../../features/ministerios').then(m => ({ default: m.AdminMinisterioDetalhesView })));
const AdminDashboardView = React.lazy(() => import('../../features/admin-dashboard').then(m => ({ default: m.AdminDashboardView })));
const AdminEscalasView = React.lazy(() => import('../../features/admin-escalas').then(m => ({ default: m.AdminEscalasView })));
const AdminEscalaCreateView = React.lazy(() => import('../../features/admin-escalas').then(m => ({ default: m.AdminEscalaCreateView })));
const AdminVoluntariosView = React.lazy(() => import('../../features/voluntarios').then(m => ({ default: m.AdminVoluntariosView })));
const AdminVoluntarioPerfilView = React.lazy(() => import('../../features/voluntarios').then(m => ({ default: m.AdminVoluntarioPerfilView })));
const AdminSolicitacoesView = React.lazy(() => import('../../features/solicitacoes').then(m => ({ default: m.AdminSolicitacoesView })));
const AdminRepertorioView = React.lazy(() => import('../../features/admin-repertorio').then(m => ({ default: m.AdminRepertorioView })));
const AdminFeedView = React.lazy(() => import('../../features/admin-feed').then(m => ({ default: m.AdminFeedView })));
const AdminRelatoriosView = React.lazy(() => import('../../features/relatorios').then(m => ({ default: m.AdminRelatoriosView })));

export default function RouteContent() {
  const { currentView, navigateTo, setTrocaModalOpen, toggleTheme, isDarkMode, user, userProfile, userMemberships, unreadNotificationsCount, selectedEscala, setSelectedTrocaSlot, setSelectedSongModal, refreshUserData, showLogin, canManage } = useOutletContext<any>();
  return (<React.Suspense fallback={<div className="p-8 text-sm font-bold text-muted-foreground">Carregando...</div>}>
          {currentView === 'home' && (
            <HomeView 
              navigateTo={navigateTo} 
              onTrocaClick={(slot: any) => {
                setSelectedTrocaSlot(slot);
                setTrocaModalOpen(true);
              }}
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
              userProfile={userProfile}
              onOpenTroca={(slot: any) => {
                setSelectedTrocaSlot(slot);
                setTrocaModalOpen(true);
              }}
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
              canManage={canManage}
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
  </React.Suspense>);
}
