<template>
  <v-fade-transition>
    <v-container class="pa-0">      
      <v-card flat>
        <v-card-text>  
          <form>              
            <v-text-field append-icon="lock_open" label="Password lama" type="password" v-model="pass.password" class="pb-4" :error-messages="err ? err.password : ''" @click="err.password = []" autocomplete ></v-text-field>

            <v-text-field append-icon="lock"  label="Password baru" type="password" v-model="pass.password_new" :error-messages="err ? err.password_new : ''" @click="err.password_new = []" autocomplete persistent-hint></v-text-field>
            <v-text-field  autocomplete label="Ulangi password baru" type="password" v-model="pass.password_new_confirmation"  :error-messages="err ? err.password_new_confirmation : ''" @click="err.password_new_confirmation = []" ></v-text-field>
          </form>
        </v-card-text>
        <v-card-actions class="pb-3">
          <v-spacer></v-spacer><v-btn color="primary" dark @click='changePwd'>Update</v-btn><v-spacer></v-spacer>
        </v-card-actions>                            
      </v-card>

      <v-snackbar multi-line v-model="snackbar.value" :timeout="4000" color='primary darken-4'>{{ snackbar.text }}</v-snackbar>
    
    </v-container>
  </v-fade-transition>
</template>

<script>
  export default {
    data(){
      return{               
        snackbar:{ text:'', value: false },
        pass:{
          password:'',
          password_new:'',
          password_new_confirmation:'',
        },
        err:{},
        oldPassWrong:'',
      }
    },

    created(){
      this.$store.commit('pageTitle', 'Ganti Password')
    },

    methods:{
      changePwd(){
        if( this.$store.state.license == 'pcmode'){
          return this.snackbar = {value: true, text: 'Tidak bisa mengganti password Mode Demo'}
        }
        this.axios.post('/api/change-pwd', this.pass)
        .then(res=>{          
          if(res.data.notmatch != ''){ 
            this.snackbar.value = true
            this.snackbar.text = res.data.notmatch
          } else {
            this.snackbar.value = true
            this.snackbar.text = 'SUKSES, password telah diganti.'           
          }
          this.err= {}
        })
        .catch(err=>{
          this.err = err.response.data.errors
        })

      },      
    }    
  }
</script>