import api from '@/api'
import * as types from '../mutation-types'
import router from "@/router";
import querystring from "query-string"
import axios from "axios"

// initial state
const state = {
    savedTracks: {},
}

// getters
const getters = {
    saved: state => state.savedTracks,
}

// actions
const actions = {
    getUserTracks({ commit }) {
        api.getSavedTracks(tracks => {
            if (tracks.status === 401) {
                this.dispatch("user/login");
            } else {
                commit("saveTracks", { tracks });
            }
        })
    },
}

// mutations
const mutations = {
    saveTracks(state, { tracks }) {
        state.savedTracks = tracks;
        state.albumSongs = tracks;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}