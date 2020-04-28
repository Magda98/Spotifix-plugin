<template>
  <v-container
    style="flex-direction: column;box-shadow: none; padding:0; background-color: #d1c4e9;height: fit-content; box-shadow: 2px 0px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12); z-index: 100; position: relative;"
  >
   <v-row>
       <v-col cols="12" >
        <v-card v-if="currentTrack.album"   color="primaryLight">
        <div class="d-flex flex-no-wrap justify-left">
           <v-avatar v-if="currentTrack.album"
                class="ma-3"
                size="75"
                tile
              >
                <v-img :src="currentTrack.album.images[0].url"></v-img>
              </v-avatar>
              <div>
    <v-card-title   style="font-size:14px !important; line-height:14px;"
                  class="headline"
                  v-text="currentTrack.name"
                ></v-card-title>

                <v-card-subtitle style="font-size:12px;">{{currentTrack.album.name}} <v-icon style="font-size:9px; padding: 0 5px;">mdi-checkbox-blank-circle</v-icon><span v-for="artist in (currentTrack.artists)" :key="artist.id" v-html="' '+ artist.name"></span></v-card-subtitle>
              </div>
            </div>
          </v-card>
       </v-col>
   </v-row>
   <v-row style="margin-bottom:-10px;">
        <v-col cols="4" style="display:flex;justify-content:center;align-items:center;padding-left:22px;">
            <v-slider 
            color="secondary"
          min="0"
          step="10"
          v-on:change="setVolume"
          max="100"
          v-model="sliderVol"
        >
                 <template v-slot:prepend id="song">
            <v-btn v-on:click="volume === null ? updateVolume(100) : updateVolume(0)" height="27" width="27" color="secondary" icon><v-icon>{{volume != null? "mdi-volume-high" : "mdi-volume-off" }}</v-icon></v-btn>
            </template>

        </v-slider>
            </v-col>
       <v-col   cols="4" id="sp-palyer" style="display:flex;justify-content:center;align-items:center;margin-top:-20px;">
          <v-btn v-on:click="prev"  :disabled="player.disallows.skipping_prev" icon min-height="45" min-width="45" >
      <v-icon  color="secondary">mdi-skip-previous-circle-outline</v-icon>
    </v-btn>
    <v-btn icon min-width="45" min-height="45" v-if="player.paused" :disabled="player.disallows.skipping_resuming" v-on:click="resumed()">
      <v-icon  color="secondary" style="font-size: 35px;">mdi-play-circle-outline</v-icon>
    </v-btn>

    <v-btn icon min-width="45" min-height="45" v-if="!player.paused" :disabled="player.disallows.skipping_pausing" v-on:click="paused()" >
      <v-icon  color="secondary" style="font-size: 35px;">mdi-pause-circle-outline</v-icon>
    </v-btn>
    <v-btn icon min-width="45" min-height="45" :disabled="player.disallows.skipping_next" v-on:click="next">
      <v-icon  color="secondary" >mdi-skip-next-circle-outline</v-icon>
    </v-btn>
       </v-col>
       <v-col cols="4" style="    display: flex;
    justify-content: space-evenly;">
          <v-btn icon min-width="30" min-height="30" v-on:click="shuffle(!shufflePlay)" >
      <v-icon  :color="shufflePlay? 'secondaryDark' : 'secondaryLight'" style="font-size: 25px;">mdi-shuffle</v-icon>
    </v-btn>
    <v-btn v-if="repeatPlay === 'off'" icon min-width="30" min-height="30" v-on:click="repeat('context')"  >
      <v-icon  color="secondaryLight" style="font-size: 25px;">mdi-repeat</v-icon>
    </v-btn>
     <v-btn v-else-if="repeatPlay === 'context'" icon min-width="30" min-height="30" v-on:click="repeat('track')"  >
      <v-icon  color="secondaryDark" style="font-size: 25px;">mdi-repeat</v-icon>
    </v-btn>
     <v-btn v-else-if="repeatPlay === 'track'" icon min-width="30" min-height="30" v-on:click="repeat('off')" >
      <v-icon  color="secondaryDark" style="font-size: 25px;">mdi-repeat-once</v-icon>
    </v-btn>
          </v-col>
        <v-col  cols="11" style="display:flex;justify-content:center;align-items:center;padding:0px; margin: -10px auto 0 auto;">
    <v-slider 
    color="secondary"
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
import { mapGetters, mapActions } from 'vuex';
import browser from "webextension-polyfill"
export default {
    data(){
      return{
        play: false,
      }
    },
     computed: {
        ...mapGetters("player", ["currentSec", "maxSec", "currentTrack", "songCurrentMilisec", "songDuration", "player", "volume", "shufflePlay", "repeatPlay"]),
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
      ...mapActions("player", ["shuffle", "repeat"]),
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
          },
          updateVolume(value){
              browser.runtime.sendMessage({msg:'player/updateVolume', type:'player', value: value/100});
              browser.runtime.sendMessage({msg:'player/setVolume', type:'player'});
             
         }
    },
    
}
</script>
<style lang="scss" scoped>

</style>