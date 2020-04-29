import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import Vuex from "vuex";
import VuexWebExtensions from "vuex-webextensions";
import user from "@/store/modules/user";
import player from "@/store/modules/player";
import spotify from "@/store/modules/spotify";
import VuexPersistence from "vuex-persist";
import axios from "axios";

Vue.use(Vuex);

/**
 * @module popup/main
 * @desc Main js file where the Vue instance is createted for popup
 * @vue-data {Object} store - Instance of vuex store
 * @vue-data {Object} vuex-Local - Instance of VuexPersistance save store to localStorage
 * @vue-data {Object} Vue - Instance of Vue
 */

// const debug = process.env.NODE_ENV !== 'production'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    key: "spotifix-plugin",
    strictMode: true,
});

const store = new Vuex.Store({
    modules: {
        user,
        player,
        spotify,
    },
    mutations: {
        RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION, // this mutation **MUST** be named "RESTORE_MUTATION"
    },
    strict: true,
    plugins: [
        vuexLocal.plugin,
        VuexWebExtensions({
            syncActions: false,
            ignoredMutations: [
                "player/seekTime",
                "player/setInt",
                "player/updateTime",
                "player/saveCurrentTrack",
                "player/saveId",
            ],
        }),
    ],
});

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    created() {
        this.$store.subscribe((mutation, state) => {
            if (mutation.type === "user/SAVE_TOKEN") {
                axios.defaults.headers["Authorization"] = `Bearer ${state.user.token}`;
            }
        });
        if (this.$store.state.user.token) {
            axios.defaults.headers[
                "Authorization"
            ] = `Bearer ${this.$store.state.user.token}`;
            this.$store.dispatch("user/getUserInfo");
            this.$store.dispatch("spotify/getUserTracks");
        } else store.dispatch("user/login", false);
    },
    render: (h) => h(App),
}).$mount("#app");