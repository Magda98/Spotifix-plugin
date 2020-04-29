import api from "@/api";
import Vue from "vue";

/**
 * @module store/modules/player
 * @desc Store for Spotify Player functions and states
 */

/**
 * The Vuex 'state' object.
 * @name State
 * @type {object}
 * @property {Number} DevId=1 - Player Device ID
 * @property {Number} songCurrentSec=0 - Current song second
 * @property {Number} maxSongSec=240 - Duration of song
 * @property {Object|undefined} interval=undefined - Interval for song sec update,
 * @property {Object|undefined} currentTrack=undefined - Current track data,
 * @property {Number} songDuration=240 - Duration of song
 * @property {Number} songCurrentMilisec=0 - Current song time in miliseconds
 * @property {Object} player={} - Spotify Player object state
 * @property {Bolean} shuffle=false - Shuffle mode
 * @property {Number} volume=1 - Player volume
 * @property {String} repeat="off" - Player repeat mode
 */
const state = {
  DevId: 1,
  songCurrentSec: 0,
  maxSongSec: 240,
  interval: undefined,
  currentTrack: undefined,
  songDuration: 240,
  songCurrentMilisec: 0,
  player: {},
  shuffle: false,
  volume: 1,
  repeat: "off",
};

/**
 * The module 'getters' object.
 * @name Getters
 * @type {object}
 * @getter {Number} songDuration=songDuration Returns a property that is a number
 * @getter {Number} songCurrentMilisec=songCurrentMilisec Returns a property that is a number
 * @getter {Number} currentSec=songCurrentSec Returns a property that is a number
 * @getter {Number}  maxSec=maxSongSec Returns a property that is a number
 * @getter {Object}  currentTrack=currentTrack  Returns a Object property
 * @getter {Object}  player=player  Returns a Object property
 * @getter {Number}  volume=volume Returns a property that is a number
 * @getter {Bolean}  shufflePlay=shuffle  Returns a boolean property
 * @getter {String}  repeatPlay=repeat Returns a string property
 */
const getters = {
  songDuration: (state) => state.songDuration,
  songCurrentMilisec: (state) => state.songCurrentMilisec,
  currentSec: (state) => state.songCurrentSec,
  maxSec: (state) => state.maxSongSec,
  currentTrack: (state) => state.currentTrack,
  player: (state) => state.player,
  volume: (state) => state.volume,
  shufflePlay: (state) => state.shuffle,
  repeatPlay: (state) => state.repeat,
};

/**
 * @name Actions
 * @desc
 * playPlaylist - Play album/playlist/artist, <br/>
 * updateSec - Sets interval for song time, <br/>
 * updateSongTime - Updates song time, <br/>
 * updateVolume - Update player volume, <br/>
 * pause/resume/prev/next/seek/setVolume - Player function, <br/>
 * getVolume - Get volume of player, <br/>
 * shuffle - Set shuffle mode, <br/>
 * repeat - Set repeat mode, <br/>
 * playSong - Play song of given uri <br/>
 */
const actions = {
  playSong({ state, dispatch }, data) {
    api.playSong(
      (song) => {
        if (song.status === 401) dispatch("user/login", false, { root: true });
        else if (song.status === 403)
          dispatch("toastMessage/alert", {
            message: "Sorry, You have no premium account. 😔",
            type: "warning",
          });
        else if (song.status === 404)
          dispatch("toastMessage/alert", {
            message: "Sorry, player is not ready yet.",
            type: "error",
          });
      },
      { track: data, id: state.DevId }
    );
  },
  playPlaylist({ state }, uri) {
    api.playPlaylist(
      (song) => {
        if (song.status === 401) this.dispatch("user/login", false);
        // else if (song.status === 403)
        //     this.dispatch("toastMessage/alert", { message: "Sorry, You have no premium account. 😔", type: "warning" });
        // else if (song.status === 404)
        //     this.dispatch("toastMessage/alert", { message: "Sorry, player is not ready yet.", type: "error" });
      },
      { uri: uri, id: state.DevId }
    );
  },
  updateSec({ commit, state }) {
    if (!state.player.paused)
      commit(
        "setInt",
        setInterval(() => {
          commit("updateTime");
        }, 1000)
      );
    else {
      commit("setInt", false);
    }
  },
  updateSongTime({ commit }, data) {
    commit("seekTime", data);
  },
  updateVolume({ commit }, data) {
    commit("volume", data);
  },
  pause() {
    Vue.prototype.$player.pause();
  },
  resume() {
    Vue.prototype.$player.resume();
  },
  prev() {
    Vue.prototype.$player.previousTrack();
  },
  next() {
    Vue.prototype.$player.nextTrack();
  },
  seek({ state }) {
    Vue.prototype.$player.seek(state.songCurrentMilisec);
  },
  setVolume({ state }) {
    Vue.prototype.$player.setVolume(state.volume);
  },
  getVolume({ commit }) {
    Vue.prototype.$player.getVolume().then((volume) => {
      commit("volume", volume);
    });
  },
  shuffle(data) {
    api.playShuffle(() => {}, data);
  },
  repeat(data) {
    api.playRepeat(() => {}, data);
  },
};

/**
 * The module 'setters' object.
 * @name Mutations
 * @type {object}
 * @mutator {String} repeat=repeat Sets the state String property
 * @mutator {Bolean} shuffle=shuffle Sets the state Bolean property
 * @mutator {Number} volume=volume Sets the state numerical property
 * @mutator {Object} player=player Sets the state Object property
 * @mutator {Number} seekTime=songCurrentMilisec,songCurrentSec Sets the state numerical property
 * @mutator {Object} saveCurrentTrack=currentTrack Sets the state Object property
 * @mutator {Function} setInt=interval Sets the state Function property
 * @mutator {Function} clearInt=interval Sets the state Function property
 * @mutator {Number} updateTime=songCurrentMilisec,songCurrentSec Sets the state Number property
 * @mutator {Number} saveId=DevId Sets the state Number property
 * @mutator {Number} playingSong=maxSongSec,songCurrentSec,songDuration,songCurrentMilisec  Sets the state Number property
 */
const mutations = {
  repeat(state, data) {
    state.repeat = data;
  },
  shuffle(state, data) {
    state.shuffle = data;
  },
  volume(state, data) {
    state.volume = data;
  },
  player(state, data) {
    state.player = data;
  },
  seekTime(state, data) {
    state.songCurrentMilisec = data;
    state.songCurrentSec = data / 1000;
  },
  saveCurrentTrack(state, data) {
    state.currentTrack = data;
  },
  setInt(state, data) {
    if (data != false) {
      state.interval = clearInterval(state.interval);
      state.interval = data;
    } else {
      state.interval = clearInterval(state.interval);
      state.interval = false;
    }
  },
  clearInt(state) {
    state.interval = clearInterval(state.interval);
  },
  updateTime(state) {
    state.songCurrentMilisec += 1000;
    state.songCurrentSec += 1;
  },
  saveId(state, id) {
    state.DevId = id;
  },
  playingSong(state, data) {
    state.maxSongSec = data.duration / 1000;
    state.songCurrentSec = data.position / 1000;
    state.songDuration = data.duration;
    state.songCurrentMilisec = data.position;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
