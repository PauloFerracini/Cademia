'use strict';

// ---------- Armazenamento ----------
const store = {
  get(chave, padrao) {
    try {
      const v = localStorage.getItem('cademia.' + chave);
      return v ? JSON.parse(v) : padrao;
    } catch { return padrao; }
  },
  set(chave, valor) {
    try { localStorage.setItem('cademia.' + chave, JSON.stringify(valor)); } catch { /* sem armazenamento */ }
  },
};

const $ = (s, el = document) => el.querySelector(s);
const hoje = () => new Date().toLocaleDateString('sv-SE'); // AAAA-MM-DD no fuso local
const fmt = (n, d = 0) => Number(n).toLocaleString('pt-BR', { maximumFractionDigits: d, minimumFractionDigits: d });
const foodById = Object.fromEntries(FOODS.map(f => [f.id, f]));
const exById = Object.fromEntries(EXERCICIOS.map(e => [e.id, e]));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- Cálculos ----------
function calcular(perfil) {
  const { sexo, idade, peso, altura, atividade, deficit } = perfil;
  // Mifflin-St Jeor
  const tmb = 10 * peso + 6.25 * altura - 5 * idade + (sexo === 'm' ? 5 : -161);
  const gasto = tmb * atividade;
  const piso = sexo === 'm' ? 1500 : 1200;
  const meta = Math.max(piso, Math.round((gasto * (1 - deficit)) / 10) * 10);
  const prot = Math.round(peso * 2);                 // 2 g/kg preserva massa magra
  const gord = Math.round((meta * 0.25) / 9);        // 25% das calorias
  const carb = Math.max(0, Math.round((meta - prot * 4 - gord * 9) / 4));
  const deficitDia = gasto - meta;
  const imc = peso / (altura / 100) ** 2;
  return { tmb, gasto, meta, prot, gord, carb, deficitDia, imc };
}

function nutrientes(alimentoId, gramas) {
  const f = foodById[alimentoId];
  const k = gramas / 100;
  return { kcal: f.kcal * k, p: f.p * k, c: f.c * k, g: f.g * k };
}

function somar(lista) {
  return lista.reduce((t, n) => ({ kcal: t.kcal + n.kcal, p: t.p + n.p, c: t.c + n.c, g: t.g + n.g }), { kcal: 0, p: 0, c: 0, g: 0 });
}

const kcalExercicio = (met, pesoKg, minutos) => met * pesoKg * (minutos / 60);

function classificarImc(imc) {
  if (imc < 18.5) return 'abaixo do peso';
  if (imc < 25) return 'peso normal';
  if (imc < 30) return 'sobrepeso';
  return 'obesidade';
}

// ---------- Estado ----------
let perfil = store.get('perfil', null);
let plano = perfil ? calcular(perfil) : null;

// ---------- Abas ----------
document.querySelectorAll('.aba').forEach(btn => {
  btn.addEventListener('click', () => abrirAba(btn.dataset.aba));
});
function abrirAba(id) {
  document.querySelectorAll('.aba').forEach(b => b.classList.toggle('ativa', b.dataset.aba === id));
  document.querySelectorAll('.painel').forEach(p => p.classList.toggle('ativo', p.id === id));
  store.set('aba', id);
  window.scrollTo({ top: 0 });
}

// ---------- Perfil ----------
const formPerfil = $('#form-perfil');
if (perfil) {
  for (const [k, v] of Object.entries(perfil)) if (formPerfil.elements[k]) formPerfil.elements[k].value = v;
}
formPerfil.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(formPerfil);
  perfil = {
    sexo: fd.get('sexo'),
    idade: +fd.get('idade'),
    peso: +fd.get('peso'),
    altura: +fd.get('altura'),
    atividade: +fd.get('atividade'),
    deficit: +fd.get('deficit'),
    meta: +fd.get('meta') || null,
  };
  store.set('perfil', perfil);
  plano = calcular(perfil);
  renderTudo();
});

function renderResumo() {
  const el = $('#resumo');
  if (!plano) {
    el.innerHTML = '<p class="muted">Preencha seus dados e toque em <b>Calcular meu plano</b> para ver sua meta de calorias, macros e estimativa de prazo.</p>';
    return;
  }
  const kgSemana = (plano.deficitDia * 7) / 7700; // ~7700 kcal por kg de gordura
  let prazo = '';
  if (perfil.meta && perfil.meta < perfil.peso && kgSemana > 0) {
    const semanas = Math.ceil((perfil.peso - perfil.meta) / kgSemana);
    prazo = `<p>Para chegar a <b>${fmt(perfil.meta, 1)} kg</b>, a estimativa é de <b>${semanas} semanas</b> mantendo o plano.</p>`;
  }
  el.innerHTML = `
    <h2>Seu plano</h2>
    <div class="stats">
      <div class="stat"><b>${fmt(plano.meta)} kcal</b><span>Meta diária</span></div>
      <div class="stat"><b>${fmt(plano.gasto)} kcal</b><span>Gasto diário estimado</span></div>
      <div class="stat"><b>${fmt(plano.tmb)} kcal</b><span>Metabolismo basal</span></div>
      <div class="stat"><b>${fmt(plano.imc, 1)}</b><span>IMC (${classificarImc(plano.imc)})</span></div>
    </div>
    <div class="macros">${barrasMacros({ p: plano.prot, c: plano.carb, g: plano.gord }, null)}</div>
    <p>Déficit de <b>${fmt(plano.deficitDia)} kcal/dia</b> ≈ <b>${fmt(kgSemana, 2)} kg</b> de gordura por semana.</p>
    ${prazo}
    <div class="acoes" style="justify-content:flex-start">
      <button class="btn" type="button" onclick="abrirAba('dieta')">Ver dieta</button>
      <button class="btn sec" type="button" onclick="abrirAba('treino')">Ver exercícios</button>
    </div>`;
}

function barrasMacros(alvo, atual) {
  const linhas = [
    ['Proteína', 'p', 'var(--primaria)'],
    ['Carboidrato', 'c', 'var(--azul)'],
    ['Gordura', 'g', 'var(--amarelo)'],
  ];
  return linhas.map(([nome, k, cor]) => {
    const valor = atual ? atual[k] : alvo[k];
    const pct = atual ? Math.min(100, (atual[k] / alvo[k]) * 100) : 100;
    const texto = atual ? `${fmt(valor)} / ${fmt(alvo[k])} g` : `${fmt(alvo[k])} g`;
    return `<div><div class="barra-rot"><span>${nome}</span><span>${texto}</span></div>
      <div class="barra"><i style="width:${pct}%;background:${cor}"></i></div></div>`;
  }).join('');
}

// ---------- Dieta ----------
function gerarPlanoAlimentar(metaKcal) {
  return REFEICOES.map(r => {
    const base = somar(r.itens.map(([id, g]) => nutrientes(id, g))).kcal;
    const fator = (metaKcal * r.pct) / base;
    const itens = r.itens.map(([id, g]) => {
      // Vegetais e café não precisam ser reduzidos; o resto escala com a meta
      const fixo = ['salada', 'brocolis', 'legumes', 'cafe', 'tomate'].includes(id);
      const gramas = fixo ? g : Math.max(5, Math.round((g * fator) / 5) * 5);
      return { id, gramas, ...nutrientes(id, gramas) };
    });
    return { nome: r.nome, itens, total: somar(itens) };
  });
}

function renderDieta() {
  const el = $('#refeicoes');
  if (!plano) {
    $('#dieta-meta').textContent = 'Calcule seu plano na aba Perfil para gerar a dieta.';
    $('#macros-plano').innerHTML = '';
    el.innerHTML = '';
    return;
  }
  const refeicoes = gerarPlanoAlimentar(plano.meta);
  const total = somar(refeicoes.map(r => r.total));
  $('#dieta-meta').textContent = `Plano com ~${fmt(total.kcal)} kcal (meta: ${fmt(plano.meta)} kcal). Toque em "Registrar" para lançar a refeição no diário.`;
  $('#macros-plano').innerHTML = barrasMacros({ p: plano.prot, c: plano.carb, g: plano.gord }, total);
  el.innerHTML = refeicoes.map((r, i) => `
    <div class="card refeicao">
      <h3>${r.nome} <small>${fmt(r.total.kcal)} kcal · P ${fmt(r.total.p)}g</small></h3>
      <ul class="lista">
        ${r.itens.map(it => `<li><span>${esc(foodById[it.id].nome)}</span><span class="muted">${it.gramas} g · ${fmt(it.kcal)} kcal</span></li>`).join('')}
      </ul>
      <div class="acoes" style="justify-content:flex-end;margin-top:8px">
        <button class="btn peq" data-registrar="${i}">Registrar refeição</button>
      </div>
    </div>`).join('');
  el.querySelectorAll('[data-registrar]').forEach(btn => {
    btn.addEventListener('click', () => {
      const r = refeicoes[+btn.dataset.registrar];
      const dia = diaAtual();
      r.itens.forEach(it => dia.alimentos.push({ id: it.id, gramas: it.gramas }));
      salvarDia(dia);
      btn.textContent = 'Registrado ✓';
      btn.disabled = true;
      renderDiario();
    });
  });
}

// ---------- Diário ----------
function diaAtual() {
  return store.get('dia.' + hoje(), { alimentos: [], treinos: [] });
}
function salvarDia(dia) { store.set('dia.' + hoje(), dia); }

const selAlimento = $('#sel-alimento');
selAlimento.innerHTML = [...FOODS].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  .map(f => `<option value="${f.id}">${esc(f.nome)} (${f.kcal} kcal/100g)</option>`).join('');
const formAlimento = $('#form-alimento');
const sugerirPorcao = () => { formAlimento.elements.gramas.value = foodById[selAlimento.value].porcao; };
selAlimento.addEventListener('change', sugerirPorcao);
sugerirPorcao();

formAlimento.addEventListener('submit', e => {
  e.preventDefault();
  const dia = diaAtual();
  dia.alimentos.push({ id: selAlimento.value, gramas: +formAlimento.elements.gramas.value });
  salvarDia(dia);
  renderDiario();
});

function renderDiario() {
  const dia = diaAtual();
  const consumido = somar(dia.alimentos.map(a => nutrientes(a.id, a.gramas)));
  const queimado = dia.treinos.reduce((s, t) => s + t.kcal, 0);
  const meta = plano ? plano.meta : 0;
  const restante = meta - consumido.kcal + queimado;

  $('#balanco').innerHTML = `
    <div><b>${fmt(meta)}</b><span>Meta</span></div>
    <div><b>${fmt(consumido.kcal)}</b><span>Consumido</span></div>
    <div><b>${fmt(queimado)}</b><span>Exercício</span></div>
    <div><b style="color:${restante < 0 ? 'var(--laranja)' : 'var(--primaria)'}">${fmt(restante)}</b><span>Restante</span></div>`;
  $('#macros-diario').innerHTML = plano ? barrasMacros({ p: plano.prot, c: plano.carb, g: plano.gord }, consumido) : '<p class="muted">Calcule seu plano no Perfil para ver as metas.</p>';

  const lc = $('#lista-consumo');
  lc.innerHTML = dia.alimentos.length
    ? dia.alimentos.map((a, i) => {
        const n = nutrientes(a.id, a.gramas);
        return `<li><span>${esc(foodById[a.id].nome)} <span class="muted">· ${a.gramas} g</span></span>
          <span>${fmt(n.kcal)} kcal <button class="x" data-rm-al="${i}" aria-label="Remover">×</button></span></li>`;
      }).join('')
    : '<li class="vazio">Nada registrado ainda.</li>';
  lc.querySelectorAll('[data-rm-al]').forEach(b => b.addEventListener('click', () => {
    const d = diaAtual(); d.alimentos.splice(+b.dataset.rmAl, 1); salvarDia(d); renderDiario();
  }));

  const lt = $('#lista-treinos');
  lt.innerHTML = dia.treinos.length
    ? dia.treinos.map((t, i) => `<li><span>${esc(exById[t.id].nome)} <span class="muted">· ${t.min} min</span></span>
        <span>−${fmt(t.kcal)} kcal <button class="x" data-rm-tr="${i}" aria-label="Remover">×</button></span></li>`).join('')
    : '<li class="vazio">Nenhum treino registrado hoje.</li>';
  lt.querySelectorAll('[data-rm-tr]').forEach(b => b.addEventListener('click', () => {
    const d = diaAtual(); d.treinos.splice(+b.dataset.rmTr, 1); salvarDia(d); renderDiario();
  }));
}

// ---------- Exercícios ----------
let filtro = 'Todos';
const pesoAtual = () => (perfil ? perfil.peso : 75);

function renderSemana() {
  const idx = (new Date().getDay() + 6) % 7; // segunda = 0
  $('#semana').innerHTML = SEMANA.map((d, i) => `
    <div class="dia ${i === idx ? 'hoje' : ''}">
      <b>${d.dia}</b><span class="muted">${d.foco}</span>
      <ul>${d.ids.map(id => `<li>${esc(exById[id].nome)}</li>`).join('')}</ul>
    </div>`).join('');
}

function renderFiltros() {
  const cats = ['Todos', ...new Set(EXERCICIOS.map(e => e.cat)), 'Baixo impacto'];
  $('#filtros').innerHTML = cats.map(c => `<button class="chip ${c === filtro ? 'ativo' : ''}" data-cat="${c}">${c}</button>`).join('');
  $('#filtros').querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
    filtro = b.dataset.cat; renderFiltros(); renderExercicios();
  }));
}

function renderExercicios() {
  const lista = EXERCICIOS
    .filter(e => filtro === 'Todos' || e.cat === filtro || (filtro === 'Baixo impacto' && e.impacto === 'Baixo'))
    .map(e => ({ ...e, kcal: kcalExercicio(e.met, pesoAtual(), e.dur) }))
    .sort((a, b) => b.met - a.met);
  $('#lista-ex').innerHTML = lista.map(e => `
    <button class="ex" data-ex="${e.id}">
      <b>${esc(e.nome)}</b>
      <div class="tags"><span class="tag ${e.cat}">${e.cat}</span><span class="tag">${e.nivel}</span><span class="tag">Impacto ${e.impacto.toLowerCase()}</span></div>
      <span class="kcal">~${fmt(e.kcal)} kcal</span> <span class="muted">em ${e.dur} min</span>
    </button>`).join('');
  $('#lista-ex').querySelectorAll('[data-ex]').forEach(b => b.addEventListener('click', () => abrirExercicio(b.dataset.ex)));
}

// ---------- Modal + cronômetro ----------
const modal = $('#modal');
let exAberto = null;
let timer = null;

function abrirExercicio(id) {
  const e = exById[id];
  exAberto = e;
  const porMin = kcalExercicio(e.met, pesoAtual(), 1);
  $('#modal-conteudo').innerHTML = `
    <h2>${esc(e.nome)}</h2>
    <div class="tags"><span class="tag ${e.cat}">${e.cat}</span><span class="tag">${e.nivel}</span><span class="tag">Impacto ${e.impacto.toLowerCase()}</span></div>
    <p>${esc(e.desc)}</p>
    <ol>${e.passos.map(p => `<li>${esc(p)}</li>`).join('')}</ol>
    <p><span class="kcal">~${fmt(porMin, 1)} kcal/min</span> <span class="muted">para ${fmt(pesoAtual(), 1)} kg · sugerido: ${e.dur} min (~${fmt(porMin * e.dur)} kcal)</span></p>`;
  $('#min-feitos').value = e.dur;
  pararTimer();
  modal.showModal();
}
$('#fechar').addEventListener('click', () => modal.close());
modal.addEventListener('close', pararTimer);

$('#form-feito').addEventListener('submit', ev => {
  ev.preventDefault();
  const min = +$('#min-feitos').value;
  if (!exAberto || !min) return;
  const dia = diaAtual();
  dia.treinos.push({ id: exAberto.id, min, kcal: Math.round(kcalExercicio(exAberto.met, pesoAtual(), min)) });
  salvarDia(dia);
  renderDiario();
  modal.close();
});

function bip(freq = 880, dur = 0.15) {
  try {
    const ctx = bip.ctx || (bip.ctx = new (window.AudioContext || window.webkitAudioContext)());
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = freq; o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    o.start(); o.stop(ctx.currentTime + dur);
  } catch { /* sem áudio */ }
}

function mostrarTimer(fase, seg, rodada, total) {
  const f = $('#fase');
  f.textContent = fase === 'trab' ? 'Trabalho' : fase === 'desc' ? 'Descanso' : fase;
  f.className = 'timer-fase ' + (fase === 'trab' || fase === 'desc' ? fase : '');
  $('#tempo').textContent = `${String(Math.floor(seg / 60)).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;
  $('#rodada').textContent = total ? `Rodada ${rodada} de ${total}` : '';
}

function pararTimer() {
  clearInterval(timer);
  timer = null;
  mostrarTimer('Pronto', 0, 0, 0);
}

$('#t-parar').addEventListener('click', pararTimer);
$('#t-iniciar').addEventListener('click', () => {
  clearInterval(timer);
  const trab = Math.max(5, +$('#t-trab').value || 40);
  const desc = Math.max(0, +$('#t-desc').value || 0);
  const total = Math.max(1, +$('#t-rod').value || 1);
  let rodada = 1, fase = 'trab', seg = trab;
  mostrarTimer(fase, seg, rodada, total);
  bip(1040);
  timer = setInterval(() => {
    seg--;
    if (seg > 0) { if (seg <= 3) bip(660, 0.08); mostrarTimer(fase, seg, rodada, total); return; }
    if (fase === 'trab' && desc > 0 && rodada < total) {
      fase = 'desc'; seg = desc; bip(520);
    } else if (rodada < total) {
      rodada++; fase = 'trab'; seg = trab; bip(1040);
    } else {
      clearInterval(timer); timer = null;
      mostrarTimer('Concluído! 💪', 0, total, total);
      bip(1040, 0.4);
      $('#min-feitos').value = Math.max(1, Math.round((trab * total + desc * (total - 1)) / 60));
      return;
    }
    mostrarTimer(fase, seg, rodada, total);
  }, 1000);
});

// ---------- Progresso ----------
const formPeso = $('#form-peso');
formPeso.elements.data.value = hoje();
formPeso.addEventListener('submit', e => {
  e.preventDefault();
  const data = formPeso.elements.data.value;
  const peso = +formPeso.elements.peso.value;
  const pesos = store.get('pesos', []).filter(p => p.data !== data);
  pesos.push({ data, peso });
  pesos.sort((a, b) => a.data.localeCompare(b.data));
  store.set('pesos', pesos);
  // Mantém o perfil atualizado com o registro mais recente
  if (perfil && pesos[pesos.length - 1].data === data) {
    perfil.peso = peso;
    store.set('perfil', perfil);
    formPerfil.elements.peso.value = peso;
    plano = calcular(perfil);
  }
  formPeso.elements.peso.value = '';
  renderTudo();
});

function renderProgresso() {
  const pesos = store.get('pesos', []);
  const lista = $('#lista-pesos');
  lista.innerHTML = pesos.length
    ? [...pesos].reverse().map(p => {
        const [a, m, d] = p.data.split('-');
        return `<li><span>${d}/${m}/${a}</span><span>${fmt(p.peso, 1)} kg <button class="x" data-rm-peso="${p.data}" aria-label="Remover">×</button></span></li>`;
      }).join('')
    : '<li class="vazio">Registre seu peso para acompanhar a evolução.</li>';
  lista.querySelectorAll('[data-rm-peso]').forEach(b => b.addEventListener('click', () => {
    store.set('pesos', store.get('pesos', []).filter(p => p.data !== b.dataset.rmPeso));
    renderProgresso();
  }));

  const g = $('#grafico');
  if (pesos.length < 2) { g.innerHTML = ''; return; }
  const W = 600, H = 220, pad = 36;
  const valores = pesos.map(p => p.peso);
  if (perfil && perfil.meta) valores.push(perfil.meta);
  const min = Math.floor(Math.min(...valores) - 1), max = Math.ceil(Math.max(...valores) + 1);
  const x = i => pad + (i * (W - pad * 2)) / (pesos.length - 1);
  const y = v => H - pad + ((v - min) * -(H - pad * 2)) / (max - min);
  const pts = pesos.map((p, i) => `${x(i)},${y(p.peso)}`).join(' ');
  const metaLinha = perfil && perfil.meta
    ? `<line x1="${pad}" x2="${W - pad}" y1="${y(perfil.meta)}" y2="${y(perfil.meta)}" stroke="var(--primaria)" stroke-dasharray="6 4"/>
       <text x="${W - pad}" y="${y(perfil.meta) - 6}" text-anchor="end" font-size="18" fill="var(--primaria)">meta ${fmt(perfil.meta, 1)} kg</text>`
    : '';
  const variacao = pesos[pesos.length - 1].peso - pesos[0].peso;
  g.innerHTML = `
    <p>Variação total: <b style="color:${variacao <= 0 ? 'var(--primaria)' : 'var(--laranja)'}">${variacao > 0 ? '+' : ''}${fmt(variacao, 1)} kg</b></p>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico de evolução do peso">
      <text x="4" y="${y(max) + 4}" font-size="18" fill="var(--muted)">${max}</text>
      <text x="4" y="${y(min) + 4}" font-size="18" fill="var(--muted)">${min}</text>
      <line x1="${pad}" x2="${W - pad}" y1="${y(min)}" y2="${y(min)}" stroke="var(--borda)"/>
      ${metaLinha}
      <polyline points="${pts}" fill="none" stroke="var(--azul)" stroke-width="3" stroke-linejoin="round"/>
      ${pesos.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.peso)}" r="4" fill="var(--azul)"><title>${fmt(p.peso, 1)} kg</title></circle>`).join('')}
    </svg>`;
}

// ---------- Início ----------
function renderTudo() {
  renderResumo();
  renderDieta();
  renderDiario();
  renderExercicios();
  renderProgresso();
}
renderSemana();
renderFiltros();
renderTudo();
abrirAba(store.get('aba', perfil ? 'dieta' : 'perfil'));
