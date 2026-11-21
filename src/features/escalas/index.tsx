import {
ArrowRightLeft,
Calendar,
Check,
CheckCircle2,
ChevronLeft,
Cloud,
Clock,MapPin,
Music,
Users
} from 'lucide-react';
import { useEffect,useState } from 'react';
import { usePreviewDataRevision } from '../../shared/state/dataRevision';
import './schedule-ticket.css';
import { toast } from 'sonner';
import { getField,previewData,saveData } from '../../mocks/previewData';

import { Avatar,Badge,Button,Card,Modal,SectionHeader,cn,formatFullDatePtBR,formatTimePtBR } from '../../shared/ui';

export function EscalasView({ navigateTo, userMemberships, userProfile, onOpenTroca }: any) {
  const [section, setSection] = useState<'upcoming' | 'swaps' | 'history'>('upcoming');
  const [responseFilter, setResponseFilter] = useState('all');
  const [confirming, setConfirming] = useState<string | null>(null);
  const revision = usePreviewDataRevision(state => state.revision);
  const [viewScope, setViewScope] = useState<'my' | 'all'>('my');
  const [escalas, setEscalas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


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
              ministry_member_id: userSlot?.ministry_member_id,
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
  }, [userMemberships, viewScope, revision]);

  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(new Date());
  const visibleSchedules = escalas.filter(item => item.schedules && (
    section === 'history' ? item.schedules.date < today : item.schedules.date >= today
  ) && (responseFilter === 'all' || item.response === responseFilter)).sort((first, second) => section === 'history'
    ? second.schedules.date.localeCompare(first.schedules.date)
    : first.schedules.date.localeCompare(second.schedules.date));
  const ownMembershipIds = new Set(userMemberships?.map((member: any) => member.id));
  const swaps = previewData('schedule_swap_requests', 'read', undefined, row => ownMembershipIds.has(row.requester_id),
    { order: ['created_at', { ascending: false }] }).data;
  const pending = escalas.filter(item => item.response === 'pending' && item.schedules?.date >= today).length;
  const openSwapIds = new Set(swaps.filter((request: any) => request.status === 'pending').map((request: any) => request.schedule_member_id));
  const tabs = [{ id: 'upcoming', label: 'Próximas' }, { id: 'swaps', label: 'Trocas' }, { id: 'history', label: 'Histórico' }] as const;

  async function confirm(id: string) {
    setConfirming(id);
    try {
      const { error } = await saveData('schedule_members', 'update', { response: 'confirmed' },
        row => row.id === id && row.response === 'pending' && ownMembershipIds.has(row.ministry_member_id));
      if (error) throw error;
      toast.success('Presença confirmada!');
    } catch {
      toast.error('Não foi possível confirmar a presença. Tente novamente.');
    } finally {
      setConfirming(null);
    }
  }

  return (
    <div className="schedule-page">
      <header className="schedule-banner">
        <div className="relative z-10">
          {userProfile?.full_name && <span className="mb-1 block text-sm font-semibold">Olá, {userProfile.full_name.split(' ')[0]}!</span>}
          <h1>Suas escalas</h1>
          {pending > 0 && <p><Clock size={14} aria-hidden="true" /> {pending} aguardando você</p>}
        </div>
        <Cloud className="absolute right-[27%] top-4 size-8 -rotate-6 text-white/60" aria-hidden="true" />
        <img src={`${import.meta.env.BASE_URL}brand/pulo.png`} alt="" />
      </header>

      <nav className="schedule-tabs" aria-label="Seções de escalas">
        {tabs.map(tab => <button key={tab.id} type="button" aria-pressed={section === tab.id} onClick={() => setSection(tab.id)}>{tab.label}</button>)}
      </nav>

      {section === 'swaps' ? (
        swaps.length ? <ul className="space-y-3">
          {swaps.map((request: any) => {
            const event = request.schedule_members?.schedules;
            const states: Record<string, string> = { pending: 'Aguardando', approved: 'Aprovada', rejected: 'Recusada', canceled: 'Cancelada' };
            return <li key={request.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-bold">{event?.title || 'Pedido de troca'}</h2>
                <Badge variant={request.status === 'approved' ? 'success' : request.status === 'pending' ? 'warning' : 'default'}>{states[request.status] || request.status}</Badge>
              </div>
              {request.reason && <p className="mt-2 text-sm text-muted-foreground">{request.reason}</p>}
              {event && <Button variant="outline" size="sm" className="mt-3" onClick={() => navigateTo('detalhes', event)}>Ver escala</Button>}
            </li>;
          })}
        </ul> : <p className="schedule-empty">Você ainda não tem pedidos de troca.</p>
      ) : <>
        <div className="schedule-scope" aria-label="Quais escalas mostrar">
          <button type="button" aria-pressed={viewScope === 'my'} onClick={() => setViewScope('my')}>Minhas escalas</button>
          <button type="button" aria-pressed={viewScope === 'all'} onClick={() => setViewScope('all')}>Todas da igreja</button>
          <select aria-label="Filtrar por situação" value={responseFilter} onChange={event => setResponseFilter(event.target.value)}
            className="ml-auto min-h-11 rounded-xl border border-border-strong bg-card px-2 text-sm">
            <option value="all">Todos os status</option>
            <option value="pending">Pendentes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="declined">Ausências</option>
          </select>
        </div>
        {loading ? <p className="schedule-empty" role="status">Carregando escalas…</p> : visibleSchedules.length === 0 ? (
          <div className="schedule-empty">
            <img src={`${import.meta.env.BASE_URL}brand/pulo.png`} alt="" className="mx-auto mb-2 size-16" />
            <h2 className="font-bold">Nenhuma escala por aqui</h2>
            <p className="mt-1 text-sm text-muted-foreground">{section === 'history' ? 'As escalas anteriores aparecem aqui.' : 'Quando houver uma escala publicada para este período, ela aparece aqui.'}</p>
          </div>
        ) : (
          <ul className="grid gap-4">
            {visibleSchedules.map(item => {
              const schedule = item.schedules;
              const date = new Date(`${schedule.date}T12:00:00`);
              const [year, month, day] = schedule.date.split('-');
              const weekday = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
              const monthName = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][Number(month) - 1];
              const ministry = schedule.ministries?.name || 'Ministério';
              const tradePending = openSwapIds.has(item.id);
              const stamp = tradePending ? 'Troca pedida' : { pending: 'Aguardando', confirmed: 'Confirmado', declined: 'Ausência' }[item.response as 'pending' | 'confirmed' | 'declined'];
              const tone = /louvor/i.test(ministry) ? 'purple' : /recep/i.test(ministry) ? 'lime' : 'blue';
              const canRespond = section === 'upcoming' && item.response === 'pending' && !tradePending;
              return (
                <li key={item.id} className="schedule-ticket" data-tone={tone}>
                  <div className="schedule-ticket-date">
                    <time dateTime={`${year}-${month}-${day}`}><span>{weekday}</span><strong>{day}</strong><span>{monthName}</span></time>
                    <span className="schedule-ticket-time"><Clock size={11} aria-hidden="true" /> {formatTimePtBR(schedule.start_time)}</span>
                  </div>
                  <div className="schedule-ticket-main">
                    <div className="schedule-ticket-top">
                      <span className="schedule-ticket-ministry">{ministry}</span>
                      {stamp && <span className="schedule-ticket-stamp" data-status={tradePending ? 'swap' : item.response}>{stamp}</span>}
                    </div>
                    <h2><button type="button" onClick={() => navigateTo('detalhes', schedule)}>{schedule.title || 'Culto de Celebração'}</button></h2>
                    {schedule.location && <p><MapPin size={14} aria-hidden="true" /> {schedule.location}</p>}
                    {item.ministry_roles?.name && <p><Users size={14} aria-hidden="true" /> {item.ministry_roles.name}</p>}
                    <div className="schedule-ticket-actions">
                      {canRespond ? <>
                        <Button size="sm" disabled={confirming !== null} className="flex-1" onClick={() => void confirm(item.id)}>{confirming === item.id ? 'Confirmando…' : 'Confirmar'}</Button>
                        <Button variant="outline" size="sm" onClick={() => onOpenTroca(item)}>Trocar</Button>
                      </> : <button className="schedule-ticket-link" type="button" onClick={() => navigateTo('detalhes', schedule)}>Ver detalhes</button>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </>}
    </div>
  );
}

export function DetalhesView({ escala, onBack, onOpenTroca, onOpenSong, user, userMemberships }: any) {
  const [currentEscala, setCurrentEscala] = useState(escala);
  if (!escala || !currentEscala) return null;

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
    const { error } = await saveData('schedule_members', 'update', {
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

    const { error } = await saveData('schedule_members', 'update', {
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
      const { error } = await saveData('schedule_swap_requests', 'insert', {
          schedule_member_id: slot.id,
          requester_id: requesterMemberId,
          target_member_id: targetMemberId || null,
          reason: reason || 'Não poderei comparecer.',
          status: 'pending'
        }, () => true, { single: false, limit: undefined, order: undefined });

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

