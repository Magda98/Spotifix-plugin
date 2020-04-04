import _ from "lodash";
import axios from "axios";
import router from "@/router"

axios.defaults.baseURL = "https://api.spotify.com/v1/";
axios.defaults.headers.post['Content-Type'] = 'application/json';

const api = {
    clientID: "9e71951e46e74a79ac078ac56f76ba69",
    clientSecret: "***REMOVED***"
}

export default {
    getUserInfo(cb) {
        axios.get("me").then(response => {
            cb(response.data);
        }).catch(e => {
            cb(e.response.data.error);
        })
    },
};