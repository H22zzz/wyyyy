<template>
  <div id="player-wrap" :style="{height: showPlayerPanel?'100%':0}">
    <!-- mini-player -->
    <transition enter-active-class="mini-slide-in" leave-active-class="mini-slide-out">
      <mini-player v-show="showMiniPlayer" @show-player-panel="handlePlayerPanel" />
    </transition>

    <!-- normal-player -->
    <transition
      enter-active-class="normal-fade-in"
      leave-active-class="normal-fade-out"
      @enter="enterAction"
      @after-enter="afterEnterAction"
      @leave="leaveAction"
    >
      <normal-player
        ref="player"
        v-if="showPlayerPanel"
        @close-player-panel="handlePlayerPanel"
        v-model="playRate"
      />
    </transition>

    <!-- 播放器 -->
    <audio ref="audio" style="opacity: 0; width: 0; height: 0;" />
  </div>
</template>

<script>
import MiniPlayer from "./children/mini-player";
import NormalPlayer from "./children/normal-player";
import { mapState, mapGetters } from "vuex";
export default {
  components: {
    MiniPlayer,
    NormalPlayer,
  },
  data() {
    return {
      showMiniPlayer: false,
      showPlayerPanel: false,
      playRate: 1,
    };
  },
  computed: {
    ...mapState({
      currentIndex: (state) => state.player.currentSongIndex,
      playing: (state) => state.player.playing,
      list: (state) => state.player.playSongList,
      progress: (state) => state.player.progress,
      duration: (state) => state.player.duration,
      isDrag: (state) => state.player.isDrag,
      playMode: (state) => state.player.playMode,
    }),
    ...mapGetters({
      song: "player/currentSong",
    }),
  },
  watch: {
    currentIndex(newVal, oldVal) {
      // 第一次播放，开始显示MiniPlayer
      if (oldVal < 0) {
        this.showMiniPlayer = true;
      }
    },
    showPlayerPanel(newVal) {
      // normalPlayer切换，MiniPlayer跟着切换
      this.showMiniPlayer = !newVal;
    },
    // 监听倍速的变化
    playRate(newVal){
      const audio = this.$refs.audio;
      console.log(audio.playbackRate);
      audio.playbackRate = newVal;
    }
  },
  methods: {
    handlePlayerPanel() {
      this.showPlayerPanel = !this.showPlayerPanel;
    },
    // normal player的动画事件
    enterAction(el, done) {
      this.$refs.player.handleEnter(done);
    },
    // normal player的动画事件
    afterEnterAction(el) {
      this.$refs.player.handleAfterEnter();
    },
    // normal player的动画事件
    leaveAction(el, done) {
      this.$refs.player.handleLeave(done);
    },
    // 拖拽了进度条之后，需要修改currentTime
    modifyCurrentTime(value) {
      const audio = this.$refs.audio;
      audio.currentTime = this.duration * value;
    },
  },
  mounted() {
    const audio = this.$refs.audio;
    // 监听切换的新歌，是否可以播放
    audio.addEventListener("canplay", () => {
      // 获得总时长
      this.$store.commit("player/setDuration", audio.duration);
      // 播放
      audio.play();
    });

    // 监听当前音乐的进度
    audio.addEventListener("timeupdate", () => {
      if (this.isDrag) {
        return;
      }
      // 在拖拽的时候不要修改进度
      const progress = audio.currentTime / audio.duration;
      this.$store.commit("player/setProgress", progress);
      this.$store.commit("player/setCurrentTime", audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      //单曲循环
      if (this.playMode === 1) {
        audio.currentTime = 0;
        audio.play();
      } else {
        // 顺序或随机播放
        this.$store.dispatch("player/changeSong", "next");
      }
    });

    this.$watch("currentIndex", (newVal) => {
      // 设置audio的链接,换歌曲
      audio.src = `https://music.163.com/song/media/outer/url?id=${this.song.id}.mp3`;
      // 加载新歌
      audio.load();
      // 请求歌词
      this.$store.dispatch('player/reqestLyric', this.song.id);
    });

    // 监听播放的状态
    this.$watch("playing", (newVal) => {
      if (newVal) {
        // 播放
        audio.play();
      } else {
        // 暂停
        audio.pause();
      }
    });
  },
};
</script>

<style scoped>
#player-wrap {
  position: absolute;
  width: 100%;
  height: 0;
  background: rgba(0, 0, 0, 0.7);
  bottom: 0;
  left: 0;
  z-index: 1000;
}
@keyframes mini-slide-in {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes mini-slide-out {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
}
.mini-slide-in {
  animation: mini-slide-in 300ms ease-in;
}
.mini-slide-out {
  animation: mini-slide-out 300ms ease-out;
}
@keyframes normal-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes normal-fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.normal-fade-in {
  animation: normal-fade-in 300ms ease-in;
}
.normal-fade-out {
  animation: normal-fade-out 300ms ease-out;
}
</style>

<style>
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.cd-img {
  animation-name: rotate;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  animation-duration: 5s;
}
.cd-img.paused {
  animation-play-state: paused;
}
.cd-img.play {
  animation-play-state: running;
}
</style>
