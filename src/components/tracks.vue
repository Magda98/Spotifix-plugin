<template>
  <v-list color="#F5F5F6">
    <v-list-item v-for="(item, index) in items" :key="index">
      <v-list-item-icon>
        <v-btn
          icon
          v-on:click="
            liked[index] === false ? saveTrack(item.id) : deleteTrack(item.id)
          "
        >
          <v-icon color="primary">{{
            liked[index] === false ? "mdi-heart-outline" : "mdi-heart"
          }}</v-icon>
        </v-btn>
        <v-btn color="secondary" icon @click="addToQueue(item.uri)">
          <v-icon>mdi-playlist-plus</v-icon>
        </v-btn>
      </v-list-item-icon>
      <v-list-item flat @click="playSong(item.uri)" style="margin-left: 20px;">
        <v-list-item-content style="width: 300px;">
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-avatar v-if="item.album.images.length > 0">
          <v-img :src="item.album.images[1].url"></v-img>
        </v-list-item-avatar>
      </v-list-item>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapActions } from "vuex";

/**
 * @module components/tracks
 * @desc Display tracks list
 * @vue-prop {Array} items - Array of tracks
 * @vue-prop {Array} liked - Array of Bolean wihich song is liked
 * @vue-event {String} spotify/saveTrack - Add track to liked songs
 * @vue-event {String} spotify/deleteTrack - Remove track from liked songs
 * @vue-event {String} spotify/addToQueue - Addtrack to queue in player
 * @vue-event {String} player/playSong - Playing clicked song
 */
export default {
  props: {
    items: Array,
    liked: Array,
  },
  methods: {
    ...mapActions("player", ["playSong"]),
    ...mapActions("spotify", ["saveTrack", "deleteTrack", "addToQueue"]),
  },
};
</script>
