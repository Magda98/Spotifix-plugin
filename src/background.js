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
    plugins: [vuexLocal.plugin, VuexWebExtensions()]
})
window.onSpotifyWebPlaybackSDKReady = () => {
    const token = store.state.user.token;
    const player = new Spotify.Player({
        name: 'Spotifix',
        getOAuthToken: cb => { cb(token); }
    });
    console.log(store.state.user.token)
    axios.defaults.headers['Authorization'] = `Bearer ${store.state.user.token}`;

    // Error handling
    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
        console.log("XD");
    });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => {
        store.dispatch("toastMessage/alert", { message: "Sorry, You have no premium account. 😔", type: "warning" });
    });
    player.addListener('playback_error', ({ message }) => {
        if (store.state.currentTrack.uri)
            store.dispatch("player/playSong", { uri: store.state.currentTrack.uri });
        else
            store.dispatch("toastMessage/alert", { message: "No song was loaded", type: "error" });
    });

    // Playback status updates
    player.addListener('player_state_changed', statePlayer => {
        store.commit("player/saveCurrentTrack", statePlayer.track_window.current_track);
        if (!statePlayer.paused) {
            store.commit("player/playingSong", statePlayer);
            if (!store.state.interval)
                store.commit("player/setInt", setInterval(() => { store.commit("player/updateTime") }, 1000));
        } else {
            store.commit("player/pause");
            if (store.state.interval)
                store.commit("player/setInt", false);
        }
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        store.commit("player/saveId", device_id);
        // console.log('Ready with Device ID', device_id);
        store.dispatch("toastMessage/alert", { message: "Player is ready", type: "success" });
        store.commit("player/setInt", false);
        console.log("READY");
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        // console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
    store.commit("player/savePlayer", player);
    // Vue.prototype.$player = player;
};


browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    store.dispatch("user/login");
})
browser.runtime.onMessage.addListener((request) => {
    console.log(request)
    store.dispatch(request);
});