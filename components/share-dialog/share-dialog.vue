<template>
  <uni-popup ref="sharePopup" type="bottom" background-color="#fff">
    <view class="share-dialog">
      <!-- 标题 -->
      <view class="dialog-header">
        <text class="dialog-title">分享抽牌结果</text>
        <uni-icons type="close" size="24" color="#666" @click="closeDialog"></uni-icons>
      </view>

      <!-- 分享选项 -->
      <view class="share-options">
        <text class="section-title">分享格式</text>
        <radio-group @change="onFormatChange">
          <view class="option-item" v-for="format in shareFormats" :key="format.value">
            <radio :value="format.value" :checked="selectedFormat === format.value" color="#8B4513" />
            <text class="option-label">{{ format.label }}</text>
            <text class="option-desc">{{ format.description }}</text>
          </view>
        </radio-group>
      </view>

      <!-- AI提示词选择 -->
      <view class="prompt-options" v-if="selectedFormat === 'withPrompt'">
        <text class="section-title">AI提示词模板</text>
        <picker 
          :value="selectedPrompt" 
          :range="promptOptions" 
          range-key="label"
          @change="onPromptChange"
        >
          <view class="picker-trigger">
            <text>{{ selectedPromptLabel }}</text>
            <uni-icons type="arrowdown" size="16" color="#666"></uni-icons>
          </view>
        </picker>
      </view>

      <!-- 预览 -->
      <view class="preview-section">
        <text class="section-title">预览</text>
        <scroll-view scroll-y class="preview-content">
          <text class="preview-text">{{ shareContentPreview }}</text>
        </scroll-view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="cancel-btn" @click="closeDialog">取消</button>
        <button class="confirm-btn" @click="confirmShare">复制内容</button>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import { ShareManager } from '@/utils/shareManager.js';

export default {
  name: 'ShareDialog',
  
  data() {
    return {
      selectedFormat: 'simple',
      selectedPrompt: 'basic',
      shareFormats: [
        { value: 'simple', label: '简洁版', description: '仅包含牌面信息' },
        { value: 'withPrompt', label: 'AI解读版', description: '包含AI提示词，便于生成解读' }
      ],
      promptOptions: []
    };
  },
  
  computed: {
    selectedPromptLabel() {
      const prompt = this.promptOptions.find(p => p.value === this.selectedPrompt);
      return prompt ? prompt.label : '选择提示词';
    },
    
    shareContentPreview() {
      if (!this.cards || this.cards.length === 0) return '暂无数据';
      
      if (this.selectedFormat === 'simple') {
        return ShareManager.generateSimpleResult(this.cards, this.question);
      } else {
        return ShareManager.generateShareContent(
          this.cards, 
          this.question, 
          this.seed, 
          this.selectedPrompt
        );
      }
    }
  },
  
  methods: {
    open(cards, question, seed) {
      this.cards = cards;
      this.question = question || '';
      this.seed = seed;
      this.promptOptions = ShareManager.getAvailablePrompts();
      this.$refs.sharePopup.open();
    },
    
    closeDialog() {
      this.$refs.sharePopup.close();
    },
    
    onFormatChange(e) {
      this.selectedFormat = e.detail.value;
    },
    
    onPromptChange(e) {
      const index = e.detail.value;
      this.selectedPrompt = this.promptOptions[index].value;
    },
    
    confirmShare() {
      let shareContent;
      
      if (this.selectedFormat === 'simple') {
        shareContent = ShareManager.generateSimpleResult(this.cards, this.question);
      } else {
        shareContent = ShareManager.generateShareContent(
          this.cards, 
          this.question, 
          this.seed, 
          this.selectedPrompt
        );
      }
      
      uni.setClipboardData({
        data: shareContent,
        success: () => {
          uni.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          });
          this.closeDialog();
        },
        fail: () => {
          uni.showToast({
            title: '复制失败',
            icon: 'error'
          });
        }
      });
    }
  },
};
</script>


<style>
@import 'share-dialog.css'
</style>