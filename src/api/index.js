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
    playSong(cb, data) {
        axios.put(`me/player/play?device_id=${data.id}`, {
            uris: [data.track]
        }).then(response => {
            cb(response.data)
        }).catch(e => cb(e.response.data.error))
    },
    playPlaylist(cb, data) {
        axios.put(`me/player/play?device_id=${data.id}`, {
            context_uri: data.uri
        }).then(response => {
            cb(response.data)
        }).catch(e => cb(e.response.data.error))
    },
    getSavedTracks(cb) {
        axios.get(`me/tracks`, {
                limit: 50
            }).then(response => {
                cb(response.data)
            })
            .catch(e => cb(e.response.data.error))
    },
    search(cb, data) {
        data = encodeURIComponent(data.trim())
        axios.get(`search?q=${data}&type=album,track,artist,playlist&limit=6`).then(response => {
                cb(response.data)
            })
            .catch(e => cb(e.response.data.error))
    },
    checkSavedTracks(cb, ids) {
        ids = ids.join(',');
        axios.get(`me/tracks/contains?ids=${ids}`).then(response => {
            cb(response.data)
        }).catch(e => cb(e.response.data.error))
    },
    playShuffle(cb, data) {
        axios.put(`me/player/shuffle?state=${data}`).then(response => {
            cb(response.data)
        }).catch(e => cb(e.response.data.error))
    },
    playRepeat(cb, data) {
        axios.put(`me/player/repeat?state=${data}`).then(response => {
            cb(response.data)
        }).catch(e => cb(e.response.data.error))
    },
    saveTracks(cb, data) {
        axios.put(`me/tracks`, {
                ids: [data]
            }).then(response => {
                cb(response.data)
            })
            .catch(e => cb(e.response.data.error))
    },
    deleteTracks(cb, data) {
        axios.delete(`me/tracks?ids=${data}`).then(response => {
                cb(response.data)
            })
            .catch(e => cb(e.response.data.error))
    },
    addToQueue(cb, data) {
        axios.post(`me/player/queue?uri=${data}`).then(response => {
                cb(response.data)
            })
            .catch(e => cb(e.response.data.error))
    }
};