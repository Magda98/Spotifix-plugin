import Vue from 'vue';
import Vuex from 'vuex';
import VuexWebExtensions from 'vuex-webextensions';
import user from '@/store/modules/user'
import player from '@/store/modules/player'
import spotify from '@/store/modules/spotify'
import VuexPersistence from 'vuex-persist'
import browser from "webextension-polyfill"
import axios from "axios";
import { initialize } from '@/spotifyPlayer'

/**
 * @module background
 * @desc Background script where player is initialized
 */


window.onSpotifyWebPlaybackSDKReady = () => {};
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

/**
 * @param {} vuexLocal  
 * @desc cerate VuexPersistance to map store to localStorage
 */
const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    key: 'spotifix-plugin',
    strictMode: true
})


/**
 * @param {} store 
 * @desc cerate Vuex store instance
 */
const store = new Vuex.Store({
    modules: {
        user,
        player,
        spotify
    },
    mutations: {
        RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION // this mutation **MUST** be named "RESTORE_MUTATION"
    },
    strict: true,
    plugins: [vuexLocal.plugin, VuexWebExtensions({
        syncActions: false,
    })]
})

Vue.prototype.$store = store;
store.dispatch("user/login", false);
store.subscribe((mutation, state) => {
    if (mutation.type === 'user/SAVE_TOKEN') {
        initialize()
    }
})
initialize()

/**
 * @desc Catch messages from popup and call function from store by dispatch
 */
browser.runtime.onMessage.addListener((request) => {
    if (request.type === 'player') {
        store.dispatch(request.msg, request.value ? request.value : null);
    }
});