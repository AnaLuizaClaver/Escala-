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

export function RepertorioView({ onOpenSong }: any) {
  const [viewMode, setViewMode] = useState<'playlists' | 'all_songs'>('playlists');
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [allSongs, setAllSongs] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);
  const [showPlaylistMobile, setShowPlaylistMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKey, setSelectedKey] = useState('Todos');
  const [loading, setLoading] = useState(true);

  const musicalKeys = ['Todos', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'Am', 'Em', 'Dm', 'Bm'];

  const loadRepertoireData = async () => {
    setLoading(true);
    try {
      // 1. Buscar todas as músicas cadastradas
      const { data: songsData } = previewData('songs', 'read', undefined, (row: any) => true, { single: false, limit: undefined, order: ['title', { ascending: true }] });

      setAllSongs(songsData || []);

      // 2. Buscar escalas publicadas com repertório
      const { data: schedulesData } = previewData('schedules', 'read', undefined, (row: any) => getField(row, 'status') === 'published', { single: false, limit: undefined, order: ['date', { ascending: false }] });

      const formattedPlaylists = (schedulesData || [])
        .filter((s: any) => s.schedule_songs && s.schedule_songs.length > 0)
        .map((s: any) => ({
          id: s.id,
          name: s.title || 'Culto de Celebração',
          event: s.ministries?.name || 'Culto',
          date: formatFullDatePtBR(s.date),
          songs: (s.schedule_songs || [])
            .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
            .map((ss: any) => ss.songs)
            .filter(Boolean)
        }));

      setPlaylists(formattedPlaylists);
      if (formattedPlaylists.length > 0) {
        setSelectedPlaylist(formattedPlaylists[0]);
      }
    } catch (err) {
      console.error('Erro ao carregar repertório:', err);
      toast.error('Erro ao carregar biblioteca de músicas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRepertoireData();
  }, []);

  const handlePlaylistClick = (playlist: any) => {
    setSelectedPlaylist(playlist);
    setShowPlaylistMobile(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtro de Músicas do Acervo
  const filteredAllSongs = allSongs.filter(song => {
    const matchesSearch = 
      (song.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.artist || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKey = selectedKey === 'Todos' || (song.musical_key || '').toUpperCase() === selectedKey.toUpperCase();
    return matchesSearch && matchesKey;
  });

  // Filtro de Playlists
  const filteredPlaylists = playlists.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-300 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Biblioteca Musical</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Repertório</h1>
        </div>

        <div className="flex items-center gap-2 bg-secondary/60 p-1.5 rounded-2xl border border-border w-fit">
          <button
            onClick={() => setViewMode('playlists')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-extrabold transition-all",
              viewMode === 'playlists' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Repertórios por Culto
          </button>
          <button
            onClick={() => setViewMode('all_songs')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-extrabold transition-all",
              viewMode === 'all_songs' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Todas as Músicas ({allSongs.length})
          </button>
        </div>
      </div>

      {viewMode === 'all_songs' ? (
        <div className="space-y-6 flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título da música ou artista..." 
                className="w-full h-12 bg-card border border-border rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              {musicalKeys.map(k => (
                <button
                  key={k}
                  onClick={() => setSelectedKey(k)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border whitespace-nowrap",
                    selectedKey === k ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:bg-secondary"
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-bold text-muted-foreground">Carregando acervo musical...</p>
            </div>
          ) : filteredAllSongs.length === 0 ? (
            <Card className="p-12 text-center border-dashed rounded-3xl bg-secondary/10 flex-1 flex flex-col items-center justify-center">
              <Music className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-extrabold text-xl mb-1">Nenhuma música encontrada</h3>
              <p className="text-sm font-semibold text-muted-foreground max-w-md">
                Tente ajustar os termos da busca ou selecione outro tom musical.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pb-6">
              {filteredAllSongs.map((song: any) => (
                <Card 
                  key={song.id} 
                  hoverable
                  onClick={() => onOpenSong?.(song)}
                  className="p-5 rounded-3xl border border-border cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border group-hover:bg-primary/20 transition-colors">
                      <Music className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-base truncate">{song.title}</h4>
                      <p className="text-xs font-bold text-muted-foreground truncate">{song.artist || 'Artista não especificado'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {song.musical_key && (
                      <Badge variant="default" className="font-extrabold text-xs px-2.5 py-1">
                        {song.musical_key}
                      </Badge>
                    )}
                    {song.bpm && (
                      <span className="text-[11px] font-bold text-muted-foreground hidden sm:inline">
                        {song.bpm} BPM
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0 relative">
          <div className={cn("md:w-80 lg:w-96 shrink-0 flex flex-col h-full", showPlaylistMobile ? "hidden md:flex" : "flex")}>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar repertório por culto..." 
                className="w-full h-12 bg-card border border-border rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pb-4 pr-2">
              {filteredPlaylists.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs font-bold text-muted-foreground">Nenhuma playlist encontrada</p>
                </div>
              ) : (
                filteredPlaylists.map(playlist => (
                  <div 
                    key={playlist.id} 
                    onClick={() => handlePlaylistClick(playlist)}
                    className={cn(
                      "p-4 rounded-3xl border transition-all cursor-pointer group flex items-center justify-between",
                      selectedPlaylist?.id === playlist.id
                        ? "bg-foreground text-background border-foreground shadow-md"
                        : "bg-card border-border hover:border-primary/50 text-foreground"
                    )}
                  >
                    <div>
                      <h3 className="font-extrabold text-base mb-1">{playlist.name}</h3>
                      <p className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        selectedPlaylist?.id === playlist.id ? "text-background/70" : "text-muted-foreground"
                      )}>
                        {playlist.date} • {playlist.songs.length} músicas
                      </p>
                    </div>
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      selectedPlaylist?.id === playlist.id ? "bg-background/20 text-background" : "bg-secondary group-hover:bg-primary/20 text-foreground"
                    )}>
                      <PlayCircle className="w-5 h-5" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={cn("flex-1 flex flex-col h-full", !showPlaylistMobile ? "hidden md:flex" : "flex animate-in slide-in-from-right-4 md:animate-none")}>
            {selectedPlaylist ? (
              <Card className="flex-1 flex flex-col p-0 overflow-hidden border-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-border rounded-3xl">
                <div className="bg-secondary/30 p-6 sm:p-8 border-b border-border shrink-0">
                  <button 
                    className="md:hidden flex items-center gap-2 text-sm font-bold text-muted-foreground mb-6 bg-background px-4 py-2 rounded-full border border-border"
                    onClick={() => setShowPlaylistMobile(false)}
                  >
                    <ChevronLeft className="w-4 h-4" /> Voltar para Playlists
                  </button>
                  
                  <Badge variant="primary" className="mb-4">{selectedPlaylist.event}</Badge>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">{selectedPlaylist.name}</h2>
                  <p className="font-semibold text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {selectedPlaylist.date}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
                  {selectedPlaylist.songs.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPlaylist.songs.map((song: any, i: number) => (
                        <div 
                          key={song.id || i} 
                          onClick={() => onOpenSong?.(song)}
                          className="group p-4 sm:p-5 rounded-3xl border border-border bg-background hover:border-primary/50 transition-all cursor-pointer hover:shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center font-extrabold text-lg text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-extrabold text-lg truncate">{song.title}</p>
                                <p className="text-sm font-bold text-muted-foreground truncate">{song.artist}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-6 shrink-0 bg-secondary/50 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none">
                              <div className="flex items-center gap-2">
                                <Badge className="font-extrabold text-sm px-3 bg-background border border-border sm:bg-secondary sm:border-transparent">
                                  {song.musical_key || song.tone || 'G'}
                                </Badge>
                              </div>
                              {song.bpm && (
                                <div className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground">
                                  <AlignLeft className="w-4 h-4" /> {song.bpm} BPM
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                        <Music className="w-10 h-10 text-muted-foreground opacity-50" />
                      </div>
                      <p className="font-extrabold text-2xl mb-2">Playlist Vazia</p>
                      <p className="font-medium text-muted-foreground max-w-sm">Ainda não foram adicionadas músicas para este evento.</p>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="flex-1 flex flex-col items-center justify-center text-center p-8 border-dashed rounded-3xl">
                <Music className="w-12 h-12 text-muted-foreground opacity-40 mb-3" />
                <p className="font-extrabold text-lg">Selecione uma playlist para ver o repertório</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export function SongDetailsModal({ song, onClose }: any) {
  if (!song) return null;

  const key = song.musical_key || song.tone || 'G';
  const bpm = song.bpm || '—';

  return (
    <Modal isOpen={!!song} onClose={onClose}>
      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border">
          <Music className="w-8 h-8 text-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 truncate">{song.title}</h2>
          <p className="text-base sm:text-lg font-bold text-muted-foreground truncate">{song.artist || 'Artista não especificado'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-secondary/50 p-4 rounded-2xl border border-border text-center">
          <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1">Tom Musical</p>
          <p className="text-2xl font-extrabold text-primary">{key}</p>
        </div>
        <div className="bg-secondary/50 p-4 rounded-2xl border border-border text-center">
          <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1">Andamento (BPM)</p>
          <p className="text-2xl font-extrabold">{bpm}</p>
        </div>
      </div>

      {song.notes && (
        <div className="mb-8 bg-card border border-border rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Observações do Arranjo / Líder
          </p>
          <p className="text-sm font-semibold leading-relaxed text-foreground/90">{song.notes}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="secondary" 
          className="flex-1 border-border bg-card hover:bg-secondary font-bold"
          onClick={() => {
            if (song.cifra_url) {
              window.open(song.cifra_url, '_blank');
            } else {
              toast.info('Link da cifra não cadastrado para esta música.');
            }
          }}
        >
          <FileText className="w-4 h-4 mr-2" />
          Ver Cifra
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1 border-border bg-card hover:bg-secondary font-bold text-red-500 hover:text-red-600"
          onClick={() => {
            if (song.youtube_url) {
              window.open(song.youtube_url, '_blank');
            } else {
              toast.info('Link do YouTube não cadastrado para esta música.');
            }
          }}
        >
          <Youtube className="w-4 h-4 mr-2" />
          Assistir no YouTube
        </Button>
      </div>
    </Modal>
  );
}
// --- SHARED COMPONENTS IN MAIN APP ---

