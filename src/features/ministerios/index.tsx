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

export function MeusMinisteriosView({ user, userMemberships = [], onRefreshMemberships }: any) {
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


export function AdminMinisteriosView({ navigateTo }: any) {
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

export function AdminMinisterioDetalhesView({ ministry, navigateTo }: any) {
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

