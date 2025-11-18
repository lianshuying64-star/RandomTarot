<template>
  <view class="draw-result">
    <!-- 牌阵信息 -->
    <view class="spread-info" v-if="spreadConfig">
      <text class="spread-name">{{ spreadConfig.name }}牌阵</text>
      <text class="spread-desc">{{ spreadConfig.description }}</text>
    </view>
    
    <!-- 牌结果显示 -->
    <view class="cards-grid">
      <view 
        v-for="(cardData, index) in cards" 
        :key="index"
        class="card-item"
      >
        <!-- 牌位置标签 -->
        <view class="position-label" v-if="cardData.spreadPosition">
          <text class="position-title">{{ cardData.spreadPosition }}</text>
          <text class="position-desc">{{ cardData.spreadDescription }}</text>
        </view>
        
        <!-- 塔罗牌 -->
        <tarot-card 
          :card="cardData.card"
          :reversed="cardData.isReversed"
          :spread-position="cardData.spreadPosition"
          :spread-description="cardData.spreadDescription"
        />
      </view>
    </view>
  </view>
</template>

<script>
import TarotCard from '@/components/tarot-card/tarot-card.vue';

export default {
  name: 'DrawResult',
  
  components: {
    TarotCard
  },
  
  props: {
    cards: {
      type: Array,
      default: () => []
    },
    spreadConfig: {
      type: Object,
      default: null
    }
  }
};
</script>

<style>
@import './draw-result.css';
</style>