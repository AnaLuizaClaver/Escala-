import React, { useState, useEffect } from 'react';
import { previewData, getField } from '../../mocks/previewData';
import { usePreview } from '../../hooks/usePreview';
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

import { cn, Button, Badge, Card, Avatar, Modal, formatDatePtBR, formatFullDatePtBR, formatTimePtBR, SidebarItem, BottomNavItem, SectionHeader, ProximoCultoCard, EscalaAbertaCard, VoluntarioMesCard, AniversariosCard, AvisoCard, getMinistryIconComponent } from '../../shared/ui';

export function NotificacoesView({ navigateTo, user, userMemberships = [] }: any) {
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

export function NotificationCard({ data }: any) {
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

