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

export function EscalasView({ navigateTo, user, userMemberships }: any) {
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

export function DetalhesView({ escala, onBack, onOpenTroca, onOpenSong, user, userMemberships }: any) {
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


export function TrocaModal({ isOpen, onClose, slot, userMemberships }: any) {
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

