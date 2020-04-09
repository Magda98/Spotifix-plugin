import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import vuetify from '@/plugins/vuetify';
import Vuex from 'vuex';
import VuexWebExtensions from 'vuex-webextensions';
import * as actions from '@/store/actions'
import * as getters from '@/store/getters'
import user from '@/store/modules/user'
import toastMessage from '@/store/modules/toastMessage'
import VuexPersistence from 'vuex-persist'
import axios from "axios";

Vue.use(Vuex)


// const debug = process.env.NODE_ENV !== 'production'

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
    },
    mutations: {
        RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION // this mutation **MUST** be named "RESTORE_MUTATION"
    },
    strict: true,
    plugins: [vuexLocal.plugin, VuexWebExtensions()]
})

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    created() {
        this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'user/SAVE_TOKEN') {
                axios.defaults.headers.common['Authorization'] = `Bearer ${state.user.token}`;
            }
        })
        if (this.$store.state.user.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.$store.state.user.token}`;
            this.$store.dispatch("user/getUserInfo");
        }
    },
    render: h => h(App)
}).$mount("#app");