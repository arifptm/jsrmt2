<template>
	<v-fade-transition>
  <div>
		<v-card class="mb-1">    	
      <v-card-text>                
      
            	<p class="ma-1">Pilihan waktu yang ditampilkan</p>
               <v-radio-group v-model="settings.additional_praytime" row hide-details class="mt-0 mb-2">
                <v-radio color="primary" label="Imsyak" value="imsyak"></v-radio>
                <v-radio color="primary" label="Syuruq" value="syuruq"></v-radio>
              </v-radio-group>
      
      
      </v-card-text>
    </v-card>
    <v-card class="mb-1">      
      <v-card-text>                                  
        <v-switch color="primary" label="Tampilkan hari besar Islam" v-model="holidaySwitch" class="mt-0"></v-switch>                                      
        <v-text-field v-if="holidaySwitch === true" label="Mulai ditampilkan" persistent-hint hint="hari sebelum mulai ditampilkan" v-model="settings.holiday"></v-text-field>
        </v-card-text>
    </v-card>

    <v-card class="mb-1">
      <v-card-text>                                  
              <v-switch class="mt-0" color="primary" label="Tampilkan counter sholat mendatang" hide-details v-model.number="settings.show_next_schedule"></v-switch>
            </v-card-text>
    </v-card>

    <v-card class="mb-1">
      <v-card-text>                                  
               
               
               <v-radio-group v-model="settings.audio_output" row hide-details class="mt-0" @change="audioOutSelected(settings.audio_output)">
                <v-radio color="primary" label="Analog 3.5mm" :value="1"></v-radio>
                <v-radio color="primary" label="HDMI" :value="2"></v-radio>
              </v-radio-group>
            </v-flex>                       
          </v-layout>
        
      </v-card-text>
      <v-card-actions>        
        <v-btn color="primary" flat block @click="$router.push('/settings')">Batal</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" block @click="saveOthers">Simpan</v-btn>
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
				holidaySwitch: false,
				cdHoliday: 0,	
				snackbar:{ text:'', value:false }
			}
		},

		created(){
			this.init()
      this.$store.commit('pageTitle', 'Lain-lain')
		},    

		methods:{
			init(){
				this.getSettings()
						
			},
			getSettings(){
				this.axios.get('/api/settings')
				.then(res=>{
					this.settings = res.data		
						if (res.data.holiday != 0) {
            //this.cdHoliday = res.data.holiday
            this.holidaySwitch = true
          }							
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

			audioOutSelected(val){
				this.axios.get('/api/set-audio-out/'+val)
				var valtext = ( val == 2 ) ? 'HDMI' : 'Analog'
				this.snackbar = { value: true, text: 'Output changed to ... '+ valtext}
			},

			saveOthers(){                
        if (this.holidaySwitch === false){ this.settings.holiday = 0 }          
        if (this.holidaySwitch === true && this.settings.holiday == 0){
          this.settings.holiday = 30
        }          

        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{
          this.axios.put('/api/bot/1', {code:3})
          //this.$router.push('/settings')          
          this.snackbar = { value: true, text: 'Update pengaturan...Sukses!'}

        })
        .catch(err=>{
          console.log(err.response.data)
        })
      },    

		}
			


	}	
</script>

<style>

</style>