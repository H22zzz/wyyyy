import {RANK_LIST_API} from '../../api/url'
import http from '../../api/http'
export default {
  namespaced: true,
  state: {
    toplist: [],
    list: [],
    loading: false
  },
  mutations: {
    setRankData(state, payload){
      // 设置官方榜数据
      state.toplist = payload.toplist;
      // 设置全球榜数据
      state.list = payload.list;
    },
    setLoading(state, payload){
      state.loading = payload;
    }
  },
  actions: {
    async requestRankData(context){
      context.commit('setLoading', true);

      // 请求排行榜数据
      let {data: {list}} = await http.get(RANK_LIST_API);
      let toplist = list.splice(0, 4);
      toplist = toplist.map(item=>({
        id: item.id,
        coverImgUrl: item.coverImgUrl,
        update: item.updateFrequency,
        tracks: item.tracks
      }));
      list = list.map(item=>({
        id: item.id,
        coverImgUrl: item.coverImgUrl,
        update: item.updateFrequency,
      }))
      context.commit('setRankData', {toplist, list});
      
      context.commit('setLoading', false);
    }
  }
}