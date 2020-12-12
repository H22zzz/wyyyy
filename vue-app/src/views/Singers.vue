<template>
  <div>
    <div id="singers" class="page">
      <!-- 歌手类型 -->
      <menu-list title="分类(默认热门)" :data="menu_type" v-model="select_type" />
      <menu-list title="首字母" :data="menu_letter" v-model="select_letter" />
      <infinite-scroll
        class="content"
        ref="scroll"
        @pull-down="handlePullDown"
        @pull-up="handlePullUp"
      >
        <ul>
          <li class="singer-item" v-for="item in data" :key="item.id" @click="goSingerPageAction(item.id)">
            <img v-lazy="item.picUrl" alt />
            <h3>{{item.name}}</h3>
          </li>
        </ul>
      </infinite-scroll>
    </div>
    <!-- 子页面 -->
    <transition enter-active-class="fly-in" leave-active-class="fly-out">
      <router-view />
    </transition>
  </div>
</template>

<script>
import MenuList from "../components/Singers/menu-list";
import { mapState } from "vuex";
export default {
  components: {
    MenuList,
  },
  data() {
    return {
      menu_type: [],
      menu_letter: [],
      select_type: -1,
      select_letter: -1,
    };
  },
  computed: {
    ...mapState({
      data: (state) => state.singers.singerData,
      loading: (state) => state.singers.loading,
    }),
  },
  watch: {
    select_type() {
      this.requestData();
    },
    select_letter() {
      this.requestData();
    },
    loading() {
      //监听有没有加载完成，初始化，下拉刷新，上拉加载更多
    },
  },
  methods: {
    // 请求数据
    requestData(isLoadMore) {
      // 处理参数
      let type = -1;
      let area = -1;
      let initial = -1;
      if (this.select_type >= 0) {
        const item = this.menu_type[this.select_type];
        type = item.typeID;
        area = item.areaID;
      }
      if (this.select_letter >= 0) {
        const item = this.menu_letter[this.select_letter];
        initial = item.id;
      }
      const offset = isLoadMore ? this.data.length : 0;
      const limit = 30;
      //发送请求数据
      this.$store.dispatch("singers/requestSingerList", {
        type,
        area,
        initial,
        offset,
        limit,
      });
      // 监听loading的变化
      const unwatch = this.$watch("loading", (newVal) => {
        if (!newVal) {
          if (isLoadMore === false) {
            //下拉刷新的请求
            // 关闭下拉刷新的效果
            this.$refs.scroll.endPullDown();
          } else if (isLoadMore === true) {
            //加载更多的请求
            // 关闭上拉加载更多的效果
            this.$refs.scroll.endPullUp();
          } else {
            //isLoadMore = undefined
            //初始化加载，切换的加载的请求
            // 滚动滚动视图到最顶部
            this.$refs.scroll.scrollToTop();
          }
          //移除监听
          unwatch();
        }
      });
    },
    // 下拉刷新
    handlePullDown() {
      //刷新数据
      this.requestData(false);
    },
    // 上拉加载
    handlePullUp() {
      this.requestData(true);
    },
    // 
    goSingerPageAction(id){
      this.$router.push({name: "singer", params: {id}});
    }
  },
  created() {
    // 构建组合列表
    const types = [
      { label: "男", id: 1 },
      { label: "女", id: 2 },
      { label: "组合", id: 3 },
    ];
    const areas = [
      { label: "华语", id: 7 },
      { label: "欧美", id: 96 },
      { label: "日本", id: 8 },
      { label: "韩国", id: 16 },
      { label: "其他", id: 0 },
    ];
    let result = [];
    areas.forEach((area) => {
      result = [
        ...result,
        ...types.map((type) => ({
          label: area.label + type.label,
          id: area.id.toString() + type.id.toString(),
          areaID: area.id,
          typeID: type.id,
        })),
      ];
    });
    this.menu_type = result;

    // 构建字母列表
    this.menu_letter = new Array(26).fill(65).map((item, index) => {
      return {
        label: String.fromCharCode(item + index),
        id: String.fromCharCode(97 + index),
      };
    });

    // 请求初始数据
    this.requestData();
  },
};
</script>

<style scoped lang="scss">
@import "../assets/global-style.scss";
.content {
  position: absolute;
  top: 52px;
  left: 0;
  bottom: 0;
  width: 100%;
}
.singer-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid $border-color;
  img {
    width: 50px;
    height: 50px;
  }
  h3 {
    margin: 0 10px;
    line-height: 50px;
    font-size: $font-size-m;
  }
}
</style>