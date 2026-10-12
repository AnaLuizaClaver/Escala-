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

export function AdminDashboardView({ navigateTo, user, userProfile, toggleTheme, isDarkMode }: any) {
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



