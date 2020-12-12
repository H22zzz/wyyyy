<template>
<div class="mini-player-bar">
  <template v-if="song.id">
  <!-- cd -->
  <div class="poster" @click="showPlayerPanelAction">
    <img :src="song.al.picUrl" alt="" class="cd-img" :class="[playing ? 'play': 'paused']"/>
  </div>
  <!-- 信息 -->
  <div class="info" @click="showPlayerPanelAction">
    <h3 class="title">{{song.title}}</h3>
    <p class="singer">{{song.ar.join('/')}}</p>
  </div>
  <div class="icon handle-icon" @click="playAction">
    <span class="iconfont" :class="[playing ? pauseIcon : playIcon]"></span>
    <cicle-progress :value="progress"/>
  </div>
  <div class="icon menu-icon">
    <span class="iconfont icon-liebiao"></span>
  </div>
  </template>
</div>
</template>

<script>
import CicleProgress from './cicle-progress'
import {mapState, mapGetters} from 'vuex'
export default {
  components: {
    CicleProgress
  },
  data(){
    return {
      playIcon: 'icon-zanting1',
      pauseIcon: 'icon-stop',
    }
  },
  computed: {
    ...mapState({
      playing: state=>state.player.playing,
      progress: state=>state.player.progress,
    }),
    ...mapGetters({
      song: 'player/currentSong'
    })
  },
  methods: {
    // 触发事件，告诉父组件需要展示播放界面
    showPlayerPanelAction(){
      this.$emit('show-player-panel');
    },
    // 播放暂停按键事件
    playAction(){
      this.$store.commit('player/setPlaying');
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/global-style.scss";
.mini-player-bar{
  width: 100%;
  height: 60px;
  background: $background-color;
  position: absolute;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  .poster{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .info{
    margin-left: 14px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    .title{
      font-size: $font-size-m;
      color: $font-color-desc;
    }
    .singer{
      font-size: $font-size-s;
      color: $font-color-desc-v2;
    }
  }
  .test{
    width: 40px;
    height: 40px;
    /* background: #555; */
  }
  .icon{
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    color: $theme-color;
    position: relative;
  }
  .handle-icon .iconfont{
    font-size: 18px;
    padding: 5px;
  }
  .menu-icon .iconfont{
    font-size: 28px;
  }
}
</style>