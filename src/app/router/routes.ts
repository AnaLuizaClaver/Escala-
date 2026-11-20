export const viewPaths = {
  home: '/inicio', escalas: '/escalas', detalhes: '/escalas/:id', repertorio: '/repertorio',
  feed: '/feed', ministerios: '/ministerios', conquistas: '/conquistas',
  notificacoes: '/notificacoes', perfil: '/perfil', configuracoes: '/configuracoes',
  admin_dashboard: '/admin', admin_ministerios: '/admin/ministerios',
  admin_ministerio_detalhes: '/admin/ministerios/:id', admin_escalas: '/admin/escalas',
  admin_escala_create: '/admin/escalas/nova', admin_voluntarios: '/admin/voluntarios',
  admin_voluntario_perfil: '/admin/voluntarios/:id', admin_solicitacoes: '/admin/solicitacoes',
  admin_repertorio: '/admin/repertorio', admin_feed: '/admin/feed', admin_relatorios: '/admin/relatorios',
} as const;
export type View = keyof typeof viewPaths;
export function pathForView(view: string, data?: { id?: string }): string {
  const path = viewPaths[view as View] || viewPaths.home;
  return path.replace(':id', encodeURIComponent(data?.id || ''));
}
export function viewForPath(pathname: string): View {
  const path = pathname.replace(/\/$/, '') || '/';
  if (/^\/escalas\/[^/]+$/.test(path)) return 'detalhes';
  if (/^\/admin\/ministerios\/[^/]+$/.test(path)) return 'admin_ministerio_detalhes';
  if (/^\/admin\/voluntarios\/[^/]+$/.test(path)) return 'admin_voluntario_perfil';
  const entry = Object.entries(viewPaths).find(([, value]) => value === path);
  return entry ? entry[0] as View : 'home';
}
export function isPublicPath(pathname: string): boolean {
  return ['/login', '/cadastro', '/recuperar-senha', '/escolher-ministerio', '/aguardando-aprovacao'].includes(pathname);
}
