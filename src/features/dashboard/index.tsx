import {
Bell,
Calendar,
ChevronRight,
Moon,Sun
} from 'lucide-react';
import { useEffect,useState } from 'react';
import { toast } from 'sonner';
import { getField,previewData,saveData } from '../../mocks/previewData';

import { AniversariosCard,Button,Card,EscalaAbertaCard,ProximoCultoCard,VoluntarioMesCard } from '../../shared/ui';

export function HomeView({ toggleTheme, isDarkMode, navigateTo, onTrocaClick, unreadCount, user, userProfile, userMemberships }: any) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const firstName = userProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Voluntário'

  const [proximaEscala, setProximaEscala] = useState<any>(null)
  const [openSlots, setOpenSlots] = useState<any[]>([])
  const [voluntarioMes, setVoluntarioMes] = useState<any>(null)
  const [aniversarios, setAniversarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadHomeData = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0]
      const userMemberIds = (userMemberships || []).filter((membership: any) => membership.status === 'approved').map((membership: any) => membership.id)

      // 1. Próxima escala do voluntário
      if (userMemberIds.length > 0) {
        const { data: myMemberRows } = previewData('schedule_members', 'read', undefined, (row: any) => (userMemberIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'schedules.date') >= todayStr && getField(row, 'schedules.status') === 'published' && row.response !== 'declined', { single: false, limit: 1, order: ['schedules(date)', { ascending: true }] })

        if (myMemberRows && myMemberRows.length > 0) {
          setProximaEscala(myMemberRows[0])
        } else {
          setProximaEscala(null)
        }
      } else {
        setProximaEscala(null)
      }

      // 2. Vagas abertas (Quero Servir)
      const { data: slots } = previewData('schedule_members', 'read', undefined, (row: any) => getField(row, 'ministry_member_id') === null && getField(row, 'schedules.status') === 'published' && getField(row, 'schedules.date') >= todayStr, { single: false, limit: 4, order: ['schedules(date)', { ascending: true }] })

      setOpenSlots(slots || [])

      // 3. Voluntário do mês
      const now = new Date()
      const { data: volMonth } = previewData('volunteer_of_month', 'read', undefined, (row: any) => getField(row, 'month') === now.getMonth() + 1 && getField(row, 'year') === now.getFullYear(), { single: true, limit: 1, order: undefined })

      setVoluntarioMes(volMonth)

      // 4. Aniversariantes
      const { data: bdays } = previewData('profiles', 'read', undefined, (row: any) => getField(row, 'birth_date') !== null, { single: false, limit: 6, order: undefined })

      setAniversarios(bdays || [])
    } catch (err) {
      console.error('Erro ao carregar dados da Home:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadHomeData()
  }, [userMemberships])

  const handleConfirmarPresenca = async (scheduleMemberId: string) => {
    const { error } = await saveData('schedule_members', 'update', {
        response: 'confirmed',
        response_at: new Date().toISOString()
      }, (row: any) => row.id === scheduleMemberId && row.response === 'pending')

    if (error) {
      toast.error('Erro ao confirmar presença.')
    } else {
      toast.success('Presença confirmada com sucesso!')
      setProximaEscala((prev: any) => prev ? { ...prev, response: 'confirmed' } : prev)
    }
  }

  const handleQueroServir = async (slotId: string, ministryId: string) => {
    const matchingMember = (userMemberships || []).find((m: any) => m.ministry_id === ministryId && m.status === 'approved')
    if (!matchingMember) {
      toast.error('Você precisa fazer parte deste ministério para assumir esta vaga.')
      return
    }

    const { error } = await saveData('schedule_members', 'update', {
        ministry_member_id: matchingMember.id,
        response: 'confirmed',
        response_at: new Date().toISOString()
      }, (row: any) => row.id === slotId && row.ministry_member_id === null)

    if (error) {
      toast.error('Não foi possível assumir a vaga. Tente novamente.')
    } else {
      toast.success('Você assumiu a vaga com sucesso!')
      setOpenSlots(prev => prev.filter((s: any) => s.id !== slotId))
      void loadHomeData()
    }
  }

  const hasUpcomingSchedule = Boolean(proximaEscala?.schedules)
  const showOpenSlots = hasUpcomingSchedule || openSlots.length > 0

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-8 px-5 py-6 sm:px-8 lg:space-y-10 lg:px-10 lg:py-9">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">{greeting}, {firstName}</h1>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={toggleTheme}
            aria-label={isDarkMode ? 'Ativar tema claro' : 'Ativar tema escuro'}>
            {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <Button variant="outline" size="icon" className="relative rounded-xl" onClick={() => navigateTo('notificacoes')}
            aria-label={unreadCount > 0 ? `Notificações. ${unreadCount} pendentes` : 'Notificações'}>
            <Bell className="size-4" />
            {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />}
          </Button>
        </div>
      </header>

      {loading ? <Card className="p-6" role="status">Carregando suas escalas…</Card> : <>
        {hasUpcomingSchedule && (
          <section aria-label="Próxima escala">
            <ProximoCultoCard proximaEscala={proximaEscala}
              onClick={() => navigateTo('detalhes', proximaEscala.schedules)}
              onConfirm={() => handleConfirmarPresenca(proximaEscala.id)}
              onTrocaClick={onTrocaClick ? () => onTrocaClick(proximaEscala) : undefined} />
          </section>
        )}

        {showOpenSlots ? (
          <section aria-labelledby="open-slots-heading" className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="open-slots-heading" className="text-xl font-extrabold tracking-tight sm:text-2xl">Vagas abertas</h2>
              <Button variant="ghost" size="sm" onClick={() => navigateTo('escalas')}>
                Ver escalas <ChevronRight className="size-4" />
              </Button>
            </div>
            {openSlots.length === 0 ? (
              <p className="rounded-2xl border border-border px-4 py-4 text-sm text-muted-foreground">Nenhuma vaga aberta no momento.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
                {openSlots.map(slot => (
                  <EscalaAbertaCard key={slot.id} slot={slot} featured={!hasUpcomingSchedule}
                    onQueroServir={() => handleQueroServir(slot.id, slot.schedules?.ministry_id)} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="relative isolate overflow-hidden rounded-3xl bg-brand-surface p-5 text-white sm:p-8" aria-labelledby="empty-agenda-heading">
            <img src={`${import.meta.env.BASE_URL}equipe-servindo.png`} alt="" className="pointer-events-none absolute inset-y-0 right-0 -z-20 h-full w-full object-cover object-center sm:w-3/5" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-blue via-brand-night/95 to-brand-night/45" />
            <div className="max-w-sm space-y-3">
              <Calendar className="size-5 text-brand-lime" aria-hidden="true" />
              <h2 id="empty-agenda-heading" className="text-xl font-extrabold sm:text-3xl">Sua agenda está livre</h2>
              <p className="text-sm text-white/85">Você ainda não tem uma escala futura. As próximas escalas e vagas vão aparecer aqui.</p>
              <Button className="mt-1 bg-brand-lime text-brand-night hover:brightness-105" onClick={() => navigateTo('escalas')}>
                Ver escalas <ChevronRight className="size-4" />
              </Button>
            </div>
          </section>
        )}

        {(voluntarioMes || aniversarios.length > 0) && (
          <section aria-labelledby="community-heading" className="space-y-4 border-t border-border pt-6 sm:pt-8">
            <h2 id="community-heading" className="text-lg font-extrabold tracking-tight sm:text-xl">Comunidade</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {voluntarioMes && <VoluntarioMesCard highlight={voluntarioMes} />}
              {aniversarios.length > 0 && <AniversariosCard birthdays={aniversarios} />}
            </div>
          </section>
        )}
      </>}
    </div>
  )
}
