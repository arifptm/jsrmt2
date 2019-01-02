<template>
  <v-fade-transition>
    <div>
      <v-layout row wrap>    
        <v-flex xs12>     
          <v-card class="mb-1">
            <v-card-title class="title pb-0 primary--text">Waktu saat ini</v-card-title>
            <v-card-text>          
              <v-layout row wrap>
                <v-flex xs6 class="pl-2">
                  <v-menu ref="menu1" :close-on-content-click="false" v-model="menu1" :nudge-right="40" :return-value.sync="serverDate" lazy offset-y full-width min-width="290px" transition="scale-transition">
                    <v-text-field slot="activator" v-model="$moment(serverDate).format('DD-MM-YYYY')" label="Tanggal" append-icon="event" readonly hide-details></v-text-field>
                    <v-date-picker locale="id-ID" v-model="serverDate" @input="$refs.menu1.save(serverDate)"></v-date-picker>
                  </v-menu>           
                </v-flex>
                
                <v-flex xs6 class="pr-2">
                  <v-menu ref="menu2" :close-on-content-click="false" v-model="menu2" :nudge-right="40" :return-value.sync="serverTime" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px" >
                    <v-text-field slot="activator" v-model="serverTime" label="Jam" append-icon="access_time" readonly hide-details></v-text-field>
                    <v-time-picker v-model="serverTime" format="24hr" @change="$refs.menu2.save(serverTime)"></v-time-picker>
                  </v-menu>                
                </v-flex>  
              </v-layout> 
            </v-card-text>
            <v-card-actions class="pb-3">          
              <v-btn color="primary" @click="saveTimedate" class="ml-2">Set</v-btn>
              <v-spacer></v-spacer>      
              <v-btn color="primary" @click="syncTimedate" class="mr-2">Samakan jam HP</v-btn>
            </v-card-actions>
          </v-card>

          <v-card class="mb-3">
            <v-card-title class="title primary--text pb-3">Jadwal Sholat</v-card-title>        
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-autocomplete :items="cities" type="text" item-text="name" item-value="id" v-model="settings.city_id" label="Jadwal Kota" readonly></v-autocomplete>
                </v-flex>
                <v-flex xs6 class="text-xs-right">
                  <v-btn color="primary" class="mx-0" @click="selectCity">Pilih kota</v-btn>
                </v-flex>
              </v-layout>
              <v-layout row wrap>                      
                <v-flex xs6>
                  <v-text-field label="Latitude" :value="settings.city.latitude" disabled hide-details v-if="settings.city"></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field label="Longitude" :value="settings.city.longitude" disabled hide-details v-if="settings.city"></v-text-field>
                </v-flex>
                <v-flex xs12 v-if="saving === true">
                  <v-progress-linear :indeterminate="true" color="green" size="16" ></v-progress-linear>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        
          <v-card class="ma-3">
            <v-card-text class="text-xs-center">
              Untuk kehati-hatian, Waktu sholat dapat di koreksi.
              Silakan masuk menu<br>"PENGATURAN" > "KOREKSI WAKTU"
            </v-card-text>  
          </v-card>
        
        </v-flex>
      </v-layout>

      <v-dialog v-model="dialog" full-width :overlay="false" max-width="500px" transition="dialog-transition">
        <v-card>   
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Kota/Zona</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon  @click="dialog = false">close</v-icon>
          </v-toolbar>   
          <v-card-text>                        
            <v-autocomplete hide-details v-if="checkbox===false" :items="filteredCity" item-text="name" item-value="id" v-model.number="customCity.id" label="Pilih Kota" > 
            </v-autocomplete>
            <v-radio-group v-model="settings.wi" row>
              <v-radio  color="primary" label="WIB" :value="1"></v-radio>
              <v-radio  color="primary" label="WITA" :value="2"></v-radio>
              <v-radio  color="primary" label="WIT" :value="3"></v-radio>
            </v-radio-group>
            <v-divider></v-divider>
            <v-checkbox color="primary" label="Kota saya tidak terdaftar" v-model="checkbox" @change="selectCustom">
            </v-checkbox>
            <v-divider class="mb-3" v-if="checkbox===true"></v-divider>
            <v-layout row wrap v-if="checkbox===true">
              <v-flex xs12>
                <div class="subheading">Tuliskan latitude dan longitude kota anda</div>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Nama kota" v-model="customCity.name"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="Latitude" v-model="customCity.latitude"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="Longitude" v-model="customCity.longitude"></v-text-field>
              </v-flex>
            </v-layout>
            <v-card-actions>
              <v-btn block color="primary" @click="updateCity">Simpan</v-btn>
            </v-card-actions>
          </v-card-text>      
        </v-card>
      </v-dialog>

      <v-snackbar multi-line v-model="snackbar.value" :timeout="6000" color='primary darken-4'>{{ snackbar.text }}
        <v-btn flat color="yellow" @click.native="$router.push('/settings')">Kembali</v-btn>
      </v-snackbar>

    </div>
  </v-fade-transition>

</template>

<script>
    import Vue from 'vue'
    import Croppa from 'vue-croppa'
    Vue.use(Croppa) 
  export default{
    data(){
      return {             
        dialog: false,        
        cities:[],
        snackbar:{ text: '', value: false},
        serverDate: '',
        serverTime: '',
        dateTime:'',
        menu1:false,
        menu2:false,
        settings:{},
        saving: false,
        customCity:{ id: null , name:'', latitude: '', longitude: ''},
        checkbox: false,
      }
    },

    created(){
      this.initial()      
      this.$store.commit('pageTitle', 'Jam dan Jadwal')
    },


    computed:{
      filteredCity(){
        return this.cities.filter(item=>item.id != 111111)
      },
    },

    methods:{
      initial(){
        this.getSettings()
        this.getServerDatetime()
        this.getCities()
      },

      getCities(){
        this.axios.get('/api/cities')
        .then(res=>{
          this.cities = res.data
        })
      }, 

      selectCity(){        
        this.customCity.id = this.settings.city_id
        if(this.settings.city_id == 999999){            
          this.customCity.latitude = this.settings.city.latitude
          this.customCity.name = this.settings.city.name
          this.customCity.longitude = this.settings.city.longitude          
          this.checkbox = true
        } else {
          this.customCity.latitude = ''
          this.customCity.name = ''
          this.customCity.longitude = ''
          this.checkbox = false
        }

        this.dialog = true        
      },     

      selectCustom(){
        this.checkbox == !this.checkbox
        this.customCity.id = this.checkbox === true ? 999999 : this.settings.city_id
      },  



      getSettings(){
        this.axios.get('/api/settings')
        .then(res=>{          
          this.settings = res.data             
          this.oldPrayTimeCorrection = {
            'imsyak_correction': res.data.imsyak_correction,
            'shubuh_correction': res.data.shubuh_correction,
            'syuruq_correction': res.data.syuruq_correction,
            'dzuhur_correction': res.data.dzuhur_correction,
            'ashar_correction': res.data.ashar_correction,
            'maghrib_correction': res.data.maghrib_correction,
            'isya_correction': res.data.isya_correction
          }

        })
      },    

      saveSettings(){                    
        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{
          this.axios.put('/api/bot/1', { code: 3 })
          this.getSettings()
          this.snackbar = { value: true, text: 'Pengaturan...updated!.' }
          this.dialogPause = false
        })
      },


      updateCity(){
        this.saving = true
        this.dialog = false        
        this.axios.put('/api/update-city/'+ this.customCity.id+'/'+this.settings.wi, { name:this.customCity.name, latitude: this.customCity.latitude, longitude: this.customCity.longitude }, { timeout:15000})
        .then(res=>{ 
          this.axios.put('/api/bot/1', { code: 99 })
          this.snackbar.text="Kota dan jadwal...updated!."
          this.snackbar.value=true            
          this.saving = false
          this.getCities()
          this.getSettings()
        })
      },

      getServerDatetime(){
        this.axios.get('/api/server-datetime')
        .then(res=>{
          let dt = this.dateTime = this.$moment(res.data.date)
          this.serverDate = this.$moment(dt).format('YYYY-MM-DD')
          this.serverTime = this.$moment(dt).format('HH:mm')
        })
      },
      syncTimedate(){
        let sd = this.serverDate = this.$moment().format('YYYY-MM-DD')
        let st = this.serverTime = this.$moment().format('HH:mm')
        this.axios.post('api/update-server-datetime', {date: sd , time: st}, { timeout:10000})
        .then(res=>{       
          this.axios.put('/api/bot/1', { code: 99 })
          this.initial()
          this.snackbar.value= true
          this.snackbar.text= 'Tanggal dan jam...updated!.'
          //console.log(res.data)
        }) 
      },

      saveTimedate(){
        this.axios.post('api/update-server-datetime', {date: this.serverDate, time: this.serverTime}, {timeout: 10000})
        .then(res=>{
          this.axios.put('/api/bot/1', { code: 99 })          
          this.initial() 
          this.snackbar.value= true
          this.snackbar.text= 'Tanggal dan jam...updated!.'
          //console.log(res.data)
        })
      },      
      
    }
  }
</script>