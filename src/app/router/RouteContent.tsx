import React from 'react';
import { useOutletContext } from 'react-router';
import { HomeView } from '../../features/dashboard';
import { EscalasView, DetalhesView, TrocaModal } from '../../features/escalas';
import { RepertorioView, SongDetailsModal } from '../../features/repertorio';
import { FeedView, FeedPost } from '../../features/feed';
import { NotificacoesView, NotificationCard } from '../../features/notificacoes';
import { PerfilView, ConfiguracoesView } from '../../features/perfil';
import { ConquistasView } from '../../features/conquistas';
import { RegisterView, SelectMinistryView, PendingApprovalView } from '../../features/auth';
import { MeusMinisteriosView, AdminMinisteriosView, AdminMinisterioDetalhesView } from '../../features/ministerios';
import { AdminDashboardView } from '../../features/admin-dashboard';
import { AdminEscalasView, AdminEscalaCreateView, EditChoiceModal } from '../../features/admin-escalas';
import { AdminVoluntariosView, AdminVoluntarioPerfilView } from '../../features/voluntarios';
import { AdminSolicitacoesView } from '../../features/solicitacoes';
import { AdminRepertorioView } from '../../features/admin-repertorio';
import { AdminFeedView } from '../../features/admin-feed';
import { AdminRelatoriosView } from '../../features/relatorios';

export default function RouteContent() {
  const { currentView, navigateTo, setTrocaModalOpen, toggleTheme, isDarkMode, user, userProfile, userMemberships, unreadNotificationsCount, selectedEscala, setSelectedTrocaSlot, setSelectedSongModal, refreshUserData, showLogin } = useOutletContext<any>();
  return (<>
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
  </>);
}
