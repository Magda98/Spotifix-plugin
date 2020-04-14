import api from '@/api'
import * as types from '../mutation-types'
import router from "@/router";
import querystring from "query-string"
import axios from "axios"

// initial state
const state = {
    savedTracks: {},
    search: false
}

// getters
const getters = {
    saved: state => state.savedTracks,
    searched: state => state.search
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
    search({ commit }, data) {
        api.search(result => {
            if (result.status === 401) {
                this.dispatch("user/login");
            } else {
                commit("saveSearch", result);
            }

        }, data)
    }
}

// mutations
const mutations = {
    saveTracks(state, { tracks }) {
        state.savedTracks = tracks;
        state.albumSongs = tracks;
    },
    saveSearch(state, search) {
        state.search = search;
        console.log(search);
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}