import {
Calendar,
Check,
ChevronLeft,
Clock,
Eye,
Plus,
Repeat,
ShieldCheck,
Trash2,
Users
} from 'lucide-react';
import { useEffect,useRef,useState } from 'react';
import { toast } from 'sonner';
import { getField,hasOnlineTables,previewData,saveData,saveOnlineSchedule } from '../../mocks/previewData';

import { Avatar,Badge,Button,Card,Modal,SectionHeader,cn,formatDatePtBR,formatTimePtBR } from '../../shared/ui';

export function AdminEscalasView({ navigateTo }: any) {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [ministries, setMinistries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedMinistryId, setSelectedMinistryId] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedFill, setSelectedFill] = useState('Todos');

  const loadAdminEscalas = async () => {
    setLoading(true);
    try {
      // 1. Carregar Ministérios
      const { data: minList } = previewData('ministries', 'read', undefined, () => true, { single: false, limit: undefined, order: ['name', {}] });

      setMinistries(minList || []);

      // 2. Carregar Escalas
      const { data: schedulesData, error } = previewData('schedules', 'read', undefined, () => true, { single: false, limit: undefined, order: ['date', { ascending: false }] });

      if (error) throw error;
      setSchedules(schedulesData || []);
    } catch (err) {
      console.error('Erro ao carregar escalas:', err);
      toast.error('Erro ao carregar lista de escalas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAdminEscalas();
  }, []);

  const handleTogglePublish = async (scheduleId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const { error } = await saveData('schedules', 'update', { status: nextStatus }, (row: any) => getField(row, 'id') === scheduleId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success(nextStatus === 'published' ? 'Escala publicada aos voluntários!' : 'Escala retornada a rascunho.');
      setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, status: nextStatus } : s));
    } catch (err: any) {
      toast.error('Erro ao alterar status da escala: ' + err.message);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta escala?')) return;
    try {
      const { error } = await saveData('schedules', 'delete', undefined, (row: any) => getField(row, 'id') === scheduleId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success('Escala excluída com sucesso.');
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    } catch (err: any) {
      toast.error('Erro ao excluir escala: ' + err.message);
    }
  };

  // Filtered schedules
  const filteredSchedules = schedules.filter(s => {
    if (selectedMinistryId !== 'Todos' && s.ministries?.id !== selectedMinistryId) return false;
    if (selectedStatus !== 'Todos' && s.status !== selectedStatus) return false;
    
    const members = s.schedule_members || [];
    const openSlots = members.filter((m: any) => !m.ministry_member_id).length;
    const isComplete = openSlots === 0 && members.length > 0;

    if (selectedFill === 'Completas' && !isComplete) return false;
    if (selectedFill === 'Vagas' && (isComplete || members.length === 0)) return false;

    return true;
  });

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Gerenciamento
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Escalas de Culto</h1>
        </div>
        <Button onClick={() => navigateTo('admin_escala_create')} className="font-bold cursor-pointer">
          <Plus className="w-5 h-5 mr-1.5" /> Nova Escala
        </Button>
      </div>

      {/* Filter Card */}
      <Card className="mb-8 p-4 bg-secondary/30 flex flex-col sm:flex-row gap-4 border border-border rounded-3xl">
        <div className="flex-1">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
            Ministério
          </label>
          <select 
            value={selectedMinistryId} 
            onChange={(e) => setSelectedMinistryId(e.target.value)}
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
            Status de Publicação
          </label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full h-11 bg-background border border-border rounded-2xl px-3 text-sm font-bold focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos os Status</option>
            <option value="published">Publicadas</option>
            <option value="draft">Rascunhos</option>
            <option value="completed">Concluídas</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
            Preenchimento
          </label>
          <select 
            value={selectedFill} 
            onChange={(e) => setSelectedFill(e.target.value)}
            className="w-full h-11 bg-background border border-border rounded-2xl px-3 text-sm font-bold focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todas as Escalas</option>
            <option value="Completas">Completas (Sem Vagas)</option>
            <option value="Vagas">Com Vagas Abertas</option>
          </select>
        </div>
      </Card>

      {/* Schedules List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Carregando escalas...</p>
        </div>
      ) : filteredSchedules.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed rounded-3xl">
          <Calendar className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-extrabold text-xl mb-2">Nenhuma escala encontrada</h3>
          <p className="text-muted-foreground font-semibold text-sm max-w-sm mb-6">
            Não existem escalas que correspondam aos filtros selecionados.
          </p>
          <Button onClick={() => navigateTo('admin_escala_create')} className="font-bold">
            <Plus className="w-4 h-4 mr-1.5" /> Criar Primeira Escala
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSchedules.map(escala => {
            const members = escala.schedule_members || [];
            const openSlots = members.filter((m: any) => !m.ministry_member_id).length;
            const confirmedCount = members.filter((m: any) => m.response === 'confirmed').length;
            const isComplete = openSlots === 0 && members.length > 0;
            const isPublished = escala.status === 'published';

            return (
              <Card key={escala.id} className="p-0 overflow-hidden flex flex-col md:flex-row group rounded-3xl border-border">
                {/* Date Block */}
                <div className="bg-secondary/30 md:w-36 p-5 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-border shrink-0">
                  <div className="flex flex-col md:items-start">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {formatDatePtBR(escala.date).split(' ')[1] || 'MÊS'}
                    </span>
                    <span className="text-3xl font-extrabold">
                      {formatDatePtBR(escala.date).split(' ')[0] || '01'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-muted-foreground md:mt-2">
                    {formatTimePtBR(escala.start_time)}
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="px-2 py-0 text-[10px] font-bold">
                        {escala.ministries?.name || 'Geral'}
                      </Badge>
                      <Badge variant={isPublished ? 'success' : 'secondary'} className="px-2 py-0 text-[10px] font-bold">
                        {isPublished ? 'Publicada' : 'Rascunho'}
                      </Badge>
                      <Badge 
                        variant={isComplete ? 'success' : openSlots > 0 ? 'warning' : 'secondary'} 
                        className="px-2 py-0 text-[10px] font-bold"
                      >
                        {isComplete ? 'Completa' : `${openSlots} vaga(s) aberta(s)`}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-extrabold mb-3">{escala.title || 'Culto de Celebração'}</h3>

                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {members.filter((m: any) => m.ministry_member_id).slice(0, 5).map((m: any, i: number) => {
                          const p = m.ministry_members?.profiles;
                          return (
                            <Avatar 
                              key={m.id || i} 
                              src={p?.avatar_url} 
                              fallback={p?.full_name?.charAt(0) || 'V'} 
                              size="sm" 
                              className="border-2 border-card" 
                            />
                          );
                        })}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">
                        {confirmedCount} de {members.length} confirmados
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t sm:border-t-0 border-border pt-4 sm:pt-0 shrink-0">
                    <Button 
                      variant={isPublished ? "outline" : "primary"} 
                      size="sm" 
                      className="font-bold text-xs cursor-pointer"
                      onClick={() => handleTogglePublish(escala.id, escala.status)}
                    >
                      {isPublished ? 'Despublicar' : 'Publicar'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="w-9 h-9 cursor-pointer"
                      onClick={() => navigateTo('detalhes', escala)}
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="w-9 h-9 bg-destructive/10 border-transparent hover:bg-destructive/20 cursor-pointer"
                      onClick={() => handleDeleteSchedule(escala.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
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

export function AdminEscalaCreateView({ navigateTo }: any) {
  const [step, setStep] = useState(1);
  const [ministries, setMinistries] = useState<any[]>([]);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const [allSongs, setAllSongs] = useState<any[]>([]);
  const [songSearch, setSongSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submission = useRef<{ id: string; payload: string } | null>(null);
  const isSaving = useRef(false);

  // Form State
  const [selectedMinistryId, setSelectedMinistryId] = useState('');
  const [title, setTitle] = useState('Culto de Celebração');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('21:00');
  const [location, setLocation] = useState('Templo Principal');

  // Slots: array of { roleId, roleName, memberId, memberName }
  const [slots, setSlots] = useState<Array<{ roleId: string; roleName: string; memberId: string; memberName: string }>>([]);

  // Selected Song IDs
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { data: minList } = previewData('ministries', 'read', undefined, () => true, { single: false, limit: undefined, order: ['name', {}] });
        setMinistries(minList || []);
        if (minList && minList.length > 0) {
          setSelectedMinistryId(minList[0].id);
        }

        const { data: songsData } = previewData('songs', 'read', undefined, () => true, { single: false, limit: undefined, order: ['title', {}] });
        setAllSongs(songsData || []);
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
      }
    };

    void loadInitialData();
  }, []);

  // When selectedMinistryId changes, load its roles and members
  useEffect(() => {
    if (!selectedMinistryId) return;

    const loadMinistryRolesAndMembers = async () => {
      try {
        const { data: rolesData } = previewData('ministry_roles', 'read', undefined, (row: any) => getField(row, 'ministry_id') === selectedMinistryId, { single: false, limit: undefined, order: ['name', {}] });

        setAvailableRoles(rolesData || []);

        const { data: membersData } = previewData('ministry_members', 'read', undefined, (row: any) => getField(row, 'ministry_id') === selectedMinistryId && getField(row, 'status') === 'approved', { single: false, limit: undefined, order: undefined });

        setAvailableMembers(membersData || []);

        // Pre-fill initial slots from existing roles
        if (rolesData && rolesData.length > 0) {
          setSlots(rolesData.map((r: any) => ({
            roleId: r.id,
            roleName: r.name,
            memberId: '',
            memberName: ''
          })));
        } else {
          setSlots([]);
        }
      } catch (err) {
        console.error('Erro ao carregar funções do ministério:', err);
      }
    };

    void loadMinistryRolesAndMembers();
  }, [selectedMinistryId]);

  const handleAddSlot = () => {
    const firstRole = availableRoles.length > 0 ? availableRoles[0] : null;
    setSlots(prev => [
      ...prev,
      {
        roleId: firstRole?.id || '',
        roleName: firstRole?.name || 'Função',
        memberId: '',
        memberName: ''
      }
    ]);
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSlotRoleChange = (index: number, roleId: string) => {
    const roleObj = availableRoles.find(r => r.id === roleId);
    setSlots(prev => prev.map((s, i) => i === index ? {
      ...s,
      roleId,
      roleName: roleObj?.name || s.roleName
    } : s));
  };

  const handleSlotMemberChange = (index: number, memberId: string) => {
    const memberObj = availableMembers.find(m => m.id === memberId);
    setSlots(prev => prev.map((s, i) => i === index ? {
      ...s,
      memberId,
      memberName: memberObj?.profiles?.full_name || ''
    } : s));
  };

  const toggleSongSelection = (songId: string) => {
    setSelectedSongIds(prev => 
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    );
  };

  const handlePublish = async (asDraft = false) => {
    if (isSaving.current) return;
    if (!selectedMinistryId) {
      toast.error('Selecione um ministério.');
      return;
    }
    if (!date) {
      toast.error('Selecione uma data para a escala.');
      return;
    }

    const status = asDraft ? 'draft' : 'published';
    const schedule = {
      ministry_id: selectedMinistryId,
      title: title.trim() || 'Culto de Celebração',
      date,
      start_time: startTime,
      end_time: endTime || null,
      location: location.trim() || 'Templo Principal',
      status,
    };
    const memberRows = slots.map(slot => ({
      role_id: slot.roleId || null,
      ministry_member_id: slot.memberId || null,
    }));

    isSaving.current = true;
    setSubmitting(true);
    try {
      if (hasOnlineTables()) {
        const payload = JSON.stringify([schedule, memberRows, selectedSongIds]);
        if (submission.current?.payload !== payload) {
          submission.current = { id: crypto.randomUUID(), payload };
        }
        await saveOnlineSchedule({ ...schedule, status, id: submission.current.id }, memberRows, selectedSongIds);
      } else {
        const { data, error } = await saveData('schedules', 'insert', schedule, undefined, { single: true });
        if (error) throw error;
        if (memberRows.length > 0) {
          const { error: slotError } = await saveData('schedule_members', 'insert', memberRows.map(row => ({
            ...row, schedule_id: data.id, response: 'pending',
          })));
          if (slotError) throw slotError;
        }
        if (selectedSongIds.length > 0) {
          const { error: songError } = await saveData('schedule_songs', 'insert', selectedSongIds.map((songId, index) => ({
            schedule_id: data.id, song_id: songId, position: index + 1,
          })));
          if (songError) throw songError;
        }
      }

      toast.success(asDraft ? 'Escala salva como rascunho!' : 'Escala publicada com sucesso!');
      navigateTo('admin_escalas');
    } catch (err: any) {
      console.error('Erro ao salvar escala:', err);
      toast.error('Erro ao criar escala: ' + err.message);
    } finally {
      isSaving.current = false;
      setSubmitting(false);
    }
  };

  const selectedMinistry = ministries.find(m => m.id === selectedMinistryId);
  const filteredSongs = allSongs.filter(s => 
    s.title.toLowerCase().includes(songSearch.toLowerCase()) || 
    (s.artist && s.artist.toLowerCase().includes(songSearch.toLowerCase()))
  );

  return (
    <div className="flex flex-col lg:flex-row h-full animate-in fade-in duration-300">
      
      {/* Wizard Sidebar */}
      <div className="lg:w-72 xl:w-80 bg-secondary/20 border-b lg:border-b-0 lg:border-r border-border p-6 sm:p-8 shrink-0 flex flex-col">
        <Button variant="ghost" className="w-fit mb-8 px-0 hover:bg-transparent cursor-pointer font-bold" onClick={() => navigateTo('admin_escalas')}>
          <ChevronLeft className="w-5 h-5 mr-1" /> Cancelar
        </Button>
        
        <h2 className="text-2xl font-extrabold mb-8">Nova Escala</h2>

        <div className="flex flex-row lg:flex-col gap-4 lg:gap-0 overflow-x-auto hide-scrollbar">
          {[
            { s: 1, title: 'Informações Básicas', desc: 'Data, hora e ministério' },
            { s: 2, title: 'Montar Equipe', desc: 'Funções e voluntários' },
            { s: 3, title: 'Repertório', desc: 'Vincular músicas do culto' },
            { s: 4, title: 'Revisar & Publicar', desc: 'Confirmação final' }
          ].map(item => (
            <div key={item.s} className="flex gap-4 mb-0 lg:mb-8 min-w-[200px] lg:min-w-0 opacity-50 transition-opacity" style={{ opacity: step >= item.s ? 1 : 0.4 }}>
              <div className="flex flex-col items-center">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors", step === item.s ? "bg-primary border-primary text-primary-foreground" : step > item.s ? "bg-foreground border-foreground text-background" : "border-border text-muted-foreground")}>
                  {step > item.s ? <Check className="w-4 h-4" /> : item.s}
                </div>
                {item.s < 4 && <div className="w-0.5 h-full bg-border mt-2 hidden lg:block"></div>}
              </div>
              <div>
                <p className={cn("font-extrabold text-sm mb-0.5", step === item.s && "text-primary")}>{item.title}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 lg:p-12 relative flex flex-col">
        
        {/* Step 1 */}
        {step === 1 && (
          <div className="max-w-2xl w-full mx-auto animate-in slide-in-from-right-8 duration-300">
            <SectionHeader title="Informações Básicas" />

            <div className="space-y-6 mt-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                  Ministério Responsável *
                </label>
                <select 
                  value={selectedMinistryId} 
                  onChange={(e) => setSelectedMinistryId(e.target.value)}
                  className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
                >
                  {ministries.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                  Título do Culto ou Evento *
                </label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                  placeholder="Ex: Culto de Celebração, Culto da Família" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                    Data do Culto *
                  </label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                    Horário de Início *
                  </label>
                  <input 
                    type="time" 
                    value={startTime} 
                    onChange={e => setStartTime(e.target.value)} 
                    className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                    Horário de Término
                  </label>
                  <input 
                    type="time" 
                    value={endTime} 
                    onChange={e => setEndTime(e.target.value)} 
                    className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                    Localização
                  </label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    className="w-full h-12 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                    placeholder="Ex: Templo Principal" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="max-w-3xl w-full mx-auto animate-in slide-in-from-right-8 duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <SectionHeader title="Montar Equipe" />
                <p className="text-xs text-muted-foreground font-semibold mt-1">
                  Defina as funções e escale os voluntários para o culto.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleAddSlot} className="font-bold cursor-pointer">
                <Plus className="w-4 h-4 mr-1.5" /> Adicionar Vaga
              </Button>
            </div>
            
            {slots.length === 0 ? (
              <Card className="p-8 text-center border-dashed rounded-3xl">
                <Users className="w-10 h-10 text-muted-foreground opacity-40 mx-auto mb-3" />
                <p className="font-extrabold text-base">Nenhuma posição configurada</p>
                <p className="text-xs text-muted-foreground mb-4">Clique no botão acima para adicionar a primeira vaga.</p>
                <Button onClick={handleAddSlot} size="sm">
                  <Plus className="w-4 h-4 mr-1.5" /> Adicionar Posição
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {slots.map((slot, i) => (
                  <Card key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-3xl border-border">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                        Função / Posição
                      </label>
                      <select 
                        value={slot.roleId} 
                        onChange={(e) => handleSlotRoleChange(i, e.target.value)}
                        className="w-full h-12 bg-background border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
                      >
                        <option value="">-- Selecione uma função --</option>
                        {availableRoles.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                        Voluntário Escalado
                      </label>
                      <select 
                        value={slot.memberId} 
                        onChange={(e) => handleSlotMemberChange(i, e.target.value)}
                        className="w-full h-12 bg-background border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
                      >
                        <option value="">-- Vaga Aberta (Disponível no Feed) --</option>
                        {availableMembers.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.profiles?.full_name || 'Voluntário'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-5 sm:pt-6">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-10 h-10 text-destructive hover:bg-destructive/10 cursor-pointer"
                        onClick={() => handleRemoveSlot(i)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="max-w-2xl w-full mx-auto animate-in slide-in-from-right-8 duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <SectionHeader title="Repertório do Culto" />
                <p className="text-xs text-muted-foreground font-semibold mt-1">
                  Selecione as músicas do acervo para esta escala ({selectedSongIds.length} selecionadas).
                </p>
              </div>
            </div>

            <div className="mb-4">
              <input 
                type="text" 
                value={songSearch}
                onChange={e => setSongSearch(e.target.value)}
                placeholder="Buscar música por título ou artista..."
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
              {filteredSongs.length === 0 ? (
                <Card className="p-8 text-center border-dashed rounded-2xl">
                  <p className="text-sm font-bold text-muted-foreground">Nenhuma música encontrada no acervo.</p>
                </Card>
              ) : (
                filteredSongs.map(song => {
                  const isSelected = selectedSongIds.includes(song.id);
                  return (
                    <div 
                      key={song.id}
                      onClick={() => toggleSongSelection(song.id)}
                      className={cn(
                        "p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all",
                        isSelected 
                          ? "bg-primary/10 border-primary shadow-sm" 
                          : "bg-card border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center border font-bold text-xs",
                          isSelected ? "bg-primary text-primary-foreground border-primary" : "border-border"
                        )}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="font-extrabold text-sm">{song.title}</p>
                          <p className="text-xs text-muted-foreground font-semibold">{song.artist || 'Artista'}</p>
                        </div>
                      </div>
                      {song.musical_key && (
                        <Badge variant="secondary" className="font-black text-xs">
                          {song.musical_key}
                        </Badge>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="max-w-3xl w-full mx-auto animate-in slide-in-from-right-8 duration-300">
            <SectionHeader title="Revisão Final" />
            
            <Card className="mb-6 p-0 overflow-hidden rounded-3xl border-border mt-4">
              <div className="bg-secondary/30 p-6 sm:p-8 border-b border-border">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="primary">{selectedMinistry?.name || 'Ministério'}</Badge>
                  <Badge variant="secondary">{location}</Badge>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">{title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> {date ? formatDatePtBR(date) : ''}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> {startTime} {endTime ? `- ${endTime}` : ''}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Equipe Escalada ({slots.length} posições)
                  </h4>
                  <div className="space-y-2">
                    {slots.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl border border-border bg-background">
                        <div className="flex items-center gap-3">
                          <Avatar fallback={s.roleName ? s.roleName.charAt(0) : '?'} size="sm" />
                          <div>
                            <p className="font-extrabold text-sm">{s.memberName || 'Vaga Aberta'}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.roleName}</p>
                          </div>
                        </div>
                        {s.memberId ? (
                          <Badge variant="secondary" className="text-xs">Escalado</Badge>
                        ) : (
                          <Badge variant="warning" className="text-xs">Vaga Aberta</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedSongIds.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      Repertório ({selectedSongIds.length} músicas)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSongIds.map(id => {
                        const song = allSongs.find((s: any) => s.id === id);
                        return song ? (
                          <Badge key={id} variant="secondary" className="px-3 py-1 text-xs font-bold">
                            🎵 {song.title} {song.musical_key ? `(${song.musical_key})` : ''}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-auto pt-8 flex justify-between items-center w-full max-w-3xl mx-auto">
          <Button 
            variant="secondary" 
            onClick={() => setStep(step - 1)} 
            disabled={step === 1} 
            className="w-32 font-bold cursor-pointer"
          >
            Voltar
          </Button>
          
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)} className="w-32 font-bold cursor-pointer">
              Próximo
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => handlePublish(true)} 
                disabled={submitting} 
                className="font-bold cursor-pointer"
              >
                Salvar Rascunho
              </Button>
              <Button 
                onClick={() => handlePublish(false)} 
                disabled={submitting} 
                className="bg-foreground text-background font-bold shadow-lg hover:brightness-110 cursor-pointer"
              >
                <Check className="w-4 h-4 mr-1.5" /> Publicar Escala
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


// Edit recurring scale logic dummy component to be used when Edit2 is clicked
export function EditChoiceModal({ isOpen, onClose }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Escala">
      <div className="space-y-6 animate-in slide-in-from-bottom-4">
        <p className="font-medium text-muted-foreground mb-4">Esta é uma escala recorrente. Você deseja editar apenas esta ocorrência ou todas as futuras?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card hoverable className="text-center p-6 border-primary/20 hover:border-primary/60 cursor-pointer" onClick={onClose}>
            <Calendar className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h4 className="font-extrabold text-sm mb-1">Apenas esta</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Afeta um único evento</p>
          </Card>
          <Card hoverable className="text-center p-6 border-primary/20 hover:border-primary/60 cursor-pointer" onClick={onClose}>
            <Repeat className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h4 className="font-extrabold text-sm mb-1">Toda a recorrência</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Afeta eventos futuros</p>
          </Card>
        </div>
      </div>
    </Modal>
  )
}

// --- ADMIN VOLUNTARIOS ---

