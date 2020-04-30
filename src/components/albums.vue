<template>
  <v-row style="margin: 0 auto;">
    <v-col
      v-for="item in items"
      :key="item.uri"
      cols="3"
      style="margin: 0 auto;"
    >
      <v-card
        height="180px"
        color="#E1E2E1"
        flat
        @click="playPlaylist(item.uri)"
      >
        <v-avatar v-if="item.images.length > 0" class="ma-3" size="100" tile>
          <v-img :src="item.images[0].url"></v-img>
        </v-avatar>
        <v-card-title
          style="font-size: 12px; line-height: 12px; padding: 6px;"
          v-text="item.name"
        ></v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
/**
 * @module components/albums
 * @desc Display albums and playlists
 * @vue-prop {Array} items - Array of albums/playlists
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
