import api from '@/api'
import * as types from '../mutation-types'
import router from "@/router";
import querystring from "query-string"
import axios from "axios"

// initial state
const state = {
    savedTracks: {},
    search: false,
    liked: [],
}

// getters
const getters = {
    saved: state => state.savedTracks,
    searched: state => state.search,
    liked: state => state.liked
}

// actions
const actions = {
    getUserTracks({ commit }) {
        api.getSavedTracks(tracks => {
            if (tracks.status === 401) {
                this.dispatch("user/login", false);
            } else {
                commit("saveTracks", { tracks });
            }
        })
    },
    search({ commit, dispatch }, data) {
        api.search(result => {
            if (result.status === 401) {
                this.dispatch("user/login", false);
            } else {
                console.log(result);
                commit("saveSearch", result);
                const ids = result.tracks.items.map(x => x.id);
                dispatch("checkSavedTracks", ids);
            }

        }, data)
    },
    checkSavedTracks({ commit }, data) {
        api.checkSavedTracks(result => {
            commit("saveChecked", result);
        }, data)
    },
    saveTrack({ commit, state, dispatch }, data) {
        api.saveTracks(e => {
            const ids = state.search.tracks.items.map(x => x.id);
            dispatch("checkSavedTracks", ids);
        }, data)
    },
    deleteTrack({ commit, state, dispatch }, data) {
        api.deleteTracks(e => {
            const ids = state.search.tracks.items.map(x => x.id);
            dispatch("checkSavedTracks", ids);
        }, data)
    },
    addToQueue({ state }, data) {
        api.addToQueue(e => {
            commit("added succefully");
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
    },
    saveChecked(state, result) {
        state.liked = result;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}