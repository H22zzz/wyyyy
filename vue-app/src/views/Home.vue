<template>
  <div id="home">
    <header class="header">
      <span class="iconfont icon-caidan"></span>
      <span>云音乐</span>
      <span class="iconfont icon-41"></span>
    </header>
    <nav class="menu">
      <router-link class="menu-item" to="/recommend">
        <span>推荐</span>
      </router-link>
      <router-link class="menu-item" to="/singers">
        <span>歌手</span>
      </router-link>
      <router-link class="menu-item" to="/rank">
        <span>排行榜</span>
      </router-link>
    </nav>
    <keep-alive>
      <router-view />
    </keep-alive>
    <Player/>
  </div>
</template>

<script>
import Player from './Player'
export default {
  components: {
    Player
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/global-style.scss";
.header {
  width: 100%;
  height: 50px;
  background-color: $theme-color;
  padding: 5px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    line-height: 40px;
    font-size: 20px;
    color: $font-color-light;
    &.iconfont {
      font-size: 25px;
    }
  }
}
.menu {
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: $theme-color;
  .menu-item {
    flex: 1;
    height: 40px;
    color: $font-color-light;
    font-size: $font-size-m;
    text-align: center;
    line-height: 40px;
    &.router-link-active {
      font-weight: 700;
      span {
        border-bottom: 2px solid $font-color-light;
      }
    }
    span {
      padding: 3px 0;
    }
  }
}
</style>