import Vue from "vue";
import axios from "axios";

/**
 * @module spotifyPlayer
 * @desc Function to initialize Spotify SDK
 */

const waitForSpotifyWebPlaybackSDKToLoad = async () =>
  new Promise((resolve) => {
    if (window.Spotify) resolve(window.Spotify);
    else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        resolve(window.Spotify);
      };
    }
  });

export async function initialize() {
  const Spotify = await waitForSpotifyWebPlaybackSDKToLoad();
  const token = Vue.prototype.$store.state.user.token;
  const player = new Spotify.Player({
    name: "Spotifix",
    getOAuthToken: (cb) => {
      cb(token);
    },
  });
  axios.defaults.headers[
    "Authorization"
  ] = `Bearer ${Vue.prototype.$store.state.user.token}`;

  // Error handling
  player.addListener("initialization_error", ({ message }) => {
    // eslint-disable-next-line no-console
    console.error(message);
  });
  player.addListener("authentication_error", ({ message }) => {
    // eslint-disable-next-line no-console
    console.error(message);
  });
  player.addListener("account_error", ({ message }) => {
    // console.error(message);
    Vue.prototype.$store.dispatch("toastMessage/alert", {
      message: "Sorry, You have no premium account. 😔",
      type: "warning",
    });
  });
  player.addListener("playback_error", ({ message }) => {
    // console.error(message);
    if (Vue.prototype.$store.state.player.currentTrack.uri)
      Vue.prototype.$store.dispatch(
        "player/playSong",
        Vue.prototype.$store.state.player.currentTrack.uri
      );
    else
      Vue.prototype.$store.dispatch("toastMessage/alert", {
        message: "No song was loaded",
        type: "error",
      });
  });

  // Playback status updates
  player.addListener("player_state_changed", (statePlayer) => {
    Vue.prototype.$store.commit("player/shuffle", statePlayer.shuffle);
    let data = "off";
    switch (statePlayer.repeat_mode) {
      case 0:
        data = "off";
        break;
      case 1:
        data = "context";
        break;
      case 2:
        data = "track";
        break;
    }
    Vue.prototype.$store.commit("player/repeat", data);
    Vue.prototype.$store.commit("player/player", statePlayer);
    Vue.prototype.$store.dispatch("player/getVolume");
    Vue.prototype.$store.commit(
      "player/saveCurrentTrack",
      statePlayer.track_window.current_track
    );
    if (!statePlayer.paused) {
      Vue.prototype.$store.commit("player/playingSong", statePlayer);
      if (!Vue.prototype.$store.state.user.interval)
        Vue.prototype.$store.commit(
          "player/setInt",
          setInterval(() => {
            Vue.prototype.$store.commit("player/updateTime");
          }, 1000)
        );
    } else {
      Vue.prototype.$store.commit("player/setInt", false);
    }
  });

  // Ready
  const ready = new Promise((resolve) => {
    player.addListener("ready", ({ device_id }) => {
      Vue.prototype.$store.commit("player/saveId", device_id);
      // console.log("Ready with Device ID", device_id);
      Vue.prototype.$store.dispatch("toastMessage/alert", {
        message: "Player is ready",
        type: "success",
      });
      if (!Vue.prototype.$store.state.player.player.paused) player.resume();
      Vue.prototype.$store.commit("player/setInt", false);
      resolve(player);
    });
  });
  // Not Ready
  player.addListener("not_ready", ({ device_id }) => {
    // eslint-disable-next-line no-console
    console.log("Device ID has gone offline", device_id);
  });

  // Connect to the player!
  player.connect();
  Vue.prototype.$player = player;
  return ready;
}
