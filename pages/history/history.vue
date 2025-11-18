<template>
  <view class="history-container">
    <view class="header">
      <text class="title">📜 抽牌历史</text>
      <text class="subtitle">共 {{ historyList.length }} 次记录</text>
    </view>

    <view class="history-list" v-if="historyList.length > 0">
      <view 
        class="history-item" 
        v-for="(item, index) in historyList" 
        :key="index"
        @click="viewHistoryDetail(item)"
      >
        <view class="item-header">
          <text class="item-time">{{ formatTime(item.timestamp) }}</text>
          <text class="item-seed">种子: {{ shortenSeed(item.seed) }}</text>
        </view>
        
        <view class="item-cards">
          <text class="cards-count">{{ item.cards.length }} 张牌</text>
          <view class="card-previews">
            <text 
              v-for="card in item.cards" 
              :key="card.id"
              class="card-preview"
            >
              {{ card.name }}
            </text>
          </view>
        </view>
        
        <view class="item-params">
          <text class="param">算法: {{ item.params.method }}</text>
          <text class="param">方法: {{ item.params.algorithm }}</text>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-icon">📭</text>
      <text class="empty-text">暂无抽牌记录</text>
      <text class="empty-subtext">返回首页开始抽牌吧</text>
    </view>

    <view class="action-buttons">
      <button @click="clearHistory" class="clear-btn">清空历史</button>
      <button @click="goBack" class="back-btn">返回首页</button>
    </view>

    <!-- 历史详情弹窗 -->
    <uni-popup ref="detailPopup" type="center">
      <view class="detail-popup" v-if="selectedHistory">
        <text class="popup-title">抽牌详情</text>
        
        <view class="popup-time">
          <text>时间: {{ formatTime(selectedHistory.timestamp) }}</text>
        </view>
        
        <view class="popup-seed">
          <text>种子: {{ selectedHistory.seed }}</text>
        </view>
        
        <view class="popup-cards">
          <text class="cards-title">抽到的牌:</text>
          <view 
            class="popup-card" 
            v-for="card in selectedHistory.cards" 
            :key="card.id"
          >
            <text class="card-name">{{ card.name }} ({{ card.enName }})</text>
            <text class="card-meaning">{{ card.meaning }}</text>
          </view>
        </view>
        
        <view class="popup-params">
          <text class="params-title">随机参数:</text>
          <text>算法: {{ selectedHistory.params.method }}</text>
          <text>抽牌数: {{ selectedHistory.params.cards }}</text>
          <text>方法: {{ selectedHistory.params.algorithm }}</text>
        </view>
        
        <button @click="closeDetail" class="close-btn">关闭</button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      historyList: [],
      selectedHistory: null
    };
  },
  
  onLoad() {
    this.loadHistory();
  },
  
  onShow() {
    this.loadHistory();
  },
  
  methods: {
    // 加载历史记录
    loadHistory() {
      try {
        const history = uni.getStorageSync('tarotHistory') || [];
        this.historyList = history.reverse(); // 最新的在前面
      } catch (error) {
        console.error('加载历史记录失败:', error);
        this.historyList = [];
      }
    },
    
    // 查看历史详情
    viewHistoryDetail(history) {
      this.selectedHistory = history;
      this.$refs.detailPopup.open();
    },
    
    // 关闭详情弹窗
    closeDetail() {
      this.$refs.detailPopup.close();
      this.selectedHistory = null;
    },
    
    // 清空历史
    clearHistory() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有抽牌历史吗？',
        success: (res) => {
          if (res.confirm) {
            try {
              uni.setStorageSync('tarotHistory', []);
              this.historyList = [];
              uni.showToast({
                title: '历史已清空',
                icon: 'success'
              });
            } catch (error) {
              uni.showToast({
                title: '清空失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    // 返回首页
    goBack() {
      uni.navigateBack();
    },
    
    // 格式化时间
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
    
    // 缩短种子显示
    shortenSeed(seed) {
      const seedStr = seed.toString();
      if (seedStr.length <= 8) return seedStr;
      return seedStr.substring(0, 4) + '...' + seedStr.substring(seedStr.length - 4);
    }
  }
};
</script>
