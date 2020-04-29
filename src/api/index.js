import _ from "lodash";
import axios from "axios";

axios.defaults.baseURL = "https://api.spotify.com/v1/";
axios.defaults.headers.post["Content-Type"] = "application/json";

/**
 * @module Api
 * @desc Send request to Spotify API
 */

export default {
  /**
   * @param {Function} cb - CallBack Function to get server response
   */
  getUserInfo(cb) {
    axios
      .get("me")
      .then((response) => {
        cb(response.data);
      })
      .catch((e) => {
        cb(e.response.data.error);
      });
  },
  /**
   * @param {Function} cb - CallBack Function to get server response
   * @param {Object} data - Pass device ID and song uri
   */
  playSong(cb, data) {
    axios
      .put(`me/player/play?device_id=${data.id}`, {
        uris: [data.track],
      })
      .then((response) => {
        cb(response.data);
      })
      .catch((e) => cb(e.response.data.error));
  },
  /**
   * @param {Function} cb - CallBack Function to get server response
   * @param {Object} data - Pass device ID and album/artists/playlists uri
   */
  playPlaylist(cb, data) {
    axios
      .put(`me/player/play?device_id=${data.id}`, {
        context_uri: data.uri,
      })
      .then((response) => {
        cb(response.data);
      })
      .catch((e) => cb(e.response.data.error));
  },
  /**
   * @param {Function} cb - CallBack Function to get server response
   */
  getSavedTracks(cb) {
    axios
      .get(`me/tracks`, {
        limit: 50,
      })
      .then((response) => {
        cb(response.data);
      })
      .catch((e) => cb(e.response.data.error));
  },
  /**
   * @param {Function} cb - CallBack Function to get server response
   * @param {String} data - Text from search input
   */
  search(cb, data) {
    if (data !== null) data = encodeURIComponent(data.trim());
    axios
      .get(`search?q=${data}&type=album,track,artist,playlist&limit=6`)
      .then((response) => {
        cb(response.data);
      })
      .catch((e) => cb(e.response.data.error));
  },
  /**
   * @param {Function} cb - CallBack Function to get server response
   * @param {Array} ids - Array of current searched songs ID's
   */
  checkSavedTracks(cb, ids) {
    ids = ids.join(",");
    axios
      .get(`me/tracks/contains?ids=${ids}`)
      .then((response) => {
        cb(response.data);
      })
      .catch((e) => cb(e.response.data.error));
  },
  /**
   * @param {Function} cb - CallBack Function to get server response
   * @param {String} data - Shuffle mode
   */
  playShuffle(cb, data) {
    axios
      .put(`me/player/shuffle?state=${data}`)
      .then((response) => {
        cb(response.data);
      })
      .catch((e) => cb(e.response.data.error));
  },
  /**
   * @param {Function} cb - CallBack Function to get server response
   * @param {String} data - Repeat mode
   */
  playRepeat(cb, data) {
    axios
      .put(`me/player/repeat?state=${data}`)
      .then((response) => {
        cb(response.data);
      })
      .catch((e) => cb(e.response.data.error));
  },
  /**
   * @param {Function} cb - CallBack Function to get server response
   * @param {String} data - ID of song to save to liked songs
   */
  saveTracks(cb, data) {
    axios
      .put(`me/tracks`, {
        ids: [data],
      })
      .then((response) => {
        cb(response.data);
      })
      .catch((e) => cb(e.response.data.error));
  },
  /**
   * @param {Function} cb - CallBack Function to get server response
   * @param {String} data - ID of song to remove from liked songs
   */
  deleteTracks(cb, data) {
    axios
      .delete(`me/tracks?ids=${data}`)
      .then((response) => {
        cb(response.data);
      })
      .catch((e) => cb(e.response.data.error));
  },
  /**
   * @param {Function} cb - CallBack Function to get server response
   * @param {String} data - uri of song to add to player queue
   */
  addToQueue(cb, data) {
    axios
      .post(`me/player/queue?uri=${data}`)
      .then((response) => {
        cb(response.data);
      })
      .catch((e) => cb(e.response.data.error));
  },
};
