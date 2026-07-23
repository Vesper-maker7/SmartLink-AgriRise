<script setup>
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('[智链兴农] AI智慧农业平台启动')
  // 获取系统信息设置状态栏高度
  uni.getSystemInfo({
    success(res) {
      const statusBarHeight = res.statusBarHeight || 44
      // 设置 CSS 变量供全局使用
      const style = document?.documentElement?.style
      if (style) {
        style.setProperty('--status-bar-height', statusBarHeight + 'px')
        style.setProperty('--window-height', res.windowHeight + 'px')
      }
    }
  })
})
</script>

<style lang="scss">
@import '@/uni.scss';

/* 全局过渡动画 */
.page-enter-active {
  animation: fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
