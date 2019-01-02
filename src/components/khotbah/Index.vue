<template>
  <div>
    <v-tabs v-model="active" color="success" dark slider-color="primary darken-4" fixed-tabs>
      <v-tab ripple class="primary--text text--darken-5">Khotbah</v-tab>
      <v-tab ripple class="primary--text text--darken-5">Khotib</v-tab>
      <v-tab ripple class="primary--text text--darken-5">Selesai</v-tab>
      <v-tab-item>
        <v-card>
          <v-layout row wrap class="grey lighten-4">
            <v-btn color="primary" fab depressed dark  @click.prevent="createKhotbah()"><v-icon>add</v-icon></v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchFutureKhotbah"  label="Cari" single-line class="pr-3" clearable></v-text-field>     
          </v-layout>

          <v-data-table :headers='headersKhotbah' hide-headers :items="khotbahs.future" :search="searchFutureKhotbah" disable-initial-sort>
            <template slot="items" slot-scope="props">
              <tr>
                <td class="pl-2 pr-0"></td>
                <td class="pl-0 pr-0"><v-icon small :color="(props.item.ticker == 1) ? 'green' : 'grey lighten-3'">notifications</v-icon></td>
                <td class="pl-0 pr-2"><v-icon small :color="(props.item.jumbotron == 1) ? 'green' : 'grey lighten-3'">desktop_windows</v-icon></td>
                <td class="px-0" @click.prevent="editKhotbah(props.item)"><div class="body-2">{{ $moment(props.item.date).format('DD-MM-YYYY') }}</div><div class="caption">{{ props.item.khotib.name }} {{ props.item.khotib.city }}</div></td>                
                <td class="pl-0 pr-3 text-xs-right">
                  <v-btn icon @click.prevent="removeKhotbah(props.item.id)"> <v-icon color="red">delete</v-icon></v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
      
      <v-tab-item>
        <v-card>
          <v-layout row wrap class="grey lighten-4">
            <v-btn color="primary" fab depressed dark  @click.prevent="createKhotib()"><v-icon>add</v-icon></v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchKhotib"  label="Cari" single-line class="pr-3" clearable></v-text-field>     
          </v-layout>
          
          <v-data-table :headers='headersKhotib' hide-headers :items="khotibs" :search="searchKhotib" disable-initial-sort>
            <template slot="items" slot-scope="props">
              <tr>
                <td class="pl-3 pr-0" @click.prevent="editKhotib(props.item)"><div class="body-2">{{ props.item.name }}</div>
                  <v-icon size="16" v-if="props.item.city">place</v-icon>{{ props.item.city }} <span v-if="props.item.city">---</span>  <span class="grey--text" v-if="props.item.khotbahs_count > 0"><v-icon size="16">timer</v-icon> {{ props.item.khotbahs_count}} jadwal</span></td>
                <td class="pl-0 pr-3 text-xs-right">                  
                  <v-btn icon :disabled="props.item.khotbahs_count > 0"> <v-icon color="red" @click.prevent="removeKhotib(props.item.id)" :disabled="props.item.khotbah_count > 0">delete</v-icon></v-btn>                  
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>    

      <v-tab-item>
        <v-card>
          <v-layout row wrap class="grey lighten-4">
            <v-text-field v-model="searchPastKhotbah" prepend-icon="search" label="Cari" single-line  clearable class="mx-3"></v-text-field>     
          </v-layout>
          <v-data-table :headers='headersKhotbah' hide-headers :items="khotbahs.past" :search="searchPastKhotbah" disable-initial-sort>
            <template slot="items" slot-scope="props">
              <tr>
                <td class="pl-3 pr-0" @click.prevent="editKhotbah(props.item)"><div class="body-2">{{ $moment(props.item.date).format('DD-MM-YYYY') }}</div><div class="caption">{{ props.item.khotib.name }} {{ props.item.khotib.city }}</div></td>
                <td class="pl-0 pr-3 text-xs-right">
                  <v-btn icon @click.prevent="removeKhotbah(props.item.id)"> <v-icon color="red">delete</v-icon></v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
    </v-tabs>

    <v-dialog v-model="dialogKhotib"  persistent :overlay="false" max-width="500px" transition="dialog-transition">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>{{ khotibDialogTitle }}</v-toolbar-title><v-spacer></v-spacer>
          <v-icon @click="closeKhotibDialog">close</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-text-field label="Nama Khotib" v-model="editedKhotib.name" :error-messages="errors ? errors.name : ''" @click="errors.name = []"></v-text-field>
          <v-text-field label="Alamat kota/daerah" v-model="editedKhotib.city"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click.prevent="storeKhotib">{{ khotibSaveButton }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogKhotbah"  persistent :overlay="false" max-width="500px" transition="dialog-transition">
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>{{ khotbahDialogTitle }}</v-toolbar-title><v-spacer></v-spacer>
          <v-icon @click="closeKhotbahDialog()">close</v-icon>
        </v-toolbar>      
        <v-card-text>
          <v-menu ref="menu1" :close-on-content-click="false" v-model="menu1" :nudge-right="40" :return-value.sync="editedKhotbah.date" lazy offset-y full-width min-width="290px" transition="scale-transition">
            <v-text-field slot="activator" v-model="$moment(editedKhotbah.date).format('DD-MM-YYYY')" label="Tanggal" readonly :error-messages="errors ? errors.date : ''" @click="errors.date = []"></v-text-field>
            <v-date-picker locale="id-ID" v-model="editedKhotbah.date" @input="$refs.menu1.save(editedKhotbah.date)"></v-date-picker>
          </v-menu>     

          <v-select :items="khotibs" v-model="editedKhotbah.khotib_id" item-text="name" item-value="id" label="Khotib" :error-messages="errors ? errors.khotib_id : ''" @click="errors.khotib_id = []"></v-select>

          <v-switch label="Tambahkan ke pengumunan" hide-details v-model.number="editedKhotbah.ticker" :true-value="1" color="primary" :false-value="0"></v-switch>
          <v-switch label="Tambahkan ke jumbotron" hide-details v-model.number="editedKhotbah.jumbotron" :true-value="1" color="primary" :false-value="0" v-if="$store.state.licence != 'std'"></v-switch>

        </v-card-text>  
            
        <v-card-actions>
          <v-btn block color="primary" v-on:click.prevent="storeKhotbah()">Simpan</v-btn>           
        </v-card-actions>
      </v-card>        
      
    </v-dialog>
    
    <v-snackbar multi-line v-model="snackbar.value" :timeout="4000" color='primary darken-4'>{{ snackbar.text }}</v-snackbar>

  
</div>

</template>

<script>  
  export default{
    data(){
      return{
        active:'',
        menu1: false,
        dialogKhotib:false,
        dialogKhotbah:false,
        searchPastKhotbah:'',
        searchFutureKhotbah:'',
        searchKhotib:'',
        errors:{},
        khotibEditedIndex: -1,
        editedKhotib:{},
        editedKhotbah: {},
        khotbahEditedIndex: -1,
        headersKhotbah:[
          { text: 'Nama', value: 'khotib.name', class:"pl-3 pr-0"},
          { text: 'Dari', value: 'khotib.city', class:"hidden-xs-only" },
          { text: 'Aksi', value: '', class:"pl-0 pr-3"},
        ],
        headersKhotib:[
          { text: 'Name', value: 'name', class:"pl-3 pr-0"},          
          { text: 'Dari', value: 'city', class:"hidden-xs-only" },
          { text: 'Aksi', value: '', class:"pl-0 pr-3"},
        ],
        khotbahs:[],
        khotbah:{},                
        khotibs:[],        
        snackbar: {value:false, text:''},
      }
    },

    created(){
      this.init()
      this.$store.commit('pageTitle', 'Khotib & Khotbah')
    },

    computed:{
      khotibDialogTitle(){
        return this.khotibEditedIndex == -1 ? 'Tambah Khotib' : 'Edit Khotib'
      },
      khotibSaveButton(){
        return this.khotibEditedIndex == -1 ? 'Simpan' : 'Perbarui'
      },
      khotbahDialogTitle(){        
        return this.khotbahEditedIndex == -1 ? 'Tambah Khotbah' : 'Edit Khotbah'
      }
    },

    methods:{

      init(){
        this.getKhotibs()
        this.getKhotbahs()
      },

      getKhotibs(){
        this.axios.get('/api/khotibs')
        .then(res=>{
          this.khotibs = res.data
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

      getKhotbahs(){
        this.axios.get('/api/khotbahs')
        .then(res=>{
          this.khotbahs = res.data
        })
      },

      createKhotbah(){
        this.editedKhotbah.jumbotron = 1
        this.editedKhotbah.ticker = 1
        this.dialogKhotbah = true
      },

      closeKhotbahDialog(persistent=0){
        if (persistent == 0) this.resetEditedKhotbah(1)          

        if (this.khotbahEditedIndex) this.khotbahEditedIndex = -1        

        this.dialogKhotbah = false
        this.errors = {}
      },

      resetEditedKhotbah(){
        this.editedKhotbah = {
          id: null,
          jumbotron: 1,
          ticker: 1,
          date: null,
          khotib_id: null
        }
      },  

      editKhotbah(item){    
        this.khotbahEditedIndex = item.id   
        this.editedKhotbah = Object.assign({}, item)
        this.dialogKhotbah = true
      },

      storeKhotbah(){
        if(this.khotbahEditedIndex > -1){
          this.axios.put('/api/khotbah/'+ this.editedKhotbah.id, this.editedKhotbah)
          .then(res=>{
            this.axios.put('/api/bot/1', {code:99})
            this.snackbar = { value:true, text: res.data.msg}
            this.init()
            this.closeKhotbahDialog()    
            this.resetEditedKhotbah()        
          })
            .catch(err=>{ 
                this.errors = err.response.data.errors              
              // this.snackbar = {value: true, text: Object.values(msg)[0][0]}
            })  
        } else {
          this.axios.post('/api/khotbah', this.editedKhotbah)
          .then(res=>{
            this.axios.put('/api/bot/1', {code:99})
            this.init()
            this.closeKhotbahDialog()
            this.snackbar = { value:true, text: res.data.msg}
            this.resetEditedKhotbah()
          })
            .catch(err=>{ 
              this.errors = err.response.data.errors
            })            
        }
                
      },

      removeKhotbah(id){
        if( this.$store.state.license == 'pcmode'){
          return this.snackbar = {value: true, text: 'Tidak bisa menghapus pada Mode Demo'}
        }
        confirm('Menghapus jadwal khotbah?') &&         
        this.axios.delete('/api/khotbah/'+id)
        .then(res=>{
          this.axios.put('/api/bot/1', {code:99})
          this.snackbar = { value: true, text:'Jadwal khotbah berhasi dihapus'}
          this.init()
        })
      },
      
      createKhotib(){
        this.dialogKhotib = true
      },

      closeKhotibDialog(persistent=0){        
        if( persistent != 0 ) this.resetEditedKhotib()
        if( this.khotibEditedIndex)this.khotibEditedIndex = -1
        this.dialogKhotib = false
        this.errors = {}
      },

      resetEditedKhotib(){
        this.editedKhotib = {
          name:'', 
          city:'', 
          khotbah_count:0, 
          id: null
        }
      },

      editKhotib(item){
        this.khotibEditedIndex = item.id
        this.editedKhotib = Object.assign({}, item)       
        this.dialogKhotib = true
      },
      storeKhotib(){
        if(this.khotibEditedIndex > -1){
          this.axios.put('/api/khotib/'+this.editedKhotib.id, this.editedKhotib)
          .then(res=>{
            this.init()
            this.closeKhotibDialog()
            this.snackbar = { value: true, text:'Khotib berhasi diperbarui'}
            this.resetEditedKhotib()
          })
        .catch(err=>{ 
          var msg = this.errors = err.response.data.errors              
            // this.snackbar = {value: true, text: Object.values(msg)[0][0]}
          })            
        } else {
          this.axios.post('/api/khotib', this.editedKhotib)
          .then(res=>{
            this.init()
            this.closeKhotibDialog()
            this.snackbar = { value: true, text:'Khotib berhasi ditambahkan'}
            this.editedKhotib = {khotib_id:'', date:''}
            this.resetEditedKhotib()
          })  
            .catch(err=>{ 
              this.errors = err.response.data.errors
              // this.snackbar = {value: true, text: Object.values(msg)[0][0]}
            })          
        }

      },      
      removeKhotib(id){
        if( this.$store.state.license == 'pcmode'){
          return this.snackbar = {value: true, text: 'Tidak bisa menghapus pada Mode Demo'}
        }
        confirm('Menghapus Khotib?') &&         
        this.axios.delete('/api/khotib/'+id)
        .then(res=>{          
          this.snackbar = { value: true, text:'Khatib berhasi dihapus'}
          this.init()
        })
      },      
    }
  }
</script>


