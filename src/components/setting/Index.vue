<template>
  <v-fade-transition>
  <div>
    <v-container grid-list-lg fluid>
      <v-layout row wrap >
        <v-flex d-flex xs4 v-for="menu in menus" :key="menu.text" >
          <v-card class="primary text-xs-center" dark flat @click="menu.act">
            <v-icon class="pt-1 blue--text text--lighten-5" size="28">{{ menu.icon }}</v-icon>
            <div class="font-weight-medium px-1 pb-1">{{ menu.text }}</div>
          </v-card>
        </v-flex>
        
      </v-layout>
      
    </v-container>

    <v-snackbar multi-line v-model="snackbar.value" :timeout="4000" color='primary darken-4'>{{snackbar.text }}</v-snackbar>


<!-- TEMPLATE -->
  <v-dialog v-model="dialogTemplate" :overlay="false" max-width="500px" transition="dialog-transition" >
    <v-card>
      <v-toolbar color="primary" flat dark>
        <v-toolbar-title>Template/layout</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon @click="dialogTemplate = false">close</v-icon>
      </v-toolbar>
      <v-container grid-list-lg>              
        <v-layout row wrap>          
          <v-flex xs6 v-for="template in options.template" :key="template.id">
            <v-radio-group v-model="settings.layout_id" hide-details class="ma-0 pa-0" @change="saveTemplate">
              <v-card>              
                <v-img contain height="auto" :src="getImg(template.image)">
                </v-img>
                <v-radio :disabled="$store.state.template != ''" :label="template.title" :value="template.id" color="primary" style="font-size: .5vh"></v-radio>
              </v-card>
            </v-radio-group>
          </v-flex>        
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>

<!-- FONT/ARABIC -->
  <v-dialog v-model="dialogArabic" :overlay="false" max-width="500px" transition="dialog-transition" >
    <v-card>      
      <v-toolbar class="primary" flat dark>
        <v-toolbar-title>Font/Arabic</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon @click="dialogArabic = false">close</v-icon>
      </v-toolbar>
      <v-card-text>  
        <v-container grid-list-md class="pa-0">
          <v-layout row wrap>        
            <v-flex xs6><v-select label="Font global" v-model="settings.body_font" hint="Font seluruh sistem." persistent-hint :items="fonts" item-text="text" item-value="value"></v-select></v-flex>

            <v-flex xs6><v-select label="Nama masjid" v-model="settings.mos_font" hint="Font khusus nama masjid." persistent-hint :items="fonts" item-text="text" item-value="value"></v-select></v-flex>          
          </v-layout>
        </v-container> 
        <v-switch color="primary" label="Arabic waktu sholat" v-model="settings.arabic_sc_name" hide-details></v-switch>
        <v-switch color="primary" label="Arabic Kalender hijriah" v-model='settings.arabic_hijri_calendar' hide-details></v-switch>
        <v-switch color="primary" label="Arabic Waktu sholat mendatang" v-model='settings.arabic_next_schedule' hide-details></v-switch>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="saveArabic">Simpan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

<!-- MANUAL -->
  <v-dialog v-model="dialogJadwal" :overlay="false" max-width="500px" transition="dialog-transition" >
    <v-card>      
      <v-toolbar color="primary" flat dark>
        <v-toolbar-title >Jadwal Manual</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon @click="dialogJadwal = false">close</v-icon>
      </v-toolbar>
      <v-card-text>  
        <v-container grid-list-md class="pa-0">
          <v-layout row wrap>                    
            <v-flex xs12>
              <v-card>
                <v-card-text>
                  <p>Untuk membuat jadwal sholat secara manual, silakan download template Excel di bawah ini, kemudian isi data waktu sholat selama satu tahun.</p>
                  <p class="mb-0">Setelah selesai, dapat anda upload dengan tombol di paling bawah!</p>
                </v-card-text>
                <v-card-actions><v-spacer></v-spacer>
                  <a  class="text-xs-center" :href="downloadTemplate"><b>DOWNLOAD TEMPLATE</b></a>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <vue-xlsx-table @on-select-file="handleSelectedFile">Upload file Excel</vue-xlsx-table>
            </v-flex>    
            <v-flex xs12 v-if="savingXls === true">
              <v-progress-linear :indeterminate="true" color="primary" size="16" ></v-progress-linear>
            </v-flex>
          </v-layout>
        </v-container> 
        
      </v-card-text>
      <v-card-actions>
        
      </v-card-actions>
    </v-card>
  </v-dialog>    

<!-- JEDA IQOMAH -->
    <v-dialog v-model="dialogPause" persistent :overlay="false" max-width="500px" transition="dialog-transition">
      <v-card> 
        <v-toolbar color="primary" flat dark>
          <v-toolbar-title >Jeda Iqomah</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogPause = false">close</v-icon>
        </v-toolbar>           
        <v-card-text class="pa-3">
          <v-container fluid class="pa-0"  grid-list-lg>
            <v-layout row wrap>       
              <v-flex xs6><v-select :items="pauseItems" v-model.number="settings.timer_shubuh" item-value="value"  item-text="title" label="Shubuh" hide-details></v-select></v-flex>
              
              <v-flex xs6><v-select :items="pauseItems" v-model.number="settings.timer_dzuhur" item-value="value" item-text="title" label="Dzuhur" hide-details></v-select></v-flex>          
              
              <v-flex xs6><v-select :items="pauseItems" v-model.number="settings.timer_ashr" item-value="value" item-text="title" label="Ashar" hide-details></v-select>
              </v-flex><v-flex xs6>
              
              <v-select :items="pauseItems" v-model.number="settings.timer_maghrib" item-value="value" item-text="title" label="Maghrib" hide-details></v-select>
              </v-flex>          
              
              <v-flex xs6><v-select :items="pauseItems" v-model.number="settings.timer_isya" item-value="value" item-text="title" label="Isya" hide-details></v-select></v-flex>          
            </v-layout>            
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="savePause">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>    

</div>
</v-fade-transition>
</template>

<script>
  export default{
    data(){
      return {
        dialog:false,  
        dialogTemplate:false,
        dialogArabic: false,        
        dialogPause: false,        
        dialogJadwal:false,        
        settings:{},
        checkbox:false,
        // customCity:{ id: null , name:'', latitude: null, longitude: null},
        saving:false,
        snackbar:{ value:'', text:''},        
        savingXls:false,
        options:{
          adzan: [],
          iqomah: [], 
          cities: [],
          template: [],          
        },
        fonts:[
          { text: 'Roboto', value: 'roboto'},
          { text: 'Aladin', value: 'aladin'},
          { text: 'Eczar', value: 'eczar'},
          { text: 'Oleo', value: 'oleo'},
        ],
        // schIncluded:'',
        //settingMenu:{ template:false, arabic:false, alarm:false},                
        pauseItems: [
          { value:1, title: '1 mnt (test)'},
          { value:10, title: '10 menit'},
          { value:11, title: '11 menit'},
          { value:12, title: '12 menit'},
          { value:13, title: '13 menit'},
          { value:14, title: '14 menit'},
          { value:15, title: '15 menit'},
          { value:16, title: '16 menit'},
          { value:17, title: '17 menit'},
          { value:18, title: '18 menit'},
          { value:19, title: '19 menit'},
          { value:20, title: '20 menit'},
          { value:21, title: '21 menit'},
          { value:22, title: '22 menit'},
          { value:23, title: '23 menit'},
          { value:24, title: '24 menit'},
          { value:25, title: '25 menit'},
          { value:26, title: '26 menit'},
          { value:27, title: '27 menit'},
          { value:28, title: '28 menit'},
          { value:29, title: '29 menit'},
          { value:30, title: '30 menit'},
        ],      
        qori_id:'',
        surah_id:'',

        downloadTemplate: '',

        oldBodyFont:'',

        menus:[
          {icon: 'card_membership', text: 'Lisensi & Identitas', act:()=>this.$router.push({ name: 'identity'})},
          {icon: 'av_timer', text: 'Jam & Jadwal', act: ()=>this.$router.push({ name: 'schedule'})},
          { icon: 'widgets', text: 'Template', act: this.editTemplate },
          { icon: 'volume_up', text: 'Audio & Alarm', act : ()=>this.$router.push({ name: 'alarm'}) },
          { icon: 'font_download', text: 'Huruf / Arabic', act: this.editArabic },
          { icon: 'library_music', text: 'Murottal', act: ()=>this.$router.push({name:'murottal'}) },
          { icon: 'watch_later', text: 'Jadwal Manual', act: this.editJadwal },          
          { icon: 'timer_3', text: 'Koreksi waktu', act: ()=>this.$router.push({name:'correction'}) },
          { icon: 'volume_off', text: 'Waktu Diam', act: ()=>this.$router.push({name:'silent'}) },
          { icon: 'pause', text: 'Jeda Iqomah', act: this.editPause },
          { icon: 'toc', text: 'Lain-lain', act: ()=>this.$router.push({name:'other'}) },

        ]

      }

    },

    created(){      
      this.getSettings()
      this.getOptions()      
      this.downloadTemplate = this.$store.state.baseUrl + '/download/jadwal.xlsx'
      this.$store.commit('pageTitle', 'Pengaturan')
    },    

    watch:{
      holidaySwitch(val){
        this.cdHoliday = (val === true ) ? this.settings.holiday : 0
      }
    },


    methods:{    
      getImg(img){
        return this.$store.state.baseUrl+'/static/templates/'+img
      },
      getSettings(){
        this.axios.get('/api/settings')
        .then(res=>{          
          this.settings = res.data
          this.settings.city_id = parseInt(res.data.city_id)
          this.settings.layout_id = parseInt(res.data.layout_id)
          this.arabic = res.data.arabic
          this.oldBodyFont = this.settings.body_font
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
      
      editTemplate(){        
        this.dialogTemplate = true
      },    
      saveTemplate(){        
        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{
          this.axios.put('/api/bot/1', {code:99 })
          this.dialogTemplate = false
          this.snackbar = { value: true, text: 'Update pengaturan...SUKSES!.' }
        })
      },      

         

      editArabic(){        
        this.dialogArabic = true
      },
      saveArabic(){                      
        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{        
          if (this.settings.body_font == this.oldBodyFont){
            this.axios.put('/api/bot/1', {code: 9 })
            this.dialogArabic = false                    
            this.snackbar = { value: true, text: 'Update pengaturan...SUKSES!.' }
          } else {
            this.axios.put('/api/bot/1', {code: 99 })
            this.dialogArabic = false 
            this.oldBodyFont = this.settings.body_font
          }
        })
      },



      editPause(){
        this.dialogPause = true
      },
      savePause(){
        
        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{
          this.getSettings()
          this.snackbar = { value: true, text: 'Pengaturan...updated!.' }
          this.dialogPause = false
        })
      }, 

      editJadwal(){        
        this.dialogJadwal = true
      },
      handleSelectedFile (convertedData) {
        console.log(convertedData)
        var data = convertedData.body
        if(data.length != 366){
          alert('Data tidak lengkap')          
        } else {
          if(confirm('Ganti dengan jadwal manual?')){
            this.savingXls = true
            this.axios.post('/api/settings/manual-praytime', data)
            .then(res=>{
              this.dialogJadwal = false
              this.getSettings()
              this.snackbar = { value: true, text: 'Update jadwal sholat...SUKSES!.' }
              this.savingXls = false
            })
          }
        }        
      },

    }
  }
</script>

<style>

.vue-xlsx-container{
  display:flex;
}

.xlsx-button { 
    background-color: #607d8b !important;
    border-color: #607d8b !important;    
    text-transform: uppercase;    
    font-weight: 500;
    height: 40px;
    width:100%;
 }
</style>
