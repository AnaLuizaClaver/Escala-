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
import { FeedPost } from '../feed';

export function AdminFeedView({ user, userProfile, navigateTo }: any) {
  const [filterMin, setFilterMin] = useState('Todos');
  const [posts, setPosts] = useState<any[]>([]);
  const [ministries, setMinistries] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isVoluntarioModalOpen, setVoluntarioModalOpen] = useState(false);

  // Post form state
  const [postType, setPostType] = useState('📢 Aviso');
  const [postMinistryId, setPostMinistryId] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);

  // Volunteer of the Month form state
  const [honorVolunteerId, setHonorVolunteerId] = useState('');
  const [honorMinistryId, setHonorMinistryId] = useState('');
  const [honorTitle, setHonorTitle] = useState('Destaque do Mês');
  const [honorMessage, setHonorMessage] = useState('');
  const [submittingHonor, setSubmittingHonor] = useState(false);

  const loadFeedAndMetadata = async () => {
    setLoading(true);
    try {
      const { data: minList } = previewData('ministries', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['name', {}] });
      setMinistries(minList || []);

      const { data: volList } = previewData('profiles', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['full_name', {}] });
      setVolunteers(volList || []);
      if (volList && volList.length > 0) {
        setHonorVolunteerId(volList[0].id);
      }

      const { data: postsData, error } = previewData('feed_posts', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['created_at', { ascending: false }] });

      if (error) throw error;
      setPosts(postsData || []);
    } catch (err) {
      console.error('Erro ao carregar feed admin:', err);
      toast.error('Erro ao carregar postagens do feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFeedAndMetadata();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      toast.error('Título e mensagem são obrigatórios.');
      return;
    }

    setSubmittingPost(true);
    try {
      const { error } = previewData('feed_posts', 'insert', {
          author_id: user?.id,
          ministry_id: postMinistryId ? postMinistryId : null,
          type: postType,
          title: postTitle.trim(),
          content: postContent.trim()
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      if (error) throw error;

      toast.success('Publicação criada com sucesso!');
      setPostTitle('');
      setPostContent('');
      setPostMinistryId('');
      setPostModalOpen(false);
      await loadFeedAndMetadata();
    } catch (err: any) {
      toast.error('Erro ao publicar: ' + err.message);
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta publicação?')) return;

    try {
      const { error } = previewData('feed_posts', 'delete', undefined, (row: any) => getField(row, 'id') === postId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.success('Publicação removida com sucesso.');
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err: any) {
      toast.error('Erro ao excluir: ' + err.message);
    }
  };

  const handlePublishHonor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!honorVolunteerId) {
      toast.error('Selecione um voluntário.');
      return;
    }

    setSubmittingHonor(true);
    const now = new Date();
    try {
      const selectedVol = volunteers.find(v => v.id === honorVolunteerId);

      // 1. Inserir em volunteer_of_month
      previewData('volunteer_of_month', 'insert', {
          volunteer_id: honorVolunteerId,
          ministry_id: honorMinistryId || null,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          reason: (honorTitle + ' - ' + honorMessage).trim()
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      // 2. Criar post no feed comemorando
      previewData('feed_posts', 'insert', {
          author_id: user?.id,
          ministry_id: honorMinistryId || null,
          type: '🎉 Aniversário',
          title: `🏆 Voluntário em Destaque: ${selectedVol?.full_name || 'Voluntário'}!`,
          content: `${honorTitle}\n\n${honorMessage || 'Parabéns pela dedicação e excelente serviço prestado à igreja!'}`
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      toast.success('Homenagem publicada no mural!');
      setHonorTitle('Destaque do Mês');
      setHonorMessage('');
      setVoluntarioModalOpen(false);
      await loadFeedAndMetadata();
    } catch (err: any) {
      toast.error('Erro ao registrar homenagem: ' + err.message);
    } finally {
      setSubmittingHonor(false);
    }
  };

  const ministryFilterOptions = ['Todos', ...ministries.map(m => m.name), 'Geral'];

  const filteredPosts = posts.filter(p => {
    if (filterMin === 'Todos') return true;
    if (filterMin === 'Geral') return !p.ministries;
    return p.ministries?.name === filterMin;
  });

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1000px] mx-auto w-full animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Gerenciamento
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Feed da Comunidade</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setVoluntarioModalOpen(true)} className="font-bold cursor-pointer">
            <Trophy className="w-4 h-4 mr-2 text-yellow-500" /> Voluntário do Mês
          </Button>
          <Button onClick={() => setPostModalOpen(true)} className="font-bold cursor-pointer">
            <Plus className="w-4 h-4 mr-1.5" /> Novo Post
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
        {ministryFilterOptions.map(m => (
          <button
            key={m}
            onClick={() => setFilterMin(m)}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer",
              filterMin === m 
                ? "bg-foreground text-background border-foreground shadow-sm" 
                : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-muted-foreground">Carregando postagens...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed rounded-3xl">
          <MessageSquare className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-extrabold text-xl mb-2">Feed vazio</h3>
          <p className="text-muted-foreground font-semibold text-sm max-w-sm">
            Não existem postagens para este filtro ainda. Crie uma nova publicação acima!
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map(post => {
            const feedPostData = {
              id: post.id,
              authorName: post.profiles?.full_name || 'Liderança',
              authorAvatar: post.profiles?.avatar_url,
              ministry: post.ministries?.name || 'Geral',
              time: post.created_at ? formatDatePtBR(post.created_at.split('T')[0]) : 'Hoje',
              type: post.type === '📢 Aviso' ? 'aviso' : post.type === '🎉 Aniversário' ? 'aniversario' : post.type === '🔥 Escala aberta' ? 'escala' : post.type === '🏆 Voluntário' ? 'voluntario' : 'evento',
              title: post.title,
              content: `${post.title ? post.title + '\n\n' : ''}${post.content || ''}`,
              reactions: { heart: post.feed_likes?.length || 0, fire: 0, pray: 0, music: 0 }
            };

            return (
              <div key={post.id} className="relative group">
                <div className="absolute top-4 right-16 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="xs"
                    className="shadow-md text-destructive hover:bg-destructive/10 cursor-pointer rounded-full"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Excluir
                  </Button>
                </div>
                <FeedPost post={feedPostData} />
              </div>
            );
          })}
        </div>
      )}

      {/* Post Modal */}
      <Modal isOpen={isPostModalOpen} onClose={() => setPostModalOpen(false)} title="Novo Post no Feed">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                Tipo de Post
              </label>
              <select 
                value={postType} 
                onChange={e => setPostType(e.target.value)}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
              >
                <option value="📢 Aviso">📢 Aviso</option>
                <option value="📅 Evento">📅 Evento</option>
                <option value="🔥 Escala aberta">🔥 Escala aberta</option>
                <option value="🎉 Aniversário">🎉 Celebração / Destaque</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                Ministério Alvo
              </label>
              <select 
                value={postMinistryId} 
                onChange={e => setPostMinistryId(e.target.value)}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
              >
                <option value="">Geral (Todos os voluntários)</option>
                {ministries.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
              Título do Post *
            </label>
            <input 
              type="text" 
              required
              value={postTitle} 
              onChange={e => setPostTitle(e.target.value)}
              placeholder="Ex: Ensaio geral confirmado para esta quinta-feira!"
              className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
              Mensagem *
            </label>
            <textarea 
              rows={4}
              required
              value={postContent} 
              onChange={e => setPostContent(e.target.value)}
              placeholder="Escreva a mensagem que deseja compartilhar com a equipe..."
              className="w-full bg-secondary/50 border border-border rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-4">
            <Button type="button" variant="secondary" className="flex-1 font-bold cursor-pointer" onClick={() => setPostModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold cursor-pointer" disabled={submittingPost}>
              {submittingPost ? 'Publicando...' : 'Publicar Post'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Voluntario do Mes Modal */}
      <Modal isOpen={isVoluntarioModalOpen} onClose={() => setVoluntarioModalOpen(false)} title="Eleger Voluntário do Mês">
        <form onSubmit={handlePublishHonor} className="space-y-4">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center relative shadow-inner">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
          </div>
          <p className="text-center font-semibold text-muted-foreground text-xs mb-4">
            Celebre publicamente o esforço e dedicação de quem fez a diferença na equipe.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                Voluntário Homenageado *
              </label>
              <select 
                value={honorVolunteerId} 
                onChange={e => setHonorVolunteerId(e.target.value)}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
              >
                {volunteers.map(v => (
                  <option key={v.id} value={v.id}>{v.full_name || 'Voluntário'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
                Ministério
              </label>
              <select 
                value={honorMinistryId} 
                onChange={e => setHonorMinistryId(e.target.value)}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary"
              >
                <option value="">Geral / Todos</option>
                {ministries.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
              Título da Conquista
            </label>
            <input 
              type="text" 
              value={honorTitle} 
              onChange={e => setHonorTitle(e.target.value)}
              className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
              placeholder="Ex: Maior assiduidade, Sempre pronto a ajudar..." 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">
              Mensagem de Reconhecimento
            </label>
            <textarea 
              rows={3}
              value={honorMessage} 
              onChange={e => setHonorMessage(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-primary resize-none"
              placeholder="Ex: Agradecemos de coração por todo amor e dedicação que você coloca no ministério todos os finais de semana!"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-4">
            <Button type="button" variant="secondary" className="flex-1 font-bold cursor-pointer" onClick={() => setVoluntarioModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold cursor-pointer" disabled={submittingHonor}>
              {submittingHonor ? 'Publicando...' : 'Publicar Homenagem'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

// --- ADMIN RELATORIOS ---

