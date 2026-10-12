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


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



// --- SYSTEM COMPONENTS ---

export function Button({ children, variant = 'primary', size = 'md', className, ...props }: any) {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:brightness-95 border-transparent shadow-sm',
    secondary: 'bg-secondary text-foreground hover:bg-secondary/80 border-border',
    ghost: 'bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground',
    outline: 'bg-transparent border-border text-foreground hover:bg-secondary',
    destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent',
  };
  const sizes = {
    xs: 'h-8 px-3 text-[10px] font-bold rounded-full',
    sm: 'h-9 px-4 text-xs font-bold rounded-full',
    md: 'h-12 px-6 text-sm font-bold rounded-full',
    lg: 'h-14 px-8 text-base font-bold rounded-full',
    icon: 'h-10 w-10 flex items-center justify-center rounded-full',
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-colors border outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variants[variant as keyof typeof variants],
        sizes[size as keyof typeof sizes],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Badge({ children, variant = 'default', className }: any) {
  const variants = {
    default: 'bg-secondary text-foreground',
    primary: 'bg-primary/20 text-primary-foreground dark:text-primary',
    success: 'bg-green-500/20 text-green-700 dark:text-green-400',
    warning: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
    destructive: 'bg-red-500/20 text-red-700 dark:text-red-400 animate-pulse',
  };
  return (
    <span className={cn('px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap', variants[variant as keyof typeof variants], className)}>
      {children}
    </span>
  );
}

export function Card({ children, className, hoverable = false, onClick }: any) {
  const Component = hoverable ? motion.div : 'div';
  return (
    <Component 
      onClick={onClick}
      whileHover={hoverable ? { y: -4 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden',
        hoverable && 'hover:border-primary/50 transition-colors group cursor-pointer hover:shadow-md',
        className
      )}
    >
      {children}
    </Component>
  );
}

export function Avatar({ src, alt, size = 'md', className, fallback }: any) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };
  
  if (!src) {
    return (
      <div className={cn('rounded-full flex items-center justify-center bg-secondary border border-border text-muted-foreground font-bold text-xs', sizes[size as keyof typeof sizes], className)}>
        {fallback || '?'}
      </div>
    );
  }
  return (
    <img src={src} alt={alt} className={cn('rounded-full object-cover border border-border bg-secondary', sizes[size as keyof typeof sizes], className)} />
  );
}

export function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>
      <Card className="w-full max-w-lg shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 p-6 sm:p-8">
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
        {title && <h2 className="text-2xl font-extrabold mb-6 pr-8">{title}</h2>}
        {children}
      </Card>
    </div>
  );
}

// --- MAIN APP ---


export function formatDatePtBR(dateStr?: string) {
  if (!dateStr) return ''
  try {
    const [year, month, day] = dateStr.split('-')
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const monthIndex = parseInt(month, 10) - 1
    return `${day} ${months[monthIndex] || ''}`
  } catch {
    return dateStr
  }
}

export function formatFullDatePtBR(dateStr?: string) {
  if (!dateStr) return ''
  try {
    const [year, month, day] = dateStr.split('-')
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    const monthIndex = parseInt(month, 10) - 1
    return `${parseInt(day, 10)} de ${months[monthIndex] || ''} de ${year}`
  } catch {
    return dateStr
  }
}

export function formatTimePtBR(timeStr?: string) {
  if (!timeStr) return ''
  return timeStr.slice(0, 5)
}

// --- VIEWS ---


export function SidebarItem({ icon, label, active, badge, notificationCount, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={cn(
      "flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 group",
      active 
        ? "bg-primary text-primary-foreground font-bold shadow-[0_4px_14px_rgba(198,255,77,0.2)]" 
        : "text-muted-foreground hover:bg-secondary hover:text-foreground font-medium"
    )}>
      <div className="flex items-center gap-3.5">
        {React.cloneElement(icon, { 
          className: cn("w-5 h-5 transition-transform duration-300", active ? "stroke-[2.5px]" : "stroke-2 group-hover:scale-110 group-hover:text-primary") 
        })}
        <span>{label}</span>
      </div>
      {badge && <Badge variant="primary">{badge}</Badge>}
      {notificationCount && (
        <span className="bg-destructive text-destructive-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">{notificationCount}</span>
      )}
    </div>
  );
}

export function BottomNavItem({ icon, label, active, notification, onClick }: any) {
  return (
    <div onClick={onClick} className="flex flex-col items-center justify-center w-16 relative cursor-pointer group gap-1.5">
      <div className={cn(
        "flex items-center justify-center w-12 h-10 rounded-2xl transition-all duration-300",
        active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground group-hover:bg-secondary group-hover:text-foreground"
      )}>
        {React.cloneElement(icon, { className: cn("w-5 h-5", active ? "stroke-[2.5px]" : "stroke-2") })}
      </div>
      <span className={cn("text-[10px] transition-colors", active ? "text-foreground font-extrabold" : "text-muted-foreground font-semibold")}>{label}</span>
      {notification && <span className="absolute top-0 right-3 w-2.5 h-2.5 bg-destructive border-2 border-background rounded-full"></span>}
    </div>
  );
}

export function SectionHeader({ title, badge }: { title: string, badge?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="text-xl sm:text-2xl font-extrabold">{title}</h2>
      {badge && <Badge variant="destructive">{badge}</Badge>}
    </div>
  );
}

export function ProximoCultoCard({ proximaEscala, loading, onClick, onConfirm, onTrocaClick }: any) {
  if (loading) {
    return (
      <Card className="p-8 text-center bg-card border-border">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm font-bold text-muted-foreground">Carregando sua próxima escala...</p>
      </Card>
    )
  }

  if (!proximaEscala || !proximaEscala.schedules) {
    return (
      <Card className="p-8 text-center bg-secondary/20 border-dashed border-border rounded-3xl">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <Calendar className="w-7 h-7" />
        </div>
        <h3 className="font-extrabold text-xl mb-1">Você não possui escalas futuras</h3>
        <p className="text-sm font-semibold text-muted-foreground mb-4">
          Quando seu líder publicar uma escala com você, ela aparecerá aqui.
        </p>
      </Card>
    )
  }

  const schedule = proximaEscala.schedules
  const isConfirmed = proximaEscala.response === 'confirmed'
  const isPending = proximaEscala.response === 'pending'
  const ministryName = schedule.ministries?.name || 'Ministério'
  const roleName = proximaEscala.ministry_roles?.name || 'Voluntário'
  const formattedDate = formatFullDatePtBR(schedule.date)
  const formattedTime = formatTimePtBR(schedule.start_time)

  return (
    <Card hoverable className="p-0 border-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-border">
      <div className="bg-primary px-6 sm:px-8 py-5 flex items-center justify-between" onClick={onClick}>
        <Badge variant={isConfirmed ? 'success' : isPending ? 'warning' : 'destructive'} className={isConfirmed ? 'bg-primary-foreground/20 text-primary-foreground' : undefined}>
          {isConfirmed ? 'Confirmado' : isPending ? 'Pendente' : 'Recusado'}
        </Badge>
        <div className="flex items-center gap-2 text-primary-foreground/90 text-sm font-bold">
          <Clock className="w-4 h-4" /> {formattedDate}
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 gap-6" onClick={onClick}>
          <div>
            <h3 className="font-extrabold text-2xl sm:text-3xl mb-4 tracking-tight">{schedule.title || 'Culto de Celebração'}</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-secondary/50 text-foreground px-4 py-2 rounded-xl">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{formattedDate} • {formattedTime}</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 text-foreground px-4 py-2 rounded-xl">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{schedule.location || 'Templo Principal'}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-secondary items-center justify-center text-foreground shrink-0 rotate-3">
            {getMinistryIconComponent(ministryName)}
          </div>
        </div>

        <div className="bg-secondary/30 rounded-2xl p-5 mb-8 border border-border/50 flex items-center gap-4" onClick={onClick}>
          <div className="w-1.5 bg-primary rounded-full h-12"></div>
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Ministério & Função</p>
            <p className="font-extrabold text-lg sm:text-xl">{ministryName} • {roleName}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button 
            size="lg" 
            className={cn("flex-1 text-base font-extrabold", isConfirmed && "opacity-90")} 
            onClick={(e: any) => { 
              e.stopPropagation() 
              onConfirm?.() 
            }}
          >
            <CheckCircle2 className="w-5 h-5 mr-1" />
            {isConfirmed ? 'Presença Confirmada' : 'Confirmar presença'}
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            className="sm:w-auto font-bold" 
            onClick={(e: any) => { 
              e.stopPropagation() 
              onTrocaClick?.() 
            }}
          >
            <ArrowRightLeft className="w-5 h-5 sm:mr-0 mr-2" />
            <span className="sm:hidden">Solicitar troca</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function EscalaAbertaCard({ slot, onQueroServir }: any) {
  const [applied, setApplied] = useState(false);
  const schedule = slot?.schedules;
  const ministry = schedule?.ministries?.name || 'Ministério';
  const role = slot?.ministry_roles?.name || 'Voluntário';
  const formattedDate = formatDatePtBR(schedule?.date);
  const formattedTime = formatTimePtBR(schedule?.start_time);

  return (
    <Card className={cn(
      "flex flex-col h-full bg-gradient-to-b from-card to-card/50 rounded-3xl",
      applied ? "border-primary/50" : "hover:border-primary/50"
    )}>
      {applied ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h4 className="font-extrabold text-xl mb-2">Vaga assumida! 🙌</h4>
          <p className="text-sm font-semibold text-muted-foreground mb-4">Você foi adicionado(a) à escala.</p>
          <Badge variant="success">Confirmado</Badge>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6 bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-2xl w-fit">
            <Flame className="w-5 h-5" />
            <p className="font-extrabold text-sm tracking-widest uppercase">Escala Aberta</p>
          </div>
          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center gap-3 text-sm font-bold">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><Clock className="w-4 h-4" /></div>
              <div><p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Quando</p><p>{formattedDate} • {formattedTime}</p></div>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><Users className="w-4 h-4" /></div>
              <div><p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">{ministry}</p><p className="text-destructive font-extrabold">Falta: {role}</p></div>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => { 
              setApplied(true); 
              onQueroServir?.(); 
            }} 
            className="w-full hover:bg-primary hover:text-primary-foreground hover:border-primary font-extrabold cursor-pointer"
          >
            Quero servir
          </Button>
        </>
      )}
    </Card>
  );
}

export function VoluntarioMesCard({ highlight }: any) {
  const name = highlight?.profiles?.full_name || 'Destaque do Mês';
  const avatar = highlight?.profiles?.avatar_url;
  const reason = highlight?.reason || 'Servindo a igreja com amor e excelência';

  return (
    <Card hoverable className="relative p-0 border-none bg-primary text-primary-foreground overflow-hidden rounded-3xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6"><Trophy className="w-5 h-5 fill-current" /><h3 className="font-extrabold uppercase tracking-widest text-xs">Destaque do Mês</h3></div>
        <div className="flex items-center gap-5">
          <Avatar 
            src={avatar || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&auto=format"} 
            alt={name} 
            size="xl" 
            className="border-4 border-primary-foreground/20 shadow-xl" 
            fallback={name.charAt(0)}
          />
          <div>
            <p className="font-extrabold text-2xl mb-1">{name}</p>
            <Badge className="bg-primary-foreground text-primary shadow-sm text-xs px-3 font-bold">
              {reason}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AniversariosCard({ birthdays = [] }: any) {
  return (
    <Card hoverable className="h-full flex flex-col rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
            <Gift className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-lg">Aniversários</h3>
        </div>
      </div>
      <div className="space-y-4 flex-1 justify-center flex flex-col">
        {birthdays.length === 0 ? (
          <p className="text-xs font-semibold text-muted-foreground text-center py-4">Nenhum aniversariante registrado</p>
        ) : (
          birthdays.slice(0, 3).map((person: any) => (
            <div key={person.id} className="flex items-center gap-4 group cursor-pointer">
              <Avatar 
                src={person.avatar_url} 
                alt={person.full_name} 
                size="lg" 
                fallback={person.full_name?.charAt(0) || 'U'}
                className="group-hover:border-primary transition-colors" 
              />
              <div className="flex-1">
                <p className="text-base font-extrabold">{person.full_name}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                  {formatDatePtBR(person.birth_date)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export function AvisoCard({ title, time, content, icon, primary }: any) {
  return (
    <div className="p-4 rounded-3xl border border-border bg-card hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group flex gap-4">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors", primary ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-foreground border-border group-hover:bg-secondary/80")}>{icon}</div>
      <div className="flex-1 pt-1">
        <div className="flex items-center justify-between mb-1.5"><p className="font-extrabold text-base">{title}</p><span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-1 rounded-md">{time}</span></div>
        <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}


export function getMinistryIconComponent(name: string) {
  const normalized = (name || '').toLowerCase()
  if (normalized.includes('louvor') || normalized.includes('música') || normalized.includes('som')) return <Mic className="w-7 h-7" />
  if (normalized.includes('mídia') || normalized.includes('transmissão') || normalized.includes('vídeo') || normalized.includes('projeção')) return <MonitorPlay className="w-7 h-7" />
  if (normalized.includes('comunicação') || normalized.includes('foto') || normalized.includes('marketing')) return <Camera className="w-7 h-7" />
  if (normalized.includes('recepção') || normalized.includes('acolhimento') || normalized.includes('boas-vindas') || normalized.includes('portaria')) return <HeartHandshake className="w-7 h-7" />
  if (normalized.includes('infantil') || normalized.includes('kids') || normalized.includes('jovens')) return <Users className="w-7 h-7" />
  return <Users className="w-7 h-7" />
}

