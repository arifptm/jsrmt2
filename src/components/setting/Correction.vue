<template>
  <v-fade-transition>
    <div>
    <v-card flat>      
      
      <v-toolbar color="primary" dark fixed flat>
        <v-toolbar-side-icon @click.native="$store.commit('drawerState')"></v-toolbar-side-icon>
        <v-toolbar-title class="ml-1">{{ $store.state.pageTitle }}</v-toolbar-title>    
        <v-spacer></v-spacer>        
        <v-icon @click="$router.push({name:'setting'})">close</v-icon>
      </v-toolbar>      

      <v-card>    
        <v-card-text class="pa-3">
          <v-container fluid grid-list-md class="pa-0">
                      
          <v-layout row wrap>
            <v-flex xs12>                
              <v-autocomplete :items ="hijriOptions" label = "Koreksi kalender hijriah" item-text = 'text' item-value = 'value' v-model = 'settings.hijri_correction'>                
              </v-autocomplete>
            </v-flex>

            <div v-if="settings.city_id == 111111">
              <v-flex xs12>
                <v-alert type="info" :value="true">
                  Koreksi waktu sholat tidak berpengaruh, karena menggunakan pengaturan jadwal sholat manual.
                </v-alert>  
              </v-flex>
            </div>
            <div v-else>
              <v-flex xs12>                          
                <v-switch color="primary" label="Koreksi waktu sholat global" :true-value="1" :false-value="0" v-model="settings.global_correction"></v-switch>
              </v-flex>
              
              <div v-if="settings.global_correction == 1">
                <v-autocomplete :items ="sholatOptions" label = "Tambahan waktu" item-text = 'text' item-value = 'value' v-model = 'settings.praytime_correction'>
                </v-autocomplete>
              </div>          

              <div v-else>
                <v-layout row wrap>                                  
                  <v-flex xs4>
                    <v-autocomplete :items ="sholatOptions" label = "Imsyak" item-text = 'text' item-value = 'value' v-model = 'settings.imsyak_correction'></v-autocomplete>
                  </v-flex>
                  <v-flex xs4>                  
                    <v-autocomplete :items ="sholatOptions" label = "Shubuh" item-text = 'text' item-value = 'value' v-model = 'settings.shubuh_correction'></v-autocomplete>
                  </v-flex>
                  <v-flex xs4>
                    <v-autocomplete :items ="sholatOptions" label = "Syuruq" item-text = 'text' item-value = 'value' v-model = 'settings.syuruq_correction'></v-autocomplete>
                  </v-flex>
                  <v-flex xs4>                  
                    <v-autocomplete :items ="sholatOptions" label = "Dzuhur" item-text = 'text' item-value = 'value' v-model = 'settings.dzuhur_correction'></v-autocomplete>
                  </v-flex>
                  <v-flex xs4>
                    <v-autocomplete :items ="sholatOptions" label = "Ashar" item-text = 'text' item-value = 'value' v-model = 'settings.ashar_correction'></v-autocomplete>
                  </v-flex>
                  <v-flex xs4>
                    <v-autocomplete :items ="sholatOptions" label = "Maghrib" item-text = 'text' item-value = 'value' v-model = 'settings.maghrib_correction'></v-autocomplete>
                  </v-flex>
                  <v-flex xs4>
                    <v-autocomplete :items ="sholatOptions" label = "Isya" item-text = 'text' item-value = 'value' v-model = 'settings.isya_correction'></v-autocomplete>
                  </v-flex>
                </v-layout>
              </div>
            </div>
            
            <v-flex xs12 v-if="saving === true">
              <v-progress-linear :indeterminate="true" color="primary" size="16" ></v-progress-linear>
            </v-flex>
          </v-layout>
          </v-container>
        </v-card-text>
          <v-card-actions>                          
            <v-btn color="primary" flat block @click="$router.push('/settings')">Batal</v-btn>
            <v-spacer></v-spacer>
            <v-btn block color="primary" @click="saveCorrection()">Simpan</v-btn>              
          </v-card-actions>           
      </v-card>     
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
        saving:false,
        snackbar: { value:false, text:''},
        hijriOptions:[
          { value: -3 , text: '-3 hari'},
          { value: -2 , text: '-2 hari'},
          { value: -1 , text: '-1 hari'},
          { value: 0 , text: 'Tanpa koreksi'},
          { value: 1 , text: '+1 hari'},
          { value: 2 , text: '+2 hari'},
          { value: 3 , text: '+3 hari'},
        ],
        sholatOptions:[
          { value: 9 , text: '+9 menit'},
          { value: 8 , text: '+8 menit'},
          { value: 7 , text: '+7 menit'},
          { value: 6 , text: '+6 menit'},
          { value: 5 , text: '+5 menit'},
          { value: 4 , text: '+4 menit'},
          { value: 3 , text: '+3 menit'},          
          { value: 2 , text: '+2 menit'},
          { value: 1 , text: '+1 menit'},
          { value: 0 , text: 'Tanpa koreksi'},
          { value: -1 , text: '-1 menit'},
          { value: -2 , text: '-2 menit'},
          { value: -3 , text: '-3 menit'},
          { value: -4 , text: '-4 menit'},
          { value: -5 , text: '-5 menit'},
          { value: -6 , text: '-6 menit'},
          { value: -7 , text: '-7 menit'},
          { value: -8 , text: '-8 menit'},
          { value: -9 , text: '-9 menit'},

        ],

        oldPrayTimeCorrection:{},
      }
    },

    created(){
      this.init()
    },

    methods:{
      init(){
        this.getSettings()    
        this.$store.commit('pageTitle', 'Koreksi waktu')        
      },

      getSettings(){
        this.axios.get('/api/settings')
        .then(res=>{          
          this.settings = res.data
          this.oldPrayTimeCorrection = {
            praytime_correction: res.data.praytime_correction,
            imsyak_correction: res.data.imsyak_correction,
            shubuh_correction: res.data.shubuh_correction,
            syuruq_correction: res.data.syuruq_correction,          
            dzuhur_correction: res.data.dzuhur_correction,
            ashar_correction: res.data.ashar_correction,
            maghrib_correction: res.data.maghrib_correction,
            isya_correction: res.data.isya_correction
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

      saveCorrection(){ 
        this.saving = true
        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{                              
          var op = this.oldPrayTimeCorrection
          if (
            op.imsyak_correction != this.settings.imsyak_correction ||
            op.shubuh_correction != this.settings.shubuh_correction ||
            op.syuruq_correction != this.settings.syuruq_correction ||
            op.dzuhur_correction != this.settings.dzuhur_correction ||
            op.ashar_correction != this.settings.ashar_correction ||
            op.maghrib_correction != this.settings.maghrib_correction ||
            op.isya_correction != this.settings.isya_correction ||
            op.praytime_correction != this.settings.praytime_correction
            ){            
              this.axios.put('/api/update-city/'+ this.settings.city_id+'/'+this.settings.wi, { name: this.settings.city.name, latitude: this.settings.city.latitude, longitude: this.settings.city.longitude })
              .then (res=>{
                this.oldPrayTimeCorrection = {
                  imsyak_correction: this.settings.imsyak_correction,
                  shubuh_correction: this.settings.shubuh_correction,
                  syuruq_correction: this.settings.syuruq_correction,
                  dzuhur_correction: this.settings.dzuhur_correction,
                  ashar_correction: this.settings.ashar_correction,
                  maghrib_correction: this.settings.maghrib_correction,
                  isya_correction: this.settings.isya_correction,
                  praytime_correction: this.settings.praytime_correction
                }

                this.axios.put('/api/bot/1', {code: 3 })
                this.snackbar = { value:true, text: 'Update pengaturan... sukses!'}
                this.saving = false  

              })
          } else {
            this.axios.put('/api/bot/1', {code: 9 })    
            this.snackbar = { value:true, text: 'Update pengaturan... sukses!'}
            this.saving = false            
          }          
        })         
      },      

    }
  }
</script>  