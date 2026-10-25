import { CATEGORY_PROFILE } from './foods.js';

// 参考《中国居民膳食指南（2022）》成人轻体力活动水平，按天计
const BASE_TARGETS = {
  kcal: 2000,
  protein: 65,
  fat: 60,
  carb: 250,
  sodium: 2000,
  fiber: 25,
  veg: 300,
  fruit: 250,
  whole: 50,
  sugar: 25,
  dairy: 300,
};

const MODE_FACTOR = { day: 1, meal: 0.4 };

export const DIMENSIONS = [
  { key: 'vegfruit', label: '蔬菜水果', weight: 25 },
  { key: 'protein', label: '蛋白质质量', weight: 20 },
  { key: 'staple', label: '主食与全谷', weight: 20 },
  { key: 'oilsaltsugar', label: '油盐糖控制', weight: 20 },
  { key: 'energy', label: '能量平衡', weight: 10 },
  { key: 'variety', label: '饮食多样性', weight: 5 },
];

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const round = (x, d = 0) => {
  const p = 10 ** d;
  return Math.round(x * p) / p;
};

export function totalsOf(items) {
  const t = { kcal: 0, protein: 0, fat: 0, carb: 0, sodium: 0, fiber: 0, veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0 };
  const groups = new Set();
  const cats = new Set();
  for (const item of items) {
    const ratio = (item.food.serving * item.servings) / 100;
    t.kcal += item.food.n[0] * ratio;
    t.protein += item.food.n[1] * ratio;
    t.fat += item.food.n[2] * ratio;
    t.carb += item.food.n[3] * ratio;
    t.sodium += item.food.n[4] * ratio;
    t.fiber += item.food.n[5] * ratio;
    t.veg += (item.food.veg || 0) * ratio;
    t.fruit += (item.food.fruit || 0) * ratio;
    t.whole += (item.food.whole || 0) * ratio;
    t.sugar += (item.food.sugar || 0) * ratio;
    t.dairy += (item.food.dairy || 0) * ratio;
    if (['meat', 'poultry', 'fish', 'egg', 'dairy', 'soy'].includes(item.food.pg)) groups.add(item.food.pg);
    cats.add(item.food.cat);
  }
  for (const k of Object.keys(t)) t[k] = round(t[k], 1);
  t.dishes = items.length;
  t.proteinGroupCount = groups.size;
  t.catCount = cats.size;
  return t;
}

function scoreDimensions(t, tg) {
  const vegRatio = t.veg / tg.veg;
  const fruitRatio = t.fruit / tg.fruit;
  const vegfruit = 0.6 * clamp01(vegRatio) + 0.4 * clamp01(fruitRatio);

  const adequacy = clamp01(t.protein / tg.protein);
  const variety = clamp01(t.proteinGroupCount / 4);
  let protein = 0.75 * adequacy + 0.25 * variety;
  if (t.protein > tg.protein * 2) protein -= 0.1;

  const carbRatio = clamp01(t.carb / tg.carb);
  const wholeRatio = clamp01(t.whole / tg.whole);
  let staple = 0.45 * carbRatio + 0.55 * wholeRatio;
  if (t.carb > tg.carb * 1.6) staple -= 0.1;

  const fatScore = t.fat <= tg.fat * 1.15
    ? Math.min(1, 0.6 + 0.4 * clamp01(t.fat / (tg.fat * 0.5)))
    : 1 - clamp01((t.fat - tg.fat * 1.15) / (tg.fat * 0.8));
  const naScore = 1 - clamp01((t.sodium - tg.sodium) / (tg.sodium * 0.75));
  const sugarScore = 1 - clamp01((t.sugar - tg.sugar) / (tg.sugar * 1.2));
  const oilsaltsugar = 0.4 * fatScore + 0.4 * naScore + 0.2 * sugarScore;

  const diff = Math.abs(t.kcal - tg.kcal);
  const energy = 1 - clamp01((diff - tg.kcal * 0.1) / (tg.kcal * 0.45));

  const varietyScore = 0.55 * clamp01(t.catCount / 5) + 0.45 * clamp01(t.dishes / 8);

  const raw = { vegfruit, protein, staple, oilsaltsugar, energy, variety: varietyScore };
  return DIMENSIONS.map((d) => {
    const score = clamp01(raw[d.key]);
    return {
      ...d,
      score: round(score, 3),
      detail: DIMENSION_DETAIL[d.key](t, tg),
      hint: DIMENSION_HINT[d.key](score),
    };
  });
}

const DIMENSION_DETAIL = {
  vegfruit: (t, tg) => `蔬菜 ${round(t.veg)} / ${round(tg.veg)} g · 水果 ${round(t.fruit)} / ${round(tg.fruit)} g`,
  protein: (t, tg) => `蛋白质 ${round(t.protein)} / ${round(tg.protein)} g · 来源 ${t.proteinGroupCount} 类`,
  staple: (t, tg) => `碳水 ${round(t.carb)} / ${round(tg.carb)} g · 全谷物 ${round(t.whole)} / ${round(tg.whole)} g`,
  oilsaltsugar: (t, tg) => `脂肪 ${round(t.fat)} / ${round(tg.fat)} g · 钠 ${round(t.sodium)} / ${round(tg.sodium)} mg · 添加糖 ${round(t.sugar)} / ${round(tg.sugar)} g`,
  energy: (t, tg) => `摄入 ${round(t.kcal)} kcal · 建议 ${round(tg.kcal * 0.9)}–${round(tg.kcal * 1.1)} kcal`,
  variety: (t, tg) => `食物类别 ${t.catCount} / 5 · 菜品 ${t.dishes} 份`,
};

const DIMENSION_HINT = {
  vegfruit: (s) => (s >= 0.8 ? '蔬果充足' : s >= 0.5 ? '蔬果偏少' : '蔬果明显不足'),
  protein: (s) => (s >= 0.8 ? '蛋白质达标' : s >= 0.5 ? '蛋白质略少' : '蛋白质不足'),
  staple: (s) => (s >= 0.8 ? '主食结构合理' : s >= 0.5 ? '全谷物偏少' : '精制主食为主'),
  oilsaltsugar: (s) => (s >= 0.8 ? '油盐糖控制良好' : s >= 0.5 ? '油盐糖略高' : '油盐糖偏高'),
  energy: (s) => (s >= 0.8 ? '能量适中' : s >= 0.5 ? '能量有偏差' : '能量明显失衡'),
  variety: (s) => (s >= 0.8 ? '搭配丰富' : s >= 0.5 ? '种类一般' : '种类单一'),
};

const GRADE = [
  { min: 85, letter: 'A', label: '优秀', tone: 'good', verdict: '今天的搭配相当均衡，结构和比例都接近膳食指南，继续保持这个节奏。' },
  { min: 70, letter: 'B', label: '良好', tone: 'ok', verdict: '整体不错，只在一两个维度上有缺口，明天做小幅调整就能更稳。' },
  { min: 55, letter: 'C', label: '需改进', tone: 'warn', verdict: '结构上有明显短板，按下面的建议调整一天，分数就能明显回升。' },
  { min: 0, letter: 'D', label: '偏差较大', tone: 'bad', verdict: '今天的搭配偏离膳食指南较多，重点先补蔬菜、控油盐，再谈其他细节。' },
];

export function evaluate(items, mode = 'day') {
  const factor = MODE_FACTOR[mode] ?? 1;
  const targets = {};
  for (const [k, v] of Object.entries(BASE_TARGETS)) targets[k] = round(v * factor, 1);

  const totals = totalsOf(items);
  const dims = scoreDimensions(totals, targets);
  const total = round(dims.reduce((s, d) => s + d.score * d.weight, 0), 1);
  const grade = GRADE.find((g) => total >= g.min);

  const fried = items.filter((i) => ['炸'].includes(i.food.cook)).reduce((s, i) => s + i.servings, 0);
  const issues = buildIssues(totals, targets, { fried, mode });
  const suggestions = buildSuggestions(totals, targets, { mode });
  const plan = buildPlan(totals, targets);
  const summary = summarize(dims);

  return { mode, factor, targets, totals, dims, total, grade, issues, suggestions, plan, summary };
}

function buildIssues(t, tg, { fried, mode }) {
  const list = [];
  const push = (key, severity, text) => list.push({ key, severity, text });

  if (t.veg < tg.veg * 0.7) push('veg', t.veg < tg.veg * 0.4 ? 'bad' : 'warn', `蔬菜约 ${round(t.veg)} g，低于建议的 ${round(tg.veg)} g`);
  if (t.fruit < tg.fruit * 0.5) push('fruit', 'warn', `水果约 ${round(t.fruit)} g，建议每天 ${round(tg.fruit)} g`);
  if (t.sodium > tg.sodium * 1.15) push('sodium', t.sodium > tg.sodium * 1.5 ? 'bad' : 'warn', `钠约 ${round(t.sodium)} mg，超过建议上限 ${round(tg.sodium)} mg`);
  if (t.sugar > tg.sugar * 1.1) push('sugar', t.sugar > tg.sugar * 1.8 ? 'bad' : 'warn', `添加糖约 ${round(t.sugar)} g，超过 ${round(tg.sugar)} g 的建议量`);
  if (t.fat > tg.fat * 1.3) push('fat', 'warn', `脂肪约 ${round(t.fat)} g，高于建议的 ${round(tg.fat)} g`);
  if (t.protein < tg.protein * 0.8) push('protein', 'warn', `蛋白质约 ${round(t.protein)} g，低于 ${round(tg.protein)} g`);
  if (t.whole < tg.whole * 0.4) push('whole', 'warn', `全谷物约 ${round(t.whole)} g，建议每天 ${round(tg.whole)} g`);
  if (fried >= 2) push('fried', 'warn', `油炸类菜品 ${round(fried, 1)} 份，烹饪方式偏油`);
  if (t.dairy < tg.dairy * 0.3) push('dairy', 'warn', `奶类约 ${round(t.dairy)} g，建议每天 ${round(tg.dairy)} g`);
  if (t.kcal > tg.kcal * 1.2) push('energy-high', 'warn', `热量约 ${round(t.kcal)} kcal，明显高于建议的 ${round(tg.kcal)} kcal`);
  if (t.kcal < tg.kcal * 0.6) push('energy-low', 'warn', `热量约 ${round(t.kcal)} kcal，摄入偏低`);
  if (t.dishes < 4 && mode === 'day') push('variety', 'warn', `只有 ${t.dishes} 份食物，种类偏单一`);
  if (t.fiber < tg.fiber * 0.6) push('fiber', 'warn', `膳食纤维约 ${round(t.fiber)} g，建议 25–30 g`);
  return list;
}

const SUGGESTION_RULES = [
  {
    key: 'veg',
    gap: (t, tg) => clamp01(1 - t.veg / tg.veg),
    make: (t, tg, verb) => ({
      title: `蔬菜补到 ${round(tg.veg)} g`,
      text: `今天只有约 ${round(t.veg)} g，还差 ${round(Math.max(0, tg.veg - t.veg))} g。${verb}午晚餐各加一份 200 g 绿叶菜，比如蒜蓉西兰花、清炒油麦菜、上汤娃娃菜。`,
    }),
  },
  {
    key: 'fruit',
    gap: (t, tg) => clamp01(1 - t.fruit / tg.fruit) * 0.9,
    make: (t, tg, verb) => ({
      title: '加一份完整水果',
      text: `水果只有约 ${round(t.fruit)} g。${verb}上午或下午加餐吃 1 个苹果 / 橙子 / 2 个猕猴桃，用整果代替果汁。`,
    }),
  },
  {
    key: 'whole',
    gap: (t, tg) => clamp01(1 - t.whole / tg.whole) * 0.85,
    make: (t, tg, verb) => ({
      title: '主食换成一半全谷',
      text: `全谷物只有约 ${round(t.whole)} g。${verb}早餐把白粥换成燕麦粥，或午晚餐用二米饭、糙米饭替代一半白米饭，一天就能补 50 g 以上。`,
    }),
  },
  {
    key: 'protein',
    gap: (t, tg) => clamp01(1 - t.protein / tg.protein) * 0.85,
    make: (t, tg, verb) => ({
      title: '补足优质蛋白',
      text: `蛋白质约 ${round(t.protein)} g，还差 ${round(Math.max(0, tg.protein - t.protein))} g。${verb}加一份清蒸鱼、白灼虾或鸡胸肉（约 100 g），也可以选择水煮蛋 + 无糖豆浆。`,
    }),
  },
  {
    key: 'sodium',
    gap: (t, tg) => clamp01((t.sodium - tg.sodium) / (tg.sodium * 0.8)),
    make: (t, tg, verb) => ({
      title: '把盐和酱油降下来',
      text: `钠约 ${round(t.sodium)} mg，已经超过 ${round(tg.sodium)} mg 的参考上限。${verb}少点一份红烧/水煮类菜品，蘸料减半，用醋、柠檬和香辛料提味。`,
    }),
  },
  {
    key: 'sugar',
    gap: (t, tg) => clamp01((t.sugar - tg.sugar) / (tg.sugar * 1.2)),
    make: (t, tg, verb) => ({
      title: '戒掉一杯甜饮',
      text: `添加糖约 ${round(t.sugar)} g，超过了每天 ${round(tg.sugar)} g 的建议。${verb}把奶茶、可乐换成无糖茶或气泡水，甜点换成水果或原味酸奶。`,
    }),
  },
  {
    key: 'fat',
    gap: (t, tg) => clamp01((t.fat - tg.fat) / (tg.fat * 0.9)),
    make: (t, tg, verb) => ({
      title: '烹饪方式换成蒸煮',
      text: `脂肪约 ${round(t.fat)} g，偏高。${verb}把一份油炸/红烧菜换成清蒸或白灼，炒菜少放一勺油，每天用油控制在 25–30 g。`,
    }),
  },
  {
    key: 'dairy',
    gap: (t, tg) => clamp01(1 - t.dairy / tg.dairy) * 0.6,
    make: (t, tg, verb) => ({
      title: '补一份奶类',
      text: `奶类只有约 ${round(t.dairy)} g，建议每天 300 g。${verb}早餐或加餐加 250 ml 纯牛奶，或无糖酸奶 150 g。`,
    }),
  },
  {
    key: 'energy-high',
    gap: (t, tg) => clamp01((t.kcal - tg.kcal * 1.15) / (tg.kcal * 0.5)),
    make: (t, tg, verb) => ({
      title: '总量收一点',
      text: `今天约 ${round(t.kcal)} kcal，比 ${round(tg.kcal)} kcal 的参考值高。${verb}主食减 1/4，优先砍掉油炸和含糖饮料，蛋白质和蔬菜不用减。`,
    }),
  },
  {
    key: 'energy-low',
    gap: (t, tg) => clamp01((tg.kcal * 0.7 - t.kcal) / (tg.kcal * 0.4)) * 0.5,
    make: (t, tg, verb) => ({
      title: '别吃太少',
      text: `今天只有约 ${round(t.kcal)} kcal，摄入偏低。${verb}正常吃三餐，加一份主食和一份蛋白质，避免靠零食补热量。`,
    }),
  },
  {
    key: 'variety',
    gap: (t, tg) => clamp01(1 - t.dishes / 6) * 0.5,
    make: (t, tg, verb) => ({
      title: '让餐盘更丰富',
      text: `今天只有 ${t.dishes} 份食物。${verb}每餐尽量凑齐「主食 + 蛋白质 + 蔬菜」三件套，一天吃到 12 种以上食材。`,
    }),
  },
];

const VERB = { day: '明天', meal: '下一餐' };

function buildSuggestions(t, tg, { mode }) {
  const verb = VERB[mode] ?? '明天';
  const ranked = SUGGESTION_RULES
    .map((rule) => ({ rule, gap: rule.gap(t, tg) }))
    .filter((x) => x.gap > 0.12)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 5)
    .map(({ rule }) => ({ key: rule.key, ...rule.make(t, tg, verb) }));

  if (ranked.length < 2) {
    ranked.push({
      key: 'keep',
      title: '保持现在的结构',
      text: `${verb}照着今天的比例吃就好：主食粗细搭配、每餐有蔬菜、蛋白质来源换着来。`,
    });
  }
  return ranked;
}

function buildPlan(t, tg) {
  const need = {
    whole: t.whole < tg.whole * 0.7,
    protein: t.protein < tg.protein * 0.85,
    veg: t.veg < tg.veg * 0.85,
    fruit: t.fruit < tg.fruit * 0.6,
    dairy: t.dairy < tg.dairy * 0.5,
    salt: t.sodium > tg.sodium,
    sugar: t.sugar > tg.sugar * 0.8,
    energy: t.kcal > tg.kcal * 1.15,
  };

  const breakfast = [
    need.whole ? '燕麦粥 1 碗（约 300 g，全谷物）' : '全麦馒头 1 个 + 水煮蛋 1 个',
    need.dairy ? '纯牛奶 250 ml' : '无糖豆浆 1 杯',
    need.fruit ? '苹果 1 个（约 200 g）' : '时令水果 1 小份',
  ];
  if (!need.whole) breakfast.splice(1, 0, '水煮蛋 1 个');

  const lunch = [
    need.whole ? '二米饭 1 碗（白米 + 糙米，约 150 g）' : '白米饭 1 碗（约 150 g）',
    need.protein ? '清蒸鲈鱼 150 g 或白灼虾 120 g' : '番茄炒蛋 1 份',
    '清炒时蔬 250 g',
  ];

  const dinner = [
    need.whole ? '杂粮粥 1 碗 + 蒸红薯 100 g' : '米饭 半碗',
    need.protein ? '家常豆腐 1 份 + 白灼鸡胸 80 g' : '番茄蛋汤 + 凉拌木耳',
    need.veg ? '蒜蓉西兰花 200 g' : '上汤娃娃菜 200 g',
  ];
  if (need.salt) dinner.push('全天用盐 ≤ 5 g，酱油减半');

  const snack = [];
  if (need.fruit) snack.push('下午：橙子 1 个或猕猴桃 2 个');
  if (need.dairy) snack.push('加餐：无糖酸奶 150 g');
  if (!snack.length) snack.push('加餐：原味坚果 25 g');
  if (need.sugar) snack.push('甜饮换成无糖茶或气泡水');
  if (need.energy) snack.push('夜宵不加餐');

  return [
    { meal: '早餐', tone: 'sun', foods: breakfast },
    { meal: '午餐', tone: 'leaf', foods: lunch },
    { meal: '晚餐', tone: 'moon', foods: dinner },
    { meal: '加餐', tone: 'berry', foods: snack },
  ];
}

function summarize(dims) {
  const sorted = [...dims].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  return {
    best: best.label,
    worst: worst.label,
    text: `最稳的是「${best.label}」，最需要补的是「${worst.label}」。`,
  };
}

export function manualFood({ name, cat }) {
  const p = CATEGORY_PROFILE[cat] || CATEGORY_PROFILE.staple;
  return {
    id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    cat,
    cook: p.cook,
    serving: p.serving,
    n: p.n,
    veg: p.veg,
    fruit: p.fruit,
    whole: p.whole,
    sugar: p.sugar,
    dairy: p.dairy,
    pg: p.pg,
    tags: ['手动估算'],
    manual: true,
  };
}
