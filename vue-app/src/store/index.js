import Vue from 'vue'
import Vuex from 'vuex'
import recommend from './modules/recommend'
import singers from './modules/singers'
import songList from './modules/song-list'
import rank from './modules/rank'
import singer from './modules/singer'
import player from '../views/Player/module/player'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    recommend,
    singers,
    songList,
    rank,
    singer,
    player
  }
})
