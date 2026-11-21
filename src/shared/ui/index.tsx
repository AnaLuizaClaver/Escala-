import { clsx,type ClassValue } from 'clsx';
import {
ArrowRightLeft,
Calendar,
Camera,
CheckCircle2,
Clock,
Gift,
HeartHandshake,
MapPin,
Mic,
MonitorPlay,
Trophy,
Users,
X
} from 'lucide-react';
import { motion } from 'motion/react';
import React,{ useState } from 'react';
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
  const buttonVariant = variant === 'default' ? 'primary' : variant;
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
        'inline-flex items-center justify-center gap-2 transition-colors duration-150 border outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variants[buttonVariant as keyof typeof variants],
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
    primary: 'bg-accent text-accent-foreground',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  };
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap', variants[variant as keyof typeof variants], className)}>
      {children}
    </span>
  );
}

export function Card({ children, className, hoverable = false, onClick }: any) {
  const Component = hoverable ? motion.div : 'div';
  return (
    <Component 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onClick(); }
      } : undefined}
      whileHover={hoverable ? { y: -4 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden',
        hoverable && 'hover:border-primary/50 transition-colors group cursor-pointer hover:shadow-md',
        onClick && 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
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
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const onCloseRef = React.useRef(onClose);
  React.useLayoutEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key !== 'Tab') return;
      const dialog = closeRef.current?.closest('[role="dialog"]');
      const focusable = Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]') || []);
      if (focusable.length === 0) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); previous?.focus(); };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div role="dialog" aria-modal="true" aria-label={title || 'Janela de diálogo'} className="w-full max-w-lg relative z-10">
      <Card className="w-full max-w-lg shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 p-6 sm:p-8">
        <button ref={closeRef} type="button" aria-label="Fechar" onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring">
          <X className="w-5 h-5" />
        </button>
        {title && <h2 className="text-2xl font-extrabold mb-6 pr-8">{title}</h2>}
        {children}
      </Card>
      </div>
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
    <button type="button" aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={cn(
      "flex items-center justify-between w-full text-left px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 group focus-visible:outline-2 focus-visible:outline-ring",
      active 
        ? "bg-primary text-primary-foreground font-bold"
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
    </button>
  );
}

export function BottomNavItem({ icon, label, active, notification, onClick, admin = false }: any) {
  return (
    <button type="button" aria-current={active ? 'page' : undefined} onClick={onClick} className={cn("relative flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-ring", admin ? "w-16 shrink-0" : "w-full", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
      <div className="flex items-center justify-center">
        {React.cloneElement(icon, { className: cn("w-5 h-5", active ? "stroke-[2.5px]" : "stroke-2") })}
      </div>
      <span className={cn("text-[9px] leading-tight", active ? "font-extrabold" : "font-semibold")}>{label}</span>
      {notification && <span className="absolute top-0 right-3 w-2.5 h-2.5 bg-destructive border-2 border-background rounded-full"></span>}
    </button>
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

export function ProximoCultoCard({ proximaEscala, onClick, onConfirm, onTrocaClick }: any) {
  const [confirming, setConfirming] = useState(false);
  const schedule = proximaEscala.schedules;
  const isPending = proximaEscala.response === 'pending';
  const isConfirmed = proximaEscala.response === 'confirmed';
  const ministryName = schedule.ministries?.name || 'Ministério';
  const roleName = proximaEscala.ministry_roles?.name;

  async function confirm() {
    setConfirming(true);
    try {
      await onConfirm();
    } finally {
      setConfirming(false);
    }
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-primary bg-gradient-to-br from-accent via-card to-card shadow-[var(--sticker-shadow)] p-5 sm:p-7 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Calendar className="size-4 dark:text-primary" aria-hidden="true" /> Próxima escala
        </p>
        {isConfirmed && <Badge variant="success">Presença confirmada</Badge>}
        {isPending && <Badge variant="warning">Aguardando sua resposta</Badge>}
      </div>
      <div className="mt-4 space-y-1.5">
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">{schedule.title || 'Culto de Celebração'}</h2>
        <p className="text-sm font-medium text-muted-foreground">{ministryName}{roleName && ` · ${roleName}`}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <span className="flex items-center gap-2 font-semibold">
          <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          {formatFullDatePtBR(schedule.date)} · {formatTimePtBR(schedule.start_time)}
        </span>
        {schedule.location && <span className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-4 shrink-0" aria-hidden="true" />{schedule.location}</span>}
      </div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        {isPending && <Button className="w-full sm:w-auto" disabled={confirming} onClick={() => void confirm()}>
          <CheckCircle2 className="size-4" aria-hidden="true" />{confirming ? 'Confirmando…' : 'Confirmar presença'}
        </Button>}
        <Button variant="outline" onClick={onClick}>Ver detalhes</Button>
        {onTrocaClick && <Button variant="ghost" onClick={onTrocaClick}>
          <ArrowRightLeft className="size-4" aria-hidden="true" /> Solicitar troca
        </Button>}
      </div>
    </Card>
  );
}

export function EscalaAbertaCard({ slot, featured, onQueroServir }: any) {
  const [applying, setApplying] = useState(false);
  const schedule = slot.schedules;
  const ministry = schedule?.ministries?.name || 'Ministério';
  const role = slot.ministry_roles?.name || 'Voluntário';

  async function apply() {
    setApplying(true);
    try {
      await onQueroServir();
    } finally {
      setApplying(false);
    }
  }

  return (
    <Card className="flex flex-col justify-between gap-4 rounded-2xl p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-foreground dark:text-primary" aria-hidden="true">
          {getMinistryIconComponent(ministry)}
        </div>
        <div className="min-w-0 space-y-1">
          <h3 className="font-extrabold leading-snug">{schedule?.title || 'Escala aberta'}</h3>
          <p className="text-sm text-muted-foreground">{ministry} · {role}</p>
          <p className="text-sm font-medium">{formatDatePtBR(schedule?.date)} · {formatTimePtBR(schedule?.start_time)}</p>
        </div>
      </div>
      <Button className="w-full sm:w-fit" variant={featured ? 'default' : 'outline'} size="sm" disabled={applying} onClick={() => void apply()}>
        {applying ? 'Enviando…' : 'Quero servir'}
      </Button>
    </Card>
  );
}

export function VoluntarioMesCard({ highlight }: any) {
  const name = highlight?.profiles?.full_name || 'Destaque do Mês';
  const avatar = highlight?.profiles?.avatar_url;
  const reason = highlight?.reason || 'Servindo a igreja com amor e excelência';

  return (
    <Card hoverable className="relative p-0 border border-border bg-card text-card-foreground overflow-hidden rounded-3xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6"><Trophy className="w-5 h-5 fill-current" /><h3 className="font-extrabold uppercase tracking-widest text-xs">Destaque do Mês</h3></div>
        <div className="flex items-center gap-5">
          <Avatar 
            src={avatar}
            alt={name} 
            size="xl" 
            className="border-4 border-border shadow-xl"
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

