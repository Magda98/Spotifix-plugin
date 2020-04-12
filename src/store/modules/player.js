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
        maxSongSec: 0,
        playing: false,
        interval: false,
        currentTrack: false,
        songDuration: 100,
        songCurrentMilisec: 0,
        player: {}
    }
    // getters
const getters = {
    songDuration: state => state.songDuration,
    songCurrentMilisec: state => state.songCurrentMilisec,
    currentSec: state => state.songCurrentSec,
    maxSec: state => state.maxSongSec,
    playing: state => state.playing,
    currentTrack: state => state.currentTrack

}

// actions
const actions = {
    playSong({ state, commit, dispatch }, data) {
        api.playSong((song) => {
            if (song.status === 401)
                dispatch("user/login", {}, { root: true });
            else if (song.status === 403)
                dispatch("toastMessage/alert", { message: "Sorry, You have no premium account. 😔", type: "warning" });
            else if (song.status === 404)
                dispatch("toastMessage/alert", { message: "Sorry, player is not ready yet.", type: "error" });
        }, { track: data, "id": state.DevId });
    },
    playPlaylist({ state, commit }, uri) {
        api.playPlaylist((song) => {
            if (song.status === 401)
                this.dispatch("user/login");
            else if (song.status === 403)
                this.dispatch("toastMessage/alert", { message: "Sorry, You have no premium account. 😔", type: "warning" });
            else if (song.status === 404)
                this.dispatch("toastMessage/alert", { message: "Sorry, player is not ready yet.", type: "error" });
        }, { "uri": uri, "id": state.DevId });
    },
    updateSec({ commit, state }) {
        if (!state.playing)
            commit("setInt", setInterval(() => { commit("updateTime"); }, 1000));
        else {
            commit("setInt", false);
        }
    },
    updateSongTime({ commit }, data) {
        commit("seekTime", data);
    },
    pause({ state }) {
        state.player.pause();
    },
    resume({ state }) {
        console.log(state.player);
        state.player.resume();

    },
    prev({ state }) {
        state.player.previousTrack();
    },
    next({ state }) {
        state.player.nextTrack();
    },
    seek({ state }) {
        state.player.seek(state.songCurrentMilisec);
    }
}

// mutations
const mutations = {
    savePlayer(state, data) {
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
        if (!state.interval) {
            state.interval = clearInterval(state.interval);
            state.interval = data;
        } else {
            state.interval = clearInterval(state.interval);
            state.interval = false;
            state.playing = false;
        }

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
        state.playing = true;
    },
    pause(state) {
        state.playing = false;
    }

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}