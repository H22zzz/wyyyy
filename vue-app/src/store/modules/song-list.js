import {
  SONG_LIST_DETAIL_API,
} from "../../api/url";
import http from "../../api/http";

export default {
  namespaced: true,
  state: {
    detail: {},
    loading: false, // 歌单详情页面的加载
  },
  mutations: {
    // 设置推荐歌单详情
    setDetail(state, payload) {
      state.detail = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
  },
  actions: {
    // 请求推荐歌单列表详情
    async requestListDetail(context, payload) {
      context.commit("setLoading", true);
      const {
        data: { playlist },
      } = await http.get(SONG_LIST_DETAIL_API, payload);
      const listDetail = {
        // 歌单名字
        name: playlist.name,
        // 歌单图片
        coverImgUrl: playlist.coverImgUrl,
        // 歌单收藏数量
        subscribedCount: playlist.subscribedCount,
        // 创建者信息
        creator: {
          nickname: playlist.creator.nickname,
          avatarUrl: playlist.creator.avatarUrl,
        },
        // 歌单歌曲列表
        tracks: playlist.tracks.map((item) => ({
          id: item.id, //id
          title: item.name, //歌名
          ar: item.ar.map((arItem) => arItem.name), //歌手
          al: {
            //专辑
            name: item.al.name,
            picUrl: item.al.picUrl,
          },
        })),
      };
      context.commit("setDetail", listDetail);
      context.commit("setLoading", false);
    },
  },
};
