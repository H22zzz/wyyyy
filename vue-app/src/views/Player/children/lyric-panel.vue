<template>
  <div class="lyric-panel" ref="scroll">
    <div class="wrap">
      <ul class="list" ref="list" @click="showCDAction">
        <li class="item" @click.stop="changeAction(item)" :class="{active: index === currentLyric}" v-for="(item, index) in lyrics" :key="index">
          {{item.text}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
export default {
  data(){
    return {
      listHeight: 0,//每一个item的高度
      itemHeight: 0,//每一个item的高度
    }
  },
  computed: {
    ...mapState({
      lyrics: state=>state.player.lyrics,
      duration: state=>state.player.duration
    }),
    ...mapGetters({
      currentLyric: 'player/currentLyric'
    })
  },
  watch: {
    currentLyric(newVal){
      if(!this.scroll){
        return;
      }
      // 识别最新的高度
      this.scroll.refresh();

      // 获得歌词要居中的偏移量
      let offset = newVal * this.itemHeight;
      offset = (this.listHeight / 2) - offset;
      if(offset > 0){
        offset = 0;
      }else if(offset < this.scroll.maxScrollY){
        offset = this.scroll.maxScrollY;
      }
      // 滚动
      this.scroll.scrollTo(0, offset, 300);
    }
  },
  methods: {
    showCDAction(){
      console.log('显示CD');
      this.$emit('close');
    },
    // 跳到点击的这句歌词
    changeAction(item){
      // 修改进度
      // 修改当前时间
      const progress = item.time / this.duration;
      this.$emit('change', progress);
    }
  },
  mounted(){
    const scroll = this.scroll = new IScroll(this.$refs.scroll, {
      tap: true,
      click: true
    });
    this.listHeight = this.$refs.scroll.offsetHeight;
    this.itemHeight = this.$refs.list.querySelector('.item').offsetHeight;
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/global-style.scss";
.lyric-panel{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgb(130, 119, 170);
}
.list{
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center
}
.item{
  line-height: 30px;
  font-size: $font-size-s;
  color: $font-color-desc-v2;
  &.active{
    color: $font-color-light;
  }
}
</style>