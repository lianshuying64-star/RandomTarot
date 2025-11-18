<template>
  <view class="tarot-card">
    <view class="card-content">
      <!-- 牌信息头部 -->
      <view class="card-header">
        <text class="card-name">{{ card.name }}</text>
        <text class="card-reversed" v-if="isReversed">🔁 逆位</text>
        <text class="card-upright" v-else>⬆️ 正位</text>
      </view>
      
      <!-- 牌阵位置信息 -->
      <view class="spread-position" v-if="spreadPosition">
        <text class="position-title">{{ spreadPosition }}</text>
        <text class="position-desc">{{ spreadDescription }}</text>
      </view>
      
      <!-- 牌的含义 -->
      <view class="card-meaning">
        <text class="meaning-text">{{ currentMeaning }}</text>
      </view>
      
      <!-- 英文名称 -->
      <view class="card-footer">
        <text class="english-name">{{ card.enName }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      required: true
    },
    reversed: {
      type: Boolean,
      default: false
    },
    spreadPosition: {
      type: String,
      default: ''
    },
    spreadDescription: {
      type: String,
      default: ''
    }
  },
  
  data() {
    return {
      isReversed: this.reversed
    };
  },
  
  computed: {
    currentMeaning() {
      return this.isReversed ? this.card.reverse : this.card.meaning;
    }
  }
};
</script>

<style>
@import './tarot-card.css';
</style>
