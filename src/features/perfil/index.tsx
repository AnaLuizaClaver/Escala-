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

export function PerfilView({ 
  navigateTo, 
  user, 
  userProfile, 
  userMemberships = [], 
  onRefreshProfile, 
  onSignOut, 
  toggleTheme, 
  isDarkMode 
}: any) {
  const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const SHIFTS = ['Manhã', 'Tarde', 'Noite'];
  
  const [availability, setAvailability] = useState<Record<string, string[]>>({
    Dom: ['Manhã', 'Noite'],
    Seg: [],
    Ter: ['Noite'],
    Qua: ['Tarde', 'Noite'],
    Qui: ['Noite'],
    Sex: ['Noite'],
    Sáb: ['Tarde', 'Noite']
  });

  const [savingAvailability, setSavingAvailability] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [birthDate, setBirthDate] = useState(userProfile?.birth_date || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Metrics
  const [stats, setStats] = useState({
    confirmedCount: 0,
    attendanceRate: 100,
    loading: true
  });

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setPhone(userProfile.phone || '');
      setBirthDate(userProfile.birth_date || '');
      if (userProfile.availability && typeof userProfile.availability === 'object') {
        setAvailability(userProfile.availability);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) return;
      const approvedIds = userMemberships.filter((m: any) => m.status === 'approved').map((m: any) => m.id);
      if (approvedIds.length === 0) {
        setStats({ confirmedCount: 0, attendanceRate: 100, loading: false });
        return;
      }

      try {
        const { count: confirmed } = previewData('schedule_members', 'read', undefined, (row: any) => (approvedIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'response') === 'confirmed', { single: false, limit: undefined, order: undefined });

        const { count: declined } = previewData('schedule_members', 'read', undefined, (row: any) => (approvedIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'response') === 'declined', { single: false, limit: undefined, order: undefined });

        const total = (confirmed || 0) + (declined || 0);
        const rate = total > 0 ? Math.round(((confirmed || 0) / total) * 100) : 100;

        setStats({
          confirmedCount: confirmed || 0,
          attendanceRate: rate,
          loading: false
        });
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    void loadStats();
  }, [user?.id, userMemberships]);

  const toggleAvailability = (day: string, shift: string) => {
    setAvailability(prev => {
      const dayShifts = prev[day] || [];
      const newShifts = dayShifts.includes(shift) 
        ? dayShifts.filter(s => s !== shift)
        : [...dayShifts, shift];
      return { ...prev, [day]: newShifts };
    });
  };

  const handleSaveAvailability = async () => {
    if (!user?.id) return;
    setSavingAvailability(true);
    try {
      const { error } = previewData('profiles', 'update', {
          availability,
          updated_at: new Date().toISOString()
        }, (row: any) => getField(row, 'id') === user.id, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.success('Disponibilidade semanal salva com sucesso!');
      onRefreshProfile?.();
    } catch (err: any) {
      toast.error('Erro ao salvar disponibilidade: ' + err.message);
    } finally {
      setSavingAvailability(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSavingProfile(true);
    try {
      const { error } = previewData('profiles', 'update', {
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          birth_date: birthDate || null,
          updated_at: new Date().toISOString()
        }, (row: any) => getField(row, 'id') === user.id, { single: false, limit: undefined, order: undefined });

      if (error) {
        toast.error('Erro ao salvar perfil: ' + error.message);
      } else {
        toast.success('Perfil atualizado com sucesso!');
        setEditModalOpen(false);
        onRefreshProfile?.();
      }
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const approvedMinistries = userMemberships.filter((m: any) => m.status === 'approved');
  const primaryMinistry = approvedMinistries.length > 0 ? approvedMinistries[0].ministries?.name : 'Voluntário';

  const totalXp = stats.confirmedCount * 250;
  const currentLevel = Math.max(1, Math.floor(totalXp / 1000) + 1);
  const xpInCurrentLevel = totalXp % 1000;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / 1000) * 100));

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1000px] mx-auto w-full animate-in fade-in duration-300">
      {/* Header / Banner */}
      <div className="relative mb-20 md:mb-24">
        <div className="h-32 md:h-48 w-full bg-primary rounded-3xl overflow-hidden relative border-4 border-card shadow-sm">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.05)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.05)_75%,transparent_75%,transparent)] bg-[length:24px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"></div>
        </div>
        <div className="absolute -bottom-12 md:-bottom-16 left-6 md:left-10 flex items-end gap-5">
          <Avatar 
            src={userProfile?.avatar_url} 
            fallback={userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'V'}
            size="xl" 
            className="w-24 h-24 md:w-32 md:h-32 border-4 border-card shadow-lg text-2xl font-black bg-secondary"
          />
          <div className="mb-2 hidden sm:block">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {userProfile?.full_name || 'Voluntário'}
            </h1>
            <p className="font-semibold text-muted-foreground">{primaryMinistry}</p>
          </div>
        </div>
        <div className="absolute -bottom-6 right-6 flex gap-2">
          <Button variant="secondary" size="icon" className="cursor-pointer" onClick={() => setEditModalOpen(true)}>
            <Edit2 className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="icon" className="cursor-pointer" onClick={() => navigateTo('configuracoes')}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="sm:hidden mb-8 px-2">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {userProfile?.full_name || 'Voluntário'}
        </h1>
        <p className="font-semibold text-muted-foreground">{primaryMinistry}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          
          {/* Histórico */}
          <section>
            <SectionHeader title="Seu Histórico" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-card to-secondary/30 rounded-3xl border-border">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-3xl font-extrabold">{stats.confirmedCount}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Escalas Concluídas</p>
              </Card>

              <Card className="flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-card to-secondary/30 rounded-3xl border-border">
                <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="text-3xl font-extrabold">{stats.attendanceRate}%</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Presença</p>
              </Card>

              <Card className="flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-card to-secondary/30 rounded-3xl border-border">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-3xl font-extrabold">{approvedMinistries.length}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Ministérios Ativos</p>
              </Card>
            </div>
          </section>

          {/* Disponibilidade */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <SectionHeader title="Disponibilidade Semanal" />
              <Button 
                variant="primary" 
                size="sm" 
                className="font-bold cursor-pointer"
                disabled={savingAvailability}
                onClick={handleSaveAvailability}
              >
                {savingAvailability ? 'Salvando...' : 'Salvar Disponibilidade'}
              </Button>
            </div>
            
            <Card className="p-0 overflow-x-auto hide-scrollbar border-border rounded-3xl">
              <div className="min-w-[600px] p-6">
                <div className="grid grid-cols-8 gap-4 mb-4">
                  <div></div>
                  {DAYS_OF_WEEK.map(day => (
                    <div key={day} className="text-center text-xs font-extrabold text-muted-foreground uppercase tracking-widest">{day}</div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  {SHIFTS.map(shift => (
                    <div key={shift} className="grid grid-cols-8 gap-4 items-center">
                      <div className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest text-right pr-2">
                        {shift}
                      </div>
                      {DAYS_OF_WEEK.map(day => {
                        const isAvailable = availability[day]?.includes(shift);
                        return (
                          <div 
                            key={`${day}-${shift}`}
                            onClick={() => toggleAvailability(day, shift)}
                            className={cn(
                              "h-12 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all active:scale-95",
                              isAvailable 
                                ? "bg-primary border-primary text-primary-foreground shadow-sm" 
                                : "bg-card border-border/60 hover:border-primary/50 text-transparent"
                            )}
                          >
                            {isAvailable && <Check className="w-5 h-5 stroke-[3]" />}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>
        </div>

        <div className="md:col-span-4 space-y-8">
          
          <Card hoverable className="bg-foreground text-background border-foreground cursor-pointer rounded-3xl" onClick={() => navigateTo('conquistas')}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary">
                <Award className="w-5 h-5" />
                <span className="font-extrabold uppercase tracking-widest text-xs">Suas Conquistas</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="text-center mb-6">
              <p className="text-sm font-bold text-muted-foreground mb-1">Nível Atual</p>
              <h2 className="text-5xl font-extrabold mb-2">Nv. {currentLevel}</h2>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span>{totalXp} XP</span>
                <span>Nv. {currentLevel + 1}</span>
              </div>
              <div className="h-3 bg-secondary/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-border">
            <h3 className="font-extrabold text-lg mb-4">Ministérios Ativos</h3>
            {approvedMinistries.length === 0 ? (
              <p className="text-xs font-bold text-muted-foreground">Nenhum ministério ativo ainda.</p>
            ) : (
              <div className="space-y-3">
                {approvedMinistries.map((m: any) => (
                  <div key={m.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-secondary/30 border border-border">
                    <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center border border-border shrink-0">
                      {getMinistryIconComponent(m.ministries?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-sm truncate">{m.ministries?.name || 'Ministério'}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                        {m.role === 'leader' ? 'Líder de Equipe' : 'Voluntário Ativo'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>
      </div>

      {/* Modal de Edição de Dados */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Perfil">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Nome Completo
            </label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              WhatsApp / Celular
            </label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Data de Nascimento
            </label>
            <input 
              type="date" 
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1 font-bold" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold" disabled={savingProfile}>
              {savingProfile ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Configurações da Conta */}
      <Modal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} title="Configurações da Conta">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/40 border border-border">
            <div>
              <p className="font-extrabold text-sm">Tema do Aplicativo</p>
              <p className="text-xs text-muted-foreground">Alternar entre claro e escuro</p>
            </div>
            <Button variant="outline" size="sm" className="font-bold" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="w-4 h-4 mr-1.5" /> : <Moon className="w-4 h-4 mr-1.5" />}
              {isDarkMode ? 'Tema Claro' : 'Tema Escuro'}
            </Button>
          </div>

          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-between">
            <div>
              <p className="font-extrabold text-sm text-destructive">Desconectar da Conta</p>
              <p className="text-xs text-muted-foreground">Sair do aplicativo neste aparelho</p>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              className="font-bold cursor-pointer"
              onClick={() => {
                setSettingsModalOpen(false);
                onSignOut?.();
              }}
            >
              <LogOut className="w-4 h-4 mr-1.5" /> Sair
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


export function ConfiguracoesView({ toggleTheme, isDarkMode, navigateTo, user, userProfile, onRefreshProfile, showLogin }: any) {
  const { showLogin: authSignOut } = usePreview();
  const [pushNotif, setPushNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#C6FF4D');

  const [cfgFullName, setCfgFullName] = useState(userProfile?.full_name || '');
  const [cfgPhone, setCfgPhone] = useState(userProfile?.phone || '');
  const [savingAccount, setSavingAccount] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setCfgFullName(userProfile.full_name || '');
      setCfgPhone(userProfile.phone || '');
    }
  }, [userProfile]);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSavingAccount(true);
    try {
      const { error } = previewData('profiles', 'update', {
          full_name: cfgFullName.trim(),
          phone: cfgPhone.trim() || null,
          updated_at: new Date().toISOString()
        }, (row: any) => getField(row, 'id') === user.id, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.success('Dados salvos com sucesso!');
      onRefreshProfile?.();
    } catch (err: any) {
      toast.error('Erro ao salvar alterações: ' + err.message);
    } finally {
      setSavingAccount(false);
    }
  };
  

  const colors = [
    { name: 'Neon Green', hex: '#C6FF4D' },
    { name: 'Ocean Blue', hex: '#3b82f6' },
    { name: 'Amethyst', hex: '#a855f7' },
    { name: 'Sunset', hex: '#f97316' },
    { name: 'Rose', hex: '#ec4899' }
  ];

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex);
    document.documentElement.style.setProperty('--primary', hex);
  };

  const handleLogout = async () => {
    try {
      if (showLogin) {
        await showLogin();
      } else {
        await authSignOut();
      }
      toast.success('Sessão encerrada com sucesso.');
    } catch (err) {
      toast.error('Erro ao sair da conta.');
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[800px] mx-auto w-full animate-in fade-in duration-300">
      
      <div className="flex items-center gap-4 mb-8">
        <Button variant="secondary" size="icon" onClick={() => navigateTo('perfil')} className="md:hidden cursor-pointer">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            Preferências
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Configurações</h1>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Aparência */}
        <section>
          <SectionHeader title="Aparência" />
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-base mb-1">Modo Escuro</h4>
                <p className="text-sm font-semibold text-muted-foreground">Alternar entre tema claro e escuro</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={cn("w-14 h-8 rounded-full transition-colors relative cursor-pointer", isDarkMode ? "bg-primary" : "bg-secondary border border-border")}
              >
                <div className={cn("absolute top-1 w-6 h-6 rounded-full bg-background shadow-sm transition-all flex items-center justify-center", isDarkMode ? "left-7" : "left-1")}>
                  {isDarkMode ? <Moon className="w-3.5 h-3.5 text-foreground" /> : <Sun className="w-3.5 h-3.5 text-foreground" />}
                </div>
              </button>
            </div>

            <div className="pt-6 border-t border-border">
              <h4 className="font-extrabold text-base mb-1">Cor de Destaque</h4>
              <p className="text-sm font-semibold text-muted-foreground mb-4">Personalize a cor principal do aplicativo</p>
              <div className="flex gap-3 flex-wrap">
                {colors.map(c => (
                  <button 
                    key={c.hex}
                    onClick={() => handleColorChange(c.hex)}
                    className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer", selectedColor === c.hex ? "ring-2 ring-offset-2 ring-offset-background scale-110 shadow-md" : "hover:scale-105 border border-border/10")}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor === c.hex && <Check className="w-5 h-5 text-[#111111]" />}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Notificações */}
        <section>
          <SectionHeader title="Notificações" />
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base mb-1">Notificações Push</h4>
                  <p className="text-sm font-semibold text-muted-foreground">Alertas diretos no seu celular ou navegador</p>
                </div>
              </div>
              <button 
                onClick={() => setPushNotif(!pushNotif)}
                className={cn("w-12 h-6 rounded-full transition-colors relative cursor-pointer", pushNotif ? "bg-primary" : "bg-secondary border border-border")}
              >
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-background shadow-sm transition-all", pushNotif ? "left-7" : "left-1")}></div>
              </button>
            </div>

            <div className="pt-6 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base mb-1">Lembretes por WhatsApp</h4>
                  <p className="text-sm font-semibold text-muted-foreground">Receba a sua escala da semana direto no WhatsApp</p>
                </div>
              </div>
              <button 
                onClick={() => setWhatsappNotif(!whatsappNotif)}
                className={cn("w-12 h-6 rounded-full transition-colors relative cursor-pointer", whatsappNotif ? "bg-primary" : "bg-secondary border border-border")}
              >
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-background shadow-sm transition-all", whatsappNotif ? "left-7" : "left-1")}></div>
              </button>
            </div>
          </Card>
        </section>

        {/* Dados da Conta */}
        <section>
          <SectionHeader title="Dados da Conta" />
          <form onSubmit={handleSaveAccount}>
            <Card className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative group cursor-pointer shrink-0">
                  <Avatar 
                    src={userProfile?.avatar_url} 
                    alt={userProfile?.full_name || "Perfil"} 
                    size="xl" 
                    className="w-24 h-24" 
                    fallback={userProfile?.full_name?.charAt(0) || "U"}
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">Nome de Exibição</label>
                    <input 
                      type="text" 
                      value={cfgFullName} 
                      onChange={e => setCfgFullName(e.target.value)}
                      required
                      className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">E-mail</label>
                  <input type="email" value={user?.email || ""} disabled className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 text-sm font-bold text-muted-foreground cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">Telefone / WhatsApp</label>
                  <input 
                    type="tel" 
                    value={cfgPhone} 
                    onChange={e => setCfgPhone(e.target.value)}
                    placeholder="(11) 98888-7777"
                    className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={savingAccount} className="cursor-pointer font-bold">
                  {savingAccount ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </Card>
          </form>
        </section>

        <div className="pt-6 border-t border-border flex justify-center">
          <Button variant="ghost" onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" /> Encerrar Sessão
          </Button>
        </div>

      </div>
    </div>
  );
}



