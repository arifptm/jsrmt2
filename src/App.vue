<template>
  <v-app>
    
    <v-navigation-drawer fixed app v-model="$store.state.drawer" width="250">
      <v-toolbar color="primary" dark>
        <v-icon  color="blue lighten-4" size="38" @click="$router.push({ name: 'home' })">alarm_on</v-icon>
        <v-toolbar-title class="title primary px-2 py-1">Jasma {{ $store.state.version }}</v-toolbar-title>
      </v-toolbar>

      <v-list dense>
        <v-list-tile exact-active-class="primary lighten-5" v-for="stdMenu in stdMenus" :key="stdMenu.text" exact :to="stdMenu.path" active-class="primary--text text--darken-4" v-if="stdMenu.for.includes($store.state.license)">
          <v-list-tile-action>
            <v-icon light v-html="stdMenu.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="stdMenu.title"></v-list-tile-title>            
          </v-list-tile-content>
        </v-list-tile>

        <v-divider class="my-2"></v-divider>

        <v-list-tile exact-active-class="primary lighten-5" v-for="proMenu in proMenus" :key="proMenu.text" exact :to="proMenu.path" active-class="primary--text text--darken-4">
          <v-list-tile-action>
            <v-icon light v-html="proMenu.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="proMenu.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider class="my-2"></v-divider>

        <v-list-tile exact-active-class="primary lighten-5" v-for="devMenu in devMenus" :key="devMenu.text" exact @click="devMenu.path" active-class="primary--text text--darken-4" >
          <v-list-tile-action>
            <v-icon light v-html="devMenu.icon" ></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="devMenu.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list> 
      <v-divider></v-divider>
      <v-card color="blue--text text--darken-4 primary lighten-5" flat>
        <v-card-text>
          <div>Serial: <b>{{ this.$store.state.serial }}</b><br>
          Lisensi: <b>{{ this.$store.state.license.toUpperCase() }}</b></div>
        </v-card-text>
      </v-card>

    </v-navigation-drawer>    

      <v-toolbar color="primary" dark  fixed app v-if="$route.name != 'login' ">
        <v-toolbar-side-icon @click.native="$store.commit('drawerState','')"></v-toolbar-side-icon>
        <v-toolbar-title class="ml-1">{{ $store.state.pageTitle }}</v-toolbar-title>    
        <v-spacer></v-spacer>
        <v-icon v-if="$route.meta.closeTo" @click="$router.push({name: $route.meta.closeTo})">close</v-icon>
      </v-toolbar>
      <v-content>
      <router-view/>
    </v-content>
    <v-snackbar multi-line v-model="snackbar.value" :timeout="4000" color='primary darken-4'>{{snackbar.text }}</v-snackbar>
  </v-app>
</template>

<script>
import md5 from 'js-md5'
export default {
  name: 'App',
  data () {
    return {      
      stdMenus:[
        {icon: 'collections', title: 'Gambar Latar', path: 'backgrounds', for: ['pcmode', 'std', 'pro', 'demo']},
        {icon: 'notifications_active', title: 'Pengumuman', path: 'tickers', for: ['pcmode', 'std', 'pro', 'demo']},
        {icon: 'desktop_windows', title: 'Jumbotron', path: 'jumbotrons', for: ['pcmode', 'pro', 'demo']},
        {icon: 'local_library', title: 'Jadwal Khotbah', path: 'khotbahs', for: ['pcmode', 'std', 'pro', 'demo']},
        {icon: 'volume_up', title: 'Daftar Murottal', path: 'murottal-upload', for: ['pcmode', 'std', 'pro', 'demo']},
      ],
      proMenus:[
        {icon: 'settings', title: 'Pengaturan', path: 'settings'},
        {icon: 'lock_open', title: 'Ganti Password', path: 'change_pwd'},
      ],
      devMenus:[
        {icon: 'refresh', title: 'Refresh', path: this.refresh },
        {icon: 'settings_backup_restore', title: 'Restart', path: this.reboot},
        {icon: 'power_settings_new', title: 'Shut Down', path: this.poweroff},
        {icon: 'exit_to_app', title: 'Logout', path: this.logout},
      ],    
      snackbar : { value: false, text: ''},
    }
  },

  created(){    
    this.$store.commit('baseUrl', process.env.VUE_APP_BASEDOMAIN)
    //this.getLicense() 
  },

  methods:{
    getLicense(){

        this.axios.get('/hwlic', { baseURL: this.$store.state.baseUrl, timeout:2000 })
        .then(res=>{          
          var resdata = res.data
          if(resdata.hw != ""){ 

            var code = this.code = resdata.set
            var serial = resdata.hw
            this.$store.commit('serial', serial.substring(8))
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
              this.$store.commit('template', 2)
            } else {
              this.$store.commit('licensing', 'nolic')
            }

          if(this.$store.state.template != '') {
            this.settings.layout_id= this.$store.state.template
            this.axios.put('/api/settings/1', this.settings)
          }

          } else {
            this.$store.commit('licensing', 'pcmode')
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

      refresh(){        
        this.axios.get('/api/run/refresh')
        .then(res=>{
          this.drawer = false
        })
      },

      reboot(){
        if( this.$store.state.license == 'pcmode'){
          return this.snackbar = {value: true, text: 'Tidak bisa me-reebot menghapus pada Mode Demo'}
        }
        if(confirm('Yakin akan restart?')){        
          this.axios.post('/api/run/reboot',)
          .then(res=>{
            this.drawer = false
            //console.log('reboot')  
          })
        }
      },

      poweroff(){
        if( this.$store.state.license == 'pcmode'){
          return this.snackbar = {value: true, text: 'Tidak bisa mematikan pada Mode Demo'}
        }
        if(confirm('Yakin akan dimatikan?')){        
          this.axios.post('/api/run/poweroff',)
          .then(res=>{
            this.drawer = false
            //console.log('shutdown')  
          })
        }
      },

      logout(){        
        this.$auth.destroyToken();
        this.$store.commit('baseUrl', process.env.VUE_APP_BASEDOMAIN)
        this.$store.commit('licensing', '')
        this.$store.commit('template', '')
        this.$router.push('/login');       
      },      
  }

}
</script>

<style>
.tslide-enter-active {
   transition: all .5s ease;
 }

.tslide-leave-active {
   transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.tslide-enter, .tslide-leave-to {
  /*transform: translateX(10px);*/
  opacity: 0;
}

.croppa-container { 
  background-color: #fff;  
}

.croppa-container canvas {
  border: 2px dashed #ccc; 
}



</style>
