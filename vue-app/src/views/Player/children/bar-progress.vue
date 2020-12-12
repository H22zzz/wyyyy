<template>
  <div class="bar-progress" ref="bar">
    <!-- 条形进度条 -->
    <div class="progress" ref="progress" :style="{width: 100 * value +'%'}"></div>
    <div class="handler" ref="handler" @touchstart="touchstartAction"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: Number
  },
  data(){
    return {
      barWidth: 0
    }
  },
  watch: {
    value(newValue){
      this.$refs.handler.style.transform = `translateY(-50%) translateX(${newValue * this.barWidth}px)`;
    }
  },
  methods: {
    // 触摸开始，给dom添加触摸移动和停止的事件
    touchstartAction(ev){
      document.ontouchmove = this.touchmoveAction;
      document.ontouchend = this.touchEndAction;
      document.ontouchcancel = this.touchEndAction;

      // 记录开始的位置
      const position =  this.value * this.barWidth;//进度条触摸开始时的位置
      this.startX = ev.changedTouches[0].clientX - position;

      this.$emit('touch', true);
    },
    touchmoveAction(ev){
      const currentX = ev.changedTouches[0].clientX;
      let tmp = currentX - this.startX;
      if(tmp < 0 || tmp > this.barWidth){
        return;
      }
       this.offsetX = tmp;
      // 设置点的位置
      this.$refs.handler.style.transform = `translateY(-50%) translateX(${this.offsetX}px)`;
      // 设置进度条的宽度
      this.$refs.progress.style.width = this.offsetX + 'px';
    },
    touchEndAction(){
      //修改进度
      const newValue = this.offsetX / this.barWidth;
      this.$emit('input', newValue);
      this.$emit('touch', false);

      // 移除事件
      document.ontouchmove = null;
      document.ontouchend = null;
      document.ontouchcancel = null;
    }
  },
  mounted(){
    // 设置进度的初始位置
    this.barWidth = this.$refs.bar.offsetWidth;
    this.$refs.handler.style.transform = `translateY(-50%) translateX(${this.value * this.barWidth}px)`;
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/global-style.scss";
.bar-progress{
  width: 60%;
  height: 4px;
  background: rgba(0, 0, 0, 0.7);
  position: relative;
}
.progress{
  height: 100%;
  background: $theme-color;
}
.handler{
  position: absolute;
  top: 50%;
  left: -20PX;
  transform: translateY(-50%);
  width: 40PX;
  height: 40PX;
  box-sizing: border-box;
  border: 8PX solid #fff;
  border-radius: 50%;
  background: $theme-color;
  @extend .entend_click;
}
</style>