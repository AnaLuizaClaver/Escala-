import './style.css'
import { churchDate } from './time.ts'

import { previewActions as repository, previewRows, previewRecord, previewUpdate, previewCommand, previewIdentity } from '../../src/mocks/rebuildPreview.ts'
type Row = Record<string, any> & { id: string }
type DocumentData = Record<string, any>
type User = typeof previewIdentity
const root = document.querySelector<HTMLDivElement>('#app')!
let user: User | null = previewIdentity, access: DocumentData | null = null, profile: DocumentData | null = null, contact: DocumentData | null = null
let permissions: Row[] = []
let ministries: Row[] = [], members: Row[] = [], events: Row[] = [], schedules: Row[] = [], roles: Row[] = [], assignments: Row[] = [], links: Row[] = [], swaps: Row[] = [], unavailable: Row[] = []
let section = 'overview', selected = '', selectedSchedule = '', loading = false, busy = false, error = '', success = '', epoch = 0
const owned = new Map<string, DocumentData>()
const admin = () => access?.papel === 'administrador'
const manages = () => admin() || owned.get(selected)?.papel === 'lider'
const h = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!))
const name = (uid: string) => members.find(item => item.id === uid)?.nome || (user?.uid === uid ? profile?.nome || user.displayName : uid)
const date = (value: { toDate?: () => Date } | undefined) => value?.toDate?.().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }) || '—'
const badge = (status: string) => `<span class="badge ${h(status)}">${h(status)}</span>`
const button = (action: string, label: string, data: Record<string,string> = {}, secondary = false) => `<button type="button" data-action="${h(action)}" ${Object.entries(data).map(([key,value])=>`data-${key}="${h(value)}"`).join(' ')} class="${secondary ? 'secondary' : ''}" ${busy ? 'disabled' : ''}>${h(label)}</button>`
const input = (label: string, key: string, type = 'text', value = '', required = true) => `<label>${h(label)}<input name="${key}" type="${type}" value="${h(value)}" ${required ? 'required' : ''} ${type === 'text' ? 'maxlength="120"' : ''}></label>`
const select = (label: string, key: string, options: string[][], value = '', required = true) => `<label>${h(label)}<select name="${key}" ${required?'required':''}>${options.map(([id,name])=>`<option value="${h(id)}" ${id===value?'selected':''}>${h(name)}</option>`).join('')}</select></label>`
const form = (action: string, title: string, content: string, label = 'Salvar') => `<form data-form="${action}" class="panel"><h3>${title}</h3><div class="fields">${content}</div><button ${busy?'disabled':''}>${label}</button></form>`
const empty = (text: string) => `<p class="empty">${text}</p>`
const shell = (body: string) => `<header><a class="brand" href="#">escalae<span>GESTÃO DE MINISTÉRIOS</span></a><div class="account">${user?`<span>${h(profile?.nome || user.displayName || user.email)}</span>${button('logout','Sair',{},true)}`:''}</div></header>${body}<footer>Uma igreja. Pessoas conectadas ao propósito. <a href="mailto:projeto.escalae@gmail.com">Fale com o suporte</a></footer>`
function friendly(reason: unknown) { return (reason as Error)?.message || 'Não foi possível concluir a operação.' }
const command = previewCommand
async function load() {
  var e, a;
  const i = ++epoch;
  loading = !0, render();
  try {
    if (!user) return;
    const t = user.uid,
      s = await repository.getAccess(t);
    if (i !== epoch) return;
    if (access = s, !(access != null && access.ativo)) {
      profile = null;
      return;
    }
    const [o, d, ee, W, ie] = await Promise.all([repository.getProfile(t), repository.listMinistries(), previewRows("membros"), repository.getPrivateContact(t), admin() ? previewRows("acessos") : Promise.resolve([])]);
    if (i !== epoch) return;
    profile = o, ministries = d, members = ee, contact = W, permissions = ie, ministries.some((u: any) => u.id === selected) || (selected = ((e = ministries[0]) == null ? void 0 : e.id) || ""), owned.clear(), await Promise.all(ministries.map(async (u: any) => {
      const A = previewRecord(`ministerios/${u.id}/integrantes/${t}`);
      i === epoch && A != null && A.ativo && owned.set(u.id, A);
    }));
    const [ae, se] = await Promise.all([admin() ? previewRows("eventos") : previewRows("eventos").filter((u: any) => u.status === "publicado"), repository.listUnavailability(t)]);
    if (i !== epoch) return;
    events = ae.sort((u: any, A: any) => u.inicioEm.toMillis() - A.inicioEm.toMillis()), unavailable = se, roles = [], links = [], schedules = [], assignments = [], swaps = [], selected && (roles = await repository.listFunctions(selected), manages() ? (links = await previewRows(`ministerios/${selected}/integrantes`), schedules = await previewRows("escalas").filter((u: any) => u.ministerioId === selected), swaps = await previewRows("solicitacoesTroca").filter((u: any) => u.ministerioId === selected)) : owned.has(selected) && (schedules = await repository.listPublishedSchedules(selected), swaps = await previewRows("solicitacoesTroca").filter((u: any) => u.solicitanteMembroId === t)), schedules.some((u: any) => u.id === selectedSchedule) || (selectedSchedule = ((a = schedules[0]) == null ? void 0 : a.id) || ""), selectedSchedule && (assignments = await previewRows(`escalas/${selectedSchedule}/designacoes`)));
  } catch (t) {
    i === epoch && (error = friendly(t));
  } finally {
    i === epoch && (loading = !1, render());
  }
}
function overview() {
  var e;
  const i = schedules.filter((a: any) => a.status === "publicada" && a.inicioEm.toMillis() > Date.now()).sort((a: any, t: any) => a.inicioEm.toMillis() - t.inicioEm.toMillis())[0];
  return `<div class="hero"><div><p class="eyebrow">SERVIR JUNTOS</p><h1>Organização para servir.<br>Espaço para cuidar.</h1><p>Ministérios, pessoas e escalas da sua igreja em um só lugar.</p>${button("navigate", "Organizar ministérios", {
    section: "ministries"
  })}</div><div class="hero-mark" aria-hidden="true">✳</div></div><div class="stats"><article><strong>${ministries.length}</strong><span>Ministérios ativos</span></article><article><strong>${members.filter((a: any) => a.ativo).length}</strong><span>Pessoas na igreja</span></article><article><strong>${schedules.filter((a: any) => a.status === "publicada").length}</strong><span>Escalas no ministério selecionado</span></article></div><section class="panel"><p class="eyebrow">PRÓXIMO ENCONTRO DO MINISTÉRIO</p>${i ? `<h2>${h(((e = events.find((a: any) => a.id === i.eventoId)) == null ? void 0 : e.titulo) || "Encontro")}</h2><p>${date(i.inicioEm)}</p>${button("navigate", "Ver escala", {
    section: "schedules"
  })}` : empty("Nenhuma escala futura publicada neste ministério.")}</section>`;
}
function ministryPage() {
  var i;
  return `<h1>Ministérios</h1><p class="intro">Cada ministério com seu nome, suas funções e suas pessoas.</p><div class="cards">${ministries.map((e: any) => `<article class="panel ministry" style="border-top-color:${/^#[\da-f]{6}$/i.test(e.cor) ? h(e.cor) : "#254c40"}"><h3>${h(e.nome)}</h3><p>${h(e.descricao || "Um espaço para servir em comunidade.")}</p>${button("choose", "Ver funções", {
    id: e.id
  })}${admin() ? button("archive", "Arquivar", {
    id: e.id
  }, !0) : ""}</article>`).join("") || empty("Cadastre o primeiro ministério para começar.")}</div>${admin() ? form("ministry", "Novo ministério", input("Nome", "nome") + input("Descrição", "descricao", "text", "", !1) + input("Cor", "cor", "color", "#487666")) : ""}${selected ? `<section class="panel"><h2>Funções · ${h((i = ministries.find((e: any) => e.id === selected)) == null ? void 0 : i.nome)}</h2>${roles.map((e: any) => `<div class="list-row"><strong>${h(e.nome)}</strong><span>Até ${h(e.capacidade)} pessoas por escala</span></div>`).join("") || empty("Nenhuma função cadastrada.")}</section>${manages() ? form("function", "Nova função", input("Nome", "nome") + input("Pessoas necessárias", "capacidade", "number", "1") + input("Ordem", "ordem", "number", "0")) : ""}` : ""}`;
}
function memberPage() {
  var i;
  return `<h1>Pessoas</h1><p class="intro">Membros da igreja e vínculos com os ministérios.</p><section class="panel">${members.map((e: any) => {
    var a, t;
    return `<div class="list-row"><strong>${h(e.nome)}</strong>${badge(e.ativo ? "ativo" : "inativo")}${admin() ? badge((a = permissions.find((s: any) => s.id === e.id)) != null && a.ativo ? "acesso ativo" : "acesso bloqueado") : ""}${admin() && e.id !== (user == null ? void 0 : user.uid) && (t = permissions.find((s: any) => s.id === e.id)) != null && t.ativo ? button("revoke", "Bloquear acesso", {
      id: e.id
    }, !0) : ""}<small>${h(e.id)}</small></div>`;
  }).join("") || empty("Nenhum membro cadastrado.")}</section>${admin() ? form("access", "Liberar acesso", input("UID da conta", "uid") + select("Perfil", "papel", [["membro", "Membro"], ["administrador", "Administrador"]]), "Liberar acesso") : ""}${selected && manages() ? `${form("membership", "Vincular ao ministério", select("Pessoa", "uid", members.filter((e: any) => e.ativo).map((e: any) => [e.id, e.nome])) + select("Papel", "papel", admin() ? [["voluntario", "Voluntário"], ["lider", "Líder"]] : [["voluntario", "Voluntário"]]))}<section class="panel"><h3>Equipe · ${h((i = ministries.find((e: any) => e.id === selected)) == null ? void 0 : i.nome)}</h3>${links.map((e: any) => `<div class="list-row"><strong>${h(name(e.id))}</strong>${badge(e.papel)}${badge(e.ativo ? "ativo" : "inativo")}${e.ativo && (admin() || e.papel !== "lider") ? button("unlink", "Desativar vínculo", {
    id: e.id,
    role: e.papel
  }, !0) : ""}</div>`).join("") || empty("Nenhum vínculo cadastrado.")}</section>` : ""}`;
}
function eventPage() {
  return `<h1>Encontros e eventos</h1><p class="intro">Os horários são exibidos no fuso de São Paulo.</p><section class="panel">${events.map((i: any) => `<div class="list-row"><div><strong>${h(i.titulo)}</strong><p>${date(i.inicioEm)} — ${date(i.fimEm)} · ${h(i.local)}</p></div>${badge(i.status)}${admin() && i.status === "rascunho" ? button("publish-event", "Publicar evento", {
    id: i.id
  }) : ""}</div>`).join("") || empty("Nenhum evento cadastrado.")}</section>${admin() ? form("event", "Novo evento", input("Título", "titulo") + input("Local", "local", "text", "", !1) + input("Início", "inicioEm", "datetime-local") + input("Fim", "fimEm", "datetime-local"), "Criar rascunho") : ""}`;
}
function schedulePage() {
  var t;
  const i = schedules.find((s: any) => s.id === selectedSchedule),
    e = links.filter((s: any) => s.ativo),
    a = assignments.find((s: any) => s.membroId === (user == null ? void 0 : user.uid));
  return `<h1>Escalas</h1><p class="intro">Organize a equipe e acompanhe as confirmações.</p>${selected ? "" : empty("Cadastre um ministério primeiro.")}<section class="panel">${schedules.map((s: any) => {
    var o;
    return `<div class="list-row"><div><strong>${h(((o = events.find((d: any) => d.id === s.eventoId)) == null ? void 0 : o.titulo) || "Evento")}</strong><p>${date(s.inicioEm)}</p></div>${badge(s.status)}${button("schedule", "Abrir", {
      id: s.id
    }, !0)}</div>`;
  }).join("") || empty("Nenhuma escala disponível neste ministério.")}</section>${selected && manages() ? form("draft", "Nova escala", select("Evento publicado", "eventoId", events.filter((s: any) => s.status === "publicado").map((s: any) => [s.id, s.titulo])), "Criar rascunho") : ""}${i ? `<section class="panel"><h2>${h(((t = events.find((s: any) => s.id === i.eventoId)) == null ? void 0 : t.titulo) || "Escala")}</h2><p>${date(i.inicioEm)} · ${badge(i.status)}</p>${assignments.map((s: any) => {
    var o;
    return `<div class="list-row"><strong>${h(name(s.membroId))}</strong><span>${h(((o = roles.find((d: any) => d.id === s.funcaoId)) == null ? void 0 : o.nome) || "Função")}</span>${badge(s.status)}</div>`;
  }).join("") || empty("Ainda não há pessoas designadas.")}${i.status !== "cancelada" && manages() ? button("cancel-schedule", "Cancelar escala", {}, !0) : ""}</section>${i.status === "rascunho" && manages() ? form("publish", "Montar e publicar a equipe", e.map((s: any) => select(String(name(s.id)), `assign_${s.id}`, [["", "Não escalar"], ...roles.map((o: any) => [o.id, o.nome])], "", !1)).join(""), "Publicar escala") : ""}${a && i.status === "publicada" && a.status === "pendente" ? `<section class="panel"><h3>Você pode participar?</h3>${button("respond", "Confirmar presença", {
    status: "confirmada"
  })}${button("respond", "Não posso participar", {
    status: "recusada"
  }, !0)}</section>` : ""}${a && ["pendente", "confirmada"].includes(a.status) && i.status === "publicada" ? form("swap", "Solicitar troca", select("Substituto", "substitutoUid", members.filter((s: any) => s.ativo && s.id !== (user == null ? void 0 : user.uid)).map((s: any) => [s.id, s.nome])), "Enviar solicitação") : ""}${manages() && i.status === "publicada" ? form("replace", "Substituir pessoa", select("Designação atual", "originalUid", assignments.filter((s: any) => ["pendente", "confirmada", "recusada"].includes(s.status)).map((s: any) => [s.membroId, String(name(s.membroId))])) + select("Substituto", "substitutoUid", e.map((s: any) => [s.id, String(name(s.id))])), "Substituir") : ""}` : ""}<section class="panel"><h3>Solicitações de troca</h3>${swaps.map((s: any) => `<div class="list-row"><div><strong>${h(name(s.solicitanteMembroId))} → ${h(name(s.substitutoMembroId))}</strong><p>${h(s.escalaId)}</p></div>${badge(s.status)}${s.status === "pendente" ? manages() ? button("approve-swap", "Aprovar", {
    id: s.id
  }) + button("reject-swap", "Recusar", {
    id: s.id
  }, !0) : button("cancel-swap", "Cancelar pedido", {
    id: s.id
  }, !0) : ""}</div>`).join("") || empty("Nenhuma solicitação.")}</section>`;
}
function availabilityPage() {
  return `<h1>Minha disponibilidade</h1><p class="intro">Informe quando não puder servir. Horários já reservados precisam ser tratados na escala.</p>${form("rename", "Meu perfil", input("Nome", "nome", "text", String((profile == null ? void 0 : profile.nome) || "")))}${form("contact", "Meu contato privado", input("E-mail", "email", "email", String((contact == null ? void 0 : contact.email) || ""), !1) + input("Telefone", "telefone", "tel", String((contact == null ? void 0 : contact.telefone) || ""), !1))}${form("unavailable", "Adicionar indisponibilidade", input("Início", "inicioEm", "datetime-local") + input("Fim", "fimEm", "datetime-local"))}<section class="panel">${unavailable.filter((i: any) => i.ativo !== !1).map((i: any) => `<div class="list-row"><strong>${date(i.inicioEm)} — ${date(i.fimEm)}</strong>${button("cancel-unavailable", "Cancelar", {
    id: i.id
  }, !0)}</div>`).join("") || empty("Nenhuma indisponibilidade cadastrada.")}</section>`;
}
function render() {
  var a;
  const i = `${error ? `<div class="notice error" role="alert">${h(error)}</div>` : ""}${success ? `<div class="notice" role="status">${h(success)}</div>` : ""}`;
  if (!user) {
    root.innerHTML = shell(`<main class="login"><p class="eyebrow">BEM-VINDO AO ESCALAE</p><h1>Mais conexão.<br>Mais tempo para servir.</h1><p>A gestão dos ministérios da sua igreja começa aqui.</p>${i}${button("login", "Explorar demonstração")}<p class="small">Demonstração com dados temporários em memória.</p></main>`);
    return;
  }
  if (loading && !access) {
    root.innerHTML = shell('<main class="login"><p role="status">Carregando sua igreja…</p></main>');
    return;
  }
  if (!profile) {
    root.innerHTML = shell(`<main class="login">${i}${form("profile", "Como podemos chamar você?", input("Nome", "nome", "text", user.displayName || ""))}</main>`);
    return;
  }
  const e: Record<string, () => string> = {
    overview: overview,
    ministries: ministryPage,
    members: memberPage,
    events: eventPage,
    schedules: schedulePage,
    availability: availabilityPage
  };
  root.innerHTML = shell(`<div class="layout"><aside><p class="eyebrow">SUA IGREJA</p><nav aria-label="Navegação principal">${[["overview", "Visão geral"], ["ministries", "Ministérios"], ["members", "Pessoas"], ["events", "Eventos"], ["schedules", "Escalas"], ["availability", "Disponibilidade"]].map(([t, s]) => `<button data-action="navigate" data-section="${t}" class="${section === t ? "current" : ""}">${s}</button>`).join("")}</nav><div class="sidebar-note">${admin() ? "Administrador" : ((a = owned.get(selected)) == null ? void 0 : a.papel) === "lider" ? "Líder de ministério" : "Membro"}<br><small>Gestão com cuidado.</small></div></aside><main><div class="toolbar">${select("Ministério", "selectedMinistry", [["", "Selecione um ministério"], ...ministries.map((t: any) => [t.id, t.nome])], selected)}${button("refresh", loading ? "Atualizando…" : "Atualizar", {}, !0)}</div>${i}${loading ? '<p role="status">Atualizando dados…</p>' : ""}${(e[section] || overview)()}</main></div>`);
}
async function run(operation: ()=>Promise<void>, message = 'Salvo com sucesso.') {
  if(busy) return
  busy = true; error = ''; success = ''; render()
  try { await operation(); success = message; await load() } catch(reason) { error = friendly(reason) }
  finally { busy = false; render() }
}
root.addEventListener('change', event => {
  const target = event.target as HTMLSelectElement
  if(target.name==='selectedMinistry') { selected = target.value; selectedSchedule=''; void load() }
})
root.addEventListener('click', event => {
  const target = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]')
  if(!target || busy) return
  const action = target.dataset.action, schedule = schedules.find(item=>item.id===selectedSchedule)
  if(action==='navigate') { section=target.dataset.section!; error='';success='';render();return }
  if(action==='choose') { selected=target.dataset.id!;void load();return }
  if(action==='schedule') { selectedSchedule=target.dataset.id!;void load();return }
  if(action==='refresh') { error='';success='';void load();return }
  if(action==='login') { user=previewIdentity;void load();return }
  if(action==='logout') { user=null;access=null;profile=null;owned.clear();render();return }
  void run(async()=>{
    if(action==='revoke') await command('revokeAccess',{uid:target.dataset.id})
    else if(action==='archive') await repository.archiveMinistry(target.dataset.id!)
    else if(action==='publish-event') previewUpdate(`eventos/${target.dataset.id}`,{status:'publicado'})
    else if(action==='unlink') await command('setMembership',{ministerioId:selected,uid:target.dataset.id,papel:target.dataset.role,ativo:false})
    else if(action==='cancel-unavailable') await command('cancelUnavailability',{id:target.dataset.id})
    else if(action==='approve-swap') await command('approveSwap',{id:target.dataset.id})
    else if(action==='reject-swap'||action==='cancel-swap') await command('rejectOrCancelSwap',{id:target.dataset.id,status:action==='reject-swap'?'recusada':'cancelada'})
    else if(schedule&&action==='cancel-schedule') await command('cancelSchedule',{eventoId:schedule.eventoId,ministerioId:schedule.ministerioId})
    else if(schedule&&action==='respond') await command('respondToAssignment',{eventoId:schedule.eventoId,ministerioId:schedule.ministerioId,status:target.dataset.status})
    else throw new Error('Selecione a escala antes de continuar.')
  })
})
root.addEventListener('submit', event => {
  event.preventDefault()
  const target = event.target as HTMLFormElement, data = Object.fromEntries(new FormData(target).entries()) as Record<string,string>, action = target.dataset.form
  const schedule = schedules.find(item=>item.id===selectedSchedule)
  void run(async()=>{
    if(action==='profile') await repository.createProfile(user!.uid,data.nome)
    else if(action==='contact') await repository.savePrivateContact(user!.uid,{email:data.email,telefone:data.telefone})
    else if(action==='rename') await repository.renameProfile(user!.uid,data.nome)
    else if(action==='ministry') await repository.createMinistry({nome:data.nome,descricao:data.descricao,cor:data.cor})
    else if(action==='function') await repository.createFunction(selected,{nome:data.nome,capacidade:Number(data.capacidade),ordem:Number(data.ordem)})
    else if(action==='access') await command('grantAccess',{uid:data.uid.trim(),papel:data.papel})
    else if(action==='membership') await command('setMembership',{ministerioId:selected,uid:data.uid,papel:data.papel,ativo:true})
    else if(action==='event') await repository.createEvent({titulo:data.titulo,local:data.local,inicioEm:churchDate(data.inicioEm),fimEm:churchDate(data.fimEm)})
    else if(action==='draft') await repository.createDraftSchedule(data.eventoId,selected)
    else if(action==='unavailable') await command('addUnavailability',{inicioEm:churchDate(data.inicioEm).toISOString(),fimEm:churchDate(data.fimEm).toISOString()})
    else if(schedule&&action==='publish') await command('publishSchedule',{eventoId:schedule.eventoId,ministerioId:selected,designacoes:Object.entries(data).filter(([key,value])=>key.startsWith('assign_')&&value).map(([key,value])=>({membroId:key.slice(7),funcaoId:value}))})
    else if(schedule&&action==='swap') await command('requestSwap',{eventoId:schedule.eventoId,ministerioId:selected,substitutoUid:data.substitutoUid})
    else if(schedule&&action==='replace') await command('replaceAssignment',{eventoId:schedule.eventoId,ministerioId:selected,originalUid:data.originalUid,substitutoUid:data.substitutoUid})
    else throw new Error('Selecione um ministério e uma escala para continuar.')
  })
})
void load()
render()

