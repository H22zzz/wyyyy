<template>
  <div>
    <!-- 推荐页面的结构 -->
    <div id="recommend" class="page" :class="{active: showBgColor}">
      <app-scroll class="content" :handleScroll="handleScrollAction">
        <div class="wrap">
          <banner-list :data="banner" />
          <recommend-list :data="recommend" />
        </div>
      </app-scroll>
    </div>
    <!-- 子页面 -->
    <transition enter-active-class="fly-in" leave-active-class="fly-out">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BannerList from "../components/recommend/banner-list";
import RecommendList from "../components/recommend/recommend-list";
export default {
  // 声明子组件
  components: {
    BannerList,
    RecommendList,
  },
  data() {
    return {
      showBgColor: false,
      handleLoading: true//需要使用mixin处理loading
    };
  },
  computed: {
    // 取得仓库中的数据
    ...mapState({
      banner: (state) => state.recommend.banner,
      recommend: (state) => state.recommend.recommend,
    }),
    ...mapGetters({
      loading: "recommend/loading",
    }),
  },
  methods: {
    // 页面的滚动事件
    handleScrollAction({y}) {
      if(y >= 0){
        this.showBgColor = true;
      }else{
        this.showBgColor = false;
      }
    },
  },
  created() {
    // 派发事件，发送请求，获得数据
    this.$store.dispatch("recommend/requestBannerList");
    this.$store.dispatch("recommend/requestRecommendList");
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/global-style.scss";
#recommend {
  background-color: $background-color;
  &.active {
    background-color: $theme-color;
  }
  .content {
    width: 100%;
    height: 100%;
  }
  .wrap {
    background-color: $background-color;
  }
  .box {
    width: 100px;
    height: 100px;
    background-color: red;
  }
}
</style>
