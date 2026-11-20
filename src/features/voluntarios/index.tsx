import {
Calendar,
ChevronLeft,
ChevronRight,
Search,
ShieldCheck,
Trophy,
Users
} from 'lucide-react';
import React,{ useEffect,useState } from 'react';
import { toast } from 'sonner';
import { getField,previewData } from '../../mocks/previewData';

import { Avatar,Badge,Button,Card,Modal,SectionHeader,formatDatePtBR,getMinistryIconComponent } from '../../shared/ui';

export function AdminVoluntariosView({ navigateTo }: any) {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [ministries, setMinistries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterMin, setFilterMin] = useState('Todos');
  const [filterRole, setFilterRole] = useState('Todos');
  const [search, setSearch] = useState('');

  const loadVolunteers = async () => {
    setLoading(true);
    try {
      // 1. Carregar Ministérios
      const { data: minList } = previewData('ministries', 'read', undefined, () => true, { single: false, limit: undefined, order: ['name', {}] });
      setMinistries(minList || []);

      // 2. Carregar Perfis com Membros
      const { data, error } = previewData('profiles', 'read', undefined, () => true, { single: false, limit: undefined, order: ['full_name', {}] });

      if (error) throw error;
      setVolunteers(data || []);
    } catch (err) {
      console.error('Erro ao carregar voluntários:', err);
      toast.error('Erro ao carregar lista de voluntários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadVolunteers();
  }, []);

  const filteredVolunteers = volunteers.filter(v => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = v.full_name?.toLowerCase().includes(q);
      const matchPhone = v.phone?.toLowerCase().includes(q);
      if (!matchName && !matchPhone) return false;
    }

    if (filterMin !== 'Todos') {
      const hasMinistry = (v.ministry_members || []).some(
        (mm: any) => mm.status === 'approved' && mm.ministries?.id === filterMin
      );
      if (!hasMinistry) return false;
    }

    if (filterRole === 'Líderes') {
      const isLeader = (v.ministry_members || []).some((mm: any) => mm.role === 'leader' && mm.status === 'approved');
      if (!isLeader) return false;
    } else if (filterRole === 'Voluntários') {
      const isOnlyVolunteer = (v.ministry_members || []).every((mm: any) => mm.role !== 'leader');
      if (!isOnlyVolunteer) return false;
    }

    return true;
  });

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Gerenciamento
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Diretório de Voluntários</h1>
        </div>
      </div>

      <Card className="mb-8 p-4 bg-secondary/30 flex flex-col sm:flex-row gap-4 border border-border rounded-3xl">
        <div className="flex-1 relative">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
            Pesquisar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou WhatsApp..."
              className="w-full h-11 bg-background border border-border rounded-2xl pl-9 pr-3 text-sm font-bold focus:outline-none focus:border-primary placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
            Ministério
          </label>
          <select 
            value={filterMin} 
            onChange={e => setFilterMin(e.target.value)} 
            className="w-full h-11 bg-background border border-border rounded-2xl px-3 text-sm font-bold focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos os Ministérios</option>
            {ministries.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
            Função / Privilégio
          </label>
          <select 
            value={filterRole} 
            onChange={e => setFilterRole(e.target.value)} 
            className="w-full h-11 bg-background border border-border rounded-2xl px-3 text-sm font-bold focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos</option>
            <option value="Líderes">Apenas Líderes</option>
            <option value="Voluntários">Apenas Voluntários</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Carregando voluntários...</p>
        </div>
      ) : filteredVolunteers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed rounded-3xl">
          <Users className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-extrabold text-xl mb-2">Nenhum voluntário encontrado</h3>
          <p className="text-muted-foreground font-semibold text-sm max-w-sm">
            Tente ajustar os filtros ou os termos da pesquisa.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredVolunteers.map(v => {
            const approvedMinistries = (v.ministry_members || []).filter((mm: any) => mm.status === 'approved');
            const isLeader = approvedMinistries.some((mm: any) => mm.role === 'leader');

            return (
              <Card 
                key={v.id} 
                hoverable 
                onClick={() => navigateTo('admin_voluntario_perfil', v)} 
                className="p-5 flex items-start gap-4 rounded-3xl border-border cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Avatar 
                  src={v.avatar_url} 
                  fallback={v.full_name?.charAt(0) || 'V'} 
                  size="lg" 
                />
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-extrabold text-base truncate">{v.full_name || 'Voluntário'}</h3>
                    {isLeader && <ShieldCheck className="w-4 h-4 text-primary shrink-0" />}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {approvedMinistries.length === 0 ? (
                      <Badge variant="secondary" className="px-2 py-0 text-[9px]">Sem ministério</Badge>
                    ) : (
                      approvedMinistries.map((m: any) => (
                        <Badge key={m.id} variant="secondary" className="px-2 py-0 text-[9px]">
                          {m.ministries?.name}
                        </Badge>
                      ))
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <span>{v.phone || 'Sem WhatsApp'}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
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

export function AdminVoluntarioPerfilView({ voluntario, navigateTo }: any) {
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({ confirmedCount: 0, attendanceRate: 100 });
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [honorModalOpen, setHonorModalOpen] = useState(false);
  const [honorReason, setHonorReason] = useState('Destaque pelo serviço e dedicação exemplar!');
  const [honorMinistryId, setHonorMinistryId] = useState('');
  const [submittingHonor, setSubmittingHonor] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      if (!voluntario?.id) return;
      setLoadingHistory(true);

      try {
        const approvedMemberIds = (voluntario.ministry_members || [])
          .filter((mm: any) => mm.status === 'approved')
          .map((mm: any) => mm.id);

        if (approvedMemberIds.length === 0) {
          setHistory([]);
          setStats({ confirmedCount: 0, attendanceRate: 100 });
          setLoadingHistory(false);
          return;
        }

        const { data: scheduleMembersData } = previewData('schedule_members', 'read', undefined, (row: any) => (approvedMemberIds).includes(getField(row, 'ministry_member_id')), { single: false, limit: undefined, order: ['schedules(date)', { ascending: false }] });

        const historyList = scheduleMembersData || [];
        setHistory(historyList);

        const confirmed = historyList.filter((m: any) => m.response === 'confirmed').length;
        const total = historyList.length;
        const rate = total > 0 ? Math.round((confirmed / total) * 100) : 100;

        setStats({
          confirmedCount: confirmed,
          attendanceRate: rate
        });
      } catch (err) {
        console.error('Erro ao carregar histórico do voluntário:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    void loadHistory();
  }, [voluntario?.id]);

  const handleHonorVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voluntario?.id) return;

    setSubmittingHonor(true);
    const now = new Date();
    try {
      const minId = honorMinistryId || (voluntario.ministry_members?.[0]?.ministries?.id) || null;
      const { error } = previewData('volunteer_of_month', 'insert', {
          volunteer_id: voluntario.id,
          ministry_id: minId,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          reason: honorReason.trim()
        }, () => true, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success(`${voluntario.full_name} foi eleito Voluntário do Mês!`);
      setHonorModalOpen(false);
    } catch (err: any) {
      toast.error('Erro ao eleger voluntário: ' + err.message);
    } finally {
      setSubmittingHonor(false);
    }
  };

  if (!voluntario) {
    return (
      <div className="p-10 text-center">
        <p className="text-muted-foreground font-bold">Nenhum voluntário selecionado.</p>
        <Button onClick={() => navigateTo('admin_voluntarios')} className="mt-4">
          Voltar para Voluntários
        </Button>
      </div>
    );
  }

  const approvedMinistries = (voluntario.ministry_members || []).filter((mm: any) => mm.status === 'approved');

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1100px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="icon" className="cursor-pointer" onClick={() => navigateTo('admin_voluntarios')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
              Perfil do Voluntário
            </p>
            <h1 className="text-3xl font-extrabold">{voluntario.full_name || 'Voluntário'}</h1>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          className="font-bold cursor-pointer"
          onClick={() => setHonorModalOpen(true)}
        >
          <Trophy className="w-4 h-4 mr-1.5" /> Eleger Voluntário do Mês
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="md:col-span-4 space-y-6">
          <Card className="text-center p-8 flex flex-col items-center rounded-3xl border-border">
            <Avatar 
              src={voluntario.avatar_url} 
              fallback={voluntario.full_name?.charAt(0) || 'V'} 
              size="xl" 
              className="mb-4 w-24 h-24 text-2xl font-black bg-secondary" 
            />
            <h2 className="text-xl font-extrabold mb-1">{voluntario.full_name || 'Voluntário'}</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
              {approvedMinistries.map((m: any) => m.ministries?.name).join(', ') || 'Voluntário da Igreja'}
            </p>
            
            <div className="w-full space-y-3 mt-4 pt-6 border-t border-border text-left">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">WhatsApp / Telefone</p>
                <p className="text-sm font-semibold truncate">{voluntario.phone || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Data de Nascimento</p>
                <p className="text-sm font-semibold truncate">{voluntario.birth_date ? formatDatePtBR(voluntario.birth_date) : 'Não informada'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="md:col-span-8 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 sm:p-6 text-center bg-secondary/30 rounded-3xl border-border">
              <p className="text-3xl font-extrabold mb-1">{stats.confirmedCount}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Escalas Servidas</p>
            </Card>
            <Card className="p-4 sm:p-6 text-center bg-secondary/30 rounded-3xl border-border">
              <p className="text-3xl font-extrabold mb-1">{stats.attendanceRate}%</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Presença</p>
            </Card>
            <Card className="p-4 sm:p-6 text-center bg-secondary/30 rounded-3xl border-border">
              <p className="text-3xl font-extrabold mb-1">{approvedMinistries.length}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ministérios</p>
            </Card>
          </div>

          {/* Ministérios */}
          <Card className="rounded-3xl border-border p-6">
            <SectionHeader title="Ministérios Ativos" />
            <div className="space-y-3 mt-4">
              {approvedMinistries.length === 0 ? (
                <p className="text-xs font-bold text-muted-foreground">Nenhum ministério ativo.</p>
              ) : (
                approvedMinistries.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                        {getMinistryIconComponent(m.ministries?.name)}
                      </div>
                      <span className="font-extrabold text-base">{m.ministries?.name}</span>
                    </div>
                    <Badge variant={m.role === 'leader' ? 'primary' : 'secondary'}>
                      {m.role === 'leader' ? 'Líder' : 'Voluntário'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Histórico Recente */}
          <Card className="rounded-3xl border-border p-6">
            <SectionHeader title="Histórico de Escalas" />
            <div className="space-y-3 mt-4">
              {loadingHistory ? (
                <div className="py-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <div className="p-8 text-center border-dashed border-2 border-border rounded-2xl">
                  <Calendar className="w-8 h-8 text-muted-foreground opacity-40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground font-semibold">Nenhuma escala registrada para este voluntário.</p>
                </div>
              ) : (
                history.map((h: any) => {
                  const s = h.schedules;
                  return (
                    <div key={h.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-background">
                      <div>
                        <p className="font-extrabold text-sm">{s?.title || 'Culto de Celebração'}</p>
                        <p className="text-xs text-muted-foreground font-semibold">
                          {s?.date ? formatDatePtBR(s.date) : ''} • {h.ministry_roles?.name || 'Posição'}
                        </p>
                      </div>
                      <Badge variant={h.response === 'confirmed' ? 'success' : h.response === 'declined' ? 'destructive' : 'warning'}>
                        {h.response === 'confirmed' ? 'Confirmado' : h.response === 'declined' ? 'Recusado' : 'Pendente'}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Eleição de Voluntário do Mês */}
      <Modal isOpen={honorModalOpen} onClose={() => setHonorModalOpen(false)} title="Eleger Voluntário do Mês">
        <form onSubmit={handleHonorVolunteer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Ministério do Destaque
            </label>
            <select 
              value={honorMinistryId} 
              onChange={e => setHonorMinistryId(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary"
            >
              {approvedMinistries.map((m: any) => (
                <option key={m.id} value={m.ministries?.id}>{m.ministries?.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Motivo da Homenagem / Reconhecimento
            </label>
            <textarea 
              value={honorReason}
              onChange={e => setHonorReason(e.target.value)}
              rows={3}
              required
              className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary"
              placeholder="Ex: Pela dedicação e pontualidade exemplar nos cultos deste mês!"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="secondary" className="flex-1 font-bold" onClick={() => setHonorModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold" disabled={submittingHonor}>
              {submittingHonor ? 'Salvando...' : 'Confirmar Homenagem'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// --- ADMIN SOLICITACOES ---

