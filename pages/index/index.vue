<template>
  <view class="container">
	<!-- 使用 uni-section 组件 -->
    <uni-section title="🔮 本地塔罗抽牌器" sub-title="完全离线 · 真随机数" type="line">
      
	  <!-- 使用封装的抽牌设置 -->
	        <uni-card title="抽牌设置" is-shadow>
	          <draw-settings @settings-change="onDrawSettingsChange" />
	        </uni-card>
	  
      <!-- 种子输入区域 -->
      <uni-card title="种子设置" is-shadow>
        <seed-input 
		  ref="seedInput"
          @seed-change="handleSeedChange"
          @question-change="handleQuestionChange"
          @time-change="handleTimeChange"
        />
      </uni-card>
      
      <!-- 抽牌按钮 -->
      <view class="action-buttons">
        <button @click="drawCards" class="draw-btn" :disabled="drawing">
          <text v-if="!drawing">🎴 开始抽牌</text>
          <text v-else>抽牌中...</text>
        </button>
        
        <button @click="resetAll" class="reset-btn">
          🔄 重置
        </button>
      </view>
      
      <!-- 使用封装的抽牌结果组件 -->
        <draw-result 
            v-if="drawnCards.length > 0"
            :cards="drawnCards"
            :spread-config="drawSettings?.spreadConfig"
        />
      
      <!-- 操作按钮 -->
      <view class="bottom-actions">
        <!-- 分享按钮 -->
        <button @click="openShareDialog" class="share-btn" v-if="drawnCards.length > 0">
            📤 分享结果
        </button>
            
        <!-- 分享弹窗 -->
        <share-dialog ref="shareDialog" />
      </view>
      
    </uni-section>
    
    <!-- 加载提示 -->
    <uni-popup ref="loadingPopup" type="center" background-color="transparent">
      <view class="loading-popup">
        <uni-load-more status="loading" content="正在抽牌..."></uni-load-more>
      </view>
    </uni-popup>
  </view>
</template>

<script>
	// 添加导入语句和组件定义
	import UniSection from '@/uni_modules/uni-section/components/uni-section/uni-section.vue';
	import UniCard from '@/uni_modules/uni-card/components/uni-card/uni-card.vue';
	import UniList from '@/uni_modules/uni-list/components/uni-list/uni-list.vue';
	import UniListItem from '@/uni_modules/uni-list/components/uni-list-item/uni-list-item.vue';
	import UniGrid from '@/uni_modules/uni-grid/components/uni-grid/uni-grid.vue';
	import UniGridItem from '@/uni_modules/uni-grid/components/uni-grid-item/uni-grid-item.vue';
	import UniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
	import UniTag from '@/uni_modules/uni-tag/components/uni-tag/uni-tag.vue';
	import UniLoadMore from '@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue';
	import UniPopup from '@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue';
	
	import ShareDialog from '@/components/share-dialog/share-dialog.vue';
	import DrawResult from '@/components/draw-result/draw-result.vue';
	import DrawSettings from '@/components/draw-settings/draw-settings.vue';
	import SeedInput from '@/components/seed-input/seed-input.vue';
	import TarotCard from '@/components/tarot-card/tarot-card.vue';
	import { AdvancedRandomGenerator } from '@/utils/random.js';
	import { SeedGenerator } from '@/utils/seedGenerator.js';
	import { getAllCards } from '@/utils/tarotData.js';
	import { TarotImageManager } from '@/utils/tarotData.js';
	
	// 添加这行 - 组件定义开始
	export default {
	  components: {
	    UniSection,
	    UniCard,
	    UniList,
	    UniListItem,
	    UniGrid,
	    UniGridItem,
	    UniIcons,
	    UniTag,
	    UniLoadMore,
	    UniPopup,
		DrawSettings,
	    SeedInput,
	    TarotCard,
		DrawResult,
		ShareDialog
	  },
	  
  data() {
    return {
      currentSeed: Date.now(),
      question: '',
      customTime: null,
      drawnCards: [], // 格式: { card: Object, isReversed: Boolean }
      randomParams: null,
      allCards: getAllCards(),
      drawing: false
    };
  },
  
 methods: {
handleTimeChange(time) {
  console.log('接收到的时间:', time);
  console.log('时间类型:', typeof time);
  
  // 转换为Date对象查看详情
  const dateObj = new Date(time);
  console.log('解析后的时间:', dateObj.toString());
  console.log('UTC时间:', dateObj.toUTCString());
  console.log('本地时间:', dateObj.toLocaleString());
  console.log('小时:', dateObj.getHours());
  console.log('时区偏移:', dateObj.getTimezoneOffset());
  
  this.currentSeed = SeedGenerator.fromDateTime(time);
  this.updateRandomParams();
},


	 // 打开分享对话框
	   openShareDialog() {
	     // 🔥 从seed-input组件获取问题文本
	     const question = this.$refs.seedInput ? this.$refs.seedInput.getQuestion() : '';
	     
	     this.$refs.shareDialog.open(
	       this.drawnCards,
	       question, // 🔥 现在能正确获取问题文本了
	       this.currentSeed
	     );
	   },
	   
	   // 处理问题种子变更
	   handleQuestionChange(question) {
	     this.question = question; // 🔥 保存问题到data中
	     if (question) {
	       this.currentSeed = SeedGenerator.fromQuestion(question);
	       this.updateRandomParams();
	     }
	},
	 
   // 抽牌设置变更
   onDrawSettingsChange(settings) {
     this.drawSettings = settings;
     this.updateRandomParams();
     console.log('抽牌设置更新:', settings);
   },
   
   // 种子变更处理
   handleSeedChange(seed) {
     this.currentSeed = typeof seed === 'string' ? 
       SeedGenerator.fromText(seed) : Number(seed);
     this.updateRandomParams();
     uni.showToast({
       title: '种子已设置',
       icon: 'success'
     });
   },
   
   handleQuestionChange(question) {
     if (question) {
       this.currentSeed = SeedGenerator.fromQuestion(question);
       this.updateRandomParams();
     }
   },
   
   handleTimeChange(time) {
     this.currentSeed = SeedGenerator.fromDateTime(time);
     this.updateRandomParams();
   },
   
   // 更新随机参数
   updateRandomParams() {
     if (!this.drawSettings) return;
     
     this.randomParams = {
       ...SeedGenerator.randomParams(this.currentSeed),
       cardCount: this.drawSettings.cardCount,
       spreadMode: this.drawSettings.spreadMode,
       algorithm: this.drawSettings.algorithm,
       autoReverse: this.drawSettings.autoReverse,
       deckType: this.drawSettings.deckType
     };
   },
   
// 根据牌组类型获取牌
getCardByDeckType(cardIndex, deckType) {
  // 🔥 使用 this.allCards 而不是 allCards
  let targetCards;
  
  switch (deckType) {
    case 'major':
      // 仅大阿卡那 (0-21)
      targetCards = this.allCards.filter(card => card.id <= 21); // 🔥 改为 this.allCards
      break;
      
    case 'minor':
      // 仅小阿卡那 (22-77)
      targetCards = this.allCards.filter(card => card.id >= 22); // 🔥 改为 this.allCards
      break;
      
    case 'full':
    default:
      // 完整78张
      targetCards = this.allCards; // 🔥 改为 this.allCards
      break;
  }
  
  // 🔥 确保返回的卡片包含 imageUrl
  const selectedCard = targetCards[cardIndex % targetCards.length];
  console.log('选中的卡片:', selectedCard); // 调试
  
  return selectedCard;
},
   
   // 主抽牌函数
async drawCards() {
	// 🔥 确保牌数据有图片路径
	  if (!this.allCards[0].imageUrl) {
	    this.allCards = getAllCards().map(card => ({
	      ...card,
	      imageUrl: TarotImageManager.getImagePath(card)
	    }));
	  }//？？？
	
    if (!this.drawSettings) {
      uni.showToast({ title: '请先完成设置', icon: 'none' });
      return;
    }
    
    this.drawing = true;
    this.$refs.loadingPopup.open();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const { 
        cardCount, 
        algorithm, 
        autoReverse, 
        deckType,
        spreadConfig 
      } = this.drawSettings;
      
      const random = new AdvancedRandomGenerator(this.currentSeed);
      
      // 🔥 使用完整的随机方法
      const cardResults = random.drawMultipleCards(cardCount, algorithm);
      
      this.drawnCards = cardResults.map((result, index) => ({
        card: this.getCardByDeckType(result.cardIndex, deckType),
        isReversed: autoReverse ? result.isReversed : false,
        drawInfo: result,
        spreadPosition: spreadConfig?.positions?.[index] || `位置${index + 1}`,
        spreadDescription: spreadConfig?.descriptions?.[index] || '',
        index: index
      }));
		
      // 保存历史
      this.$nextTick(() => {
        this.saveToHistory();
      });
      
      // 更新种子
      this.currentSeed = random.getCurrentSeed();
      this.updateRandomParams();
      
      uni.showToast({
        title: `抽到 ${cardCount} 张牌`,
        icon: 'success'
      });
      
    } catch (error) {
      console.error('抽牌错误:', error);
      uni.showToast({ title: '抽牌失败', icon: 'error' });
    } finally {
      this.drawing = false;
      this.$refs.loadingPopup.close();
    }
  },
   
   // 重置所有
   resetAll() {
     this.drawnCards = [];
     this.currentSeed = Date.now();
     this.drawSettings = null;
     this.randomParams = null;
     
     // 重置子组件
     if (this.$refs.drawSettings) {
       this.$refs.drawSettings.resetSettings();
     }
     if (this.$refs.seedInput) {
       this.$refs.seedInput.clearAll();
     }
     
     uni.showToast({
       title: '已重置',
       icon: 'success'
     });
   },
   
   // 牌事件处理
   onCardFlip(card) {
     console.log('牌被翻开:', card.name);
   },
   
   onCardReverse(data) {
     console.log('牌正逆位切换:', data.card.name, data.reversed ? '逆位' : '正位');
     
     // 更新本地数据
     const cardIndex = this.drawnCards.findIndex(item => 
       item.card.id === data.card.id
     );
     if (cardIndex !== -1) {
       this.drawnCards[cardIndex].isReversed = data.reversed;
     }
   },
   
   // 保存历史记录
   saveToHistory() {
     if (this.drawnCards.length === 0) return;
     
     const history = {
       seed: this.currentSeed,
       cards: this.drawnCards.map(cardData => ({
         ...cardData.card,
         isReversed: cardData.isReversed,
         spreadPosition: cardData.spreadPosition,
         drawTime: new Date().toISOString()
       })),
       timestamp: new Date().toISOString(),
       params: this.randomParams,
       settings: this.drawSettings
     };
     
     try {
       const existingHistory = uni.getStorageSync('tarotHistory') || [];
       existingHistory.push(history);
       
       // 只保留最近50条记录
       if (existingHistory.length > 50) {
         existingHistory.splice(0, existingHistory.length - 50);
       }
       
       uni.setStorageSync('tarotHistory', existingHistory);
     } catch (error) {
       console.error('保存历史记录失败:', error);
     }
   },
   
   // 导航方法
   goToHistory() {
     uni.navigateTo({
       url: '/pages/history/history'
     });
   },
   
   shareResult() {
     if (this.drawnCards.length === 0) {
       uni.showToast({
         title: '请先抽牌',
         icon: 'none'
       });
       return;
     }
     
     const cardNames = this.drawnCards.map(cardData => 
       `${cardData.card.name}${cardData.isReversed ? '(逆位)' : ''}`
     ).join('、');
     
     const spreadInfo = this.drawSettings?.spreadConfig?.name ? 
       `牌阵: ${this.drawSettings.spreadConfig.name}\n` : '';
     
     uni.showModal({
       title: '分享抽牌结果',
       content: `${spreadInfo}您抽到的牌是：${cardNames}`,
       showCancel: true,
       confirmText: '复制结果',
       success: (res) => {
         if (res.confirm) {
           uni.setClipboardData({
             data: `塔罗牌抽牌结果：${cardNames}`,
             success: () => {
               uni.showToast({
                 title: '已复制到剪贴板',
                 icon: 'success'
               });
             }
           });
         }
       }
     });
   },
   
   // 生命周期
   onLoad() {
     // 初始化默认设置
     this.currentSeed = Date.now();
     this.$nextTick(() => {
       if (this.$refs.drawSettings) {
         // 触发初始设置更新
         this.drawSettings = this.$refs.drawSettings.getSettings();
         this.updateRandomParams();
       }
     });
	 this.allCards = getAllCards().map(card => ({
	   ...card,
	   imageUrl: TarotImageManager.getImagePath(card)
	 }));
   },
   
   onShow() {
     // 页面显示时的逻辑
     console.log('首页显示');
   }
 },
 
};
</script>

<style scoped>
@import  'index.css'
</style>