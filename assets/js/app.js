import { FOODS, CATEGORIES } from './foods.js';
import { evaluate, manualFood } from './nutrition.js';

const STORE_KEY = 'shike.state.v1';
const state = {
  mode: 'day',
  activeCat: 'staple',
  query: '',
  items: [], // { uid, food, servings }
};

const el = {
  tabs: document.getElementById('tabs'),
  catalog: document.getElementById('catalog'),
  selected: document.getElementById('selected'),
  emptySelected: document.getElementById('emptySelected'),
  count: document.getElementById('count'),
  search: document.getElementById('search'),
  evalBtn: document.getElementById('evalBtn'),
  clearBtn: document.getElementById('clearBtn'),
  sampleBtn: document.getElementById('sampleBtn'),
  report: document.getElementById('report'),
  modeHint: document.getElementById('modeHint'),
  manualBtn: document.getElementById('manualBtn'),
  manualDialog: document.getElementById('manualDialog'),
  manualForm: document.getElementById('manualForm'),
  manualCancel: document.getElementById('manualCancel'),
  manualName: document.getElementById('manualName'),
  manualCat: document.getElementById('manualCat'),
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => `i${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const fmt = (n, d = 0) => {
  const v = Number(n) || 0;
  return d ? v.toFixed(d).replace(/\.0+$/, '') : String(Math.round(v));
};
const scoreColor = (s) => (s >= 0.8 ? '#187a52' : s >= 0.55 ? '#c98519' : '#c14f45');

/* ---------------- 渲染：分类与菜品库 ---------------- */
function renderTabs() {
  el.tabs.innerHTML = CATEGORIES.map((c) => {
    const selected = !state.query && c.id === state.activeCat;
    return `<button type="button" class="tab" role="tab" data-cat="${c.id}" aria-selected="${selected}">${c.name}</button>`;
  }).join('');
}

function visibleFoods() {
  const q = state.query.trim();
  if (q) {
    return FOODS.filter((f) => f.name.includes(q) || (f.aliases || []).some((a) => a.includes(q)));
  }
  return FOODS.filter((f) => f.cat === state.activeCat);
}

function renderCatalog() {
  const foods = visibleFoods();
  const addedIds = new Set(state.items.map((i) => i.food.id));
  if (!foods.length) {
    el.catalog.innerHTML = `<p class="catalog-empty">没有找到「${esc(state.query)}」，试试别的写法，或点右上角自定义菜品。</p>`;
    return;
  }
  el.catalog.innerHTML = foods.map((f) => {
    const added = addedIds.has(f.id);
    return `<button type="button" class="chip${added ? ' added' : ''}" data-food="${f.id}" title="每份约 ${f.serving} g">
      <span class="chip-name">${esc(f.name)}</span>
      <span class="chip-kcal">${fmt(f.n[0] * f.serving / 100)} kcal</span>
    </button>`;
  }).join('');
}

/* ---------------- 渲染：已选清单 ---------------- */
function renderSelected() {
  const items = state.items;
  el.emptySelected.hidden = items.length > 0;
  el.count.textContent = `${fmt(items.reduce((s, i) => s + i.servings, 0), 1)} 份`;
  el.evalBtn.disabled = items.length === 0;
  el.clearBtn.hidden = items.length === 0;

  el.selected.innerHTML = items.map((it) => {
    const grams = Math.round(it.food.serving * it.servings);
    const kcal = Math.round(it.food.n[0] * grams / 100);
    const catName = CATEGORIES.find((c) => c.id === it.food.cat)?.name || '';
    return `<li class="selected-row" data-uid="${it.uid}">
      <div class="sel-main">
        <span class="sel-name">${esc(it.food.name)}</span>
        <span class="sel-meta">${catName} · ${grams} g · ${kcal} kcal</span>
      </div>
      <div class="stepper" role="group" aria-label="${esc(it.food.name)} 份量">
        <button type="button" data-act="minus" aria-label="减少份量">−</button>
        <span>${fmt(it.servings, 1)} 份</span>
        <button type="button" data-act="plus" aria-label="增加份量">＋</button>
      </div>
      <button type="button" class="remove" data-act="remove" aria-label="移除 ${esc(it.food.name)}">×</button>
    </li>`;
  }).join('');

  renderCatalog();
}

/* ---------------- 交互 ---------------- */
function addFood(food) {
  const existing = state.items.find((i) => i.food.id === food.id);
  if (existing) {
    existing.servings = Math.min(5, existing.servings + 1);
  } else {
    state.items.push({ uid: uid(), food, servings: 1 });
  }
  afterChange();
}

function afterChange() {
  renderSelected();
  persist();
}

el.tabs.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-cat]');
  if (!btn) return;
  state.activeCat = btn.dataset.cat;
  state.query = '';
  el.search.value = '';
  renderTabs();
  renderCatalog();
});

el.search.addEventListener('input', (e) => {
  state.query = e.target.value;
  renderTabs();
  renderCatalog();
});

el.catalog.addEventListener('click', (e) => {
  const chip = e.target.closest('[data-food]');
  if (!chip) return;
  const food = FOODS.find((f) => f.id === chip.dataset.food);
  if (food) addFood(food);
});

el.selected.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const row = btn.closest('[data-uid]');
  const item = state.items.find((i) => i.uid === row.dataset.uid);
  if (!item) return;
  const act = btn.dataset.act;
  if (act === 'plus') item.servings = Math.min(5, item.servings + 0.5);
  if (act === 'minus') item.servings = Math.max(0.5, item.servings - 0.5);
  if (act === 'remove') state.items = state.items.filter((i) => i.uid !== item.uid);
  afterChange();
  if (state.items.length) renderReport();
});

el.clearBtn.addEventListener('click', () => {
  state.items = [];
  afterChange();
  renderEmptyReport();
});

function loadSample() {
  const pick = (id, servings) => {
    const food = FOODS.find((f) => f.id === id);
    return food ? { uid: uid(), food, servings } : null;
  };
  state.items = [
    pick('baozi', 1),
    pick('soy-milk', 1),
    pick('rice', 1),
    pick('kungpao-chicken', 1),
    pick('stirfry-greens', 1),
    pick('noodles', 1),
    pick('tomato-egg', 1),
    pick('garlic-broccoli', 1),
    pick('apple', 1),
    pick('bubble-tea', 0.5),
  ].filter(Boolean);
  state.mode = 'day';
  document.querySelector('input[name="mode"][value="day"]').checked = true;
  updateModeHint();
  afterChange();
  renderReport();
}

el.sampleBtn.addEventListener('click', loadSample);

document.querySelectorAll('input[name="mode"]').forEach((input) => {
  input.addEventListener('change', () => {
    state.mode = input.value;
    updateModeHint();
    persist();
    if (state.items.length) renderReport();
  });
});

function updateModeHint() {
  el.modeHint.textContent = state.mode === 'day'
    ? '按全天参考量评估（约 2000 kcal）'
    : '按一餐参考量评估（约 800 kcal）';
}

/* ---------------- 自定义菜品 ---------------- */
el.manualBtn.addEventListener('click', () => {
  el.manualName.value = '';
  el.manualCat.value = 'meat';
  if (typeof el.manualDialog.showModal === 'function') el.manualDialog.showModal();
  else el.manualDialog.setAttribute('open', '');
  el.manualName.focus();
});

el.manualCancel.addEventListener('click', () => el.manualDialog.close());

el.manualForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = el.manualName.value.trim();
  if (!name) return;
  const food = manualFood({ name, cat: el.manualCat.value });
  state.items.push({ uid: uid(), food, servings: 1 });
  el.manualDialog.close();
  afterChange();
});

/* ---------------- 生成评估 ---------------- */
el.evalBtn.addEventListener('click', () => {
  renderReport();
  if (window.innerWidth < 1060) {
    el.report.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

function renderEmptyReport() {
  el.report.innerHTML = originalEmptyHTML;
}

function renderReport() {
  if (!state.items.length) {
    renderEmptyReport();
    return;
  }
  const r = evaluate(state.items, state.mode);
  const t = r.totals;
  const tg = r.targets;
  const ringLen = 339.29;
  const offset = ringLen * (1 - r.total / 100);
  const tone = r.grade.tone;

  const metricDefs = [
    { label: '热量', value: t.kcal, target: tg.kcal, unit: 'kcal', kind: 'range', digits: 0 },
    { label: '蛋白质', value: t.protein, target: tg.protein, unit: 'g', kind: 'target' },
    { label: '脂肪', value: t.fat, target: tg.fat, unit: 'g', kind: 'limit' },
    { label: '碳水', value: t.carb, target: tg.carb, unit: 'g', kind: 'target' },
    { label: '钠', value: t.sodium, target: tg.sodium, unit: 'mg', kind: 'limit' },
    { label: '膳食纤维', value: t.fiber, target: tg.fiber, unit: 'g', kind: 'target' },
    { label: '蔬菜', value: t.veg, target: tg.veg, unit: 'g', kind: 'target' },
    { label: '水果', value: t.fruit, target: tg.fruit, unit: 'g', kind: 'target' },
    { label: '全谷物', value: t.whole, target: tg.whole, unit: 'g', kind: 'target' },
    { label: '添加糖', value: t.sugar, target: tg.sugar, unit: 'g', kind: 'limit' },
    { label: '奶类', value: t.dairy, target: tg.dairy, unit: 'g', kind: 'target' },
    { label: '食物类别', value: t.catCount, target: 5, unit: '类', kind: 'target', digits: 0 },
  ];

  const metricsHTML = metricDefs.map((m) => {
    const ratio = Math.min(1.25, m.value / m.target);
    let color = '#187a52';
    if (m.kind === 'limit') {
      color = ratio > 1.15 ? '#c14f45' : ratio > 1 ? '#c98519' : '#187a52';
    } else if (m.kind === 'range') {
      color = ratio > 1.25 ? '#c98519' : ratio < 0.7 ? '#c98519' : '#187a52';
    } else {
      color = ratio >= 0.85 ? '#187a52' : ratio >= 0.5 ? '#c98519' : '#c14f45';
    }
    return `<div class="metric">
      <div class="metric-label">${m.label}</div>
      <div class="metric-value">${fmt(m.value, m.digits ?? 1)}<small>${m.unit}</small></div>
      <div class="metric-track"><i style="width:${Math.min(100, ratio * 100)}%;background:${color}"></i></div>
    </div>`;
  }).join('');

  const dimsHTML = r.dims.map((d) => `
    <div class="dim-row">
      <span class="dim-label">${d.label}</span>
      <div class="dim-bar"><div class="dim-fill" data-w="${Math.round(d.score * 100)}" style="background:${scoreColor(d.score)}"></div></div>
      <span class="dim-score">${Math.round(d.score * 100)}</span>
      <span class="dim-hint">${esc(d.hint)} · ${esc(d.detail)}</span>
    </div>`).join('');

  const tagsHTML = r.issues.length
    ? r.issues.map((i) => `<span class="tag ${i.severity}">${esc(i.text)}</span>`).join('')
    : '<span class="tag good">各项指标都在建议范围内</span>';

  const suggestionsHTML = r.suggestions.map((s, idx) => `
    <li class="suggestion">
      <span class="suggestion-index">${idx + 1}</span>
      <div>
        <h4>${esc(s.title)}</h4>
        <p>${esc(s.text)}</p>
      </div>
    </li>`).join('');

  const toneColors = { sun: '#d9a441', leaf: '#187a52', moon: '#6b7f9e', berry: '#b5566e' };
  const planHTML = r.plan.map((p) => `
    <div class="meal-card">
      <h4><span class="meal-dot" style="background:${toneColors[p.tone]}"></span>${p.meal}</h4>
      <ul>${p.foods.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
    </div>`).join('');

  const today = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
  const scope = r.mode === 'day' ? '全天' : '一餐';

  el.report.innerHTML = `
    <div class="report-body">
      <div class="report-top">
        <div class="ring-wrap">
          <svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true">
            <circle class="ring-bg" cx="64" cy="64" r="54"></circle>
            <circle class="ring-value" cx="64" cy="64" r="54" stroke="${r.grade.tone === 'good' ? '#187a52' : r.grade.tone === 'ok' ? '#1d6b58' : r.grade.tone === 'warn' ? '#c98519' : '#c14f45'}"
              stroke-dasharray="${ringLen.toFixed(2)}" stroke-dashoffset="${ringLen.toFixed(2)}"></circle>
          </svg>
          <div class="ring-center">
            <span class="ring-score">${fmt(r.total, 1)}</span>
            <span class="ring-unit">综合得分</span>
          </div>
        </div>
        <div class="report-headline">
          <span class="grade-badge tone-${tone}"><span class="letter">${r.grade.letter}</span>${r.grade.label}</span>
          <h2>${esc(r.grade.verdict)}</h2>
          <p>${esc(r.summary.text)}</p>
          <p class="report-meta">${today} · ${scope}记录 · ${state.items.length} 份菜品 · 约 ${fmt(t.kcal)} kcal</p>
        </div>
      </div>

      <div class="section-title"><h3>六维评分</h3><span>满分 100，按膳食指南参考量折算</span></div>
      <div class="dims">${dimsHTML}</div>

      <div class="section-title"><h3>关键指标</h3><span>对照${scope}参考量</span></div>
      <div class="metric-grid">${metricsHTML}</div>

      <div class="section-title"><h3>需要注意</h3><span>${r.issues.length ? `${r.issues.length} 项` : '无'}</span></div>
      <div class="tags">${tagsHTML}</div>

      <div class="section-title"><h3>${r.mode === 'day' ? '明天怎么改' : '下一餐怎么改'}</h3><span>按缺口大小排序</span></div>
      <ol class="suggestions">${suggestionsHTML}</ol>

      <div class="section-title"><h3>${r.mode === 'day' ? '明日三餐示例' : '下一餐搭配示例'}</h3><span>可按口味替换同类食材</span></div>
      <div class="plan-grid">${planHTML}</div>
      <p class="plan-note">这份搭配主要针对今天最薄弱的部分：${esc(r.summary.worst)}。如果今天已经吃得很均衡，照着今天的比例继续即可。</p>
    </div>`;

  requestAnimationFrame(() => {
    const ring = el.report.querySelector('.ring-value');
    if (ring) ring.style.strokeDashoffset = String(offset);
    el.report.querySelectorAll('.dim-fill').forEach((node) => {
      node.style.width = `${node.dataset.w}%`;
    });
  });
}

const originalEmptyHTML = el.report.innerHTML;

/* ---------------- 持久化 ---------------- */
function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      mode: state.mode,
      items: state.items.map((i) => ({ food: i.food, servings: i.servings })),
    }));
  } catch { /* 隐私模式下忽略 */ }
}

function restore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.items)) return false;
    state.mode = data.mode === 'meal' ? 'meal' : 'day';
    state.items = data.items
      .filter((i) => i && i.food && i.food.id)
      .map((i) => ({ uid: uid(), food: i.food, servings: Math.min(5, Math.max(0.5, Number(i.servings) || 1)) }));
    return state.items.length > 0;
  } catch {
    return false;
  }
}

/* ---------------- 启动 ---------------- */
renderTabs();
renderCatalog();
updateModeHint();

const wantsDemo = new URLSearchParams(location.search).has('demo');
if (wantsDemo) {
  loadSample();
} else {
  const hasRestored = restore();
  if (hasRestored) {
    document.querySelector(`input[name="mode"][value="${state.mode}"]`).checked = true;
    updateModeHint();
    renderSelected();
    renderReport();
  } else {
    renderSelected();
  }
}
