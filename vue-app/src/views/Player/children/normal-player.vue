<template>
  <div class="normal-player-panel">
    <!-- header -->
    <div class="header" ref="header">
      <div class="back-icon" @click="closePlayerPanelAction">
        <span class="iconfont icon-jiantou1"></span>
      </div>
      <div class="info">
        <h3>{{song.title}}</h3>
        <p>{{song.ar.join('/')}}</p>
      </div>
    </div>
    <!-- CD唱片，和歌词 -->

    <div class="middle" ref="poster">
      <!-- cd -->
      <div class="poster" v-show="!showLyric" @click="toggleAction">
        <div class="poster-wrap">
          <img id="cd" :src="song.al.picUrl" alt class="cd-img" :class="[playing ? 'play': 'paused']"/>
        </div>
      </div>
      <!-- 歌词 -->
      <lyric-panel v-if="showLyric" @close="toggleAction" @change="changeProgressAction"/>
    </div>



    <!-- 控制栏 -->
    <div class="bottom" ref="bottom">
      <div class="paly-num">
        <span>倍速听歌</span>
        <span v-for="item in playNum" :key="item" :class="{active: value === item}" @click="changeRateAction(item)">x{{item}}</span>
      </div>
      <!-- 进度条 -->
      <div class="progress-bar-wrap">
        <span>{{currentTime | timeFormatter}}</span>
        <bar-progress :value="progress" @input="changeProgressAction" @touch="handleTouchAction"/>
        <span>{{duration | timeFormatter}}</span>
      </div>
      <div class="handle">
        <!-- 播放规则 -->
        <span class="iconfont" :class="playModeIcon[playMode]" @click="changePlayModeAction"></span>
        <!-- 上一曲 -->
        <span class="iconfont icon-shangyiqu101" @click="preAction"></span>
        <!-- 播放暂停 -->
        <span class="iconfont" :class="[playing ? pauseIcon : playIcon]" @click="playAction"></span>
        <!-- 下一曲 -->
        <span class="iconfont icon-xiayiqu101" @click="nextAction"></span>
        <span class="iconfont icon-liebiao"></span>
      </div>
    </div>
  </div>
</template>

<script>
import animations from "create-keyframe-animation";
import BarProgress from './bar-progress'
import LyricPanel from './lyric-panel'
import {mapState, mapGetters} from 'vuex'
// 执行动画的逻辑：
const aniMixin = {
  methods: {
    getPositionAndScale() {
      // 计算两个cd的x轴偏移量
      const x1 = 60;
      const x2 = document.documentElement.offsetWidth / 2;
      const x = x2 - x1;
      // 计算两个cd的y轴偏移量
      const y1 = 60;
      const y2 = (document.documentElement.offsetHeight - 448) / 2 + 360;
      const y = y2 - y1;
      const scale = 80 / 400;
      // console.log(x, y, scale);
      return { x, y, scale };
    },
    // 外部整体结构执行淡入淡出，poster执行放大和平移。
    handleEnter(done) {
      // CD的动画
      {
        const { x, y, scale } = this.getPositionAndScale();
        // 关键帧动画对象
        const animation = {
          0: {
            transform: `translate(-${x}px, ${y}px) scale(${scale})`,
          },
          60: {
            transform: "translate(0, 0) scale(1.1)",
          },
          100: {
            transform: "translate(0, 0) scale(1)",
          },
        };
        // 注册动画
        animations.registerAnimation({
          name: "cd-enter-ani",
          animation: animation,
          //动画的配置
          presets: {
            duration: 300,
            easing: "linear",
          },
        });
        // 执行动画
        animations.runAnimation(this.$refs.poster, "cd-enter-ani", done);
      }
      // header的动画
      {
        const animation = {
          0: {
            transform: "translateY(-100%)",
          },
          100: {
            transform: "translateY(0)",
          },
        };
        animations.registerAnimation({
          name: "header-enter-ani",
          animation: animation,
          //动画的配置
          presets: {
            duration: 300,
            easing: "cubic-bezier(.81,.07,.73,1.61)",
          },
        });
        animations.runAnimation(this.$refs.header, "header-enter-ani");
      }
      // bottom的动画
      {
        const animation = {
          0: {
            transform: "translateY(100%)",
          },
          100: {
            transform: "translateY(0)",
          },
        };
        animations.registerAnimation({
          name: "bottom-enter-ani",
          animation: animation,
          //动画的配置
          presets: {
            duration: 300,
            easing: "cubic-bezier(.81,.07,.73,1.61)",
          },
        });
        animations.runAnimation(this.$refs.bottom, "bottom-enter-ani");
      }
    },
    handleAfterEnter() {
      // 整个页面动画进入完成的事件
      // 注销动画
      animations.unregisterAnimation("cd-enter-ani");
      animations.unregisterAnimation("header-enter-ani");
      animations.unregisterAnimation("bottom-enter-ani");
      this.$refs.poster.style.animation = "";
      this.$refs.header.style.animation = "";
      this.$refs.bottom.style.animation = "";
    },
    handleLeave(done) {
      // 整个页面动画离开的事件
      const { x, y, scale } = this.getPositionAndScale();
      // 关键帧动画对象
      const animation = {
        0: {
          transform: "translate(0, 0) scale(1)",
        },
        60: {
          transform: "translate(0, 0) scale(1.1)",
        },
        100: {
          transform: `translate(-${x}px, ${y}px) scale(${scale})`,
        },
      };
      // 注册动画(注册前，判断是否存在该动画，存在先注销)
      if (animations.hasAnimation("cd-leave-ani")) {
        animations.unregisterAnimation("cd-leave-ani");
      }
      animations.registerAnimation({
        name: "cd-leave-ani",
        animation: animation,
        //动画的配置
        presets: {
          duration: 300,
          easing: "linear",
        },
      });
      // 执行动画
      animations.runAnimation(this.$refs.poster, "cd-leave-ani", done);
    },
    handleAfterLeave(done) {
      done();
      // 整个页面动画离开的事件
      // 注销动画
      // 因为外部组件after-leave事件执行时，该组件已经销毁，无法执行这个事件，所以把相关代码放在handleLeave中进行判断。
    },
  },
};

export default {
  components: {
    BarProgress,
    LyricPanel
  },
  mixins: [aniMixin],
  filters: {
    timeFormatter(value){
      value = Math.floor(value);
      let mm = Math.floor(value / 60);
      (mm < 10) && (mm = '0' + mm); 
      let ss = value % 60;
      (ss < 10) && (ss = '0' + ss); 
      return mm + ':' + ss;
    }
  },
  props: {
    value: Number//播放倍速
  },
  data() {
    return {
      playNum: [0.75, 1, 1.25, 1.5, 2],
      playIcon: "icon-bofang1",
      pauseIcon: "icon-plus-pause",
      playModeIcon: ["icon-shunxubofang", "icon-danquxunhuan1", "icon-suiji"],
      showLyric: false
    };
  },
  computed: {
    ...mapState({
      progress: state=>state.player.progress,
      playing: state=>state.player.playing,
      playMode: state=>state.player.playMode,
      currentTime: state=>state.player.currentTime,
      duration: state=>state.player.duration,
    }),
    ...mapGetters({
      song: 'player/currentSong'
    })
  },
  methods: {
    closePlayerPanelAction() {
      this.showLyric = false;
      this.$emit("close-player-panel");
    },
    // 修改进度progress,修改播放的时间currentTime
    changeProgressAction(value){
      this.$store.commit('player/setProgress', value);

      // 通知index.vue中的audio修改播放的时间currentTime
      this.$parent.modifyCurrentTime(value);
      
    },
    // 播放暂停按键事件
    playAction(){
      this.$store.commit('player/setPlaying');
    },
    // 拖拽进度条
    handleTouchAction(isTouch){
      this.$store.commit('player/setDrag', isTouch);
    },
    // 上一曲
    preAction(){
      this.$store.dispatch('player/changeSong', 'pre');
    },
    // 下一曲
    nextAction(){
      this.$store.dispatch('player/changeSong', 'next');
    },
    // 切换播放规则
    changePlayModeAction(){
      this.$store.commit('player/changePlayMode');
    },
    // 设置倍速
    changeRateAction(value){
      this.$emit('input', value);
    },
    // 显示歌词面板
    toggleAction(){
      this.showLyric = !this.showLyric;
      console.log(this.showLyric);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../assets/global-style.scss";
.normal-player-panel {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: $background-color;
}
.header {
  width: 100%;
  height: 44px;
  position: absolute;
  top: 0;
  left: 0;
  background: lemonchiffon;
  display: flex;
  padding: 5px 10px;
  box-sizing: border-box;
  color: $font-color-desc;
  .back-icon {
    width: 34px;
    height: 34px;
    transform: rotate(90deg);
    text-align: center;
    line-height: 34px;
    .iconfont {
      font-size: 24px;
    }
  }
  .info {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    h3 {
      font-size: $font-size-l;
    }
    p {
      font-size: $font-size-s;
      color: $font-color-desc-v2;
    }
  }
}
.middle {
  width: 100%;
  position: absolute;
  top: 44px;
  left: 0;
  bottom: 180px;
  background: lightblue;
  .poster {
    width: 200px;
    height: 200px;
    transform: translate(-50%, -50%);
    position: relative;
    left: 50%;
    top: 50%;
    .poster-wrap {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 50%;
      animation: my-ani 300ms;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.bottom {
  width: 100%;
  height: 180px;
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  .paly-num {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      display: block;
      font-size: $font-size-m;
      color: $font-color-desc-v2;
      margin: 0 2px;
      padding: 5px;
      &.active {
        border-radius: 10px;
        border: 1px solid $theme-color;
        color: $theme-color;
      }
    }
  }
  .progress-bar-wrap {
    width: 100%;
    height: 30px;
    background: #8f9;
    display: flex;
    justify-content: center;
    align-items: center;
    span{
      display: block;
      margin: 0 16px;
    }
  }
  .handle {
    padding: 20px 40px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .iconfont {
      color: $font-color-desc;
      font-size: 32px;
      &:nth-of-type(3) {
        font-size: 44px;
      }
    }
  }
}
</style>