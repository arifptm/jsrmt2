<template>

<v-fade-transition>
  <div>
<v-card flat>
      
    <v-layout row wrap >
      <v-toolbar color="primary" dark fixed flat>
        <v-toolbar-side-icon @click.native="$store.commit('drawerState')"></v-toolbar-side-icon>
        <v-toolbar-title class="ml-1">{{ $store.state.pageTitle }}</v-toolbar-title>    
        <v-spacer></v-spacer>        
        <v-icon @click="$router.push({name:'setting'})">close</v-icon>
      </v-toolbar>

          <v-flex xs12>
            <v-list two-line dense>
              <v-list-tile>
                <v-list-tile-content>
                  <v-select class="pt-3" hide-details item-value="id" item-text="title" :items="options.iqomah" v-model="audioIqomah.id" label="Iqomah"></v-select>    
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn color="primary" icon @click="audioIqomah.isPlaying ? pauseAudio(audioIqomah) : previewIqomah(audioIqomah)"><v-icon color="white">{{ audioIqomah.isPlaying === true ? 'pause' : 'play_arrow' }}</v-icon></v-btn>
                </v-list-tile-action>
              </v-list-tile>

              <v-list-tile class="primary lighten-5">
                <v-list-tile-content>
                  <v-select class="pt-3" hide-details item-value="id" item-text="title" :items="options.adzan" v-model="adzanShubuh.id" label="Adzan Shubuh"></v-select>    
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn color="primary" icon @click="adzanShubuh.isPlaying ? pauseAudio(adzanShubuh) : previewAdzan(adzanShubuh)"><v-icon color="white">{{ adzanShubuh.isPlaying ? 'pause' : 'play_arrow' }}</v-icon></v-btn>
                </v-list-tile-action>
              </v-list-tile>

              <v-list-tile>
                <v-list-tile-content>
                  <v-select class="pt-3" hide-details item-value="id" item-text="title" :items="options.adzan" v-model="adzanDzuhur.id" label="Adzan Dzuhur"></v-select>    
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn color="primary" icon @click="adzanDzuhur.isPlaying ? pauseAudio(adzanDzuhur) : previewAdzan(adzanDzuhur)"><v-icon color="white">{{ adzanDzuhur.isPlaying ? 'pause' : 'play_arrow' }}</v-icon></v-btn>
                </v-list-tile-action>
              </v-list-tile>

              <v-list-tile class="primary lighten-5">
                <v-list-tile-content>
                  <v-select class="pt-3" hide-details item-value="id" item-text="title" :items="options.adzan" v-model="adzanJumat.id" label="Adzan Jumat"></v-select>    
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn color="primary" icon @click="adzanJumat.isPlaying ? pauseAudio(adzanJumat) : previewAdzan(adzanJumat)"><v-icon color="white">{{ adzanJumat.isPlaying ? 'pause' : 'play_arrow' }}</v-icon></v-btn>
                </v-list-tile-action>
              </v-list-tile>

              <v-list-tile>
                <v-list-tile-content>
                  <v-select class="pt-3" hide-details item-value="id" item-text="title" :items="options.adzan" v-model="adzanAshar.id" label="Adzan Ashar"></v-select>    
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn color="primary" icon @click="adzanAshar.isPlaying ? pauseAudio(adzanAshar) : previewAdzan(adzanAshar)"><v-icon color="white">{{ adzanAshar.isPlaying ? 'pause' : 'play_arrow' }}</v-icon></v-btn>
                </v-list-tile-action>
              </v-list-tile>

              <v-list-tile class="primary lighten-5">
                <v-list-tile-content>
                  <v-select class="pt-3" hide-details item-value="id" item-text="title" :items="options.adzan" v-model="adzanMaghrib.id" label="Adzan Maghrib"></v-select>    
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn color="primary" icon @click="adzanMaghrib.isPlaying ? pauseAudio(adzanMaghrib) : previewAdzan(adzanMaghrib)"><v-icon color="white">{{ adzanMaghrib.isPlaying ? 'pause' : 'play_arrow' }}</v-icon></v-btn>
                </v-list-tile-action>
              </v-list-tile>

              <v-list-tile>
                <v-list-tile-content>
                  <v-select class="pt-3" hide-details item-value="id" item-text="title" :items="options.adzan" v-model="adzanIsya.id" label="Adzan Isya"></v-select>    
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn color="primary" icon @click="adzanIsya.isPlaying ? pauseAudio(adzanIsya) : previewAdzan(adzanIsya)"><v-icon color="white">{{ adzanIsya.isPlaying ? 'pause' : 'play_arrow' }}</v-icon></v-btn>
                </v-list-tile-action>
              </v-list-tile>            
            </v-list>
          </v-flex>
        </v-layout>      
    
      <v-card-actions><v-spacer></v-spacer>
        <v-btn color="primary" block @click="saveAudio">Simpan</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>  
      <v-snackbar multi-line v-model="snackbar.value" :timeout="6000" color='primary darken-4'>{{ snackbar.text }}
        <v-btn flat color="yellow" @click.native="$router.push('/settings')">Kembali</v-btn>
      </v-snackbar>      
    </div>
  </v-fade-transition>


</template>

<script>
	export default{
		data(){
			return{
				settings:{},			
				options:{
          adzan: [],
          iqomah: [], 
          cities: [],
          template: [],          
        },
        adzanShubuh: {},
        adzanDzuhur: {},
        adzanJumat: {},
        adzanAshar: {},
        adzanMaghrib: {},
        adzanIsya: {},
        audioIqomah: {},
        snackbar: {value:false, text: ''}
			}
		}, 

		created(){
			this.init()
      this.$store.commit('pageTitle', 'Audio / Alarm')
		},

    computed:{
      items(){
        return [
          { option: this.options.iqomah, model: this.audioIqomah.id, label:"Audio Iqomah" }
        ]
      }
    },

		methods:{
			init(){
				this.getSettings()
				this.getOptions()
			},
			getSettings(){
        this.axios.get('/api/settings')
        .then(res=>{          
          this.settings = res.data    
          this.adzanShubuh = {audio: new Audio(), isPlaying: false, id: this.settings.adz_shubuh_id}
          this.adzanDzuhur = {audio: new Audio(), isPlaying: false, id: this.settings.adz_dzuhur_id}
          this.adzanJumat = {audio: new Audio(), isPlaying: false, id: this.settings.adz_jumat_id}
          this.adzanAshar = {audio: new Audio(), isPlaying: false, id: this.settings.adz_ashar_id}
          this.adzanMaghrib = {audio: new Audio(), isPlaying: false, id: this.settings.adz_maghrib_id}
          this.adzanIsya = {audio: new Audio(), isPlaying: false, id: this.settings.adz_isya_id}
          this.audioIqomah = {audio: new Audio(), isPlaying: false, id: this.settings.audio_iqomah_id}
        })
        .catch(err=>{
          this.$auth.destroyToken()
          this.$store.commit('licensing', '')                    
          this.$store.commit('authenticate', false)
          if (!err.response){
            this.snackbar = {value:true, text: 'Tidak menemukan alat. Pastikan HP ini terhubung dengan Wifi Jasma!'}
          } else {            
            this.snackbar = {value:true, text: 'Terjadi kesalahan (' + err.response.status + '). Silakan kontak customer service.'}
          }          
        })
      },

      getOptions(){
        this.axios.get('/api/menu-options')
        .then(res=>{
          this.options = res.data
        })
      },  

      previewAdzan(audio){
        this.axios.get('/api/adzan/'+ audio.id)
        .then(res=>{        
        var audioPath = this.$store.state.baseUrl+'/static/adzan/'                
        audio.isPlaying = true         
        audio.audio.src = audioPath + res.data.filename        
        audio.audio.load()        
        audio.audio.play()  
        audio.audio.onended = () => { this.endPreview(audio) }
        })        
      },

      endPreview(val){
        val.audio.pause()
        val.isPlaying = false        
      },

      pauseAudio(audio){
        audio.isPlaying = false
        audio.audio.pause()
      },
      previewIqomah(audio){
        this.axios.get('/api/iqomah/'+ audio.id)
        .then(res=>{
          var audioPath = this.$store.state.baseUrl+'/static/iqomah/'
          audio.isPlaying = true
          audio.audio.src = audioPath + res.data.filename
          audio.audio.load()
          audio.audio.play()  
          audio.audio.onended = () => { this.endPreview(audio) }
        })        
      },      
      saveAudio(){
        this.settings.audio_iqomah_id = this.audioIqomah.id
        this.settings.adz_shubuh_id = this.adzanShubuh.id
        this.settings.adz_dzuhur_id = this.adzanDzuhur.id
        this.settings.adz_jumat_id = this.adzanJumat.id
        this.settings.adz_ashar_id = this.adzanAshar.id
        this.settings.adz_maghrib_id = this.adzanMaghrib.id
        this.settings.adz_isya_id = this.adzanIsya.id        
        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{
          this.axios.put('/api/bot/1', {code: 9 })
          this.snackbar= { value:true, text:"Update pengaturan...sukses!"}
        })
      },  
    },

    beforeDestroy(){      
        this.dialogAudio = false
        this.audioIqomah.audio.pause()
        this.audioIqomah.isPlaying = false
        this.adzanShubuh.audio.pause()
        this.adzanShubuh.isPlaying = false
        this.adzanDzuhur.audio.pause()
        this.adzanDzuhur.isPlaying = false
        this.adzanJumat.audio.pause()
        this.adzanJumat.isPlaying = false
        this.adzanAshar.audio.pause()
        this.adzanAshar.isPlaying = false
        this.adzanMaghrib.audio.pause()
        this.adzanMaghrib.isPlaying = false
        this.adzanIsya.audio.pause()
        this.adzanIsya.isPlaying = false
    }
	}	
</script>