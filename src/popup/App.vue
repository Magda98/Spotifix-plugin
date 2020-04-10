<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <div>
     <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
       
      </v-btn>
      <v-btn v-on:click="login">
      Zaloguj
      <v-icon>feedback</v-icon>
      </v-btn>
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
    </v-content>
  </v-app>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  name: 'App',
  computed:{
    ...mapGetters('user',['loggedIn', 'userInfo']),
    ...mapGetters('spotify', ['saved'])
  },
  methods: {
    ...mapActions('user',['login']),
    ...mapActions('spotify', ['getUserTracks']),
     ...mapActions('player', ['playSong'])
  },
  created(){
    console.log(this.saved);

  }
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
