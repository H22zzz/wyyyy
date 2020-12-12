<template>
  <div class="banner">
    <div class="swiper-container" ref="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in data" :key="index">
          <img :src="item" alt="banner" />
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper/swiper-bundle.js";
import "swiper/swiper-bundle.css";
export default {
  props: {
    data: Array,
  },
  watch: {
    // 当轮播图的slide数据发送变化，构建轮播图
    data() {
      this.$nextTick(() => {
        this.swiper = new Swiper(this.$refs.swiper, {
          pagination: {
            el: ".swiper-pagination",
          },
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/global-style.scss";
.banner {
  width: 100%;
  height: 140px;
  position: relative;
  &::before {
    content: "";
    display: block;
    width: 100%;
    height: 65%;
    background: $theme-color;
  }
  .swiper-container {
    width: 98%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 6px;
    overflow: hidden;
    .swiper-slide {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<style lang="scss">
@import "../../assets/global-style.scss";
.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {
    margin: 0 4px;
}
.swiper-pagination-bullet {
    width: 8px;
    height: 8px;
}
.swiper-pagination-bullet.swiper-pagination-bullet-active{
  background: $theme-color;
}
</style>