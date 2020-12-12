<template>
  <div class="global">
    <h3 class="title">全球榜</h3>
    <ul class="list">
      <li class="item" v-for="item in data" :key="item.id" @click="goSongListPageAction(item.id)">
        <div class="image">
          <img v-lazy="item.coverImgUrl" alt=""/>
          <span>{{item.update}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    data: Array
  },
  methods: {
    goSongListPageAction(id){
      this.$router.push({name: 'rank-list', params: {id}});
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/global-style.scss";
.global{
  padding: 5px;
}
.title{
  padding: 5px;
  font-size: 14px;
  font-weight: 700;
  padding: 10px;
}
.list{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.item{
  width: 32%;
  padding: 5px 0;
  display: flex;
  border-bottom: 1PX solid $border-color;
  .image{
    width: 100%;
    height: 100%;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    img{
      width: 100%;
      height: 100%;
    }
    span{
      width: 100%;
      height: 30%;
      padding: 10px;
      box-sizing: border-box;
      position: absolute;
      left: 0;
      bottom: 0;
      color: $font-color-light;
      font-size: $font-size-s;
      background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(110, 110, 110, 0.4));
    }
  }
}
</style>