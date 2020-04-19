<template>
  <v-container
    light
    style="flex-direction: column;box-shadow: none; padding:0;"
  >
   <v-row>
       <v-col cols="12" >
        <v-card v-if="currentTrack.album"   color="primary">
        <div class="d-flex flex-no-wrap justify-left">
           <v-avatar v-if="currentTrack.album"
                class="ma-3"
                size="75"
                tile
              >
                <v-img :src="currentTrack.album.images[0].url"></v-img>
              </v-avatar>
              <div>
    <v-card-title   style="font-size:16px !important; line-height:12px;"
                  class="headline"
                  v-text="currentTrack.name"
                ></v-card-title>

                <v-card-subtitle style="font-size:12px;">{{currentTrack.album.name}} <v-icon style="font-size:11px; padding: 0 5px;">mdi-checkbox-blank-circle</v-icon><span v-for="artist in (currentTrack.artists)" :key="artist.id" v-html="' '+ artist.name"></span></v-card-subtitle>
              </div>
            </div>
          </v-card>
       </v-col>
   </v-row>
   <v-row style="margin-bottom:-10px;">
        <v-col cols="3" style="display:flex;justify-content:center;align-items:center;">
            <v-slider 
          :prepend-icon='volume != null? "mdi-volume-high" : "mdi-volume-off" '
          min="0"
          step="10"
          v-on:change="setVolume"
          max="100"
          v-model="sliderVol"
        ></v-slider>
            </v-col>
       <v-col   cols="4" id="sp-palyer" style="display:flex;justify-content:center;align-items:center;margin-top:-20px;">
          <v-btn v-on:click="prev"  icon min-height="45" min-width="45" >
      <v-icon  color="primary">mdi-skip-previous-circle-outline</v-icon>
    </v-btn>
    <v-btn icon min-width="45" min-height="45" v-if="player.paused" v-on:click="resumed()">
      <v-icon  color="primary" style="font-size: 35px;">mdi-play-circle-outline</v-icon>
    </v-btn>

    <v-btn icon min-width="45" min-height="45" v-if="!player.paused" v-on:click="paused()" >
      <v-icon  color="primary" style="font-size: 35px;">mdi-pause-circle-outline</v-icon>
    </v-btn>
    <v-btn icon min-width="45" min-height="45" v-on:click="next">
      <v-icon  color="primary" >mdi-skip-next-circle-outline</v-icon>
    </v-btn>
       </v-col>
        <v-col  cols="5" style="display:flex;justify-content:center;align-items:center;">
    <v-slider 
          min="0"
          step="1000"
          v-on:change="seek"
          :max="songDuration"
          v-model="slider"
        >
         <template v-slot:prepend id="song">
              <v-text-field
                :value="(parseInt(currentSec/60)).toString() +':'+( parseInt(currentSec%60) < 10 ? ('0'+parseInt(currentSec%60).toString()) : parseInt(currentSec%60).toString() )"
                class="mt-0 pt-0"
                hide-details
                :disabled="true"
                :readonly="true"
                style="width: 35px"
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :value="(parseInt(maxSec/60)).toString() +':'+( parseInt(maxSec%60) < 10 ? ('0'+parseInt(maxSec%60).toString()) : parseInt(maxSec%60).toString() )"
                class="mt-0 pt-0"
                hide-details
               :disabled="true"
                style="width: 35px"
                flat
              ></v-text-field>
            </template>
        </v-slider>
            </v-col>
    </v-row>
  </v-container>
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
        ...mapGetters("player", ["currentSec", "maxSec", "currentTrack", "songCurrentMilisec", "songDuration", "player", "volume"]),
          slider: {
         get() { return this.songCurrentMilisec },
         set(value) { browser.runtime.sendMessage({msg:'player/updateSongTime', type:'player', value: value});},
      },
       sliderVol: {
         get() { return this.volume * 100},
         set(value) { browser.runtime.sendMessage({msg:'player/updateVolume', type:'player', value: value/100});},
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
        },
            setVolume(){
             browser.runtime.sendMessage({msg:'player/setVolume', type:'player'});
          }
    },
    
}
</script>
<style lang="scss" scoped>

</style>