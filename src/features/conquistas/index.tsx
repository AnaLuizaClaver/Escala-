import {
ChevronLeft,
Clock,
Flame,
Music,
Trophy,
Users
} from 'lucide-react';
import { useEffect,useState } from 'react';
import { getField,previewData } from '../../mocks/previewData';

import { Badge,Button,Card,SectionHeader,cn } from '../../shared/ui';

export function ConquistasView({ navigateTo, user, userMemberships = [] }: any) {
  const [stats, setStats] = useState({
    totalConfirmed: 0,
    monthAwardsCount: 0,
    loading: true
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) return;
      const approvedIds = userMemberships.filter((m: any) => m.status === 'approved').map((m: any) => m.id);
      
      try {
        let confirmedCount = 0;
        if (approvedIds.length > 0) {
          const { count } = previewData('schedule_members', 'read', undefined, (row: any) => (approvedIds).includes(getField(row, 'ministry_member_id')) && getField(row, 'response') === 'confirmed', { single: false, limit: undefined, order: undefined });
          confirmedCount = count || 0;
        }

        const { count: awardsCount } = previewData('volunteer_of_month', 'read', undefined, (row: any) => getField(row, 'volunteer_id') === user.id, { single: false, limit: undefined, order: undefined });

        setStats({
          totalConfirmed: confirmedCount,
          monthAwardsCount: awardsCount || 0,
          loading: false
        });
      } catch (err) {
        console.error('Erro ao carregar conquistas:', err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    void loadStats();
  }, [user?.id, userMemberships]);

  const xpPerScale = 250;
  const xpPerAward = 1000;
  const totalXp = (stats.totalConfirmed * xpPerScale) + (stats.monthAwardsCount * xpPerAward);
  
  const currentLevel = Math.max(1, Math.floor(totalXp / 1000) + 1);
  const xpInCurrentLevel = totalXp % 1000;
  const xpNeededForNext = 1000;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

  const allBadges = [
    {
      id: 'first-step',
      title: 'Primeiro Passo',
      desc: 'Serviu na sua 1ª escala na igreja',
      icon: <Flame className="w-8 h-8 text-orange-500" />,
      bg: 'bg-orange-500/10',
      unlocked: stats.totalConfirmed >= 1,
      progress: Math.min(1, stats.totalConfirmed),
      max: 1
    },
    {
      id: 'faithful-5',
      title: 'Fiel no Chamado',
      desc: 'Completou 5 escalas servindo',
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      bg: 'bg-blue-500/10',
      unlocked: stats.totalConfirmed >= 5,
      progress: Math.min(5, stats.totalConfirmed),
      max: 5
    },
    {
      id: 'multi-ministry',
      title: 'Coração de Servo',
      desc: 'Participa de 2 ou mais ministérios',
      icon: <Users className="w-8 h-8 text-green-500" />,
      bg: 'bg-green-500/10',
      unlocked: userMemberships.filter((m: any) => m.status === 'approved').length >= 2,
      progress: Math.min(2, userMemberships.filter((m: any) => m.status === 'approved').length),
      max: 2
    },
    {
      id: 'veteran-20',
      title: 'Veterano do Altar',
      desc: 'Completou 20 escalas servindo',
      icon: <Music className="w-8 h-8 text-purple-500" />,
      bg: 'bg-purple-500/10',
      unlocked: stats.totalConfirmed >= 20,
      progress: Math.min(20, stats.totalConfirmed),
      max: 20
    },
    {
      id: 'volunteer-month',
      title: 'Destaque do Mês',
      desc: 'Foi eleito voluntário do mês',
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      bg: 'bg-yellow-500/10',
      unlocked: stats.monthAwardsCount >= 1,
      progress: Math.min(1, stats.monthAwardsCount),
      max: 1
    }
  ];

  const unlockedBadges = allBadges.filter((b: any) => b.unlocked);
  const lockedBadges = allBadges.filter(b => !b.unlocked);

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1000px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="secondary" size="icon" onClick={() => navigateTo('perfil')}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Gamificação</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Suas Conquistas</h1>
        </div>
      </div>

      <Card className="bg-foreground text-background border-foreground mb-10 overflow-hidden relative rounded-3xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-20 translate-x-10"></div>
        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-primary flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Nível</span>
              <span className="text-3xl font-extrabold text-primary">{currentLevel}</span>
            </div>
            <div>
              <p className="text-2xl font-extrabold mb-1">
                {currentLevel === 1 ? 'Voluntário Iniciante' : currentLevel < 4 ? 'Voluntário Dedicado' : 'Líder de Excelência'}
              </p>
              <p className="text-sm font-medium text-muted-foreground max-w-sm">
                Você já completou {stats.totalConfirmed} {stats.totalConfirmed === 1 ? 'escala' : 'escalas'} no altar.
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-72">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              <span>{totalXp} XP</span>
              <span className="text-primary">Faltam {xpNeededForNext - xpInCurrentLevel} XP</span>
            </div>
            <div className="h-4 bg-secondary/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20"></div>
              </div>
            </div>
          </div>
          
        </div>
      </Card>

      <div className="space-y-10">
        <section>
          <SectionHeader title="Desbloqueadas" badge={String(unlockedBadges.length)} />
          {unlockedBadges.length === 0 ? (
            <Card className="p-8 text-center border-dashed rounded-3xl">
              <Trophy className="w-10 h-10 text-muted-foreground opacity-40 mx-auto mb-3" />
              <p className="font-extrabold text-lg">Nenhuma conquista desbloqueada ainda</p>
              <p className="text-sm text-muted-foreground">Confirme presença e sirva nas escalas para conquistar suas primeiras badges!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedBadges.map(badge => (
                <Card key={badge.id} className="text-center p-6 sm:p-8 flex flex-col items-center hover:-translate-y-1 transition-transform rounded-3xl border-border">
                  <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm", badge.bg)}>
                    {badge.icon}
                  </div>
                  <h3 className="font-extrabold text-lg mb-2">{badge.title}</h3>
                  <p className="text-sm font-semibold text-muted-foreground">{badge.desc}</p>
                  <div className="mt-4 pt-4 border-t border-border w-full flex justify-center">
                    <Badge variant="success">Desbloqueada ✓</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {lockedBadges.length > 0 && (
          <section>
            <SectionHeader title="Em Progresso" badge={String(lockedBadges.length)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lockedBadges.map(badge => (
                <Card key={badge.id} className="flex gap-5 p-5 items-center opacity-80 rounded-3xl border-border">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shrink-0 text-muted-foreground border border-border">
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-base mb-1">{badge.title}</h3>
                    <p className="text-xs font-semibold text-muted-foreground mb-4">{badge.desc}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>{badge.progress} / {badge.max}</span>
                        <span>{Math.round((badge.progress / badge.max) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all" 
                          style={{ width: `${(badge.progress / badge.max) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

    </div>
  );
}

// --- NOVO FLUXO DE CADASTRO E MINISTÉRIOS ---

