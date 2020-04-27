<template>
  <v-app style="max-height:fit-content;" >
    <v-app-bar
      app
      color="primaryDark"
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
       <v-btn v-on:click="loginUser()"  color="secondaryDark" class="white--text" >
         zaloguj
       </v-btn>
      </div> 
    </v-app-bar>
    <v-content style="max-height:fit-content; background-color: #F5F5F6;">
          <v-text-field v-if="loggedIn" clearable color="secondary"  prepend-inner-icon="mdi-magnify" dense outlined autocomplete="off" style="margin: 5px 20px;    height: 40px;"
       @click:clear="searchInp=false" v-model="searchModel" v-on:input="searchModel != ''? search($event): null;searchInp = true ">
        </v-text-field>
        <v-card flat color="#F5F5F6" :style="searchModel != '' ? ' width: 100%;height: 250px; max-height:250px;overflow: hidden; transition:height 0.3s ease-out;' : 'max-height: 0px; height: 0px;transition:height 0.3s ease-out;'" v-if="searched.tracks && searchInp && searchModel != ''">
          <div style=" width: 100%; overflow-y: scroll; padding-right: 17px; box-sizing: content-box;height: 100%; ">
          <v-card-title>Utwory</v-card-title>
          <v-list color="#F5F5F6" v-if="searched.tracks && searchInp && searchModel != ''">
      <v-list-item
        v-for="(item,index) in searched.tracks.items"
        :key="index"
      >
        <v-list-item-icon>
          <v-btn icon v-on:click="liked[index] === false? saveTrack(item.id): deleteTrack(item.id)">
          <v-icon   color="primary">{{liked[index] === false? 'mdi-heart-outline' : 'mdi-heart'}}</v-icon>
          </v-btn>
        </v-list-item-icon>
        <v-list-item flat @click="playSong(item.uri)">
        <v-list-item-content  style="max-width: 300px;">
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-avatar>
          <v-img :src="item.album.images[1].url"></v-img>
        </v-list-item-avatar>
        </v-list-item>
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
      <v-card height="180px" color="#E1E2E1" flat @click="playPlaylist(item.uri)">
              <v-avatar
                class="ma-3"
                size="100"
                tile
              >
                <v-img :src="item.images[1].url"></v-img>
              </v-avatar>
          <v-card-title style="font-size: 12px;line-height:12px; padding:6px;" v-text="item.name"></v-card-title>
      </v-card>
      </v-col>
    </v-row>
          </div>
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
    ...mapGetters('spotify', ['saved', 'searched', 'liked'])
  },
  methods: {
    ...mapActions('spotify', ['getUserTracks', 'search', 'saveTrack', 'deleteTrack']),
    ...mapActions('player', ['playSong', 'playPlaylist']),
    ...mapActions('user', ['login']),
    loginUser(){
      window.close();
      this.login(true);
    }
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
