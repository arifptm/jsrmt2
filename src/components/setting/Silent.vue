<template>
  <v-fade-transition>
  <div>
    <v-toolbar fixed flat color="primary" dark>
      <v-toolbar-side-icon @click.native="$store.commit('drawerState')"></v-toolbar-side-icon>
      <v-toolbar-title>Waktu diam</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon @click="$router.push('/settings')">close</v-icon></v-btn>
    </v-toolbar>
  
    <v-card>            
      <v-card-text>         
        <v-container class="pa-0" grid-list-md>
          <v-layout row wrap>        
            <v-flex xs6>
              <v-text-field v-model.number="settings.jumat_duration" label="Ibadah Jumat" hint="menit tampilan gambar" persistent-hint :error-messages="errors ? errors.jumat_duration : ''" @click="errors.jumat_duration = []"></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field v-model.number="settings.sholat_duration" label="Sholat 5 waktu" hint="menit tampilan gambar" persistent-hint :error-messages="errors ? errors.sholat_duration : ''" @click="errors.sholat_duration = []"></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field v-model.number="settings.tarawih_duration" label="Sholat tarawih" hint="menit tampilan gambar" persistent-hint :error-messages="errors ? errors.tarawih_duration : ''" @click="errors.tarawih_duration = []"></v-text-field>
            </v-flex>
            <v-flex xs6 class="text-xs-right"><v-btn color="primary" @click="saveSilent">Simpan</v-btn>
            </v-flex>                
          </v-layout>
        </v-container>
      </v-card-text>          
      <v-divider></v-divider>
      <v-card-text>
        <div class="title mb-2">Gambar saat ibadah</div>
        <v-container class="pa-0" grid-list-md>
          <v-layout row wrap>
            <v-flex xs6>                              
              <v-img :aspect-ratio="16/9" :src="jumatBg" >
              <div class="pl-1 subheading white--text" style="background: rgba(0,0,0,0.4)">Sholat Jumat</div>                  
              </v-img>
              <v-btn small block color="primary" @click="putBg('jumat')">Ubah</v-btn>
            </v-flex>

            <v-flex xs6>                              
              <v-img :aspect-ratio="16/9" :src="sholatBg">
                <div class="pl-1 subheading white--text" style="background: rgba(0,0,0,0.4)">Sholat 5 waktu</div>
              </v-img>
              <v-btn small block color="primary" @click="putBg('sholat')">ubah</v-btn>
            </v-flex>

            <v-flex xs6>                
              <v-img :aspect-ratio="16/9" :src="tarawihBg">
                <div class="pl-1 subheading white--text" style="background: rgba(0,0,0,0.4)">Sholat Tarawih</div>
              </v-img>
              <v-btn small block color="primary" @click="putBg('tarawih')">ubah</v-btn>
            </v-flex>

            <v-flex xs6>                
              <v-img :aspect-ratio="16/9" :src="toIqomahBg" >
                <div class="pl-1 subheading white--text" style="background: rgba(0,0,0,0.4)">Cntdwn Iqomah</div>
              </v-img>
              <v-btn small block color="primary"  @click="putBg('iqomah')">ubah</v-btn>                
            </v-flex>              
          </v-layout>    
        </v-container>            
      </v-card-text>
    </v-card>
    
    <v-dialog v-model="dialogPutBg" max-width="500" :overlay="false"  transition="dialog-transition" >
        <v-card>      
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Ganti Gambar</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon icon @click="dialogPutBg = false">close</v-icon>
          </v-toolbar>
          <v-card-text class="text-xs-center">          
            <croppa v-model="myCroppa"
            :width="240"  :height="135" :quality="8"
            :prevent-white-space= "true"
            placeholder="+ Tambah gambar"
            placeholder-color="#000"
            :placeholder-font-size="16"
            canvas-color="transparent"
            :show-remove-button="true"
            remove-button-color="black"
            :show-loading="true"
            :loading-size="50"
            loading-color="#606060"   
            initial-size="contain">       
          </croppa>
          <v-card-actions>
           <v-spacer></v-spacer><v-btn color="primary" block @click="uploadBg()">Upload</v-btn>
           
           <v-btn v-if="bgIfReset.value == 'sholat' && settings.sholat_bg != 'sholat_bg.jpg'" color="primary" block @click="defSholatBg()">reset</v-btn>
           <v-btn v-if="bgIfReset.value == 'jumat' && settings.jumat_bg != 'jumat_bg.jpg'" color="primary" block @click="defJumatBg()">reset</v-btn>
           <v-btn v-if="bgIfReset.value == 'tarawih' && settings.tarawih_bg != 'tarawih_bg.jpg'" color="primary" block @click="defTarawihBg()">reset</v-btn>
           <v-btn v-if="bgIfReset.value == 'iqomah' && settings.toiqomah_bg != 'counterbg.jpg'" color="primary" block @click="defToIqomahBg()">reset</v-btn>
          <v-spacer></v-spacer>
          </v-card-actions>
          
            <v-divider></v-divider> 
          
           <v-layout row wrap>
             <v-flex xs8 offset-xs2>
              <div class="subheading">Gambar jika di reset</div>
               <v-img v-if="bgIfReset.file != ''" :aspect-ratio="16/9" :src="resetBg" ></v-img>
             </v-flex>
           </v-layout> 
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
  export default{
    data(){
      return{
        settings:{},   
        dialogPutBg: false,     
        myCroppa:{},
        dialogPutBg: false,
        puttedBg: '',
        bgIfReset: { file: '', value:''},
        errors:{},
        snackbar:{text:'', value: false}
      }
    },

    computed:{
      toIqomahBg(){        
          if(this.settings.toiqomah_bg == null){
            return this.$store.state.baseUrl+'/static/silent_bg/counterbg.jpg'          
          } else {
            return this.$store.state.baseUrl+'/static/silent_bg/'+this.settings.toiqomah_bg
          }
      },

      sholatBg(){      
        if(this.settings.sholat_bg == null){
          return this.$store.state.baseUrl+'/static/silent_bg/sholat_bg.jpg'          
        } else {
          return this.$store.state.baseUrl+'/static/silent_bg/'+this.settings.sholat_bg
        }
      },

      tarawihBg(){      
        if(this.settings.tarawih_bg == null){
          return this.$store.state.baseUrl+'/static/silent_bg/tarawih_bg.jpg'          
        } else {
          return this.$store.state.baseUrl+'/static/silent_bg/'+this.settings.tarawih_bg
        }
      },

      jumatBg(){      
          if(this.settings.jumat_bg == null){
            return this.$store.state.baseUrl+'/static/silent_bg/jumat_bg.jpg'          
          } else {
            return this.$store.state.baseUrl+'/static/silent_bg/'+this.settings.jumat_bg
          }      
      },

      resetBg(){        
        if (this.bgIfReset.file != ''){
          return this.$store.state.baseUrl+'/static/silent_bg/'+this.bgIfReset.file
        }
      }
    },    

    created(){
      this.init()
    },


    methods:{
      init(){
        this.getSettings()
      },

      getSettings(){
        this.axios.get('/api/settings')
        .then(res=>{
          this.settings = res.data                
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

      saveSilent(){                
        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{
          this.axios.put('/api/bot/1', {code:9})
          this.snackbar = { value:true, text: 'Update pengaturan... sukses!'}
        }) 
        .catch(err=>{
          this.errors = err.response.data.errors
        })       
      },
      defSholatBg(){
        this.settings.sholat_bg = 'sholat_bg.jpg'
        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{
          this.axios.put('/api/bot/1', {code:9})
          this.dialogPutBg = false
        })
      },
      defTarawihBg(){
        this.settings.tarawih_bg = 'tarawih_bg.jpg'
        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{
          this.axios.put('/api/bot/1', {code:9})
          this.dialogPutBg = false
        })
      },
      defJumatBg(){
        this.settings.jumat_bg = 'jumat_bg.jpg'
        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{
          this.axios.put('/api/bot/1', {code:9})
          this.dialogPutBg = false
        })
      },
      defToIqomahBg(){
        this.settings.toiqomah_bg = 'counterbg.jpg'
        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{
          this.axios.put('/api/bot/1', {code:9})
          this.dialogPutBg = false
        })
      }, 
      putBg(val){
        if (val == 'sholat'){          
          this.bgIfReset = {file:'sholat_bg.jpg', value:val}
        } else if (val == 'jumat'){
          this.bgIfReset = {file:'jumat_bg.jpg', value:val}
        } else if (val == 'tarawih'){
          this.bgIfReset = {file:'tarawih_bg.jpg', value:val}
        } else if (val == 'iqomah'){
          this.bgIfReset = {file:'counterbg.jpg', value:val}
        }
        this.myCroppa.remove()
        this.puttedBg = val
        this.dialogPutBg = true
      },
      uploadBg(){
        this.axios.post('/api/upload-silent-image', { image:this.myCroppa.generateDataUrl('image/png', 0.8)})
          .then(res=>{
            if(this.puttedBg == 'sholat'){
              this.settings.sholat_bg = res.data
            } else if(this.puttedBg == 'jumat'){
              this.settings.jumat_bg = res.data
            } else if(this.puttedBg == 'iqomah'){
              this.settings.toiqomah_bg = res.data
            } else if(this.puttedBg == 'tarawih'){
              this.settings.tarawih_bg = res.data
            }

            this.axios.put('/api/settings/1', this.settings)
            .then(res=>{
              this.axios.put('/api/bot/1', {code:9})
            })
            this.dialogPutBg = false
            this.snackbar = { value: true, text: 'Pengaturan...updated!.' }               
          })
      },       
    }
  }
</script>
