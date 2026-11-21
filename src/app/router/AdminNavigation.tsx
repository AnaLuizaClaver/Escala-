import { Calendar, LayoutDashboard, ListChecks, MessageSquare, Music, PieChart, User, Users } from 'lucide-react';
import { BottomNavItem, SidebarItem } from '../../shared/ui';
import type { View } from './routes';

export const adminNavigation = [
  { view: 'admin_dashboard', label: 'Dashboard', mobile: 'Painel', icon: LayoutDashboard },
  { view: 'admin_ministerios', label: 'Ministérios', mobile: 'Ministérios', icon: Users },
  { view: 'admin_escalas', label: 'Escalas', mobile: 'Escalas', icon: Calendar },
  { view: 'admin_voluntarios', label: 'Voluntários', mobile: 'Pessoas', icon: User },
  { view: 'admin_repertorio', label: 'Repertório', mobile: 'Músicas', icon: Music },
  { view: 'admin_solicitacoes', label: 'Solicitações', mobile: 'Pedidos', icon: ListChecks },
  { view: 'admin_feed', label: 'Feed', mobile: 'Feed', icon: MessageSquare },
  { view: 'admin_relatorios', label: 'Relatórios', mobile: 'Relatórios', icon: PieChart },
] as const;

const parentView: Partial<Record<View, View>> = {
  admin_ministerio_detalhes: 'admin_ministerios',
  admin_escala_create: 'admin_escalas',
  admin_voluntario_perfil: 'admin_voluntarios',
};

export default function AdminNavigation({ currentView, navigateTo, pendingCount, mobile = false }: {
  currentView: View;
  navigateTo: (view: View) => void;
  pendingCount: number;
  mobile?: boolean;
}) {
  return adminNavigation.map(({ view, label, mobile: shortLabel, icon: Icon }) => {
    const props = {
      icon: <Icon />,
      active: (parentView[currentView] ?? currentView) === view,
      onClick: () => navigateTo(view),
    };
    return mobile
      ? <BottomNavItem key={view} label={shortLabel} admin {...props} />
      : <SidebarItem key={view} label={label} {...props}
          badge={view === 'admin_solicitacoes' && pendingCount > 0 ? String(pendingCount) : undefined} />;
  });
}
