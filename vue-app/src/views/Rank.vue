<template>
  <div>
    <div id="rank" class="page">
      <app-scroll class="content">
        <normal-rank :data="toplist" />
        <global-rank :data="list" />
      </app-scroll>
    </div>
    <transition enter-active-class="fly-in" leave-active-class="fly-out">
      <router-view />
    </transition>
  </div>
</template>

<script>
import NormalRank from "../components/rank/normal-rank";
import GlobalRank from "../components/rank/global-rank";
import { mapState } from "vuex";
export default {
  components: {
    NormalRank,
    GlobalRank,
  },
  data(){
    return {
      handleLoading: true//需要使用mixin处理loading
    }
  },
  computed: {
    ...mapState({
      toplist: (state) => state.rank.toplist,
      list: (state) => state.rank.list,
      loading: (state) => state.rank.loading,
    }),
  },
  created() {
    this.$store.dispatch("rank/requestRankData");
  },
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
}
</style>