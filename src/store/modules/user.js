import api from "@/api";
import * as types from "../mutation-types";
import queryString from "query-string";
import browser from "webextension-polyfill";

/**
 * @module store/modules/user
 * @desc Store for Spotify functions - login user, get user info
 */

/**
 * The Vuex 'state' object.
 * @name State
 * @type {object}
 * @property {Bolean} logged_in=false - True If user is loged in
 * @property {Bolean} getToken=false - True if token is saved
 * @property {String} token - user Token
 * @property {object|undefined} userInfo=undefined - User information
 */
const state = {
  logged_in: false,
  getToken: false,
  token: String,
  userInfo: undefined,
};

/**
 * The module 'getters' object.
 * @name Getters
 * @type {object}
 * @getter {Bolean} getToken=getToken Returns a property that is a Bolean
 * @getter {Object} userInfo=userInfo Returns a property that is a Object
 * @getter {String} userProfile=userInfo Returns a property that is a String
 * @getter {Bolean} loggedIn=logged_in Returns a property that is a Bolean
 */
const getters = {
  getToken: (state) => {
    state.getToken;
  },
  userInfo: (state) => state.userInfo,
  userProfile: (state) => state.userInfo.external_urls.spotify,
  loggedIn: (state) => state.logged_in,
};

/**
 * @name Actions
 *  - call the specific Api functions
 * @desc
 * login - Login a user <br/>
 * getToken - Get token from url <br/>
 * getUserInfo - Get user Information <br/>
 */
const actions = {
  login({ commit, dispatch }, interactive) {
    const baseUrl = "https://accounts.spotify.com/authorize";
    const clientId = "57a795ef5d9a4ccca747877d47fbc61d";
    const redirectUri = browser.identity.getRedirectURL("authorize");
    // "http://localhost:8080/spotifix-vue/"
    let scopes = new Array(
      "user-read-private",
      "user-read-email",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-modify-playback-state",
      "streaming",
      "user-library-modify",
      "user-library-read",
      "user-top-read"
    );
    const scope = scopes.join("%20");
    const responseType = "token";
    commit(types.GET_TOKEN, {});
    const url = `${baseUrl}?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&response_type=${responseType}`;
    browser.identity
      .launchWebAuthFlow({ url: url, interactive: interactive })
      .then((response) => dispatch("getToken", response))
      .catch(() => commit("LOGOUT_USER"));
  },

  getToken({ commit, state, dispatch }, url) {
    url = url.payload ? url.payload : url;
    if (state.getToken) {
      const token = queryString.parse(new URL(url).hash).access_token;
      commit(types.SAVE_TOKEN, { token });
      dispatch("getUserInfo");
    }
  },
  getUserInfo({ commit }) {
    api.getUserInfo((userInfo) => {
      if (userInfo.status === 401) {
        this.dispatch("user/login", false);
      } else {
        commit("saveUserInfo", { userInfo });
      }
    });
  },
};

/**
 * The module 'setters' object.
 * @name Mutations
 * @type {object}
 * @mutator {Object} saveUserInfo=userInfo Sets the state Object property
 * @mutator {Bolean} LOGIN_USER=logged_in Sets the state Bolean property
 * @mutator {Bolean} LOGOUT_USER=logged_in Sets the state Bolean property
 * @mutator {Bolean} GET_TOKEN=getToken Sets the state Bolean property
 * @mutator {String} SAVE_TOKEN=token Sets the state String property
 */
const mutations = {
  saveUserInfo(state, { userInfo }) {
    state.userInfo = userInfo;
    state.logged_in = true;
  },
  [types.LOGIN_USER](state) {
    state.logged_in = true;
  },

  [types.LOGOUT_USER](state) {
    state.logged_in = false;
  },
  [types.GET_TOKEN](state) {
    state.getToken = true;
  },
  [types.SAVE_TOKEN](state, { token }) {
    state.token = token;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
