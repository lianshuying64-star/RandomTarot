<template>
  <view class="popup-selector">
    <view class="selector-trigger" @click="showPopup">
      <text class="trigger-text">{{ selectedText || placeholder }}</text>
      <uni-icons type="arrowdown" size="16" color="#666"></uni-icons>
    </view>
    
    <uni-popup ref="popup" type="bottom" background-color="#fff">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ title }}</text>
          <uni-icons type="close" size="20" @click="closePopup"></uni-icons>
        </view>
        
        <scroll-view scroll-y class="options-list" :style="{ maxHeight: maxHeight }">
          <view 
            v-for="item in options" 
            :key="item.value"
            :class="['option-item', { active: value === item.value }]"
            @click="selectOption(item)"
          >
            <text class="option-text">{{ item.text }}</text>
            <text class="option-desc" v-if="item.description">{{ item.description }}</text>
            <uni-icons v-if="value === item.value" type="checkmarkempty" color="#8B4513"></uni-icons>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'PopupSelector',
  
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    title: {
      type: String,
      default: '请选择'
    },
    maxHeight: {
      type: String,
      default: '600rpx'
    }
  },
  
  computed: {
    selectedText() {
      const selected = this.options.find(item => item.value === this.value);
      return selected ? selected.text : '';
    }
  },
  
  methods: {
    showPopup() {
      this.$refs.popup.open();
    },
    
    closePopup() {
      this.$refs.popup.close();
    },
    
    selectOption(item) {
      this.$emit('input', item.value);
      this.$emit('change', item.value);
      this.closePopup();
    }
  }
};
</script>

<style scoped>
.popup-selector {
  width: 100%;
}

.selector-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  background: #fff;
}

.trigger-text {
  font-size: 28rpx;
  color: #333;
}

.trigger-text:empty::before {
  content: attr(placeholder);
  color: #999;
}

.popup-content {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 40rpx 30rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.options-list {
  max-height: 600rpx;
}

.option-item {
  display: flex;
  flex-direction: column;
  padding: 25rpx 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
  position: relative;
}

.option-item.active {
  background: #f8f4f0;
}

.option-item:last-child {
  border-bottom: none;
}

.option-text {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.option-desc {
  font-size: 24rpx;
  color: #666;
}

.option-item.active .option-text {
  color: #8B4513;
  font-weight: bold;
}
</style>