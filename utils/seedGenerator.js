// utils/seedGenerator.js
import { AdvancedRandomGenerator } from './random.js';

class SeedGenerator {
  // 数字种子
  static fromNumber(num) {
    return Number(num) || Date.now();
  }
  
  // 文字种子
  static fromText(text) {
    let seed = 0;
    for (let i = 0; i < text.length; i++) {
      seed = (seed * 31 + text.charCodeAt(i)) % (2**31);
    }
    return seed;
  }
  
  // 问题种子 - 使用完整的随机生成器
  static fromQuestion(question, length = 5) {
    const random = new AdvancedRandomGenerator(Date.now());
    let seed = 0;
    
    for (let i = 0; i < length; i++) {
      const index = random.randomInt(question.length);
      seed = (seed * 31 + question.charCodeAt(index)) % (2**31);
    }
    return seed;
  }
  
  // 时间种子
  static fromDateTime(customTime = null) {
    const date = customTime ? new Date(customTime) : new Date();
    return date.getTime();
  }
  
  // 复合种子
  static compositeSeed(sources) {
    let finalSeed = 0;
    sources.forEach(source => {
      if (typeof source === 'number') {
        finalSeed ^= source;
      } else if (typeof source === 'string') {
        finalSeed ^= this.fromText(source);
      }
    });
    return Math.abs(finalSeed);
  }
  
  // 随机参数生成
  static randomParams(baseSeed) {
    const random = new AdvancedRandomGenerator(baseSeed);
    const methods = ['LCG算法', '异或位移', '梅森旋转'];
    const algorithms = ['lcg', 'xorshift', 'mersenne'];
    
    return {
      method: methods[random.randomInt(methods.length, 'lcg')], // 使用LCG确保稳定
      cards: random.randomInt(5, 'lcg') + 1, // 1-5张牌
      algorithm: algorithms[random.randomInt(algorithms.length, 'lcg')]
    };
  }
}

export { SeedGenerator };