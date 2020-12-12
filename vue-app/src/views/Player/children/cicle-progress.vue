<template>
  <!-- 圆环进度条 -->
  <canvas id="canvas" ref="canvas"></canvas>
</template>

<script>
export default {
  props: {
    value: Number
  },
  data(){
    return {
      width: 0,
      height: 0,
      length: document.documentElement.offsetWidth/750*80
    }
  },
  watch: {
    value(newVal){
      // 清除画布
      const width = this.length;
      const height = this.length;
      this.context.clearRect(0, 0, width, height);
      // 绘制底色
      this.fillFullCicle();
      // 绘制进度
      this.fillRealCicle(newVal);
    }
  },
  methods: {
    // 绘制底色
    fillFullCicle(){
      const context = this.context;
      context.beginPath();
      const width = this.length;
      const height = this.length;
      const x = width / 2;
      const y = height / 2;
      const r1 = (width / 2) * 0.9;
      const r2 = r1 - 5;
      // 大圆
      context.moveTo(x, y);
      context.arc(x, y, r1, 0, Math.PI * 2, false);
      context.lineTo(x, y);
      // 小圆
      context.moveTo(x, y);
      context.arc(x, y, r2, 0, Math.PI * 2, false);
      context.lineTo(x, y);
      context.fillStyle = 'rgba(212, 68, 57, 0.5)';
      context.fill('evenodd');
      context.closePath();
    },
    // 绘制进度
    fillRealCicle(value){
      const context = this.context;
      context.beginPath();
      const width = this.length;
      const height = this.length;
      const x = width / 2;
      const y = height / 2;
      const r1 = (width / 2) * 0.9;
      const r2 = r1 - 5;

      let fillValue = 360 * value;
      // 大扇形
      context.moveTo(x, y);
      context.arc(x, y, r1, Math.PI / 180 * -90, Math.PI / 180 * (-90 + fillValue), false);
      context.lineTo(x, y);
      // 小扇形
      context.moveTo(x, y);
      context.arc(x, y, r2, Math.PI / 180 * -90, Math.PI / 180 * (-90 + fillValue), false);
      context.lineTo(x, y);

      context.fillStyle = '#000';
      context.fill('evenodd');
      context.closePath();
    }
  },
  mounted(){
    // 设置大小
    const canvas = this.$refs.canvas;
    canvas.width = this.length;
    canvas.height = this.length;
    // 获得绘制的上下文
    this.context = canvas.getContext('2d');
    
    // 清除画布
      const width = this.length;
      const height = this.length;
      this.context.clearRect(0, 0, width, height);
      // 绘制底色
      this.fillFullCicle();
      // 绘制进度
      this.fillRealCicle(this.value);

  }
}
</script>

<style>
#canvas{
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}
</style>