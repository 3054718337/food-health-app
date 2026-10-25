// 常见中式菜品营养估算库
// n = [热量 kcal, 蛋白质 g, 脂肪 g, 碳水 g, 钠 mg, 膳食纤维 g] 每 100g 可食部
// veg/fruit/whole/dairy = 每 100g 中蔬菜/水果/全谷物/奶类的克数
// sugar = 每 100g 添加糖克数；pg = 蛋白质来源分组；serving = 常见 1 份的克数

export const CATEGORIES = [
  { id: 'staple', name: '主食' },
  { id: 'meat', name: '荤菜' },
  { id: 'veg', name: '素菜' },
  { id: 'soup', name: '汤羹' },
  { id: 'fruit', name: '水果' },
  { id: 'dairy', name: '奶豆' },
  { id: 'snack', name: '零食饮料' },
];

export const PROTEIN_GROUPS = {
  grain: '谷类',
  meat: '畜肉',
  poultry: '禽肉',
  fish: '水产',
  egg: '蛋类',
  dairy: '奶类',
  soy: '大豆',
};

export const FOODS = [
  // ---------- 主食 ----------
  { id: 'rice', name: '白米饭', aliases: ['米饭', '大米饭'], cat: 'staple', cook: '蒸', serving: 200, n: [116, 2.6, 0.3, 25.9, 2, 0.3], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'grain', tags: ['精制主食'] },
  { id: 'brown-rice', name: '糙米饭', aliases: ['糙米'], cat: 'staple', cook: '蒸', serving: 200, n: [112, 2.8, 0.9, 23, 3, 1.6], veg: 0, fruit: 0, whole: 100, sugar: 0, dairy: 0, pg: 'grain', tags: ['全谷物'] },
  { id: 'mixed-rice', name: '二米饭（米+杂粮）', aliases: ['杂粮饭', '小米饭'], cat: 'staple', cook: '蒸', serving: 200, n: [110, 3, 0.8, 23, 3, 1.1], veg: 0, fruit: 0, whole: 50, sugar: 0, dairy: 0, pg: 'grain', tags: ['全谷物'] },
  { id: 'mantou', name: '白馒头', aliases: ['馒头'], cat: 'staple', cook: '蒸', serving: 100, n: [223, 7, 1.1, 47, 165, 1.3], veg: 0, fruit: 0, whole: 0, sugar: 2, dairy: 0, pg: 'grain', tags: ['精制主食'] },
  { id: 'whole-mantou', name: '全麦馒头', cat: 'staple', cook: '蒸', serving: 100, n: [220, 7.5, 1.5, 44, 170, 3.2], veg: 0, fruit: 0, whole: 100, sugar: 2, dairy: 0, pg: 'grain', tags: ['全谷物'] },
  { id: 'noodles', name: '汤面条', aliases: ['面条', '阳春面'], cat: 'staple', cook: '煮', serving: 250, n: [110, 4, 0.5, 22, 60, 1.2], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'grain', tags: ['精制主食'] },
  { id: 'buckwheat-noodles', name: '荞麦面', cat: 'staple', cook: '煮', serving: 250, n: [105, 4.5, 0.6, 20, 70, 2.2], veg: 0, fruit: 0, whole: 100, sugar: 0, dairy: 0, pg: 'grain', tags: ['全谷物'] },
  { id: 'congee', name: '白粥', aliases: ['大米粥'], cat: 'staple', cook: '煮', serving: 300, n: [46, 1.1, 0.2, 9.9, 2, 0.2], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'grain', tags: ['精制主食'] },
  { id: 'oat-congee', name: '燕麦粥', cat: 'staple', cook: '煮', serving: 300, n: [70, 2.5, 1.4, 12, 5, 2.5], veg: 0, fruit: 0, whole: 100, sugar: 0, dairy: 0, pg: 'grain', tags: ['全谷物'] },
  { id: 'youtiao', name: '油条', cat: 'staple', cook: '炸', serving: 70, n: [388, 6.9, 17.6, 51, 585, 0.9], veg: 0, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'grain', tags: ['油炸', '高盐'] },
  { id: 'sweet-potato', name: '蒸红薯', aliases: ['红薯', '地瓜'], cat: 'staple', cook: '蒸', serving: 200, n: [86, 1.6, 0.2, 20, 28, 3], veg: 0, fruit: 0, whole: 80, sugar: 0, dairy: 0, pg: 'grain', tags: ['全谷物', '薯类'] },
  { id: 'corn', name: '蒸玉米', aliases: ['玉米'], cat: 'staple', cook: '蒸', serving: 200, n: [112, 4, 1.2, 22.8, 3, 2.9], veg: 0, fruit: 0, whole: 90, sugar: 0, dairy: 0, pg: 'grain', tags: ['全谷物', '薯类'] },
  { id: 'egg-fried-rice', name: '蛋炒饭', cat: 'staple', cook: '炒', serving: 250, n: [165, 5, 5.6, 24, 350, 0.6], veg: 8, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'egg', tags: ['精制主食'] },
  { id: 'baozi', name: '肉包', aliases: ['包子'], cat: 'staple', cook: '蒸', serving: 100, n: [227, 8, 8, 30, 400, 1], veg: 5, fruit: 0, whole: 0, sugar: 3, dairy: 0, pg: 'meat', tags: [] },
  { id: 'dumpling', name: '猪肉饺子', aliases: ['饺子'], cat: 'staple', cook: '煮', serving: 250, n: [240, 10, 9, 28, 500, 1.5], veg: 18, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'meat', tags: [] },
  { id: 'jianbing', name: '煎饼果子', cat: 'staple', cook: '煎', serving: 200, n: [260, 8, 10, 34, 600, 1], veg: 8, fruit: 0, whole: 0, sugar: 2, dairy: 0, pg: 'egg', tags: ['高盐'] },
  { id: 'sandwich', name: '火腿生菜三明治', aliases: ['三明治'], cat: 'staple', cook: '即食', serving: 150, n: [210, 9, 7, 28, 480, 2], veg: 15, fruit: 0, whole: 0, sugar: 3, dairy: 0, pg: 'meat', tags: ['加工肉'] },
  { id: 'rice-noodle', name: '汤米粉', aliases: ['米粉', '河粉'], cat: 'staple', cook: '煮', serving: 300, n: [100, 3, 1, 20, 400, 0.5], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'grain', tags: [] },
  { id: 'leek-box', name: '韭菜盒子', cat: 'staple', cook: '煎', serving: 150, n: [250, 6, 12, 30, 450, 2], veg: 22, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'egg', tags: ['油炸'] },

  // ---------- 荤菜 ----------
  { id: 'steamed-fish', name: '清蒸鲈鱼', aliases: ['蒸鱼', '清蒸鱼'], cat: 'meat', cook: '蒸', serving: 200, n: [105, 18, 3, 0.5, 250, 0], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'fish', tags: [] },
  { id: 'boiled-shrimp', name: '白灼虾', aliases: ['虾'], cat: 'meat', cook: '煮', serving: 120, n: [93, 18.6, 0.8, 2.8, 180, 0], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'fish', tags: [] },
  { id: 'boiled-chicken', name: '白切鸡', aliases: ['白斩鸡'], cat: 'meat', cook: '煮', serving: 120, n: [180, 20, 11, 0.5, 300, 0], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'poultry', tags: [] },
  { id: 'kungpao-chicken', name: '宫保鸡丁', aliases: ['宫爆鸡丁'], cat: 'meat', cook: '炒', serving: 180, n: [198, 14, 13, 7, 560, 1], veg: 15, fruit: 0, whole: 0, sugar: 3, dairy: 0, pg: 'poultry', tags: ['高盐'] },
  { id: 'yuxiang-pork', name: '鱼香肉丝', cat: 'meat', cook: '炒', serving: 180, n: [190, 12, 13, 8, 600, 1.2], veg: 25, fruit: 0, whole: 0, sugar: 4, dairy: 0, pg: 'meat', tags: ['高盐'] },
  { id: 'braised-pork', name: '红烧肉', cat: 'meat', cook: '炖', serving: 120, n: [460, 8, 45, 6, 500, 0], veg: 0, fruit: 0, whole: 0, sugar: 8, dairy: 0, pg: 'meat', tags: ['高脂'] },
  { id: 'twice-cooked-pork', name: '回锅肉', cat: 'meat', cook: '炒', serving: 150, n: [350, 11, 32, 6, 650, 0.8], veg: 20, fruit: 0, whole: 0, sugar: 2, dairy: 0, pg: 'meat', tags: ['高脂', '高盐'] },
  { id: 'sweet-sour-pork', name: '糖醋里脊', cat: 'meat', cook: '炸', serving: 150, n: [290, 14, 16, 24, 400, 0.4], veg: 0, fruit: 0, whole: 0, sugar: 12, dairy: 0, pg: 'meat', tags: ['油炸', '高糖'] },
  { id: 'fried-chicken', name: '炸鸡块', aliases: ['炸鸡'], cat: 'meat', cook: '炸', serving: 150, n: [280, 17, 18, 12, 600, 0.3], veg: 0, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'poultry', tags: ['油炸', '高盐'] },
  { id: 'braised-ribs', name: '红烧排骨', cat: 'meat', cook: '炖', serving: 150, n: [330, 16, 27, 6, 520, 0], veg: 0, fruit: 0, whole: 0, sugar: 6, dairy: 0, pg: 'meat', tags: ['高脂'] },
  { id: 'roast-duck', name: '烤鸭', aliases: ['北京烤鸭'], cat: 'meat', cook: '烤', serving: 100, n: [400, 16, 38, 1, 350, 0], veg: 0, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'poultry', tags: ['高脂'] },
  { id: 'tomato-egg', name: '番茄炒蛋', aliases: ['西红柿炒鸡蛋'], cat: 'meat', cook: '炒', serving: 180, n: [110, 5.5, 7.5, 5, 400, 0.8], veg: 55, fruit: 0, whole: 0, sugar: 2, dairy: 0, pg: 'egg', tags: [] },
  { id: 'pepper-pork', name: '青椒肉丝', cat: 'meat', cook: '炒', serving: 180, n: [150, 12, 10, 4, 520, 1], veg: 40, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'meat', tags: ['高盐'] },
  { id: 'mapo-tofu', name: '麻婆豆腐', cat: 'meat', cook: '烧', serving: 180, n: [130, 8, 9, 4, 700, 0.6], veg: 5, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'soy', tags: ['高盐'] },
  { id: 'home-tofu', name: '家常豆腐', cat: 'meat', cook: '烧', serving: 180, n: [150, 10, 10, 5, 620, 0.8], veg: 15, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'soy', tags: ['高盐'] },
  { id: 'shrimp-stirfry', name: '清炒虾仁', cat: 'meat', cook: '炒', serving: 150, n: [120, 16, 4, 3, 400, 0], veg: 5, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'fish', tags: [] },
  { id: 'beef-broccoli', name: '牛肉炒西兰花', cat: 'meat', cook: '炒', serving: 200, n: [130, 12, 7, 5, 450, 2], veg: 45, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'meat', tags: [] },
  { id: 'boiled-beef', name: '水煮牛肉', cat: 'meat', cook: '煮', serving: 200, n: [220, 16, 16, 5, 900, 0.9], veg: 10, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'meat', tags: ['高盐', '高脂'] },
  { id: 'steamed-pork', name: '粉蒸肉', cat: 'meat', cook: '蒸', serving: 150, n: [330, 13, 26, 10, 480, 0.5], veg: 0, fruit: 0, whole: 0, sugar: 2, dairy: 0, pg: 'meat', tags: ['高脂'] },
  { id: 'salmon', name: '香煎三文鱼', aliases: ['三文鱼'], cat: 'meat', cook: '煎', serving: 120, n: [200, 20, 13, 0, 150, 0], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'fish', tags: [] },
  { id: 'boiled-egg', name: '水煮蛋', aliases: ['鸡蛋', '白煮蛋'], cat: 'meat', cook: '煮', serving: 50, n: [147, 13.3, 8.8, 2.8, 131, 0], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'egg', tags: [] },
  { id: 'fried-egg', name: '煎荷包蛋', aliases: ['煎蛋'], cat: 'meat', cook: '煎', serving: 55, n: [195, 13, 14, 1, 160, 0], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'egg', tags: [] },
  { id: 'chicken-breast', name: '鸡胸肉（水煮）', aliases: ['鸡胸'], cat: 'meat', cook: '煮', serving: 100, n: [133, 24, 5, 0, 60, 0], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'poultry', tags: [] },

  // ---------- 素菜 ----------
  { id: 'stirfry-greens', name: '清炒时蔬', aliases: ['炒青菜', '小白菜'], cat: 'veg', cook: '炒', serving: 200, n: [60, 1.5, 4, 4, 300, 1.5], veg: 90, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'veg', tags: [] },
  { id: 'garlic-broccoli', name: '蒜蓉西兰花', aliases: ['西兰花'], cat: 'veg', cook: '炒', serving: 200, n: [70, 3, 4.5, 5, 320, 2.5], veg: 92, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'veg', tags: [] },
  { id: 'drypot-cauliflower', name: '干锅花菜', cat: 'veg', cook: '炒', serving: 200, n: [130, 3, 10, 8, 600, 2], veg: 80, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'veg', tags: ['高盐'] },
  { id: 'disanxian', name: '地三鲜', cat: 'veg', cook: '炸', serving: 200, n: [180, 2, 14, 13, 550, 2.2], veg: 70, fruit: 0, whole: 0, sugar: 2, dairy: 0, pg: 'veg', tags: ['油炸', '高盐'] },
  { id: 'cucumber-salad', name: '凉拌黄瓜', aliases: ['拍黄瓜'], cat: 'veg', cook: '凉拌', serving: 150, n: [45, 1, 3, 3, 350, 1], veg: 95, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'veg', tags: [] },
  { id: 'potato-shreds', name: '炒土豆丝', aliases: ['土豆丝'], cat: 'veg', cook: '炒', serving: 180, n: [120, 2, 7, 13, 450, 1.2], veg: 90, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'veg', tags: [] },
  { id: 'cabbage', name: '酸辣白菜', cat: 'veg', cook: '炒', serving: 200, n: [55, 1.2, 3.5, 4, 500, 1.4], veg: 92, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'veg', tags: [] },
  { id: 'wood-ear-yam', name: '木耳炒山药', cat: 'veg', cook: '炒', serving: 180, n: [90, 2, 5, 10, 400, 2], veg: 70, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'veg', tags: [] },
  { id: 'baby-cabbage', name: '上汤娃娃菜', cat: 'veg', cook: '煮', serving: 200, n: [55, 2, 3, 5, 450, 1.6], veg: 90, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'veg', tags: [] },
  { id: 'veg-salad', name: '蔬菜沙拉（油醋汁）', aliases: ['沙拉'], cat: 'veg', cook: '生', serving: 200, n: [80, 2, 5, 6, 250, 2], veg: 95, fruit: 0, whole: 0, sugar: 2, dairy: 0, pg: 'veg', tags: [] },
  { id: 'seaweed-salad', name: '凉拌海带丝', aliases: ['海带'], cat: 'veg', cook: '凉拌', serving: 120, n: [50, 1.2, 2.5, 5, 420, 1.5], veg: 95, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'veg', tags: [] },

  // ---------- 汤羹 ----------
  { id: 'seaweed-egg-soup', name: '紫菜蛋花汤', cat: 'soup', cook: '煮', serving: 300, n: [35, 3, 1.5, 2, 450, 0.5], veg: 5, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'egg', tags: [] },
  { id: 'tomato-egg-soup', name: '番茄蛋汤', cat: 'soup', cook: '煮', serving: 300, n: [40, 2.5, 2, 3, 420, 0.5], veg: 40, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'egg', tags: [] },
  { id: 'wintermelon-rib-soup', name: '冬瓜排骨汤', cat: 'soup', cook: '炖', serving: 300, n: [55, 4, 4, 1, 400, 0.3], veg: 30, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'meat', tags: [] },
  { id: 'corn-rib-soup', name: '玉米排骨汤', cat: 'soup', cook: '炖', serving: 300, n: [60, 4, 4, 4, 400, 0.4], veg: 20, fruit: 0, whole: 15, sugar: 0, dairy: 0, pg: 'meat', tags: [] },

  // ---------- 水果 ----------
  { id: 'apple', name: '苹果', cat: 'fruit', cook: '生', serving: 200, n: [53, 0.4, 0.2, 13.7, 1, 1.7], veg: 0, fruit: 100, whole: 0, sugar: 0, dairy: 0, pg: 'fruit', tags: [] },
  { id: 'banana', name: '香蕉', cat: 'fruit', cook: '生', serving: 120, n: [93, 1.4, 0.2, 22, 1, 1.2], veg: 0, fruit: 100, whole: 0, sugar: 0, dairy: 0, pg: 'fruit', tags: [] },
  { id: 'orange', name: '橙子', aliases: ['橘子'], cat: 'fruit', cook: '生', serving: 200, n: [48, 0.8, 0.2, 11.1, 1, 0.6], veg: 0, fruit: 100, whole: 0, sugar: 0, dairy: 0, pg: 'fruit', tags: [] },
  { id: 'blueberry', name: '蓝莓', cat: 'fruit', cook: '生', serving: 100, n: [57, 0.7, 0.3, 14.5, 1, 2.4], veg: 0, fruit: 100, whole: 0, sugar: 0, dairy: 0, pg: 'fruit', tags: [] },
  { id: 'watermelon', name: '西瓜', cat: 'fruit', cook: '生', serving: 300, n: [31, 0.6, 0.1, 7, 3, 0.3], veg: 0, fruit: 100, whole: 0, sugar: 0, dairy: 0, pg: 'fruit', tags: [] },
  { id: 'grape', name: '葡萄', cat: 'fruit', cook: '生', serving: 150, n: [45, 0.5, 0.2, 10.3, 1, 0.4], veg: 0, fruit: 100, whole: 0, sugar: 0, dairy: 0, pg: 'fruit', tags: [] },
  { id: 'kiwi', name: '猕猴桃', cat: 'fruit', cook: '生', serving: 100, n: [61, 0.8, 0.6, 14.5, 3, 2.6], veg: 0, fruit: 100, whole: 0, sugar: 0, dairy: 0, pg: 'fruit', tags: [] },

  // ---------- 奶豆 ----------
  { id: 'milk', name: '纯牛奶', aliases: ['牛奶'], cat: 'dairy', cook: '即食', serving: 250, n: [65, 3.3, 3.6, 4.9, 60, 0], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 100, pg: 'dairy', tags: [] },
  { id: 'yogurt', name: '无糖酸奶', aliases: ['酸奶'], cat: 'dairy', cook: '即食', serving: 150, n: [60, 3.5, 3.2, 4.5, 50, 0], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 100, pg: 'dairy', tags: [] },
  { id: 'sweet-yogurt', name: '含糖酸奶', cat: 'dairy', cook: '即食', serving: 150, n: [90, 3, 2.8, 14, 55, 0], veg: 0, fruit: 0, whole: 0, sugar: 8, dairy: 100, pg: 'dairy', tags: ['高糖'] },
  { id: 'soy-milk', name: '无糖豆浆', aliases: ['豆浆'], cat: 'dairy', cook: '煮', serving: 300, n: [31, 3, 1.6, 1.2, 15, 0.4], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'soy', tags: [] },
  { id: 'tofu', name: '北豆腐', aliases: ['豆腐'], cat: 'dairy', cook: '煮', serving: 150, n: [116, 12.2, 4.8, 3, 7, 0.5], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'soy', tags: [] },
  { id: 'nuts', name: '混合坚果', aliases: ['坚果'], cat: 'dairy', cook: '即食', serving: 25, n: [600, 20, 50, 20, 150, 8], veg: 0, fruit: 0, whole: 0, sugar: 2, dairy: 0, pg: 'soy', tags: ['高脂'] },

  // ---------- 零食饮料 ----------
  { id: 'bubble-tea', name: '珍珠奶茶', aliases: ['奶茶'], cat: 'snack', cook: '即食', serving: 500, n: [90, 0.6, 3.5, 14, 40, 0.1], veg: 0, fruit: 0, whole: 0, sugar: 10, dairy: 10, pg: 'other', tags: ['高糖', '含糖饮料'] },
  { id: 'cola', name: '可乐', aliases: ['汽水'], cat: 'snack', cook: '即食', serving: 330, n: [43, 0, 0, 10.6, 10, 0], veg: 0, fruit: 0, whole: 0, sugar: 10.6, dairy: 0, pg: 'other', tags: ['高糖', '含糖饮料'] },
  { id: 'chips', name: '薯片', cat: 'snack', cook: '即食', serving: 50, n: [540, 6, 35, 50, 600, 4], veg: 0, fruit: 0, whole: 0, sugar: 2, dairy: 0, pg: 'other', tags: ['油炸', '高盐'] },
  { id: 'cake', name: '巧克力蛋糕', aliases: ['蛋糕'], cat: 'snack', cook: '即食', serving: 80, n: [380, 5, 18, 50, 250, 1], veg: 0, fruit: 0, whole: 0, sugar: 25, dairy: 10, pg: 'other', tags: ['高糖', '高脂'] },
  { id: 'icecream', name: '冰淇淋', aliases: ['雪糕'], cat: 'snack', cook: '即食', serving: 100, n: [200, 3.5, 11, 24, 70, 0.5], veg: 0, fruit: 0, whole: 0, sugar: 20, dairy: 30, pg: 'dairy', tags: ['高糖'] },
  { id: 'beer', name: '啤酒', cat: 'snack', cook: '即食', serving: 500, n: [43, 0.5, 0, 3.6, 10, 0], veg: 0, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'other', tags: ['酒精'] },
];

// 手动添加未知菜品时的分类平均营养估算（每 100g）
export const CATEGORY_PROFILE = {
  staple: { n: [180, 5, 4, 30, 300, 1], veg: 0, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'grain', serving: 200, cook: '家常' },
  meat: { n: [220, 15, 14, 6, 550, 0.8], veg: 10, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'meat', serving: 150, cook: '炒' },
  veg: { n: [80, 2, 5, 6, 400, 2], veg: 85, fruit: 0, whole: 0, sugar: 1, dairy: 0, pg: 'veg', serving: 180, cook: '炒' },
  soup: { n: [50, 3, 3, 3, 430, 0.5], veg: 10, fruit: 0, whole: 0, sugar: 0, dairy: 0, pg: 'other', serving: 300, cook: '煮' },
  fruit: { n: [60, 0.8, 0.3, 14, 3, 1.5], veg: 0, fruit: 100, whole: 0, sugar: 0, dairy: 0, pg: 'fruit', serving: 200, cook: '生' },
  dairy: { n: [80, 4, 3.5, 8, 60, 0], veg: 0, fruit: 0, whole: 0, sugar: 1, dairy: 60, pg: 'dairy', serving: 250, cook: '即食' },
  snack: { n: [350, 5, 15, 45, 300, 1], veg: 0, fruit: 0, whole: 0, sugar: 15, dairy: 0, pg: 'other', serving: 60, cook: '即食' },
};
