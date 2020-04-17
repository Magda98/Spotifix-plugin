<template>
  <v-app style="max-height:fit-content;" >
    <v-app-bar
      app
      color="primary"
      flat
    >

    <div v-if="loggedIn">
     <v-list style="background-color: transparent;">
       <v-list-item>
            <v-list-item-avatar >
              <img :src="userInfo.images[0].url">
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{userInfo.display_name}}</v-list-item-title>
              <v-list-item-subtitle>{{userInfo.email}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
     </v-list>
     </div>
     <div v-else>
       <v-btn v-on:click="login(true)" outlined>
         zaloguj
       </v-btn>
      </div> 
    </v-app-bar>
    <v-content style="max-height:fit-content;">
          <v-text-field prepend-inner-icon="mdi-magnify" dense outlined autocomplete="off" style="margin: 5px 20px;" height="39px"
        @focus="searchInp = true" v-model="searchModel" v-on:input="searchModel != ''? search($event): null">
        </v-text-field>
        <v-card :style="searchModel != '' ? ' width: 100%;height: 100%; max-height:250px;overflow: hidden;' : 'max-height: 0px; height: 0px;'" v-if="searched.tracks && searchInp && searchModel != ''">
          <div style=" width: 100%; overflow-y: scroll; padding-right: 17px; box-sizing: content-box;height: 100%; ">
          <v-card-title>Utwory</v-card-title>
          <v-list v-if="searched.tracks && searchInp && searchModel != ''">
      <v-list-item
        v-for="item in searched.tracks.items"
        :key="item.uri"
        @click="playSong(item.uri)"
      >
        <v-list-item-icon>
          <v-icon  color="primary">mdi-heart-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-avatar>
          <v-img :src="item.album.images[1].url"></v-img>
        </v-list-item-avatar>
      </v-list-item>
    </v-list>
    <v-card-title>Albumy</v-card-title>
     <v-row style="margin: 0 auto;"  v-if="searched.albums && searchInp && searchModel != ''">
      <v-col
        v-for="item in searched.albums.items"
        :key="item.uri"
        cols="3"
        style="margin: 0 auto;"
      >
      <v-card flat @click="playSong(item.uri)">
              <v-avatar
                class="ma-3"
                size="100"
                tile
              >
                <v-img :src="item.images[1].url"></v-img>
              </v-avatar>
          <v-card-title style="font-size: 12px;line-height:12px;" v-text="item.name"></v-card-title>
      </v-card>
      </v-col>
    </v-row>
          </div>
    </v-card>
    </v-content>
     <player v-if="loggedIn"/> 
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
    ...mapGetters('spotify', ['saved', 'searched'])
  },
  methods: {
    ...mapActions('spotify', ['getUserTracks', 'search']),
    ...mapActions('player', ['playSong']),
    ...mapActions('user', ['login'])
  },
  created(){
  },
  data() {
    return {
      searchInp: false,
      searchModel: "",
    }
  },
}
</script>

<style>

body{
  width: 500px; 
  border-radius: 5px;
  margin:0 !important;
  overflow: hidden;
  height:auto;
}
.v-application--wrap {
      min-height: auto !important;
}
</style>
