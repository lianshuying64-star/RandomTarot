// utils/random.js
// 完整的随机算法库 - 支持多种算法和正逆位随机

class AdvancedRandomGenerator {
  constructor(seed = Date.now()) {
    this.seed = Number(seed) || Date.now();
    this.methods = ['lcg', 'xorshift', 'mersenne'];
  }
  
  // ==================== 多种随机算法 ====================
  
  // LCG算法 (快速、可复现)
  lcg(seed = this.seed) {
    const a = 1103515245;
    const c = 12345;
    const m = 2**31;
    return (seed * a + c) % m;
  }
  
  // Xorshift算法 (高质量随机)
  xorshift(seed = this.seed) {
    let x = seed;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    return x < 0 ? ~x + 1 : x;
  }
  
  // 简化版梅森旋转
  mersenne(seed = this.seed) {
    const n = 624;
    const mt = new Array(n);
    mt[0] = seed >>> 0;
    
    for (let i = 1; i < n; i++) {
      mt[i] = (1812433253 * (mt[i-1] ^ (mt[i-1] >>> 30)) + i) >>> 0;
    }
    
    return mt[n-1];
  }
  
  // ==================== 核心随机方法 ====================
  
  // 选择随机算法
  selectRandomMethod() {
    const methodSeed = this.lcg(this.seed);
    const methodIndex = methodSeed % this.methods.length;
    return this.methods[methodIndex];
  }
  
  // 生成随机整数
  randomInt(max = 78, method = 'auto') {
    const selectedMethod = method === 'auto' ? this.selectRandomMethod() : method;
    let randomNum;
    
    switch(selectedMethod) {
      case 'lcg':
        this.seed = this.lcg(this.seed);
        randomNum = this.seed;
        break;
      case 'xorshift':
        this.seed = this.xorshift(this.seed);
        randomNum = this.seed;
        break;
      case 'mersenne':
        this.seed = this.mersenne(this.seed);
        randomNum = this.seed;
        break;
      default:
        this.seed = this.lcg(this.seed);
        randomNum = this.seed;
    }
    
    return randomNum % max;
  }
  
  // 🔥 正逆位随机 - 使用相同的随机序列消费
  randomBool(method = 'auto') {
    return this.randomInt(2, method) === 1;
  }
  
  // 从字符串中随机抽取字符
  randomFromString(str, length = 1, method = 'auto') {
    let result = '';
    for (let i = 0; i < length; i++) {
      const index = this.randomInt(str.length, method);
      result += str.charAt(index);
    }
    return result;
  }
  
  // ==================== 塔罗牌专用方法 ====================
  
  // 抽单张牌
  drawTarotCard(method = 'auto') {
    const cardIndex = this.randomInt(78, method);      // 消费第一个随机数选牌
    const isReversed = this.randomBool(method);        // 消费第二个随机数决定正逆
    const randomSeed = this.seed;                      // 记录当前种子
    
    return {
      cardIndex,
      isReversed,
      randomSeed,
      method: method === 'auto' ? this.selectRandomMethod() : method
    };
  }
  
  // 批量抽牌
  drawMultipleCards(count = 1, method = 'auto') {
    const cards = [];
    const selectedMethod = method === 'auto' ? this.selectRandomMethod() : method;
    
    for (let i = 0; i < count; i++) {
      const cardIndex = this.randomInt(78, selectedMethod);    // 选牌
      const isReversed = this.randomBool(selectedMethod);      // 正逆位
      
      cards.push({
        cardIndex,
        isReversed,
        randomSeed: this.seed,
        method: selectedMethod,
        position: i
      });
    }
    
    return cards;
  }
  
  // 带牌阵的抽牌
  drawWithSpread(spreadConfig, method = 'auto') {
    const cardCount = spreadConfig?.cardCount || 1;
    const cards = this.drawMultipleCards(cardCount, method);
    
    // 添加牌阵信息
    return cards.map((card, index) => ({
      ...card,
      spreadPosition: spreadConfig?.positions?.[index] || `位置${index + 1}`,
      spreadDescription: spreadConfig?.descriptions?.[index] || ''
    }));
  }
  
  // ==================== 工具方法 ====================
  
  // 获取当前种子
  getCurrentSeed() {
    return this.seed;
  }
  
  // 设置新种子
  setSeed(newSeed) {
    this.seed = Number(newSeed) || Date.now();
    return this.seed;
  }
  
  // 复制实例（用于并行随机）
  clone() {
    return new AdvancedRandomGenerator(this.seed);
  }
}

// 默认导出
export { AdvancedRandomGenerator };

// 创建默认实例
export const defaultRandom = new AdvancedRandomGenerator();