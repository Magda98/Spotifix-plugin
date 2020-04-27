import api from '@/api'
import * as types from '../mutation-types'
import router from "@/router";
import queryString from "query-string"
import axios from "axios"
import browser from "webextension-polyfill"

// initial state
const state = {
    id: '',
    logged_in: false,
    getToken: false,
    token: String,
    userInfo: false,
}

// getters
const getters = {
    userId: state => state.id,
    noTokenProvided: state => state.noTokenProvided,
    getToken: state => {
        //data
        state.getToken
    },
    userInfo: state => state.userInfo,
    userProfile: state => state.userInfo.external_urls.spotify,
    loggedIn: state => state.logged_in,
    isExpired: state => (new Date(state.expiryDate) < new Date()),
}

// actions
const actions = {
    login({ commit, state, dispatch }, interactive) {
        const baseUrl = "https://accounts.spotify.com/authorize";
        const clientId = "9e71951e46e74a79ac078ac56f76ba69";
        const redirectUri = browser.identity.getRedirectURL('authorize');
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
        browser.identity.launchWebAuthFlow({ url: url, interactive: interactive }).then(response => dispatch("getToken", response)).catch(() => commit("logout"))

    },

    getToken({ commit, state, dispatch }, url) {
        url = url.payload ? url.payload : url;
        if (state.getToken) {
            commit(types.GET_TOKEN_AF);
            const token = queryString.parse(new URL(url).hash).access_token;
            commit(types.SAVE_TOKEN, { token });
            dispatch("getUserInfo");
        }
    },
    getUserInfo({ commit, state }) {
        api.getUserInfo(userInfo => {
            if (userInfo.status === 401) {
                this.dispatch("user/login", false);
            } else {
                commit("saveUserInfo", { userInfo });
            }
        });

    }
}

// mutations
const mutations = {
    noToken(state) {
        state.noTokenProvided = true
    },
    saveUserInfo(state, { userInfo }) {
        state.userInfo = userInfo
        state.logged_in = true
    },
    logout(state) {
        state.logged_in = false;
    },
    [types.LOGIN_USER](state) {
        state.logged_in = true
    },

    [types.LOGOUT_USER](state) {
        state.logged_in = false
    },
    [types.GET_TOKEN](state) {
        state.getToken = true
    },
    [types.GET_TOKEN_AF](state) {
        state.getToken = false
    },
    [types.SAVE_TOKEN](state, { token }) {
        state.token = token
    }

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}