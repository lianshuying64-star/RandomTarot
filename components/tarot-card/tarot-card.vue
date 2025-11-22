<!-- components/tarot-card/tarot-card.vue -->
<template>
  <view class="tarot-card">
    <view class="card-inner" :class="{ reversed: showReversed }">
      <!-- 牌背面 -->
      <view class="card-back" v-show="!showFront">
        <image 
          v-if="backImageUrl" 
          :src="backImageUrl" 
          class="card-image back-image"
          mode="aspectFit"
        />
        <text v-else class="card-back-icon">🔮</text>
      </view>
      
      <!-- 牌正面 -->
      <view class="card-front" v-show="showFront">
        <!-- 图片模式 -->
        <view v-show="displayMode === 'image'" class="image-mode">
          <image 
            v-if="card.imageUrl" 
            :src="card.imageUrl" 
            class="card-image front-image"
            :class="{ 'reversed-image': reversed }"
            mode="aspectFit"
            @click="switchToText"
            @error="onImageError"
			@load="onImageLoad"
          />
          <!-- 点击提示 -->
          <view class="click-hint" @click="switchToText">
            <text>👆 点击查看牌义</text>
          </view>
        </view>
        
        <!-- 文字模式 -->
        <view v-show="displayMode === 'text'" class="text-mode">
          <view class="text-content">
            <!-- 基本信息 -->
            <view class="card-header">
              <text class="card-name">{{ card.name }}</text>
              <text class="card-reversed" v-if="reversed">🔁 逆位</text>
              <text class="card-upright" v-else>⬆️ 正位</text>
            </view>
            
            <!-- 牌阵位置 -->
            <view class="spread-position" v-if="spreadPosition">
              <text class="position-title">{{ spreadPosition }}</text>
              <text class="position-desc">{{ spreadDescription }}</text>
            </view>
            
            <!-- 核心含义 -->
            <view class="meaning-section">
              <text class="section-title">核心含义</text>
              <text class="meaning-text">{{ currentMeaning }}</text>
            </view>
            
            <!-- 详细解析（可扩展） -->
            <view class="detail-section" v-if="showDetails">
              <text class="section-title">详细解析</text>
              <text class="detail-text">{{ card.detailedAnalysis || '暂无详细解析' }}</text>
            </view>
            
            <!-- 符号象征 -->
            <view class="symbol-section" v-if="card.symbolism">
              <text class="section-title">符号象征</text>
              <text class="symbol-text">{{ card.symbolism }}</text>
            </view>
          </view>
          
          <!-- 操作按钮 -->
          <view class="action-buttons">
            <button class="mode-btn" @click="switchToImage">📷 查看图片</button>
            <button class="detail-btn" @click="toggleDetails">
              {{ showDetails ? '收起' : '展开' }}详解
            </button>
            <!-- 🔥 预留：更多解析接口 -->
            <button class="more-btn" v-if="onMoreAnalysis" @click="handleMoreAnalysis">
              更多解析
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { TarotImageManager } from '@/utils/tarotData.js';

export default {
  props: {
    card: {
      type: Object,
      required: true,
      default: () => ({
        id: 0,
        name: '',
        enName: '',
        meaning: '',
        reverse: '',
        imageUrl: '',
        // 🔥 预留扩展字段
        detailedAnalysis: '', // 详细解析
        symbolism: '',        // 符号象征
        astrology: '',        // 占星对应
        numerology: '',       // 数字意义
        element: ''           // 元素属性
      })
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
    },
    autoFlip: {
      type: Boolean,
      default: true
    },
    // 🔥 预留：更多解析的回调函数
    onMoreAnalysis: {
      type: Function,
      default: null
    }
  },
  
  data() {
    return {
      showFront: this.autoFlip,
      showReversed: this.reversed,
      imageError: false,
      backImageUrl: TarotImageManager.getBackImage(),
      displayMode: 'image', // 'image' 或 'text'
      showDetails: false    // 是否显示详细解析
    };
  },
  
  computed: {
    currentMeaning() {
      return this.reversed ? this.card.reverse : this.card.meaning;
    }
  },
  
  methods: {
    handleClick() {
      if (!this.showFront) {
        this.showFront = true;
        this.$emit('flip', this.card);
      }
    },
    
    // 🔥 切换到文字模式
    switchToText() {
      this.displayMode = 'text';
      this.$emit('mode-change', { mode: 'text', card: this.card });
    },
    
    // 🔥 切换到图片模式
    switchToImage() {
      this.displayMode = 'image';
      this.showDetails = false;
      this.$emit('mode-change', { mode: 'image', card: this.card });
    },
    
    // 🔥 切换详细解析显示
    toggleDetails() {
      this.showDetails = !this.showDetails;
      this.$emit('detail-toggle', { 
        showDetails: this.showDetails, 
        card: this.card 
      });
    },
    
    // 🔥 处理更多解析
    handleMoreAnalysis() {
      if (this.onMoreAnalysis) {
        this.onMoreAnalysis(this.card);
      } else {
        // 默认行为：发射事件
        this.$emit('more-analysis', this.card);
      }
    },
    
    onImageError() {
      this.imageError = true;
      this.displayMode = 'text'; // 图片加载失败自动切换到文字模式
      console.warn('图片加载失败:', this.card.imageUrl);
    },
    
    reset() {
      this.showFront = this.autoFlip;
      this.showReversed = this.reversed;
      this.imageError = false;
      this.displayMode = 'image';
      this.showDetails = false;
    }
  },
  
  watch: {
    card() {
      this.reset();
    },
    
    reversed(newVal) {
      this.showReversed = newVal;
    }
  },
  
  mounted() {
    console.log('=== 卡片组件调试 ===');
    console.log('props.card:', this.card);
    console.log('有imageUrl吗?', !!this.card.imageUrl);
    console.log('imageUrl值:', this.card.imageUrl);
    
    // 检查卡片对象的所有属性
    console.log('卡片所有属性:', Object.keys(this.card));
  }
};
</script>

<style scoped>
@import url("tarot-card.css");
</style>