import {
Bell,
Calendar,
Flame,
Gift,
MessageSquare,
Trophy
} from 'lucide-react';
import { useEffect,useState } from 'react';
import { toast } from 'sonner';
import { getField,previewData,saveData } from '../../mocks/previewData';

import { Avatar,Badge,Button,Card,cn,formatDatePtBR,formatTimePtBR } from '../../shared/ui';

export function FeedView({ user, userMemberships }: any) {
  const [ministryFilter, setMinistryFilter] = useState('Todos');
  const [ministriesList, setMinistriesList] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeed = async () => {
    setLoading(true);
    try {
      // 1. Carregar lista de ministérios
      const { data: minData } = previewData('ministries', 'read', undefined, () => true, { single: false, limit: undefined, order: ['name', {}] });

      setMinistriesList(minData || []);

      const dynamicPosts: any[] = [];
      const todayStr = new Date().toISOString().split('T')[0];

      // 2. Vagas abertas em escalas futuras
      const { data: openSlots } = previewData('schedule_members', 'read', undefined, (row: any) => getField(row, 'ministry_member_id') === null && getField(row, 'schedules.status') === 'published' && getField(row, 'schedules.date') >= todayStr, { single: false, limit: 6, order: ['schedules(date)', { ascending: true }] });

      (openSlots || []).forEach((slot: any) => {
        const s = slot.schedules;
        const minName = s.ministries?.name || 'Geral';
        const roleName = slot.ministry_roles?.name || 'Voluntário';
        dynamicPosts.push({
          id: `slot-${slot.id}`,
          type: 'escala',
          authorName: 'Escalaê • Vagas Abertas',
          authorAvatar: '',
          ministry: minName,
          time: `${formatDatePtBR(s.date)} • ${formatTimePtBR(s.start_time)}`,
          content: `🚨 Vaga aberta para o culto "${s.title || 'Culto de Celebração'}".\nPrecisamos de 1 ${roleName} para servir com a equipe. Se você tem disponibilidade, candidate-se abaixo!`,
          reactions: { heart: 4, fire: 7, pray: 3, music: 1 },
          slotData: slot
        });
      });

      // 3. Voluntário do mês
      const now = new Date();
      const { data: volMonth } = previewData('volunteer_of_month', 'read', undefined, (row: any) => getField(row, 'month') === now.getMonth() + 1 && getField(row, 'year') === now.getFullYear(), { single: true, limit: 1, order: undefined });

      if (volMonth && volMonth.profiles) {
        dynamicPosts.push({
          id: `vol-month-${volMonth.id}`,
          type: 'voluntario',
          authorName: 'Coordenação de Voluntários',
          authorAvatar: volMonth.profiles.avatar_url,
          ministry: volMonth.ministries?.name || 'Geral',
          time: 'Destaque do Mês',
          content: `🏆 Parabéns a ${volMonth.profiles.full_name}!\nFoi eleito(a) o(a) Voluntário(a) Destaque deste mês pelo ministério de ${volMonth.ministries?.name || 'Voluntariado'}.\n\n"${volMonth.reason || 'Servindo com dedicação e amor.'}"\n\nQue Deus continue abençoando seu chamado!`,
          reactions: { heart: 24, fire: 18, pray: 15, music: 8 }
        });
      }

      // 4. Aniversariantes do mês
      const { data: birthdays } = previewData('profiles', 'read', undefined, (row: any) => getField(row, 'birth_date') !== null, { single: false, limit: 4, order: undefined });

      if (birthdays && birthdays.length > 0) {
        const bdayNames = birthdays.map((b: any) => `${b.full_name} (${formatDatePtBR(b.birth_date)})`).join(', ');
        dynamicPosts.push({
          id: 'birthdays-post',
          type: 'aniversario',
          authorName: 'Secretaria da Igreja',
          authorAvatar: '',
          ministry: 'Geral',
          time: 'Aniversários do Mês',
          content: `🎂 Parabenizamos nossos irmãos aniversariantes deste mês:\n\n${bdayNames}\n\nDesejamos muitas bênçãos, saúde e paz em suas vidas! 🎉`,
          reactions: { heart: 16, fire: 5, pray: 12, music: 4 }
        });
      }

      // 5. Post de boas-vindas / Comunicação geral
      dynamicPosts.push({
        id: 'welcome-post',
        type: 'aviso',
        authorName: 'Pastoral & Liderança',
        authorAvatar: '',
        ministry: 'Geral',
        time: 'Aviso Importante',
        content: `🙌 Lembrete para todas as equipes:\nMantenham suas disponibilidades semanais atualizadas no perfil para facilitar o fechamento das escalas do próximo mês. Juntos somos mais fortes!`,
        reactions: { heart: 12, fire: 8, pray: 20, music: 2 }
      });

      setPosts(dynamicPosts);
    } catch (err) {
      console.error('Erro ao carregar Feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFeed();
  }, []);

  const handleQueroServir = async (slotId: string, ministryId: string) => {
    const matchingMember = (userMemberships || []).find((m: any) => m.ministry_id === ministryId && m.status === 'approved');
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
      setPosts(prev => prev.filter(p => p.id !== `slot-${slotId}`));
    }
  };

  const filterOptions = ['Todos', ...ministriesList.map(m => m.name)];
  const filteredPosts = posts.filter(p => ministryFilter === 'Todos' || p.ministry === ministryFilter);

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[800px] mx-auto w-full animate-in fade-in duration-300">
      <div className="page-intro  mb-8">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Comunidade</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold">Feed da Igreja</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5 md:mx-0 md:px-0 md:pb-6 hide-scrollbar">
        {filterOptions.map(m => (
          <button
            key={m}
            onClick={() => setMinistryFilter(m)}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border",
              ministryFilter === m ? "bg-foreground text-background border-foreground shadow-sm" : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Carregando feed...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed rounded-3xl">
          <MessageSquare className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-extrabold text-xl mb-2">Feed vazio</h3>
          <p className="text-muted-foreground font-semibold text-sm max-w-sm">
            Não existem postagens para este ministério no momento.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <FeedPost 
              key={post.id} 
              post={post} 
              onQueroServir={post.slotData ? () => handleQueroServir(post.slotData.id, post.slotData.ministry_roles?.ministry_id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FeedPost({ post, onQueroServir }: any) {
  const [reacted, setReacted] = useState<string | null>(null);

  const getPostIcon = () => {
    switch (post.type) {
      case 'aviso': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'aniversario': return <Gift className="w-5 h-5 text-orange-500" />;
      case 'escala': return <Flame className="w-5 h-5 text-red-500" />;
      case 'voluntario': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'evento': return <Calendar className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const handleReaction = (type: string) => {
    if (reacted !== type) {
      toast('Reação adicionada!', { icon: '✨' });
    }
    setReacted(reacted === type ? null : type);
  };

  return (
    <Card className="p-0 rounded-3xl border-border overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar 
            src={post.authorAvatar} 
            fallback={post.type === 'escala' ? 'E' : post.authorName?.charAt(0) || '?'} 
            size="md" 
          />
          <div>
            <p className="font-extrabold text-base leading-tight">{post.authorName}</p>
            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 mt-0.5">
              {post.time} • <Badge variant="secondary" className="px-1.5 py-0 text-[9px] font-extrabold">{post.ministry}</Badge>
            </p>
          </div>
        </div>
        <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center shrink-0">
          {getPostIcon()}
        </div>
      </div>
      
      <div className="p-5 sm:p-6 text-sm sm:text-base font-medium leading-relaxed whitespace-pre-line">
        {post.content}
        
        {post.type === 'escala' && onQueroServir && (
          <div className="mt-4">
            <Button 
              variant="secondary" 
              onClick={onQueroServir}
              className="w-full font-extrabold hover:bg-primary hover:text-primary-foreground cursor-pointer"
            >
              Quero servir
            </Button>
          </div>
        )}
      </div>

      <div className="bg-secondary/30 px-5 py-4 sm:px-6 flex items-center gap-2 overflow-x-auto hide-scrollbar border-t border-border">
        {(['heart', 'fire', 'pray', 'music'] as const).map(reaction => {
          const emojis = { heart: '❤️', fire: '🔥', pray: '🙏', music: '🎶' };
          const isActive = reacted === reaction;
          return (
            <button 
              key={reaction}
              onClick={() => handleReaction(reaction)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border transition-all cursor-pointer",
                isActive ? "bg-primary/20 border-primary text-foreground" : "bg-card border-border hover:bg-secondary text-muted-foreground"
              )}
            >
              <span>{emojis[reaction]}</span>
              <span>{(post.reactions as Record<string, number>)[reaction] + (isActive ? 1 : 0)}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

