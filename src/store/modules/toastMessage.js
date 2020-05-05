import _ from "lodash";

/**
 * @module store/modules/toastMessage
 * @desc Shows snackbar messages for user
 */

/**
 * The Vuex 'state' object.
 * @name State
 * @type {object}
 * @property {String} alertType="success" - Type of message
 * @property {String} alertIcon="mdi-checkbox-marked-circle-outline" - Message icon
 * @property {String} message - Message
 * @property {Number} timeout=2000 - Snackbar timeout
 * @property {Bolean} showAlert=false -If true snackbar is showed
 */
const state = {
  alertType: "success",
  alertIcon: "mdi-checkbox-marked-circle-outline",
  message: "",
  timeout: 2000,
  showAlert: false,
};

/**
 * The module 'getters' object.
 * @name Getters
 * @type {object}
 * @getter {Number} timeout=timeout Returns a property that is a Number
 * @getter {String} alertType=alertType Returns a property that is a String
 * @getter {String} alertIcon=alertIcon Returns a property that is a String
 * @getter {String} message=message Returns a property that is a String
 * @getter {Bolean} showAlert=showAlert Returns a property that is a Bolean
 */

const getters = {
  timeout: (state) => state.timeout,
  alertType: (state) => state.alertType,
  alertIcon: (state) => state.alertIcon,
  message: (state) => state.message,
  showAlert: (state) => state.showAlert,
};

/**
 * @name Actions
 *  - call the specific Api functions
 * @desc
 * alert - shows snackbart with message <br/>
 * hideAlert - hide snackbar after click close button <br/>
 */
const actions = {
  alert({ commit }, payload) {
    commit("showAlert", payload);
  },
  hideAlert({ commit }) {
    commit("hideAlert");
  },
};

/**
 * The module 'setters' object.
 * @name Mutations
 * @type {object}
 * @mutator {Bolean} hideAlert=showAlert Sets the state Bolean property
 * @mutator {Bolean|String|Number} showAlert=showAlert,alertType,message,timeout Sets the state Bolean, Number, String property
 */
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
