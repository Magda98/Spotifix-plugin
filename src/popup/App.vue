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
                <v-btn v-on:click="login()">
                  Zaloguj
      <v-icon>feedback</v-icon>
    </v-btn>
  </div>
    </v-content>
  </v-app>
</template>

<script>
import {mapActions} from "vuex";
export default {
  name: 'App',
  methods: {
    ...mapActions("user", ["login"]),

  }
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
