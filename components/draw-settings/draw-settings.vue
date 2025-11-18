<template>
  <view class="draw-settings">
    <!-- 抽牌数量设置 - 横向布局 -->
        <uni-forms-item label="抽牌数量" name="cardCount">
          <view class="count-selector">
            <view class="quick-counts">
              <button 
                v-for="count in quickCounts" 
                :key="count"
                :class="['count-btn', { active: cardCount === count }]"
                @click="setCardCount(count)"
              >
                {{ count }}张
              </button>
            </view>
            <view class="custom-count">
              <text class="custom-label">自定义:</text>
              <uni-number-box 
                v-model="customCount" 
                :min="1" 
                :max="maxCards" 
                @change="setCustomCount"
              />
            </view>
          </view>
        </uni-forms-item>
    
    <!-- 牌阵模式选择 -->
    <uni-forms-item label="牌阵模式" name="spreadMode">
      <view class="spread-selector-container">
        <uni-data-select
          v-model="spreadMode"
          :localdata="spreadModes"
          @change="onSpreadModeChange"
          placeholder="选择牌阵"
        />
        <text class="spread-info" v-if="currentSpread">
          {{ currentSpread.cardCount }}张 - {{ currentSpread.description }}
        </text>
      </view>
    </uni-forms-item>
    
    <!-- 高级设置 -->
    <uni-collapse>
      <uni-collapse-item title="高级设置">
        <!-- 随机算法选择 -->
        <uni-forms-item label="随机算法" name="algorithm">
          <uni-data-select
            v-model="algorithm"
            :localdata="algorithms"
            @change="onAlgorithmChange"
          />
        </uni-forms-item>
        
        <!-- 自动正逆位 -->
        <uni-forms-item label="正逆位" name="autoReverse">
          <switch :checked="autoReverse" @change="onAutoReverseChange" />
          <text class="switch-label">{{ autoReverse ? '自动随机' : '全部正位' }}</text>
        </uni-forms-item>
        
        <!-- 牌组选择 -->
        <uni-forms-item label="使用牌组" name="deckType">
          <uni-data-select
            v-model="deckType"
            :localdata="deckTypes"
            @change="onDeckTypeChange"
          />
        </uni-forms-item>
      </uni-collapse-item>
    </uni-collapse>
  </view>
</template>

<script>
import { SpreadManager } from '@/utils/spreadManager.js';

export default {
  name: 'DrawSettings',
  
  data() {
    return {
      // 基础设置
      cardCount: 1,
      customCount: 1,
      spreadMode: 'single',
      
      // 高级设置
      algorithm: 'auto',
      autoReverse: true,
      deckType: 'full',
      
      // 配置数据
      quickCounts: [1, 3, 5, 7],
      maxCards: 20,
      algorithms: [
            { value: 'auto', text: '自动选择' },
            { value: 'lcg', text: 'LCG算法' },
            { value: 'xorshift', text: '异或位移' },
            { value: 'mersenne', text: '梅森旋转' }
          ],
      deckTypes: [
        { value: 'full', text: '完整78张' },
        { value: 'major', text: '仅大阿卡那' },
        { value: 'minor', text: '仅小阿卡那' }
      ]
    };
  },
  
  computed: {
    spreadModes() {
      return SpreadManager.getAllSpreads();
    },
    
    currentSpread() {
      return SpreadManager.getSpreadConfig(this.spreadMode);
    }
  },
  
  methods: {
    // 数量设置
    setCardCount(count) {
      this.cardCount = count;
      this.customCount = count;
      this.emitSettings();
    },
    
    setCustomCount(value) {
      this.cardCount = value;
      this.emitSettings();
    },
    
    // 牌阵设置
    onSpreadModeChange(e) {
      this.spreadMode = e;
      if (this.currentSpread) {
        this.cardCount = this.currentSpread.cardCount;
        this.customCount = this.cardCount;
      }
      this.emitSettings();
    },
    
    // 高级设置
    onAlgorithmChange(e) {
      this.algorithm = e;
      this.emitSettings();
    },
    
    onAutoReverseChange(e) {
      this.autoReverse = e.detail.value;
      this.emitSettings();
    },
    
    onDeckTypeChange(e) {
      this.deckType = e;
      this.emitSettings();
    },
    
    // 发射设置变更
    emitSettings() {
      this.$emit('settings-change', this.getSettings());
    },
    
    // 获取完整设置
    getSettings() {
      return {
        cardCount: this.cardCount,
        spreadMode: this.spreadMode,
        algorithm: this.algorithm,
        autoReverse: this.autoReverse,
        deckType: this.deckType,
        spreadConfig: this.currentSpread
      };
    },
    
    // 重置设置
    resetSettings() {
      this.cardCount = 1;
      this.customCount = 1;
      this.spreadMode = 'single';
      this.algorithm = 'auto';
      this.autoReverse = true;
      this.deckType = 'full';
      this.emitSettings();
    }
  },
  
  mounted() {
    // 初始发射一次设置
    this.$nextTick(() => {
      this.emitSettings();
    });
  }
};
</script>

<style scoped>
.draw-settings {
  padding: 20rpx 0;
}

.count-selector {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.quick-counts {
  display: flex;
  gap: 15rpx;
  flex-wrap: nowrap; /* 改为不换行 */
  overflow-x: auto; /* 横向滚动 */
  padding: 10rpx 0;
}

.quick-counts::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}

.count-btn {
  padding: 20rpx 30rpx;
  border: 2rpx solid #ddd;
  border-radius: 15rpx;
  background: white;
  font-size: 26rpx;
  white-space: nowrap; /* 不换行 */
  flex-shrink: 0; /* 不收缩 */
}

.count-btn.active {
  background: #8B4513;
  color: white;
  border-color: #8B4513;
}

.custom-count {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 10rpx 0;
}

.custom-label {
  font-size: 26rpx;
  color: #666;
  min-width: 120rpx;
}

.spread-selector-container {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.spread-info {
  font-size: 24rpx;
  color: #888;
  background: #f8f8f8;
  padding: 15rpx;
  border-radius: 10rpx;
}

.switch-label {
  font-size: 26rpx;
  color: #666;
  margin-left: 20rpx;
}
</style>