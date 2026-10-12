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

export function AdminRelatoriosView({ navigateTo }: any) {
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

