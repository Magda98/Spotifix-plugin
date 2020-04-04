import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import vuetify from '@/plugins/vuetify';
import VuexWebExtensions from 'vuex-webextensions';
import * as actions from '@/store/actions'
import * as getters from '@/store/getters'
import user from '@/store/modules/user'
import toastMessage from '@/store/modules/toastMessage'
import VuexPersistence from 'vuex-persist'

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
    render: h => h(App)
}).$mount("#app");