<template>
<div class="scroll-view" ref="scroll">
  <div class="scroll-wrap" :style="{width: wrapWidth}">
    <slot/>
  </div>
</div>
</template>

<script>
export default {
  props: {
    handleScroll: Function,
    scrollX: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: true
    },
    // 接收滚动视图的宽度
    width: {
      type: [String, Number],
      default: '100%'
    }
  },
  computed: {
    // 计算最终宽度的样式
    wrapWidth(){
      if(typeof this.width === "string"){
        return this.width;
      }else{
        return this.width + 'px';
      }
    }
  },
  mounted(){
    const scroll = new IScroll(this.$refs.scroll, {
      tap: true,
      click: true,
      probeType: 3,
      scrollX: this.scrollX,
      scrollY: this.scrollY
    });
    scroll.on('beforeScrollStart', ()=>{
      scroll.refresh();
    });
    // 外部需要scroll的状态就执行监听
    this.handleScroll && scroll.on('scroll', ()=>{
      // 将当前的位置传递给外部组件
      this.handleScroll({x: scroll.x, y: scroll.y});
    });
  }
}
</script>

<style scoped lang="scss">
.scroll-view{
  overflow: hidden;
}
</style>