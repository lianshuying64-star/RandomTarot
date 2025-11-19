// utils/random.js - 保留算法选择，固定正逆位算法
class AdvancedRandomGenerator {
  constructor(seed = Date.now()) {
    this.seed = Number(seed) || Date.now();
    this.methods = ['lcg', 'xorshift', 'mersenne'];
    // 🔥 为正逆位固定使用独立的Xorshift算法
    this.positionSeed = this._generatePositionSeed(this.seed);
  }
  
  // 为正逆位生成独立种子
  _generatePositionSeed(baseSeed) {
    // 使用完全不同的参数确保独立性
    return (baseSeed * 1664525 + 1013904223) & 0x7FFFFFFF;
  }
  
  // ==================== 多种随机算法（保留） ====================
  
  // LCG算法
  lcg(seed = this.seed) {
    const a = 1103515245;
    const c = 12345;
    const m = 2**31;
    return (seed * a + c) % m;
  }
  
  // Xorshift算法
  xorshift(seed = this.seed) {
    let x = seed;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    return x < 0 ? ~x + 1 : x;
  }
  
  // 梅森旋转
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
  
  // 生成随机整数（保留算法选择）
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
  
  // 🔥 固定：正逆位使用独立的Xorshift算法（高质量随机）
  randomBool() {
    // 使用独立的Xorshift算法生成正逆位
    this.positionSeed = this._xorshiftPosition(this.positionSeed);
    return (this.positionSeed % 2) === 1;
  }
  
  // 专门为正逆位优化的Xorshift
  _xorshiftPosition(seed) {
    let x = seed;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    return x < 0 ? ~x + 1 : x;
  }
  
  // ==================== 塔罗牌专用方法 ====================
  
  // 抽单张牌
  drawTarotCard(method = 'auto') {
    const cardIndex = this.randomInt(78, method);  // 使用选择的算法
    const isReversed = this.randomBool();          // 🔥 固定使用高质量正逆位算法
    
    return {
      cardIndex,
      isReversed,
      randomSeed: this.seed,
      positionSeed: this.positionSeed,
      method: method === 'auto' ? this.selectRandomMethod() : method
    };
  }
  
  // 批量抽牌
  drawMultipleCards(count = 1, method = 'auto') {
    const cards = [];
    const selectedMethod = method === 'auto' ? this.selectRandomMethod() : method;
    
    for (let i = 0; i < count; i++) {
      const cardIndex = this.randomInt(78, selectedMethod);  // 使用选择的算法
      const isReversed = this.randomBool();                  // 🔥 固定正逆位算法
      
      cards.push({
        cardIndex,
        isReversed,
        randomSeed: this.seed,
        positionSeed: this.positionSeed,
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
  
  // ==================== 测试方法 ====================
  
  // 测试正逆位分布
  testPositionDistribution(testCount = 1000) {
    let uprightCount = 0;
    let reversedCount = 0;
    
    for (let i = 0; i < testCount; i++) {
      const isReversed = this.randomBool();
      if (isReversed) {
        reversedCount++;
      } else {
        uprightCount++;
      }
    }
    
    const uprightPercent = (uprightCount / testCount * 100).toFixed(2);
    const reversedPercent = (reversedCount / testCount * 100).toFixed(2);
    
    console.log(`🔍 正逆位分布测试 (${testCount}次):`);
    console.log(`⬆️  正位: ${uprightCount} (${uprightPercent}%)`);
    console.log(`🔁 逆位: ${reversedCount} (${reversedPercent}%)`);
    console.log(`📊 分布偏差: ${Math.abs(50 - parseFloat(uprightPercent)).toFixed(2)}%`);
    
    return {
      uprightCount,
      reversedCount,
      uprightPercent,
      reversedPercent,
      deviation: Math.abs(50 - parseFloat(uprightPercent))
    };
  }
  
  // 获取当前状态
  getCurrentSeed() {
    return this.seed;
  }
  
  // 设置新种子
  setSeed(newSeed) {
    this.seed = Number(newSeed) || Date.now();
    this.positionSeed = this._generatePositionSeed(this.seed);
    return this.seed;
  }
}


export { AdvancedRandomGenerator };