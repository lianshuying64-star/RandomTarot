<template>
  <view class="seed-input">
    <!-- 当前种子显示 -->
    <uni-notice-bar 
      v-if="currentSeedValue" 
      :text="`当前种子: ${currentSeedValue}`" 
      background-color="#f0f9ff" 
      color="#1890ff"
      single
    />
    
    <!-- 数字种子 -->
    <uni-forms-item label="数字种子" name="numberSeed">
      <uni-easyinput 
        v-model="numberSeed" 
        type="number" 
        placeholder="输入任意数字作为种子"
        @input="emitNumberSeed"
        clearable
      />
    </uni-forms-item>
    
    <!-- 文字种子 -->
    <uni-forms-item label="文字种子" name="textSeed">
      <uni-easyinput 
        v-model="textSeed" 
        placeholder="输入中英文文字作为种子"
        @input="emitTextSeed"
        clearable
      />
    </uni-forms-item>
    
    <!-- 问题种子 -->
    <uni-forms-item label="问题种子" name="questionSeed">
      <uni-easyinput 
        v-model="questionSeed" 
        type="textarea" 
        placeholder="输入您的问题，将随机抽取字符生成种子"
        @input="emitQuestionSeed"
        clearable
      />
    </uni-forms-item>
    
    <!-- 时间种子 - 修复显示问题 -->
    <uni-forms-item label="时间种子" name="timeSeed">
      <view class="time-picker-wrapper">
        <popup-selector
          v-model="timeSeed"
          :options="timeOptions"
          placeholder="选择时间种子"
          title="选择时间"
          maxHeight="800rpx"
        >
          <template #default>
            <uni-datetime-picker 
              type="datetime"
              :value="timeSeed" 
              @change="emitTimeSeed"
              :border="false"
            />
          </template>
        </popup-selector>
      </view>
    </uni-forms-item>
    
    <!-- 快速种子按钮 -->
    <view class="quick-seed-buttons">
      <uni-tag 
        text="当前时间" 
        type="primary" 
        @click="useCurrentTime"
        size="small"
      />
      <uni-tag 
        text="随机数字" 
        type="success" 
        @click="useRandomNumber"
        size="small"
      />
      <uni-tag 
        text="清空所有" 
        type="error" 
        @click="clearAll"
        size="small"
      />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      numberSeed: '',
      textSeed: '',
      questionSeed: '',
      timeSeed: '',
      currentSeedValue: null
    };
  },
  
  methods: {
	  
	// 🔥 添加获取问题的方法
	    getQuestion() {
	      return this.questionSeed.trim(); // 返回去除空格的问题文本
	    },
	    
	    // 🔥 在问题变更时发射事件
	    emitQuestionSeed() {
	      const question = this.questionSeed.trim();
	      this.currentSeedValue = question ? `问题: ${question.substring(0, 15)}...` : null;
	      this.$emit('question-change', question);
	    },
	  
    emitNumberSeed() {
      if (this.numberSeed) {
        this.currentSeedValue = `数字: ${this.numberSeed}`;
        this.$emit('seed-change', this.numberSeed);
        this.showFeedback('数字种子已设置');
      }
    },
    
    emitTextSeed() {
      if (this.textSeed) {
        this.currentSeedValue = `文字: ${this.textSeed.substring(0, 10)}${this.textSeed.length > 10 ? '...' : ''}`;
        this.$emit('seed-change', this.textSeed);
        this.showFeedback('文字种子已设置');
      }
    },
    
    emitQuestionSeed() {
      if (this.questionSeed) {
        this.currentSeedValue = `问题: ${this.questionSeed.substring(0, 10)}...`;
        this.$emit('question-change', this.questionSeed);
      }
    },
    
    emitTimeSeed(e) {
      this.timeSeed = e;
      this.currentSeedValue = `时间: ${this.formatTime(e)}`;
      this.$emit('time-change', this.timeSeed);
      this.showFeedback('时间种子已设置');
    },
    
    useCurrentTime() {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      this.timeSeed = now;
      this.emitTimeSeed(now);
    },
    
    useRandomNumber() {
      this.numberSeed = Math.floor(Math.random() * 1000000).toString();
      this.emitNumberSeed();
    },
    
    clearAll() {
      this.numberSeed = '';
      this.textSeed = '';
      this.questionSeed = '';
      this.timeSeed = '';
      this.currentSeedValue = null;
      this.$emit('seed-change', Date.now());
	  this.$emit('question-change', ''); // 🔥 发射空问题
      this.showFeedback('已重置为默认种子');
    },
    
    formatTime(timeStr) {
      if (!timeStr) return '';
      return timeStr.replace('T', ' ').replace(/\.\d+Z$/, '');
    },
    
    showFeedback(message) {
      uni.showToast({
        title: message,
        icon: 'success',
        duration: 1500
      });
    }
  }
};
</script>

<style scoped>
@import'seed-input.css'
</style>