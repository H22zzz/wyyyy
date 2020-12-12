<template>
  <div class="scroll-view" ref="scroll">
    <div class="scroll-wrap">
      <!-- 下拉刷新 -->
      <div class="pull-down" :style="{height: height+ 'px'}">
        <span class="icon loading" v-if="isPullDown">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span class="iconfont icon-fanhui" :class="{turn: canPullDown}" v-else></span>
        <span class="text">{{pullDownText}}</span>
      </div>

      <slot />
      <!-- 上拉加载 -->
      <div class="pull-up" :style="{height: height+ 'px'}">
        <span class="icon loading" v-if="isPullUp">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span class="iconfont icon-fanhui" :class="{turn: canPullUp}" v-else></span>
        <span class="text">{{pullUpText}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canPullDown: false,
      isPullDown: false,
      canPullUp: false,
      isPullUp: false,
      pullDownText: "下拉可以刷新...",
      pullUpText: '上拉keyijiazaigengduo...',
      height: window.devicePixelRatio * 40
    };
  },
  methods: {
    //关闭下拉刷新
    endPullDown(){
      this.scroll.scrollTo(0, -1 * this.height, 300);
      this.isPullDown = false;
    },
    // 关闭上拉加载更多
    endPullUp(){
      this.isPullUp = false;
    },
    // 滚动到最顶部
    scrollToTop(){
      this.scroll.scrollTo(0, -1 * this.height, 0);
    }
  },
  mounted() {
    const scroll = this.scroll = new IScroll(this.$refs.scroll, {
      tap: true,
      click: true,
      probeType: 3,
    });
    scroll.on("beforeScrollStart", () => {
      scroll.refresh();
    });
    // 下拉刷新
    scroll.scrollTo(0, -1 * this.height, 0);
    scroll.on('scroll', ()=>{
      if(this.isPullDown){//正在加载中，不判断
        return;
      }
      if(scroll.y >= 0){
        //达到了下拉刷新的条件
        this.canPullDown = true;
        this.pullDownText = '释放立即刷新...';
      }else if(scroll.y < 0 && scroll.y > (-1 * this.height)){
        //未达到，需要提醒用户
        this.canPullDown = false;
        this.pullDownText = '下拉可以刷新...';
      }
    });
    scroll.on('scrollEnd', ()=>{
      if(this.isPullDown){//正在加载中，不判断
        return;
      }
      if(scroll.y >= 0){
        //达到了下拉刷新的条件,执行刷新
        this.isPullDown = true;
        this.pullDownText = '拼命加载中...';
        // 通知外部加载
        this.$emit('pull-down');
      }else if(scroll.y < 0 && scroll.y > (-1 * this.height)){
        //未达到，收回
        scroll.scrollTo(0, -1 * this.height, 300);
      }
    })
    // 上拉加载更多
    scroll.on('scroll', ()=>{
      if(this.isPullUp){//正在加载中，不判断
        return;
      }
      const minY = scroll.maxScrollY + this.height;
      const maxY = scroll.maxScrollY;
      if(scroll.y >= minY){
        //正常可滚动范围
      }else if(scroll.y < minY && scroll.y > maxY){
        //可以看见加载更多的结构，未达到加载更多条件
        this.canPullUp = false;
        this.pullUpText = '上拉可以加载更多...';
      }else{//scorll.y <= maxY
        // 已经达到加载更多的条件
        this.canPullUp = true;
        this.pullUpText = '释放立即加载更多...';
      }
    });
    scroll.on('scrollEnd', ()=>{
      if(this.isPullUp){//正在加载中，不判断
        return;
      }
      const minY = scroll.maxScrollY + this.height;
      const maxY = scroll.maxScrollY;
      if(scroll.y >= minY){
        //正常可滚动范围
      }else if(scroll.y < minY && scroll.y > maxY){
        //可以看见加载更多的结构，未达到加载更多条件
        scroll.scrollTo(0, minY, 300);
      }else{//scorll.y <= maxY
        // 已经达到加载更多的条件,执行加载更多
        this.isPullUp = true;
        this.pullUpText = '拼命加载中...';
        // 通知外部加载更多
        this.$emit('pull-up');
      }
    })
  },
};
</script>

<style scoped lang="scss">
.scroll-view{
  overflow: hidden;
}
@import "../../assets/global-style.scss";
.pull-down, .pull-up {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-s;
  color: $font-color-desc;
  .iconfont{
    transform: rotate(90deg);
    &.turn{
      transform: rotate(-90deg);
    }
  }
}
.iconfont {
  transform: rotate(-90deg);
  margin: 6px;
  transition: 300ms;
  &.turn{
    transform: rotate(90deg);
  }
}

@keyframes ani-scale {
  0%, 100%{
    height: 4px;
  }
  50%{
    height: 16px;
  }
}
.icon{
  display: flex;
  width: 20px;
  justify-content: space-around;
  align-items: flex-end;
  margin: 0 6px;
  i{
    background-color: $theme-color;
    width: 2px;
    height: 16px;
    animation: ani-scale 1s infinite ease-in;
    &:nth-of-type(1){
      animation-delay: -0.25s;
    }
    &:nth-of-type(2){
      animation-delay: -0.5s;
    }
    &:nth-of-type(3){
      animation-delay: -0.75s;
    }
  }
}
</style>