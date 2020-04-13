<template>
  <v-app>
    <v-app-bar
      app
      color="teal"
      dark
    >
      <div class="d-flex align-center">

      </div>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <div>
  </div>
  <div v-if="loggedIn">
     <v-list
          dense
          nav
          class="py-0"
        >
            <v-list-item-avatar >
              <img :src="userInfo.images[0].url">
            </v-list-item-avatar>
          <v-list-item two-line :class="true && 'px-0'">
            <v-list-item-content>
              <v-list-item-title>{{userInfo.display_name}}</v-list-item-title>
              <v-list-item-subtitle>{{userInfo.email}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
     </v-list>
     </div>
     <v-card v-on:click="playSong(saved.items[2].track.uri)" v-if="saved.items">
       {{saved.items[2].track.name}}
     </v-card>
     <player v-if="loggedIn"/> 
    </v-content>
  </v-app>
</template>

<script>
import player from "../components/player"
import {mapActions, mapGetters} from 'vuex'
export default {
  name: 'App',
  components: {player},
  computed:{
    ...mapGetters('user',['loggedIn', 'userInfo']),
    ...mapGetters('spotify', ['saved'])
  },
  methods: {
    ...mapActions('spotify', ['getUserTracks']),
    ...mapActions('player', ['playSong'])
  },
  created(){
  }
}
</script>

<style>
html {
  width: 400px;
  height: 400px;

}
body{
  border-radius: 5px;
  margin:0 !important;
}

</style>
