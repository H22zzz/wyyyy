<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
html,
body {
  background-color: #f2f3f4;
}
html, body, #app{
  width: 100%;
  height: 100%;
}
.page {
  width: 100%;
  position: absolute;
  top: 90px;
  left: 0;
  bottom: 0;
  background-color: #f2f3f4;
  &.subpage {
    top: 0;
    z-index: 100;
  }
}
@keyframes fly-in {
  0% {
    transform: rotate(30deg) translateX(100%);
  }
  100% {
    transform: rotate(0deg) translateX(0);
  }
}
.fly-in {
  transform-origin: right bottom;
  animation: fly-in 300ms ease-in;
}
@keyframes fly-out {
  0% {
    transform: rotate(0deg) translateX(0);
  }
  100% {
    transform: rotate(30deg) translateX(100%);
  }
}
.fly-out {
  transform-origin: right bottom;
  animation: fly-out 300ms ease-in;
}
</style>