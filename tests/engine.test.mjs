import test from 'node:test';
import assert from 'node:assert/strict';
import { FOODS } from '../assets/js/foods.js';
import { evaluate, totalsOf, manualFood } from '../assets/js/nutrition.js';

const pick = (id, servings = 1) => {
  const food = FOODS.find((f) => f.id === id);
  assert.ok(food, `菜品库缺少 ${id}`);
  return { food, servings };
};

const healthyDay = [
  pick('brown-rice', 1),
  pick('steamed-fish', 1),
  pick('garlic-broccoli', 1.5),
  pick('cucumber-salad', 1),
  pick('apple', 1),
  pick('milk', 1),
  pick('yogurt', 1),
];

const junkDay = [
  pick('fried-chicken', 1),
  pick('chips', 1),
  pick('bubble-tea', 1),
  pick('braised-pork', 1),
];

test('健康搭配的得分明显高于高油高盐搭配', () => {
  const good = evaluate(healthyDay, 'day');
  const bad = evaluate(junkDay, 'day');
  assert.ok(good.total > bad.total + 20, `期望分差 > 20，实际 ${good.total} vs ${bad.total}`);
  assert.ok(['A', 'B'].includes(good.grade.letter), `健康日应得 A/B，实际 ${good.grade.letter}`);
});

test('单餐模式按 0.4 折算参考量', () => {
  const day = evaluate(healthyDay, 'day');
  const meal = evaluate(healthyDay, 'meal');
  assert.equal(meal.targets.veg, 120);
  assert.equal(meal.targets.kcal, 800);
  assert.ok(day.total > meal.total, '同样菜品按一日参考量评估时得分应更低');
});

test('蔬菜和水果的克数换算正确', () => {
  const t = totalsOf([pick('garlic-broccoli', 1), pick('apple', 1)]);
  assert.ok(Math.abs(t.veg - 184) < 0.5, `西兰花 200g 应含约 184g 蔬菜，实际 ${t.veg}`);
  assert.ok(Math.abs(t.fruit - 200) < 0.5, `苹果 200g 应计 200g 水果，实际 ${t.fruit}`);
});

test('蔬菜不足会触发预警并给出补蔬菜的建议', () => {
  const r = evaluate([pick('rice', 1), pick('braised-pork', 1)], 'day');
  assert.ok(r.issues.some((i) => i.key === 'veg'), '缺少蔬菜应触发 veg 预警');
  assert.ok(r.suggestions.some((s) => s.key === 'veg'), '应给出补蔬菜建议');
  assert.equal(r.dims.length, 6);
});

test('高盐菜品会触发钠预警', () => {
  const r = evaluate([pick('boiled-beef', 2), pick('rice', 1)], 'day');
  assert.ok(r.issues.some((i) => i.key === 'sodium'), '水煮牛肉两份应触发钠预警');
});

test('含糖饮料会触发添加糖预警', () => {
  const r = evaluate([pick('rice', 1), pick('bubble-tea', 2)], 'day');
  assert.ok(r.issues.some((i) => i.key === 'sugar'), '两杯奶茶应触发添加糖预警');
  assert.ok(r.suggestions.some((s) => s.key === 'sugar'));
});

test('明日搭配覆盖四餐且每餐都有内容', () => {
  const r = evaluate(healthyDay, 'day');
  assert.equal(r.plan.length, 4);
  for (const meal of r.plan) {
    assert.ok(meal.foods.length > 0, `${meal.meal} 不应为空`);
  }
});

test('手动菜品按类别均值估算', () => {
  const food = manualFood({ name: '外婆做的冬瓜烧肉', cat: 'meat' });
  assert.equal(food.name, '外婆做的冬瓜烧肉');
  assert.equal(food.cat, 'meat');
  assert.ok(food.serving > 0 && food.n[0] > 0);
});

test('六维权重合计为 100', () => {
  const r = evaluate(healthyDay, 'day');
  const sum = r.dims.reduce((s, d) => s + d.weight, 0);
  assert.equal(sum, 100);
});
