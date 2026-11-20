import {
Bell,
ChevronRight,
Moon,Sun
} from 'lucide-react';
import { useEffect,useState } from 'react';
import { toast } from 'sonner';
import { getField,previewData } from '../../mocks/previewData';

import { AniversariosCard,Button,Card,EscalaAbertaCard,ProximoCultoCard,SectionHeader,VoluntarioMesCard } from '../../shared/ui';

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
      const userMemberIds = (userMemberships || []).map((m: any) => m.id)

      // 1. Próxima escala do voluntário
      if (userMemberIds.length > 0) {
        const { data: myMemberRows } = previewData('schedule_members', 'read', undefined, (row: any) => (userMemberIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'schedules.date') >= todayStr && getField(row, 'schedules.status') === 'published', { single: false, limit: 1, order: ['schedules(date)', { ascending: true }] })

        if (myMemberRows && myMemberRows.length > 0) {
          setProximaEscala(myMemberRows[0])
        } else {
          setProximaEscala(null)
        }
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
    const { error } = previewData('schedule_members', 'update', {
        response: 'confirmed',
        response_at: new Date().toISOString()
      }, (row: any) => getField(row, 'id') === scheduleMemberId, { single: false, limit: undefined, order: undefined })

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

    const { error } = previewData('schedule_members', 'update', {
        ministry_member_id: matchingMember.id,
        response: 'confirmed',
        response_at: new Date().toISOString()
      }, (row: any) => getField(row, 'id') === slotId, { single: false, limit: undefined, order: undefined })

    if (error) {
      toast.error('Não foi possível assumir a vaga. Tente novamente.')
    } else {
      toast.success('Você assumiu a vaga com sucesso!')
      setOpenSlots(prev => prev.filter((s: any) => s.id !== slotId))
      void loadHomeData()
    }
  }

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300">
      <div className="hidden md:flex items-center justify-between mb-10">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Visão Geral</p>
          <h1 className="text-4xl font-extrabold">{greeting}, {firstName} 👋</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Tema Claro' : 'Tema Escuro'}
          </Button>
          <Button variant="outline" size="icon" className="relative" onClick={() => navigateTo('notificacoes')}>
            <Bell className="w-4 h-4 text-foreground" />
            {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border border-background"></span>}
          </Button>
        </div>
      </div>

      <div className="md:hidden mb-8 mt-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Visão Geral</p>
        <h1 className="text-3xl font-extrabold">{greeting}, {firstName} 👋</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
        <div className="xl:col-span-8 space-y-6 xl:space-y-8">
          <section>
            <SectionHeader title="Próximo culto" />
            <ProximoCultoCard 
              proximaEscala={proximaEscala}
              loading={loading}
              onClick={() => {
                if (proximaEscala?.schedules) {
                  navigateTo('detalhes', proximaEscala.schedules)
                }
              }} 
              onConfirm={() => {
                if (proximaEscala?.id) {
                  handleConfirmarPresenca(proximaEscala.id)
                }
              }}
              onTrocaClick={onTrocaClick} 
            />
          </section>

          <section>
            <div className="flex items-center justify-between mb-5">
              <SectionHeader title="Escalas abertas" badge={openSlots.length > 0 ? String(openSlots.length) : undefined} />
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => navigateTo('escalas')}>
                Ver todas <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {openSlots.length === 0 ? (
              <Card className="p-8 text-center bg-card border-dashed">
                <p className="text-muted-foreground font-bold text-sm">Nenhuma vaga em aberto no momento 🎉</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                {openSlots.map((slot) => (
                  <EscalaAbertaCard 
                    key={slot.id}
                    slot={slot}
                    onQueroServir={() => handleQueroServir(slot.id, slot.ministry_roles?.ministry_id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="xl:col-span-4 space-y-6 xl:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            <VoluntarioMesCard highlight={voluntarioMes} />
            <AniversariosCard birthdays={aniversarios} />
          </div>
        </div>
      </div>
    </div>
  )
}

