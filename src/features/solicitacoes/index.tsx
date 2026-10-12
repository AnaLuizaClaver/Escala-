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

export function AdminSolicitacoesView({ navigateTo }: any) {
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
