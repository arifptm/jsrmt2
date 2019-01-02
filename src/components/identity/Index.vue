<template>
  <v-fade-transition>
    <v-layout>
      <v-flex xs12>
        <v-card flat>
          <v-card-text>                    
            <v-textarea rows="2" label="Nama Masjid" v-model ="settings.mos_name"></v-textarea>
            <v-textarea label="Alamat" rows='2' v-model ="settings.mos_address"></v-textarea>          
            <v-text-field label="No. Kontak" v-model ="settings.mos_contact"></v-text-field>
            <v-layout row wrap>
              <v-flex xs4 >
                <v-text-field label="Lisensi" :value="$store.state.license.toUpperCase()+' ' + $store.state.template " disabled></v-text-field>
              </v-flex>
              <v-flex xs8>                
                <v-text-field v-if="$store.state.license != 'pcmode'" label="Kode" v-model ="settings.license" persistent-hint hint="Perhatian: Jika lisensi salah, maka Jasma tidak berjalan." :error-messages="errors ? errors.license : ''" @click="errors.license = []">                
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-text-field  outline hide-details class="mt-2" v-if="$store.state.license == 'demo'" label="Watermark Demo" v-model ="settings.demo_name"></v-text-field>
          </v-card-text>

          <v-card-actions>        
            <v-spacer></v-spacer>
            <v-btn color="primary" dark @click="saveSetting">Simpan</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>        
        </v-card>
      </v-flex>

      <v-snackbar multi-line v-model="snackbar.value" :timeout="6000" color='primary darken-4'>{{ snackbar.text }}
        <v-btn flat color="yellow" @click.native="$router.push('/settings')">Kembali</v-btn>
      </v-snackbar>

    </v-layout>
  </v-fade-transition>
</template>

<script>
  import md5 from 'js-md5'
  export default{
    data(){
      return {
        settings:{},
        snackbar:{ value:'', text:''}, 
        errors: {},
        oldLic:''
      }
    },

    created(){      
      this.getSetting() 
      this.$store.commit('pageTitle', 'Lisensi & identitas')     
    },    

    methods:{      
      getSetting(){
        this.axios.get('/api/settings')
        .then(res=>{
          this.settings = res.data
          this.oldLic = res.data.license
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

      saveSetting(){        
        this.axios.put('/api/settings/1', this.settings )
        .then(res=>{
          this.axios.put('/api/bot/1', { code: 99} )
          this.snackbar = {text: "Pengaturan telah disimpan.", value: true}
          if( this.settings.license != this.oldLic){
            this.$auth.destroyToken();
            this.$store.commit('baseUrl', process.env.VUE_APP_BASEDOMAIN)
            this.$store.commit('licensing', '')
            this.$store.commit('template', '')
            this.$router.push('/login');      
          }      
        })
        .catch(err=>{
          this.errors = err.response.data.errors
        })
      },
    }
  }
</script>