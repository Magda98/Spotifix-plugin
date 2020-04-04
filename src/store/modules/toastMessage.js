import _ from "lodash";
import * as types from "../mutation-types";

const state = {
    alertType: "success",
    alertIcon: "mdi-checkbox-marked-circle-outline",
    message: "",
    timeout: 2000,
    showAlert: false,
}
const getters = {
    timeout: state => state.timeout,
    alertType: state => state.alertType,
    alertIcon: state => state.alertIcon,
    message: state => state.message,
    showAlert: state => state.showAlert
}
const actions = {
    alert({ commit }, payload) {
        commit("showAlert", payload);
    },
    hideAlert({ commit }) {
        commit("hideAlert");
    },

}

const mutations = {
    hideAlert(state) {
        state.showAlert = false;
    },
    showAlert(state, payload) {
        state.alertType = payload.type;
        state.message = payload.message;
        state.showAlert = true;
        state.timeout = payload.timeout;

        switch (payload.type || "success") {
            case "success":
                state.alertIcon = "mdi-checkbox-marked-circle-outline";
                break;
            case "error":
            case "warning":
                state.alertIcon = "mdi-minus-circle-outline";
                break;
            case "info":
                state.alertIcon = "mdi-alert-circle-outline";
                break;
        }
    },

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};