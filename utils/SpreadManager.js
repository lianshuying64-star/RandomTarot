// utils/spreadManager.js
// 牌阵管理器
class SpreadManager {
  static spreads = {
    // 单张抽牌
    single: {
      name: '单张抽牌',
      cardCount: 1,
      positions: ['现状'],
      descriptions: ['代表当前问题的核心'],
      description: '简单直接的抽牌方式'
    },
    
    // 三张牌阵
    threecard: {
      name: '三张牌阵', 
      cardCount: 3,
      positions: ['过去', '现在', '未来'],
      descriptions: ['过去的影响', '当前状况', '未来发展'],
      description: '时间线解读法'
    },
    
    // 关系牌阵
    relationship: {
      name: '关系牌阵',
      cardCount: 4,
      positions: ['你', '对方', '关系', '建议'],
      descriptions: ['你的状态', '对方状态', '关系本质', '发展建议'],
      description: '用于关系问题分析'
    }
  };
  
  // 获取牌阵配置
  static getSpreadConfig(spreadType) {
    return this.spreads[spreadType] || this.spreads.single;
  }
  
  // 获取所有牌阵选项
  static getAllSpreads() {
    return Object.keys(this.spreads).map(key => ({
      value: key,
      text: this.spreads[key].name,
      cardCount: this.spreads[key].cardCount,
      description: this.spreads[key].description
    }));
  }
}

export { SpreadManager };