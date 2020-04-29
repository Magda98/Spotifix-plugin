import api from "@/api";
import * as types from "../mutation-types";
import querystring from "query-string";
import axios from "axios";

/**
 * @module store/modules/spotify
 * @desc Store for Spotify functions - get songs, search, saveTrack etc.
 */

/**
 * The Vuex 'state' object.
 * @name State
 * @type {object}
 * @property {Object} savedTracks={} - User saved tracks
 * @property {Object|undefined} search=undefined - Searched items
 * @property {Array} liked - Array of current searched songs, true if song is liked by user
 */
const state = {
  savedTracks: {},
  search: undefined,
  liked: [],
};

/**
 * The module 'getters' object.
 * @name Getters
 * @type {object}
 * @getter {Object} saved=savedTracks Returns a property that is a object
 * @getter {Object} searched=search Returns a property that is a object
 * @getter {Array} liked=liked Returns a property that is an Array
 */
const getters = {
  saved: (state) => state.savedTracks,
  searched: (state) => state.search,
  liked: (state) => state.liked,
};

/**
 * @name Actions
 *  - call the specific Api functions
 * @desc
 * getUserTracks - Get user saved tracks, <br/>
 * search - Search items, text forom popup input is passed, <br/>
 * checkSavedTracks - Check if tracks are saved, <br/>
 * saveTrack - Save specific track, <br/>
 * deleteTrack - Delete specific track from saved, <br/>
 * addToQueue - Add track to queue, <br/>
 */
const actions = {
  getUserTracks({ commit }) {
    api.getSavedTracks((tracks) => {
      if (tracks.status === 401) {
        this.dispatch("user/login", false);
      } else {
        commit("saveTracks", { tracks });
      }
    });
  },
  search({ commit, dispatch }, data) {
    api.search((result) => {
      if (result.status === 401) {
        this.dispatch("user/login", false);
      } else {
        commit("saveSearch", result);
        const ids = result.tracks.items.map((x) => x.id);
        dispatch("checkSavedTracks", ids);
      }
    }, data);
  },
  checkSavedTracks({ commit }, data) {
    api.checkSavedTracks((result) => {
      commit("saveChecked", result);
    }, data);
  },
  saveTrack({ state, dispatch }, data) {
    api.saveTracks((e) => {
      const ids = state.search.tracks.items.map((x) => x.id);
      dispatch("checkSavedTracks", ids);
    }, data);
  },
  deleteTrack({ state, dispatch }, data) {
    api.deleteTracks((e) => {
      const ids = state.search.tracks.items.map((x) => x.id);
      dispatch("checkSavedTracks", ids);
    }, data);
  },
  addToQueue({ state }, data) {
    api.addToQueue((e) => {}, data);
  },
};

/**
 * The module 'setters' object.
 * @name Mutations
 * @type {object}
 * @mutator {Object} saveTracks=tracks Sets the state Object property.
 * @mutator {Object} saveSearch=search Sets the state Object property.
 * @mutator {Array} saveChecked=liked Sets the state Array property.
 */
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
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
