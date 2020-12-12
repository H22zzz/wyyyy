import {SONG_LYRIC_API} from '../../../api/url'
import http from '../../../api/http'
export default {
  namespaced: true,
  state: {
    // 播放规则
    playMode: 0, //0 顺序，1 单曲， 2 随机
    // 当前的播放进度
    progress: 0,
    // 是否在拖拽进度条
    isDrag: false,
    // 当前时间
    currentTime: 0,
    // 总时间
    duration: 0,
    // 是否在播放
    playing: false,
    // 当前播放歌曲的下标
    currentSongIndex: -1,
    // 播放歌单
    playSongList: [],
    // 整首歌曲的所有歌词
    lyrics: null
  },
  getters: {
    // 当前的歌曲信息
    currentSong(state) {
      if (state.currentSongIndex >= 0) {
        return state.playSongList[state.currentSongIndex];
      } else {
        return {};
      }
    },
    // 当前播放时间对应的歌词
    currentLyric(state){
      const index = state.lyrics.findIndex(item=>item.time > state.currentTime);
      if(index > 0){//正常的歌词
        return index - 1;
      }else if(index === 0){//第一句和前奏
        return 0;
      }else if(index < 0){//最后一句歌词，和歌曲结尾部分
        return state.lyrics.length - 1;
      }
    }
  },
  mutations: {
    // 设置播放规则
    changePlayMode(state, payload) {
      if (state.playMode === 2) {
        state.playMode = 0;
      } else {
        state.playMode += 1;
      }
    },
    // 设置播放进度
    setProgress(state, payload) {
      state.progress = payload;
    },
    // 设置是否拖拽
    setDrag(state, payload) {
      state.isDrag = payload;
    },
    // 设置当前时间
    setCurrentTime(state, payload){
      state.currentTime = payload;
    },
    // 设置总时长
    setDuration(state, payload) {
      state.duration = payload;
    },
    // 设置播放状态
    setPlaying(state) {
      state.playing = !state.playing;
    },
    // 设置播放音乐的下标
    setCurrentSongIndex(state, payload) {
      // 修改下标
      state.currentSongIndex = payload;
      // 播放音乐
      state.playing = true;
    },
    // 设置播放列表
    setPlaySongList(state, payload) {
      state.playSongList = JSON.parse(JSON.stringify(payload));
    },
    // 设置歌词
    setLyrics(state, payload){
      state.lyrics = payload; 
    }
  },
  actions: {
    //切歌
    changeSong(context, payload /* pre/next */) {
      const state = context.state;
      let tmp = state.currentSongIndex;
      if (state.playMode === 0 || state.playMode === 1) {//单曲循环和顺序播放按键事件都一样
        //计算顺序播放时的上一曲，下一曲
        //单曲循环
        if (payload === "pre") {
          //上一曲
          tmp = tmp - 1;
        } else {
          //下一曲
          tmp = tmp + 1;
        }
        // 控制下标不能越界
        tmp < 0 && (tmp = state.playSongList.length - 1);
        tmp >= state.playSongList.length && (tmp = 0);
        // 提交mutations
        context.commit("setCurrentSongIndex", tmp);
      }
      else if(state.playMode === 2){
        //随机播放
        let index;
        while (true) {
          index = Math.floor(Math.random() * state.playSongList.length);
          if(index !== state.currentSongIndex){
            break;
          }
        }
        // 提交mutations
        context.commit("setCurrentSongIndex", index);
      }
    },
    // 请求歌词
    async reqestLyric(context, payload){
      // 请求歌词
      const {data: {lrc}} = await http.get(SONG_LYRIC_API, {id: payload});
      // 处理歌词数据
      let {lyric} = lrc;
      lyric = lyric.replaceAll(/\n/g, '');
      const arr = lyric.split('[');
      arr.shift();
      const newArr = arr.map(item=>{
        const [timeStr, text] = item.split(']');
        const [mm, ss] = timeStr.split(':');
        const time = Number(mm * 60) + Number(ss);
        return {
          time,
          timeStr,
          text
        }
      });
      // 设置歌词
      context.commit('setLyrics', newArr);
    }
  },
};
