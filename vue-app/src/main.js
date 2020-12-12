import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/iconfont.css'
import Plugin from './plugin'

Vue.use(Plugin);

Vue.config.productionTip = false

// 全局过滤器
// 参数1:过滤器名字
// 参数2:过滤器的实现函数，该函数第一个参数得到需要过滤的数据，后面的剩余参数是调用过滤器传入的参数。
// Vue.filter('test', (value, num)=>{
//   return value.repeat(num);
// });



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
