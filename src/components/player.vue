<template>
  <v-bottom-navigation
    dark
    id="sp-nav"
  >
   <v-row justify="center" align="center" style="display:flex;">
       <v-col cols="12" >
        <v-card flat color="#2E2E2E"  >
        <div class="d-flex flex-no-wrap justify-space-between">
              <div>
    <v-card-title   style="font-size:12px !important; line-height:12px;"
                  class="headline"
                  v-text="currentTrack.name"
                ></v-card-title>

                <v-card-subtitle style="font-size:10px;"><span v-for="artist in (currentTrack.artists)" :key="artist.id" v-html="artist.name + ' ' "></span></v-card-subtitle>
              </div>

              <v-avatar v-if="currentTrack.album"
                class="ma-3"
                size="50"
                tile
              >
                <v-img :src="currentTrack.album.images[1].url"></v-img>
              </v-avatar>
            </div>
          </v-card>
       </v-col>
       <v-col  md="12" lg="12" sm="12" id="sp-palyer" style="display:flex;justify-content:center;align-items:center;">
          <v-btn v-on:click="prev">
      <v-icon>mdi-skip-previous-circle-outline</v-icon>
    </v-btn>
    <v-btn v-if="player.paused" v-on:click="resumed()">
      <v-icon style="font-size: 35px;">mdi-play-circle-outline</v-icon>
    </v-btn>

    <v-btn v-if="!player.paused" v-on:click="paused()" >
      <v-icon style="font-size: 35px;">mdi-pause-circle-outline</v-icon>
    </v-btn>
    <v-btn v-on:click="next">
      <v-icon >mdi-skip-next-circle-outline</v-icon>
    </v-btn>
       </v-col>
        <v-col  cols="12">
    <v-slider 
          :label="(parseInt(maxSec/60)).toString() +':'+( parseInt(maxSec%60) < 10 ? ('0'+parseInt(maxSec%60).toString()) : parseInt(maxSec%60).toString() )"
          min="0"
          step="1000"
          v-on:change="seek"
          :max="songDuration"
          v-model="slider"
        ></v-slider>
            </v-col>
    </v-row>
  </v-bottom-navigation>
</template>

<script>
import { mapGetters } from 'vuex';
import browser from "webextension-polyfill"
export default {
    data(){
      return{
        play: false,
      }
    },
     computed: {
        ...mapGetters("player", ["currentSec", "maxSec", "currentTrack", "songCurrentMilisec", "songDuration", "player"]),
          slider: {
         get() { return this.songCurrentMilisec },
         set(value) { browser.runtime.sendMessage({msg:'player/updateSongTime', type:'player', value: value});},
      },
    },
    methods:{
        next(){
          browser.runtime.sendMessage({msg:'player/next', type:'player'});
        },
        prev(){
          browser.runtime.sendMessage({msg:'player/prev', type:'player'})
        },
        seek(){
          browser.runtime.sendMessage({msg:'player/seek', type:'player'})
        },
        resumed(){
          if(this.player.paused){
             browser.runtime.sendMessage({msg:'player/resume', type:'player'});
          }
        },
        paused(){
          if(!this.player.paused){
             browser.runtime.sendMessage({msg:'player/pause', type:'player'});
          }
        }
    },
    
}
</script>
<style lang="scss" scoped>
.v-slider__track-background, .v-slider__track-fill, .v-input__slot, .v-slider__thumb-container, .v-slider__thumb:before {
    transition: 3.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;  
}
#sp-nav{
  height: 120px !important;
}
@media only screen and (max-width: 900px) {
  #sp-nav{
  height: 200px !important;
}
.col-sm-12{
  padding: 0 !important;
}
}
</style>