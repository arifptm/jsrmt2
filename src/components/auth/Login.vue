<template>
    <v-container fluid fill-height class="blue-grey">
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>  
          <div v-if="$store.state.license != ''">        

            <div class="title text-xs-center white--text"><span class="font-weight-light">Remote </span>Login</div>
            <div class="display-1 text-xs-center white--text font-weight-bold">Jasma <span class="font-weight-thin">Digital</span></div>
            <v-card class="mt-3 primary darken-2" dark flat v-if="$store.state.license != 'nolic'">
              <v-card-actions>
                <div class="pl-2 subheading">Lisensi: 
                  <span class="font-weight-bold text-uppercase">{{ $store.state.license }}</span>
                  <span v-if="$store.state.template" class="font-weight-bold text-uppercase yellow--text text--lighten-2">_t{{ $store.state.template }}</span>
                </div> 
                <v-spacer></v-spacer> 
                <v-btn color="primary" @click="changeLicense()">Ganti lisensi</v-btn>
              </v-card-actions>            
            </v-card>  
          <v-card flat color="blue-grey lighten-5 mt-2" v-if="$store.state.license != 'nolic'">
            <v-card-text>
              <v-form>
                <v-text-field v-model="username" v-show="this.admin === false" append-icon="person" label="Nama User" type="text"></v-text-field>
                <v-text-field v-model="password" append-icon="lock" label="Password" type="password" autocomplete></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-checkbox disabled label="Admin ?" v-model="admin" hide-details class="mt-0 pt-0" color="primary"></v-checkbox>
              <v-spacer></v-spacer>
              <v-btn color="primary" depressed @click="login">Login</v-btn>
            </v-card-actions>
          </v-card>
            <v-card v-else flat color="blue-grey lighten-5" class="mt-2">
              <v-card-text class="text-xs-center body-2">
                <div class="subheading font-weight-bold red--text">Lisensi tidak valid.</div>
                <div>Klik tombol di bawah untuk mengganti lisensi!</div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" depressed @click="changeLicense()">Ganti Lisensi</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
              <div class="text-xs-center font-weight-bold">|<br>atau<br>|</div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" depressed @click="openDialogDemo()">Coba versi demo</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>

            </v-card>

          </div>

          <div v-else>
            <div class="display-1 text-xs-center white--text font-weight-bold mb-3">Jasma <span class="font-weight-thin">Digital</span></div>
            <v-card flat color="blue-grey lighten-5">
              <v-card-text class="text-xs-center body-2">
                <div class="subheading red--text">Remote tidak terhubung dengan Jasma. </div>
                Silakan hubungkan HP anda dengan Wifi Jasma, 
                kemudian tekan tombol di bawah ini untuk mencoba lagi!
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-progress-circular indeterminate color="primary" v-if="progress === true "></v-progress-circular>
                <v-btn color="primary" depressed @click="connect()" v-else>Coba lagi</v-btn>                
                <v-spacer></v-spacer>
              </v-card-actions>
              <div class="text-xs-center font-weight-bold">|<br>atau<br>|</div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" depressed @click="openDialogDemo()">Coba versi demo</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>

            </v-card>
          </div>

          <v-footer app dark>            
            <v-layout row wrap>
              <v-flex xs6 class="pl-2">
                <div v-if="$store.state.serial != ''">No. seri: <span class="font-weight-bold blue--text text--lighten-4">{{ $store.state.serial }}</span></div>
              </v-flex>
              <v-flex xs6 class="pr-2 text-xs-right">
                Jasma versi: <span class="font-weight-bold blue--text text--lighten-4">{{ $store.state.version }}</span>
              </v-flex>
            </v-layout>
          </v-footer>

        </v-flex>
      

      <v-dialog v-model="dialogChangeLicense" full-width :overlay="false" max-width="500px" transition="dialog-transition">
        <v-card>
          <v-card-text class="text-xs-center">
            <p>Agar remote dapat bekerja, <b>Nomor Serial</b> dan <b>Kode lisensi</b> harus benar/sesuai.</p>
            <p>Silakan isikan Kode yang telah anda dapatkan ketika melakukan pembelian, atau kontak Customer Service.</p>          
            <v-text-field outline label="Kode" v-model="settings.license" hide-details clearable></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" flat @click="dialogChangeLicense = false ">Batal</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="updateLicense">Simpan</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDemo" fullscreen :overlay="false" transition="dialog-transition">
        <v-container fluid fill-height class="primary lighten-5 pa-0">
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>  
              <v-card flat>
                <v-card-text class="text-xs-center primary lighten-5">
                  <p class="subheading px-3">Perubahan tampilan yang dibuat pada aplikasi ini, dapat langsung dilihat di <a class="font-weight-bold" href="https://jasmadigital.com/demo">https://jasmadigital.com/demo</a></p>                  
                  <v-divider class="mb-3"></v-divider>
                  <p class="subheading px-3 orange--text text--darken-4">Sebelum melanjutkan, silakan buka link di atas pada laptop atau HP lain</p>
                </v-card-text>          
                <v-card-actions class="primary lighten-4">
                  <v-btn color="primary" flat @click="dialogDemo = false">Batal</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="loginDemo">Lanjutkan</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-dialog>            

      </v-layout>

      <v-snackbar multi-line v-model="snackbar.value" :timeout="4000" color='primary darken-4'>{{ snackbar.text }}</v-snackbar>

    </v-container>
</template>

<script>
  import md5 from 'js-md5'
  export default{
    data(){
      return {
        dialogDemo: false,
        dialogChangeLicense: false,
        admin: true,
        username:'',
        password:'',
        code:"",
        errors:{},
        snackbar:{value:false,text:''},
        settings:{},
        progress: false
      }
    },

    created(){            
        this.getLicense()
        this.getSettings()      
    },

    methods:{

      connect(){        
        this.getLicense()
        this.getSettings()
      },

      getLicense(){            
        this.progress = true
        this.axios.get('/hwlic', { baseURL: this.$store.state.baseUrl })
        .then(res=>{            
          var resdata = res.data          
          if(resdata.hw != ""){    
            var code = this.code = resdata.set
            var serial = resdata.hw
            this.$store.commit('serial', serial.substring(8))
            
            this.licensin(serial, code)

          } else {
            this.$store.commit('licensing', 'pcmode')
          }                    
        })
        .catch(err=>{
          this.$store.commit('licensing', '')
          this.$store.commit('serial', '')
          this.$store.commit('template', '')
          if (!err.response){
            this.snackbar = {value:true, text: 'Tidak menemukan alat. Pastikan HP ini terhubung dengan Wifi Jasma!'}
          } else {            
            this.snackbar = {value:true, text: 'Terjadi kesalahan (' + err.response.status + '). Silakan kontak customer service.'}
          } 
          
        })
        .then(alw=>{
          this.progress = false
        })
      },

      licensin(serial, code){

        let crypt = md5(serial)
        let lc_demo = '';let lc_std = '';let lc_pro = ''
        let lc_std_t1 = '';let lc_std_t2 = '';let lc_std_t3 = '';let lc_std_t4 = '';
        let lc_pro_t1 = '';let lc_pro_t2 = '';let lc_pro_t3 = '';let lc_pro_t4 = '';

        for (var i = 0; i <= 5; i++) {
          lc_demo += crypt.charAt(process.env.VUE_APP_LIC_DEMO.split('')[i])
          lc_std+= crypt.charAt(process.env.VUE_APP_LIC_STD.split('')[i])
          lc_pro += crypt.charAt(process.env.VUE_APP_LIC_PRO.split('')[i])
          lc_std_t1 += crypt.charAt(process.env.VUE_APP_LIC_STD_T1.split('')[i])
          lc_std_t2 += crypt.charAt(process.env.VUE_APP_LIC_STD_T2.split('')[i])
          lc_std_t3 += crypt.charAt(process.env.VUE_APP_LIC_STD_T3.split('')[i])
          lc_std_t4 += crypt.charAt(process.env.VUE_APP_LIC_STD_T4.split('')[i])
          lc_pro_t1 += crypt.charAt(process.env.VUE_APP_LIC_PRO_T1.split('')[i])
          lc_pro_t2 += crypt.charAt(process.env.VUE_APP_LIC_PRO_T2.split('')[i])
          lc_pro_t3 += crypt.charAt(process.env.VUE_APP_LIC_PRO_T3.split('')[i])
          lc_pro_t4 += crypt.charAt(process.env.VUE_APP_LIC_PRO_T4.split('')[i])
        }         
        
        if(code == lc_demo){
          this.$store.commit('licensing', 'demo')
        } else if( code == lc_std ){
          this.$store.commit('licensing', 'std')
        } else if( code == lc_std_t1 ){
          this.$store.commit('licensing', 'std')
          this.$store.commit('template', 1)
        } else if( code == lc_std_t2 ){
          this.$store.commit('licensing', 'std')
          this.$store.commit('template', 2)
        } else if( code == lc_std_t3 ){
          this.$store.commit('licensing', 'std')
          this.$store.commit('template', 3)
        } else if( code == lc_std_t4 ){
          this.$store.commit('licensing', 'std')      
          this.$store.commit('template', 4)
        } else if( code == lc_pro ){
          this.$store.commit('licensing', 'pro')          
        } else if( code == lc_pro_t1 ){
          this.$store.commit('licensing', 'pro') 
          this.$store.commit('template', 1)
        } else if( code == lc_pro_t2 ){
          this.$store.commit('licensing', 'pro')
          this.$store.commit('template', 2)
        } else if( code == lc_pro_t3 ){
          this.$store.commit('licensing', 'pro')
          this.$store.commit('template', 3)
        } else if( code == lc_pro_t4 ){
          this.$store.commit('licensing', 'pro')
          this.$store.commit('template', 4)
        } else {
          this.$store.commit('licensing', 'nolic')
        }
        
        return this.$store.state.template

      },

      getSettings(){
        this.axios.get('/api/settings', { baseURL: this.$store.state.baseUrl })
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
       
      login(){
        //this.getLicense()    
        if(this.admin === true){ this.username = 'super' }
        var data = {
          client_id: 2,
          client_secret: '4HRkwk64iiYGlb2Wek2Z9F7HlwlFvCnWyvpKsdmg',          
          grant_type:'password',          
          username: this.username+"@app.tes",
          password: this.password
        }       
          
        this.axios.post('oauth/token', data)         
        .then( response => {            
          localStorage.setItem('token', response.data.access_token)
          localStorage.setItem('expiration', response.data.expires_in + Date.now())
          this.$auth.setToken(response.data.access_token, response.data.expires_in + Date.now())
          this.$store.commit('authenticate', this.$auth.isAuthenticated())
          this.axios.defaults.headers.common = {'Authorization': 'Bearer ' + this.$auth.getToken(), 'Accept': 'application/json'}          
          this.$router.push('/')
        })
        .catch(err=>{
          console.log(err.response)
          this.snackbar.text="Password tidak sesuai."
          this.snackbar.value = true
        })        
      },

      loginDemo(){        
        var data = {
          client_id: 2,
          client_secret: '4HRkwk64iiYGlb2Wek2Z9F7HlwlFvCnWyvpKsdmg',          
          grant_type:'password',          
          username: "super@app.tes",
          password: '111111'
        }       
          
        this.axios.post('oauth/token', data, { baseURL: process.env.VUE_APP_DEMODOMAIN })
        .then( response => {            
          this.$store.commit('licensing', 'pcmode')
          localStorage.setItem('token', response.data.access_token)
          localStorage.setItem('expiration', response.data.expires_in + Date.now())
          this.$auth.setToken(response.data.access_token, response.data.expires_in + Date.now())
          this.$store.commit('authenticate', this.$auth.isAuthenticated())
          this.axios.defaults.headers.common = {'Authorization': 'Bearer ' + this.$auth.getToken(), 'Accept': 'application/json'}          
          this.$router.push('/')
        })
        .catch(err=>{          
          this.$store.commit('licensing', '')
          this.$store.commit('authenticate', false)
          this.snackbar = { value:true, text: 'Periksa koneksi internet anda.'}
        }) 
      },      

      changeLicense(){
        this.dialogChangeLicense = true
      },

      updateLicense(){        
        let template = this.licensin('00000000'+ this.$store.state.serial, this.settings.license)        
        if (template) {
          this.$store.commit('template', '')          
        } else {
          this.settings.layout_id = template
        }

        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{                    
          this.connect()
          this.axios.put('/api/bot/1', {code:99 })                
          this.snackbar = { value: true, text: 'Ganti lisensi...SUKSES!.' }
          this.dialogChangeLicense = false
        })
        .catch(err=>{          
          this.snackbar = {value: true, text: Object.values(err.response.data.errors)[0][0]}
        })
      }, 

      openDialogDemo(){
        this.$store.commit('baseUrl', 'https://www.jasmadigital.com/demo')
        this.dialogDemo = true
      },

    }
  }
</script>
