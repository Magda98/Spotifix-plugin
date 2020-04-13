import Vue from 'vue';
import Vuex from 'vuex';
import VuexWebExtensions from 'vuex-webextensions';
import * as actions from '@/store/actions'
import * as getters from '@/store/getters'
import user from '@/store/modules/user'
import toastMessage from '@/store/modules/toastMessage'
import player from '@/store/modules/player'
import spotify from '@/store/modules/spotify'
import VuexPersistence from 'vuex-persist'
import browser from "webextension-polyfill"
import axios from "axios";
import { initialize } from '@/spotifyPlayer'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    key: 'spotifix-plugin',
    strictMode: true
})

const store = new Vuex.Store({
    actions,
    getters,
    modules: {
        user,
        toastMessage,
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
store.dispatch("user/login").then(
    initialize()
)
store.subscribe((mutation, state) => {
    if (mutation.type === 'user/SAVE_TOKEN') {
        initialize()
    }
})
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {})
browser.runtime.onMessage.addListener((request) => {
    if (request.type == 'player')
        store.dispatch(request.msg, request.value ? request.value : null);
});