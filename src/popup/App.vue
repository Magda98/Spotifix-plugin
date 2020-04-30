<template>
  <v-app style="max-height: fit-content;">
    <v-app-bar app color="primaryDark" flat>
      <div v-if="loggedIn">
        <userInfo :userInfo="userInfo" />
      </div>
      <div v-else>
        <v-btn
          v-on:click="loginUser()"
          color="secondaryDark"
          class="white--text"
        >
          zaloguj
        </v-btn>
      </div>
    </v-app-bar>
    <v-content
      v-if="loggedIn"
      style="max-height: fit-content; background-color: #f5f5f6;"
    >
      <v-text-field
        clearable
        color="secondary"
        prepend-inner-icon="mdi-magnify"
        dense
        outlined
        autocomplete="off"
        style="margin: 5px 20px; height: 40px;"
        @click:clear="searchInp = false"
        v-model="searchModel"
        v-on:input="
          searchModel != '' ? search($event) : null;
          searchInp = true;
        "
      >
      </v-text-field>
      <v-card
        flat
        color="#F5F5F6"
        :style="
          searchModel != null
            ? ' width: 100%;height: 250px; max-height:250px;overflow: hidden; transition:height 0.3s ease-out;'
            : 'max-height: 0px; height: 0px;transition:height 0.3s ease-out;'
        "
        v-if="searched != undefined && searchInp && searchModel !== null"
      >
        <div
          style="
            width: 100%;
            overflow-y: scroll;
            padding-right: 17px;
            box-sizing: content-box;
            height: 100%;
          "
        >
          <v-card-title>Utwory</v-card-title>
          <tracks
            v-if="searched.tracks.items.length > 0"
            :items="searched.tracks.items"
            :liked="liked"
          />
          <v-card-title>Albumy</v-card-title>
          <albums
            v-if="searched.albums.items.length > 0"
            :items="searched.albums.items"
          />
          <v-card-title>Wykonawcy</v-card-title>
          <artists
            v-if="searched.artists.items.length > 0"
            :items="searched.artists.items"
          />
          <v-card-title>Playlisty</v-card-title>
          <albums
            v-if="searched.playlists.items.length > 0"
            :items="searched.playlists.items"
          />
        </div>
      </v-card>
      <player />
    </v-content>
  </v-app>
</template>

<script>
import player from "../components/player";
import albums from "../components/albums";
import artists from "../components/artists";
import tracks from "../components/tracks";
import userInfo from "../components/userInfo";
import { mapActions, mapGetters } from "vuex";

/**
 * @module popup/App
 * @desc Main vue application file for popup
 * @vue-data {Bolean} [searchInp = false] - Check if user is typing something
 * @vue-data {String} [searchModel = ''] - Get data from search input
 * @vue-computed {Bolean} user/loggedIn - True if user token is valid
 * @vue-computed {Object} user/userInfo - Get the user information - photo, email, name from store
 * @vue-computed {Object} spotify/saved - User saved tracks
 * @vue-computed {Object} spotify/searched - Object with searched items based on text from input
 * @vue-computed {Array.<Bolean>} spotify/liked - Array of bolean which song is in user saved tracks
 * @vue-event {} spotify/getUserTracks - Get saved tracks for user
 * @vue-event {String} spotify/search - Get searched items based on typed text
 * @vue-event {} user/login - Login user to Spotify
 * @vue-event {} loginUser - Close popup window then call a function from store user/login
 */
export default {
  name: "App",
  components: { player, albums, artists, tracks, userInfo },
  computed: {
    ...mapGetters("user", ["loggedIn", "userInfo"]),
    ...mapGetters("spotify", ["saved", "searched", "liked"]),
  },
  methods: {
    ...mapActions("spotify", ["getUserTracks", "search"]),
    ...mapActions("user", ["login"]),
    loginUser() {
      window.close();
      this.login(true);
    },
  },
  data() {
    return {
      searchInp: false,
      searchModel: "",
    };
  },
};
</script>

<style>
body {
  width: 500px;
  border-radius: 5px;
  margin: 0 !important;
  overflow: hidden;
  height: fit-content;
}
.v-application--wrap {
  min-height: auto !important;
}
div.v-input__slot:before {
  border-image: none !important;
  border-color: transparent !important;
}
</style>
