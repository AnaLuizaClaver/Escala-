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

export function AdminRepertorioView() {
  const [activeTab, setActiveTab] = useState<'playlists' | 'biblioteca'>('biblioteca');
  const [schedulesWithSongs, setSchedulesWithSongs] = useState<any[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [songSearch, setSongSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State for Songs CRUD
  const [isSongModalOpen, setSongModalOpen] = useState(false);
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [songForm, setSongForm] = useState({
    title: '',
    artist: '',
    musical_key: '',
    bpm: '',
    cifra_url: '',
    youtube_url: '',
    notes: ''
  });
  const [submittingSong, setSubmittingSong] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Carregar Acervo Geral de Músicas
      const { data: songsData, error: sErr } = previewData('songs', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['title', {}] });

      if (sErr) throw sErr;
      setSongs(songsData || []);

      // 2. Carregar Escalas com Músicas
      const { data: schedData, error: scErr } = previewData('schedules', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['date', { ascending: false }] });

      if (scErr) throw scErr;
      setSchedulesWithSongs(schedData || []);

      // Update selected schedule reference if active
      if (selectedSchedule) {
        const updated = (schedData || []).find((s: any) => s.id === selectedSchedule.id);
        setSelectedSchedule(updated || null);
      }
    } catch (err) {
      console.error('Erro ao carregar repertório:', err);
      toast.error('Erro ao carregar repertório.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleOpenCreateSong = () => {
    setEditingSongId(null);
    setSongForm({
      title: '',
      artist: '',
      musical_key: 'G',
      bpm: '120',
      cifra_url: '',
      youtube_url: '',
      notes: ''
    });
    setSongModalOpen(true);
  };

  const handleOpenEditSong = (song: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSongId(song.id);
    setSongForm({
      title: song.title || '',
      artist: song.artist || '',
      musical_key: song.musical_key || '',
      bpm: song.bpm ? String(song.bpm) : '',
      cifra_url: song.cifra_url || '',
      youtube_url: song.youtube_url || '',
      notes: song.notes || ''
    });
    setSongModalOpen(true);
  };

  const handleSaveSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songForm.title.trim()) {
      toast.error('Título da música é obrigatório.');
      return;
    }

    setSubmittingSong(true);
    try {
      const payload = {
        title: songForm.title.trim(),
        artist: songForm.artist.trim() || null,
        musical_key: songForm.musical_key.trim() || null,
        bpm: songForm.bpm ? parseInt(songForm.bpm, 10) : null,
        cifra_url: songForm.cifra_url.trim() || null,
        youtube_url: songForm.youtube_url.trim() || null,
        notes: songForm.notes.trim() || null
      };

      if (editingSongId) {
        const { error } = previewData('songs', 'update', payload, (row: any) => getField(row, 'id') === editingSongId, { single: false, limit: undefined, order: undefined });
        if (error) throw error;
        toast.success('Música atualizada com sucesso!');
      } else {
        const { error } = previewData('songs', 'insert', payload, (row: any) => true, { single: false, limit: undefined, order: undefined });
        if (error) throw error;
        toast.success('Música cadastrada no acervo!');
      }

      setSongModalOpen(false);
      await loadData();
    } catch (err: any) {
      console.error('Erro ao salvar música:', err);
      toast.error('Erro ao salvar música: ' + err.message);
    } finally {
      setSubmittingSong(false);
    }
  };

  const handleDeleteSong = async (songId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Tem certeza que deseja remover esta música do acervo geral?')) return;

    try {
      const { error } = previewData('songs', 'delete', undefined, (row: any) => getField(row, 'id') === songId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.success('Música removida do acervo.');
      await loadData();
    } catch (err: any) {
      toast.error('Erro ao excluir música: ' + err.message);
    }
  };

  const handleAddSongToSchedule = async (song: any) => {
    if (!selectedSchedule) {
      toast.info('Selecione um culto/escala na coluna esquerda para adicionar músicas.');
      return;
    }

    const currentSongs = selectedSchedule.schedule_songs || [];
    const alreadyIn = currentSongs.some((ss: any) => ss.songs?.id === song.id);
    if (alreadyIn) {
      toast.error('Esta música já está nesta escala!');
      return;
    }

    try {
      const nextPos = currentSongs.length + 1;
      const { error } = previewData('schedule_songs', 'insert', {
          schedule_id: selectedSchedule.id,
          song_id: song.id,
          position: nextPos
        }, (row: any) => true, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.success(`"${song.title}" adicionada à playlist!`);
      await loadData();
    } catch (err: any) {
      toast.error('Erro ao vincular música: ' + err.message);
    }
  };

  const handleRemoveSongFromSchedule = async (scheduleSongId: string) => {
    try {
      const { error } = previewData('schedule_songs', 'delete', undefined, (row: any) => getField(row, 'id') === scheduleSongId, { single: false, limit: undefined, order: undefined });

      if (error) throw error;
      toast.success('Música removida da escala.');
      await loadData();
    } catch (err: any) {
      toast.error('Erro ao remover música: ' + err.message);
    }
  };

  const filteredSongs = songs.filter(s => {
    const q = songSearch.toLowerCase();
    const matchTitle = s.title?.toLowerCase().includes(q);
    const matchArtist = s.artist?.toLowerCase().includes(q);
    const matchKey = s.musical_key?.toLowerCase().includes(q);
    return matchTitle || matchArtist || matchKey;
  });

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in duration-300 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Gerenciamento
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Repertório & Louvor</h1>
        </div>
        <Button onClick={handleOpenCreateSong} className="font-bold cursor-pointer">
          <Plus className="w-4 h-4 mr-1.5" /> Nova Música no Acervo
        </Button>
      </div>

      {/* Mobile Tabs */}
      <div className="flex md:hidden bg-secondary/50 p-1 rounded-2xl mb-6 border border-border shrink-0">
        <button 
          className={cn("flex-1 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer", activeTab === 'biblioteca' ? "bg-background shadow-sm border border-border" : "text-muted-foreground")} 
          onClick={() => setActiveTab('biblioteca')}
        >
          Acervo Geral ({songs.length})
        </button>
        <button 
          className={cn("flex-1 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer", activeTab === 'playlists' ? "bg-background shadow-sm border border-border" : "text-muted-foreground")} 
          onClick={() => setActiveTab('playlists')}
        >
          Playlists por Culto ({schedulesWithSongs.length})
        </button>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        
        {/* Left Col - Playlists por Culto */}
        <div className={cn("w-full md:w-[420px] lg:w-[460px] shrink-0 flex-col h-full", activeTab === 'playlists' ? "flex" : "hidden md:flex")}>
          {!selectedSchedule ? (
            <div className="flex flex-col h-full animate-in slide-in-from-left-4">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <div>
                  <h2 className="text-xl font-extrabold">Playlists dos Cultos</h2>
                  <p className="text-xs text-muted-foreground font-semibold">Selecione para gerenciar o repertório</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 pb-8">
                {loading ? (
                  <div className="py-12 flex justify-center">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : schedulesWithSongs.length === 0 ? (
                  <Card className="p-8 text-center border-dashed rounded-3xl">
                    <ListMusic className="w-8 h-8 text-muted-foreground opacity-40 mx-auto mb-2" />
                    <p className="font-bold text-sm">Nenhum culto cadastrado.</p>
                  </Card>
                ) : (
                  schedulesWithSongs.map(schedule => {
                    const songCount = schedule.schedule_songs?.length || 0;
                    return (
                      <Card 
                        key={schedule.id} 
                        hoverable 
                        onClick={() => setSelectedSchedule(schedule)} 
                        className="p-4 flex justify-between items-center cursor-pointer rounded-2xl border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="min-w-0 pr-3">
                          <h3 className="font-extrabold text-base mb-1 truncate">{schedule.title}</h3>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {schedule.date ? formatDatePtBR(schedule.date) : ''} • {songCount} {songCount === 1 ? 'música' : 'músicas'}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-in slide-in-from-right-4 bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-secondary/30 p-5 sm:p-6 border-b border-border shrink-0">
                <button 
                  onClick={() => setSelectedSchedule(null)} 
                  className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 hover:text-foreground cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Voltar para Cultos
                </button>
                <h3 className="text-xl font-extrabold truncate mb-1">{selectedSchedule.title}</h3>
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> {selectedSchedule.date ? formatDatePtBR(selectedSchedule.date) : ''} às {selectedSchedule.start_time ? formatTimePtBR(selectedSchedule.start_time) : ''}
                </p>
                <div className="mt-3">
                  <Badge variant="primary" className="text-[10px] font-bold">
                    {selectedSchedule.schedule_songs?.length || 0} músicas selecionadas
                  </Badge>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {(!selectedSchedule.schedule_songs || selectedSchedule.schedule_songs.length === 0) ? (
                  <div className="text-center p-8 opacity-60">
                    <ListMusic className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-bold text-sm">Playlist vazia</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Clique no botão "+" em qualquer música do acervo ao lado para adicioná-la aqui.
                    </p>
                  </div>
                ) : (
                  [...selectedSchedule.schedule_songs]
                    .sort((a, b) => a.position - b.position)
                    .map((ss: any, index: number) => {
                      const song = ss.songs;
                      if (!song) return null;
                      return (
                        <div 
                          key={ss.id} 
                          className="flex items-center gap-3 p-3 bg-background border border-border rounded-2xl hover:border-primary/50 group transition-colors"
                        >
                          <div className="w-6 font-black text-xs text-muted-foreground text-center shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-sm truncate">{song.title}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                              {song.artist || 'Artista'} • Tom: {song.musical_key || 'N/D'}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 shrink-0 text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={() => handleRemoveSongFromSchedule(ss.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Col - Acervo Geral */}
        <div className={cn("flex-1 flex-col h-full bg-card border border-border rounded-3xl p-6 overflow-hidden shadow-sm", activeTab === 'biblioteca' ? "flex" : "hidden md:flex")}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 shrink-0">
            <div>
              <h2 className="text-xl font-extrabold">Acervo Geral de Músicas</h2>
              <p className="text-xs text-muted-foreground font-semibold">
                {songs.length} {songs.length === 1 ? 'música cadastrada' : 'músicas cadastradas'}
              </p>
            </div>
          </div>
          
          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              value={songSearch} 
              onChange={e => setSongSearch(e.target.value)}
              placeholder="Buscar por título, artista ou tom..." 
              className="w-full h-11 bg-secondary/50 border border-border rounded-2xl pl-11 pr-4 text-sm font-bold focus:outline-none focus:border-primary placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2.5">
            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredSongs.length === 0 ? (
              <Card className="p-8 text-center border-dashed rounded-3xl">
                <Music className="w-8 h-8 text-muted-foreground opacity-40 mx-auto mb-2" />
                <p className="font-bold text-sm">Nenhuma música encontrada.</p>
              </Card>
            ) : (
              filteredSongs.map(song => (
                <div 
                  key={song.id} 
                  className="p-4 bg-background border border-border rounded-2xl flex items-center justify-between group hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-extrabold text-base truncate mb-0.5">{song.title}</p>
                    <p className="text-xs font-bold text-muted-foreground truncate">{song.artist || 'Artista não informado'}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {song.cifra_url && (
                        <a 
                          href={song.cifra_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                          onClick={e => e.stopPropagation()}
                        >
                          <FileText className="w-3 h-3" /> Cifra
                        </a>
                      )}
                      {song.youtube_url && (
                        <a 
                          href={song.youtube_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1"
                          onClick={e => e.stopPropagation()}
                        >
                          <Video className="w-3 h-3" /> YouTube
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    {song.musical_key && (
                      <Badge className="bg-secondary text-xs font-black px-2.5 py-1">
                        {song.musical_key}
                      </Badge>
                    )}
                    {song.bpm && (
                      <Badge className="bg-secondary text-xs font-black px-2.5 py-1 hidden sm:inline-flex">
                        {song.bpm} bpm
                      </Badge>
                    )}
                    
                    <div className="flex gap-1.5 ml-2">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="w-9 h-9 cursor-pointer" 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleOpenEditSong(song, e)}
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-9 h-9 text-destructive hover:bg-destructive/10 cursor-pointer" 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDeleteSong(song.id, e)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {selectedSchedule && (
                        <Button 
                          size="icon" 
                          className="w-9 h-9 bg-primary text-primary-foreground hover:brightness-110 cursor-pointer" 
                          onClick={() => handleAddSongToSchedule(song)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Criação / Edição de Música */}
      <Modal 
        isOpen={isSongModalOpen} 
        onClose={() => setSongModalOpen(false)} 
        title={editingSongId ? "Editar Música" : "Nova Música no Acervo"}
      >
        <form onSubmit={handleSaveSong} className="space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar p-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Título da Música *
              </label>
              <input 
                type="text" 
                required
                value={songForm.title} 
                onChange={e => setSongForm({ ...songForm, title: e.target.value })}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="Ex: Bondade de Deus, Ele Vive"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Artista / Compositor
              </label>
              <input 
                type="text" 
                value={songForm.artist} 
                onChange={e => setSongForm({ ...songForm, artist: e.target.value })}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="Ex: Isaías Saad, Bethel Music"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Tom Musical
              </label>
              <input 
                type="text" 
                value={songForm.musical_key} 
                onChange={e => setSongForm({ ...songForm, musical_key: e.target.value })}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="Ex: G, D, Bm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                BPM (Andamento)
              </label>
              <input 
                type="number" 
                value={songForm.bpm} 
                onChange={e => setSongForm({ ...songForm, bpm: e.target.value })}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="Ex: 72, 120"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Link da Cifra (Cifra Club ou PDF)
              </label>
              <input 
                type="url" 
                value={songForm.cifra_url} 
                onChange={e => setSongForm({ ...songForm, cifra_url: e.target.value })}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="https://www.cifraclub.com.br/..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Link do YouTube
              </label>
              <input 
                type="url" 
                value={songForm.youtube_url} 
                onChange={e => setSongForm({ ...songForm, youtube_url: e.target.value })}
                className="w-full h-11 bg-secondary/50 border border-border rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary" 
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                Observações / Estrutura
              </label>
              <textarea 
                rows={3}
                value={songForm.notes} 
                onChange={e => setSongForm({ ...songForm, notes: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-primary resize-none"
                placeholder="Ex: Introdução com teclado suave, solo na segunda estrofe..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-4">
            <Button type="button" variant="secondary" className="flex-1 font-bold cursor-pointer" onClick={() => setSongModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-bold cursor-pointer" disabled={submittingSong}>
              {submittingSong ? 'Salvando...' : 'Salvar Música'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


// --- ADMIN FEED ---
