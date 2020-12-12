import { SINGER_CATEGORY_LIST_API } from "../../api/url";
import http from "../../api/http";
export default {
  namespaced: true,
  state: {
    singerData: [],
    loading: false
  },
  mutations: {
    setLoading(state, payload){
      state.loading = payload;
    },
    setSingerData(state, {data, reset}){
      if(reset){
        state.singerData = data;//初始化赋值，或者下拉刷新赋值
      }else{
        state.singerData = [...state.singerData, ...data];//上拉加载更多的赋值
      }
      
    }
  },
  actions: {
    async requestSingerList(context, payload){
      // 设置loading
      context.commit('setLoading', true);
      // 请求数据
      const {data: {artists}} = await http.get(SINGER_CATEGORY_LIST_API, payload);
      const result = artists.map(item=>({
        id: item.id,
        name: item.name,
        picUrl: item.picUrl+'?param=200x200'
      }));
      context.commit('setSingerData', {data: result, reset: payload.offset === 0});
      // 重置loading
      context.commit('setLoading', false);
    }
  }
}