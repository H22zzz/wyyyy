<template>
  <header class="header">
      <div class="cover" :style="{opacity}"></div>
      <span class="iconfont icon-fanhui" @click="backAction"></span>
      <div class="text">
        <span :class="{active: showTitle}">{{showTitle ? title : '歌单'}}</span>
      </div>
    </header>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    opacity: Number
  },
  computed: {
    ...mapState({
      title: state=>state.songList.detail.name,
    }),
    showTitle(){
      return this.opacity > 0.5;
    }
  },
  methods: {
    // 返回上一页
    backAction(){
      this.$router.back();
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/global-style.scss";
@keyframes marquee {
  0%{
    transform: translateX(100%);
  }
  100%{
    transform: translateX(-100%);
  }
}
.header{
  width: 100%;
  height: 44px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .cover{
    background: $theme-color;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .iconfont{
    font-size: 20px;
    color: $font-color-light;
  }
  .text{
    flex: 1;
    font-size: $font-size-l;
    color: $font-color-light;
    margin: 0 6px;
    overflow: hidden;
    .active{
      display: block;
      animation: 8s marquee linear infinite;
    }
  }
}
</style>