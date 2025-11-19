// utils/shareManager.js
class ShareManager {
  // 默认提示词模板
  static defaultPrompts = {
    basic: `请为以下塔罗牌组合提供专业解读：`,
    
    detailed: `作为专业塔罗师，请分析以下牌阵：
- 结合每张牌的正逆位含义
- 分析牌阵的整体能量流动  
- 给出具体的建议和启示
- 用温暖而专业的语言回复`,
    
    aiOptimized: `# 塔罗牌解读请求

## 背景信息
{question}

## 抽牌结果
{cards}

## 解读要求
1. 分析每张牌在当前位置的意义
2. 解读正逆位对含义的影响
3. 分析牌阵的整体故事线
4. 给出具体的生活建议
5. 用温暖、鼓励的语气回复

请开始解读：`
  };

  // 🔥 修复：正确显示提示词
  static generateShareContent(cards, question = '', seed = '', promptType = 'basic') {
    const prompt = this.defaultPrompts[promptType] || this.defaultPrompts.basic;
    
    // 构建牌信息
    const cardsText = cards.map(cardData => {
      const position = cardData.spreadPosition ? `【${cardData.spreadPosition}】` : '';
      const reverseText = cardData.isReversed ? '逆位' : '正位';
      return `${position} ${cardData.card.name} ${reverseText}`;
    }).join('\n');

    // 🔥 修复：正确构建分享内容
    let shareContent = `🔮 塔罗牌抽牌结果\n\n`;
    
    // 添加问题
    if (question) {
      shareContent += `问题: ${question}\n\n`;
    }
    
    // 🔥 修复：始终显示抽牌结果
    shareContent += `抽牌结果:\n${cardsText}\n\n`;
    
    // 🔥 修复：始终显示AI提示词
    shareContent += `--- AI解读提示词 ---\n`;
    shareContent += this._replacePromptPlaceholders(prompt, question, cardsText);
    
    // 添加元数据
    shareContent += `\n---\n`;
    shareContent += `种子: ${seed}\n`;
    shareContent += `时间: ${new Date().toLocaleString()}`;

    return shareContent;
  }

  // 生成纯文本结果
  static generateSimpleResult(cards, question = '') {
    let content = `🎴 塔罗牌抽牌结果\n\n`;
    
    if (question) {
      content += `问题: ${question}\n\n`;
    }
    
    content += `抽到的牌:\n`;
    cards.forEach((cardData, index) => {
      const position = cardData.spreadPosition ? `【${cardData.spreadPosition}】` : '';
      const reverseText = cardData.isReversed ? '🔁 逆位' : '⬆️ 正位';
      content += `${index + 1}. ${position} ${cardData.card.name} ${reverseText}\n`;
      content += `   含义: ${cardData.isReversed ? cardData.card.reverse : cardData.card.meaning}\n\n`;
    });

    return content;
  }

  // 替换提示词中的占位符
  static _replacePromptPlaceholders(prompt, question, cardsText) {
    return prompt
      .replace(/{question}/g, question || '暂无特定问题')
      .replace(/{cards}/g, cardsText);
  }
  
  // 获取可用的提示词类型
  static getAvailablePrompts() {
    return Object.keys(this.defaultPrompts).map(key => ({
      value: key,
      label: this._getPromptLabel(key),
      description: this.defaultPrompts[key].substring(0, 50) + '...'
    }));
  }

  static _getPromptLabel(key) {
    const labels = {
      basic: '基础解读',
      detailed: '详细分析', 
      aiOptimized: 'AI优化版'
    };
    return labels[key] || key;
  }

  // 预留接口：添加自定义提示词
  static addCustomPrompt(key, content) {
    this.defaultPrompts[key] = content;
  }

  // 预留接口：获取所有提示词
  static getAllPrompts() {
    return this.defaultPrompts;
  }
}

export { ShareManager };