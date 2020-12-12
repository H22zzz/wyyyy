<template>
  <div class="page subpage" id="singer">
    <header class="header">
      <span class="icon" @click="backAction">
        <i class="iconfont icon-fanhui"></i>
      </span>
      <span class="text">{{name}}</span>
    </header>
    <div class="image" ref="image" :style="{transform: `scale(${scale})`}">
      <img :src="singerImage" alt=""/>
      <span class="cover"></span>
    </div>
    <app-scroll class="content" :handleScroll="handleScrollAction">
      <div class="fake-image"></div>
      <div class="btn">
        <span class="iconfont icon-tianjia" :style="{opacity}">收藏</span>
      </div>
      <song-list :data="hotSongs"/>
    </app-scroll>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import SongList from '../components/common/song-list'
export default {
  components: {
    SongList
  },
  data(){
    return {
      scale: 1,
      opacity: 1,
      handleLoading: true,//需要使用mixin处理loading
    }
  },
  computed: {
    ...mapState({
      singerImage: state=>state.singer.singerImage,
      name: state=>state.singer.name,
      hotSongs: state=>state.singer.hotSongs,
      loading: state=>state.singer.loading,
    })
  },
  methods: {
    handleScrollAction({y}){
      if(y > 0){
        const height = this.$refs.image.offsetHeight;
        const targetHeight = height+y;
        this.scale = targetHeight / height;
      }else if(y <= 0 && y > -250){
        this.opacity = 1 - (-1) * y / 250;
      }
    },
    // 返回事件
    backAction(){
      this.$router.back();
    }
  },
  created(){
    this.$store.dispatch('singer/requestDetailData', {id: this.$route.params.id})
  }
}
</script>

<style scoped lang="scss">
@import "../assets/global-style.scss";
.header{
  width: 100%;
  height: 44px;
  box-sizing: border-box;
  padding: 10px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  color: $font-color-light;
  font-size: $font-size-l;
  font-weight: 700;
  display: flex;
  align-items: center;
  .text{
    margin-left: 6px;
  }
  .icon{
    @extend .entend_click;
  }
}
.image{
  width: 100%;
  height: 304px;
  position: relative;
  transform-origin: center top;
  img{
    height: 100%;
    width: 100%;
  }
  .cover{
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(7, 17, 27, 0.3);
  }
}
.content{
  width: 100%;
  position: absolute;
  top: 44px;
  left: 0;
  bottom: 0;
  .fake-image{
    width: 100%;
    height: 200px;
  }
  .btn{
    padding-bottom: 20px;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont{
      display: flex;
      height: 40px;
      padding: 0 30px;
      background: $theme-color;
      line-height: 40px;
      text-align: center;
      letter-spacing: 4px;
      border-radius: 25px;
      color: $font-color-light;
    }
  }
}
</style>