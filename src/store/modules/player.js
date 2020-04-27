import api from '@/api'
import * as types from '../mutation-types'
import router from "@/router";
import querystring from "query-string"
import axios from "axios"
import Vue from "vue";

// initial state
const state = {
        DevId: 1,
        songCurrentSec: 0,
        maxSongSec: 240,
        interval: false,
        currentTrack: false,
        songDuration: 240,
        songCurrentMilisec: 0,
        player: {},
        shuffle: false,
        volume: 1,
        repeat: "off",
    }
    // getters
const getters = {
    songDuration: state => state.songDuration,
    songCurrentMilisec: state => state.songCurrentMilisec,
    currentSec: state => state.songCurrentSec,
    maxSec: state => state.maxSongSec,
    currentTrack: state => state.currentTrack,
    player: state => state.player,
    volume: state => state.volume,
    shufflePlay: state => state.shuffle,
    repeatPlay: state => state.repeat,

}

// actions
const actions = {
    playSong({ state, commit, dispatch }, data) {
        api.playSong((song) => {
            if (song.status === 401)
                dispatch("user/login", false, { root: true });
            else if (song.status === 403)
                dispatch("toastMessage/alert", { message: "Sorry, You have no premium account. 😔", type: "warning" });
            else if (song.status === 404)
                dispatch("toastMessage/alert", { message: "Sorry, player is not ready yet.", type: "error" });
        }, { track: data, "id": state.DevId });
    },
    playPlaylist({ state, commit }, uri) {
        api.playPlaylist((song) => {
            if (song.status === 401)
                this.dispatch("user/login", false);
            else if (song.status === 403)
                this.dispatch("toastMessage/alert", { message: "Sorry, You have no premium account. 😔", type: "warning" });
            else if (song.status === 404)
                this.dispatch("toastMessage/alert", { message: "Sorry, player is not ready yet.", type: "error" });
        }, { "uri": uri, "id": state.DevId });
    },
    updateSec({ commit, state }) {
        if (!state.player.paused)
            commit("setInt", setInterval(() => { commit("updateTime"); }, 1000));
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
        Vue.prototype.$player.setVolume(state.volume)
    },
    shuffle({ state, commit }, data) {
        api.playShuffle(e => {
            commit("shuffle", data);
        }, data)
    },
    repeat({ state, commit }, data) {
        api.playRepeat(e => {
            commit("repeat", data);
        }, data)
    }
}

// mutations
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

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}