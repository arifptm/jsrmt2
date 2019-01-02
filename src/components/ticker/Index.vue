<template>
  <v-layout row wrap >
    <v-flex xs12>
      <v-layout row wrap class="px-3 pb-3 pt-2 align-baseline primary lighten-5">
        <v-flex xs6>
          <v-text-field hint="dalam detik" persistent-hint label="Durasi pengumuman" v-model.number="settings.ticker_time" :error-messages="errors ? errors.ticker_time : ''" @click="errors.ticker_time = []">            
          </v-text-field>
        </v-flex>
        <v-flex xs6 text-xs-right>
          <v-btn color="primary" ripple @click="saveSettings">Simpan</v-btn>
        </v-flex>
      </v-layout>
    </v-flex>

<v-flex xs12 class="mb-3">  
  <v-data-table hide-headers :items="items" hide-actions item-key="name">
    <template slot="items" slot-scope="props">
      <tr :class="(props.item.enabled == 1 && $moment().isSameOrAfter($moment(props.item.start)) && $moment().isSameOrBefore($moment(props.item.end))) ? 'black--text' : 'grey--text text--ligten-4' " @click="editItem(props.item)">
        <td  v-if="$store.state.license != 'std'" class="pl-3 pr-0"><v-icon :color=" props.item.jumbotron == 1 ? 'green' : 'grey lighten-3'">desktop_windows</v-icon></td>
        <td class="pl-3 pr-3">
          <div class="pt-2 px-2" v-if="props.item.enabled == 1 && $moment().isSameOrAfter($moment(props.item.start)) && $moment().isSameOrBefore($moment(props.item.end))">Tampil: {{ $moment(props.item.start).format('DD/MM/YYYY') }} - {{ $moment(props.item.end).format('DD/MM/YYYY') }}</div>
          <div class="pt-2 px-2" v-else>
            <div v-if="props.item.enabled == 0">Disabled</div>
            <div v-else>Expired: {{ $moment(props.item.end).format('DD/MM/YYYY') }} </div>
          </div>

          <div class="green lighten-5 px-2 py-1 mb-2 font-weight-bold">{{ props.item.text }}</div>        
        </td>      
<!--         <td class="pl-0 pr-0 text-xs-right">
          <v-menu bottom left>
            <v-btn slot="activator" icon > <v-icon color="primary">more_vert</v-icon> </v-btn>

            <v-list>
              <v-list-tile @click="editItem(props.item)">
                <v-list-tile-avatar><v-icon>edit</v-icon></v-list-tile-avatar>
                <v-list-tile-title>Edit</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="activate(props.item)">
                <v-list-tile-avatar><v-icon>{{ props.item.enabled == 1 ? 'cancel' : 'check_circle' }}</v-icon></v-list-tile-avatar>
                <v-list-tile-title> 
                  {{ props.item.enabled == 1 ? 'Nonaktifkan' : 'Aktifkan' }}                  
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td> -->
      </tr>
    </template>    
  </v-data-table>
</v-flex>

    <v-dialog v-model="dialog" max-width="590">
      <v-card>
        <v-toolbar class="primary" dark>                    
          <v-toolbar-title>
            Edit pengumuman
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>      
        </v-toolbar>    

        <v-card-text>
          <v-textarea :counter="75" :rows="3" :rules="[max75chars]" label="Isi pengumuman" v-model="editedItem.text"></v-textarea>

          <v-container grid-list-md class="pa-0">
            <v-layout row wrap>
              <v-flex xs6>
                <v-menu ref="menu1a" :close-on-content-click="false" v-model="menu1a" :nudge-right="40" :return-value.sync="ed.startDay" lazy offset-y full-width min-width="290px" transition="scale-transition">
                            <v-text-field slot="activator" v-model="$moment(ed.startDay).format('DD-MM-YYYY')" label="Mulai tanggal" readonly ></v-text-field>
                            <v-date-picker locale="id-ID" v-model="ed.startDay" @input="$refs.menu1a.save(ed.startDay)"></v-date-picker>
                        </v-menu>           
                      </v-flex>

              <v-flex xs6>
                <v-menu ref="menu1b" :close-on-content-click="false" v-model="menu1b" :nudge-right="40" :return-value.sync="ed.startHour" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px" >
                  <v-text-field slot="activator" v-model="ed.startHour" label="Jam" append-icon="access_time" readonly hide-details></v-text-field>
                  <v-time-picker v-model="ed.startHour" format="24hr" @change="$refs.menu1b.save(ed.startHour)"></v-time-picker>
                </v-menu>                
              </v-flex>                       

                      <v-flex xs6>
                        <v-menu ref="menu2a" :close-on-content-click="false" v-model="menu2a" :nudge-right="40" :return-value.sync="ed.endDay" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px" >
                            <v-text-field slot="activator" v-model="$moment(ed.endDay).format('DD-MM-YYYY')" label="Selesai tanggal" readonly hide-details></v-text-field>
                            <v-date-picker locale="id-ID" v-model="ed.endDay" @change="$refs.menu2a.save(ed.endDay)"></v-date-picker>
                        </v-menu>   
                      </v-flex>

              <v-flex xs6>
                <v-menu ref="menu2b" :close-on-content-click="false" v-model="menu2b" :nudge-right="40" :return-value.sync="ed.endHour" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px" >
                  <v-text-field slot="activator" v-model="ed.endHour" label="Jam" append-icon="access_time" readonly hide-details></v-text-field>
                  <v-time-picker v-model="ed.endHour" format="24hr" @change="$refs.menu2b.save(ed.endHour)"></v-time-picker>
                </v-menu>                
              </v-flex> 

                  </v-layout>
              </v-container>

          <v-switch color="primary" :true-value="1" :false-value="0" hide-details
            label="Tampilkan pengumuman"
            v-model="editedItem.enabled"            
          ></v-switch>
          <v-switch color="primary" :true-value="1" :false-value="0" hide-details
            label="Tampilkan di jumbotron?"
            v-model="editedItem.jumbotron"
            v-if="$store.state.license != 'std'"
          ></v-switch>

        </v-card-text>
        <v-card-actions>          
          <v-btn color="primary" flat  @click="dialog = false">Batal</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary"  @click="updateItem()">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar multi-line v-model="snackbar.value" :timeout="4000" color='primary darken-4'>{{ snackbar.text }}</v-snackbar>
    </v-snackbar>

  </v-layout>
</template>

<script>
  export default{
    data(){
      return {
        dialog: false,
          menu1a:false,
          menu1b:false,
            menu2a:false,
            menu2b:false,        
        editedItem: { text:''},
        ed:{
          startDay:'',
          startHour:'',
          endDay:'',
          endHour:'',
        },
        items:[],
        errors:{},
        settings:{},
        snackbar:{ value: false, text:''},
        max75chars: (v) => v.length <= 75 || 'Terlalu panjang...!',
      }
    },

    created(){
      this.getAnnouncements()
      this.getSettings()
      this.$store.commit('pageTitle', 'Pengumuman')
    },

    methods:{

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

      saveSettings(){        
        this.axios.put('/api/settings/1', this.settings)
        .then(res=>{
          this.axios.put('/api/bot/1', { code: 99 })
          this.snackbar = { value: true, text:'Update pengumuman...sukses!.'}
        })
        .catch(err=>{
          this.errors = err.response.data.errors
        })
      },      

      getAnnouncements(){
        this.axios.get('/api/announcements')
        .then(res=>{
          this.items = res.data.sort((a,b)=>this.$moment(b.end) - this.$moment(a.end))
          .sort((a,b) => b.enabled - a.enabled)
        })
      },

      truncate(text,stop){
        return (text.length > stop) ?  text.slice(0,100)+'...' : text
      },


      editItem(item){
        this.dialog = true
        this.editedItem = item        
        this.ed = {
          startDay: this.$moment(item.start).format('YYYY-MM-DD'),
          startHour: this.$moment(item.start).format('HH:mm:ss'),
          endDay: this.$moment(item.end).format('YYYY-MM-DD'),
          endHour: this.$moment(item.end).format('HH:mm:ss'),
        }        
      },

      updateItem(){
        if(this.editedItem.text == "") this.editedItem.text ='---'
        this.editedItem.start = this.ed.startDay+' '+this.ed.startHour
        this.editedItem.end = this.ed.endDay+' '+this.ed.endHour
        if (this.$store.state.license == 'std'){
          this.editedItem.jumbotron = 0
        }
        this.axios.put('/api/announcements/'+this.editedItem.id, this.editedItem)
        .then(res=>{  
          this.getAnnouncements()        
          this.axios.put('/api/bot/1', { code: 99 })
          this.dialog = false
          this.snackbar = { value: true, text:'Update pengumuman...sukses!.'}          
        })
            .catch(err=>{ 
                var msg =  err.response.data.errors              
              this.snackbar = {value: true, text: Object.values(msg)[0][0]}
            }) 

      }

    }
  }
</script>