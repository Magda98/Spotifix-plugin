<template>
  <v-list color="#F5F5F6">
    <v-list-item
      v-for="(item, index) in items"
      :key="index"
      @click="playPlaylist(item.uri)"
    >
      <v-list-item-avatar v-if="item.images.length > 0">
        <v-img :src="item.images[0].url"></v-img>
      </v-list-item-avatar>
      <v-list-item-content style="width: 300px;">
        <v-list-item-title v-text="item.name"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapActions } from "vuex";

/**
 * @module components/artists
 * @desc Display a list of searched artists
 * @vue-prop {Array} items - Array of artists
 * @vue-event {String} spotify/playPlaylist - Playing clicked album/playlist/artist
 */
export default {
  props: {
    items: Array,
  },
  methods: {
    ...mapActions("player", ["playPlaylist"]),
  },
};
</script>
