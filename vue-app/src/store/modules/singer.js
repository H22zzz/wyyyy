import {SINGER_DETAIL_API} from '../../api/url'
import http from '../../api/http'
export default {
  namespaced: true,
  state: {
    singerImage: '',
    name: '',
    hotSongs: [],
    loading: false
  },
  mutations: {
    setSingerData(state, payload){
      state.singerImage = payload.singerImage;
      state.hotSongs = payload.hotSongs;
      state.name = payload.name;
    },
    setLoading(state, payload){
      state.loading = payload;
    }
  },
  actions: {
    async requestDetailData(context, payload){
      context.commit('setLoading', true);

      const {data} = await http.get(SINGER_DETAIL_API, payload);
      const hotSongs = data.hotSongs.map(item=>({
        id: item.id, //id
        title: item.name, //歌名
        ar: item.ar.map((arItem) => arItem.name), //歌手
        al: {
          //专辑
          name: item.al.name,
          picUrl: item.al.picUrl,
        },
      }));
      context.commit('setSingerData', {
        singerImage: data.artist.picUrl,
        name: data.artist.name,
        hotSongs
      });

      context.commit('setLoading', false);
    }
  }
}