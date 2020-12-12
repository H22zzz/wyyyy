<template>
  <div class="page subpage">
    <list-detail-header :opacity="opacity"/>
    <app-scroll class="content" v-if="!loading" :handleScroll="handleScrollAction">
      <!-- 两个子组件自己从仓库中取数据 -->
      <list-detail-top/>
      <song-list :data="detail.tracks" :count="detail.subscribedCount"/>
    </app-scroll>
    <div class="content" v-else></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import SongList from '../components/common/song-list'
import ListDetailTop from '../components/song-list/list-detail-top'
import ListDetailHeader from '../components/song-list/list-detail-header'
export default {
  components: {
    SongList,
    ListDetailTop,
    ListDetailHeader
  },
  data(){
    return {
      opacity: 0,
      handleLoading: true//需要使用mixin处理loading
    }
  },
  computed: {
    ...mapState({
      detail: state=>state.songList.detail,
      loading: state=>state.songList.loading
    })
  },
  methods: {
    // 滚动事件
    handleScrollAction({y}){
      if(y < 0 && y >= -200){
        let opacity = y * (-1) / 200;
        opacity = opacity > 1 ? 1 : opacity;
        this.opacity = opacity;
      }
    }
  },
  created(){
    // 请求歌单详情数据
    this.$store.dispatch('songList/requestListDetail', {id: this.$route.params.id});
  }
}
</script>

<style scoped lang="scss">
.content{
  width: 100%;
  height: 100%;
}
</style>