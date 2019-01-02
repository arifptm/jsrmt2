<template>
	<v-layout row wrap>
    <v-btn fixed dark fab bottom right color="primary" @click="addItem">
      <v-icon>add</v-icon>
    </v-btn>
		  
		<v-container grid-list-sm class="grey lighten-3">
	  	<v-layout row wrap>
		    <v-flex xs4>
		      <v-text-field hint="dalam detik" persistent-hint label="Durasi" v-model.number="settings.jumbotron_duration" :error-messages="errors ? errors.jumbotron_duration : ''" @click="errors.jumbotron_duration = []"></v-text-field>
		    </v-flex>
		    <v-flex xs4>
		      <v-text-field hint="dalam menit" persistent-hint label="Periode" v-model.number="settings.jumbotron_pause" :error-messages="errors ? errors.jumbotron_pause : ''" @click="errors.jumbotron_pause = []"></v-text-field>
		    </v-flex>
		    <v-flex xs4>
		      <v-btn color="primary" ripple @click="saveSettings">Simpan</v-btn>
		    </v-flex>
		  </v-layout>
	  </v-container>
	
	  <v-flex xs12>
	    <v-tabs v-model="active" slider-color="green"  fixed-tabs >
	    	<v-tab v-for="n,i in Object.keys(items)" :key="i" ripple >
	    		{{ n }}
				</v-tab>

	    	<v-tab-item v-for="n,i in Object.values(items)" :key="i" >
					<v-card class="pt-2" flat>
						<v-data-table hide-headers :items="n" hide-actions class="" loading="true">
							<template slot="items" slot-scope="props">
								<tr @click="editItem(props.item)">
									<td class="pl-3 pr-0">
										<img class="py-1" :src="$store.state.baseUrl+'/imagecache/small-hd/'+props.item.image" height="54px" v-if="props.item.image" />
										<img v-else class="py-1" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAA2BAMAAADKYYHhAAAAG1BMVEUAAACWlpYSEhI4ODiDg4MlJSVdXV1LS0twcHD/wZD2AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAmElEQVRIie2QsQ6CMBRFbwsRR0w1cexjYa2hg3shrg58gV+ASQc/35KG+cHAYHxnP3n3PEAQBOGHoK1Cu8sKP6DqHaAv/UTwD1Z4RcTOJOHaBCrC7ckJluyA+3wBno6umjgBytYY1UnXICot35AF3SRhJLVOWCZ9qHSHNZNy9LkzKfrNRichv9XMb42B3bSQGraxvyAIf8gXrDMRxjA8tfYAAAAASUVORK5CYII=" height="54px" />
									</td>
									<td v-text="props.item.text"></td>
								</tr>
							</template>					  
						</v-data-table>				
					</v-card>
				</v-tab-item>
			</v-tabs> 
		</v-flex> 		

		<v-dialog v-model="dialog" fullscreen scrollable hide-overlay >
			<v-card>
				<v-toolbar color="primary" dark >
					<v-btn icon @click.native="dialog = false">
						<v-icon>close</v-icon>
					</v-btn>			
					<v-toolbar-title>
						{{ dialogTitle }}
					</v-toolbar-title>
				</v-toolbar>		

				<v-card-text class="text-xs-center">
					<croppa v-model="myCroppa"
						:width="240"	
						:height="135"
						:quality="8"
						:prevent-white-space= "true"
						placeholder="+ Tambah background"
						placeholder-color="#000"
						:placeholder-font-size="16"
						canvas-color="transparent"
						:show-remove-button="true"
						loading-color="#606060"   
						initial-size="contain"						
					>
						 <img  crossOrigin="anonymous" :src="$store.state.baseUrl+'/images/jumbotrons/'+editedItem.image" v-if="editedItem.image && editedIndex > -1" slot="initial">
					</croppa>

					<p>Jika tidak ada gambar, otomatis warna hitam.</p>
					<v-divider></v-divider>
					<v-textarea label="Isi informasi (text/html)" rows="3" v-model="editedItem.text" :error-messages="errors ? errors.text : ''" @click="errors.text = []"></v-textarea>

					<v-container grid-list-md class="pa-0">
						<v-layout row wrap>
							<v-flex xs6>
								<v-menu ref="menu1a" :close-on-content-click="false" v-model="menu1a" :nudge-right="40" :return-value.sync="ed.startDay" lazy offset-y full-width min-width="290px" transition="scale-transition">
			                  		<v-text-field slot="activator" v-model="$moment(ed.startDay).format('DD-MM-YYYY')" label="Tanggal mulai" readonly ></v-text-field>
			                  		<v-date-picker locale="id-ID" v-model="ed.startDay" @input="$refs.menu1a.save(ed.startDay)"></v-date-picker>
			                	</v-menu>           
			                </v-flex>

              <v-flex xs6>
                <v-menu ref="menu1b" :close-on-content-click="false" v-model="menu1b" :nudge-right="40" :return-value.sync="ed.startHour" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px" >
                  <v-text-field slot="activator" v-model="ed.startHour" label="Jam" append-icon="access_time" readonly></v-text-field>
                  <v-time-picker v-model="ed.startHour" format="24hr" @change="$refs.menu1b.save(ed.startHour)"></v-time-picker>
                </v-menu>                
              </v-flex> 			                

			                <v-flex xs6>
			                	<v-menu ref="menu2a" :close-on-content-click="false" v-model="menu2a" :nudge-right="40" :return-value.sync="ed.endDay" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px" >
			                  		<v-text-field slot="activator" v-model="$moment(ed.endDay).format('DD-MM-YYYY')" label="Tanggal selesai" readonly hide-details></v-text-field>
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
				</v-card-text>					
				<v-card-actions class="px-3">
					<v-btn color="red" flat small @click="deleteItem(editedItem)">Hapus</v-btn>
					<v-btn v-if="editedIndex > 0 " color="primary" small flat @click="activate(editedItem)">{{ activateLabel }}</v-btn>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="saveItem">Simpan</v-btn>								  
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-snackbar multi-line v-model="snackbar.value" :timeout="4000" color='primary darken-4'>{{snackbar.text }}</v-snackbar>
		
	
	</v-layout>
</template>

<script>	

	import Vue from 'vue'
	import Croppa from 'vue-croppa'
	Vue.use(Croppa)	

	export default {

		data () {
			return {
			    menu1a:false,
			    menu1b:false,
        		menu2a:false,
        		menu2b:false,
				snackbar:{value: false, text:''},
				active: 0,
				myCroppa:{},
				dialog: false,
				errors:{},
				items:{ aktif:[], nonaktif:[] },
				editedItem: {
					image:'',
					text:'',
					start:'',					
					end:'',
					enabled:''
				},

				ed:{
					startDay:'',
					startHour:'',
					endDay:'',
					endHour:'',
				},
				editedIndex: -1,
				settings:'',
				baseUrl: this.$store.state.baseUrl
			}
		},


		created(){
			this.getItems()
			this.getSettings()
			this.$store.commit('pageTitle', 'Jumbotron')
		},

		mounted(){			
		},

		computed:{
			newImage(){ return this.myCroppa.hasImage() },
			dialogTitle () { return this.editedIndex === -1 ? 'Tambah jumbotron' : 'Edit jumbotron' },
			activateLabel(){ return this.editedItem.enabled == 1 ? 'Arsipkan' : 'Aktifkan' },
		},

	    watch: {
	      dialog (val) {
	        val || this.close()
	      }
	    },

		methods:{

			saveSettings(){				
				this.axios.put('/api/settings/1', this.settings)
				.then(res=>{
					this.axios.put('/api/bot/1', { code: 99 })
					this.snackbar = { value: true, text:'Update data jumbotron...sukses!.'}
				})
				.catch(err=>{
					this.errors = err.response.data.errors
				})
			},

			close () {
				this.dialog = false
				this.editedIndex = -1
			},

			getItems(){
				this.axios.get('/api/jumbotrons')
				.then(res=>{ this.items = res.data })				
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

			addItem(){
				this.resetItem()
				this.editedItem.enabled = 1
				this.ed = { 
					startDay: this.$moment().format('YYYY-MM-DD'),
					startHour: this.$moment().format('HH:mm'),
					endDay: this.$moment().add(7, 'days').format('YYYY-MM-DD'),
					endHour: this.$moment().add(7, 'days').format('HH:mm'),
				}
				this.dialog = true
			},	

			editItem(item){				
				this.dialog = true
				this.editedIndex = item.id
				this.ed = {
			          startDay: this.$moment(item.start).format('YYYY-MM-DD'),
			          startHour: this.$moment(item.start).format('HH:mm'),
			          endDay: this.$moment(item.end).format('YYYY-MM-DD'),
			          endHour: this.$moment(item.end).format('HH:mm'),					
				}
				this.editedItem = item				
				this.myCroppa.refresh()
			},

			saveItem(){
				if(this.editedIndex > -1){
					this.updateItem()
				} else {
					this.storeItem()
				}				
			},

			storeItem() {
				this.editedItem.image = 'dummy'				
				this.editedItem.new_image = this.newImage === true ? this.myCroppa.generateDataUrl('image/jpg', 0.8) : ''
				if(this.editedItem.new_image == "" && this.editedItem.text == ""){
					return this.snackbar = { value: true, text: 'Jika tidak ada gambar, kolom text harus diisi.'}
				}
        		this.editedItem.start = this.ed.startDay+' '+ this.ed.startHour+ ':00'
				this.editedItem.end = this.ed.endDay+' '+ this.ed.endHour + ':00'        		
        		this.axios.post('/api/jumbotron', this.editedItem)
        		.then(res=>{
        			this.axios.put('/api/bot/1', { code: 99 })
          			this.getItems()
          			this.snackbar = { text: res.data.msg, value: true }
          			this.close()
          		})
          		.catch(err=>{	
          			var msg = this.errors = err.response.data.errors		        	
		        	this.snackbar = {value: true, text: Object.values(msg)[0][0]}
        		}) 
			},

			activate(item){

				this.axios.put('/api/jumbotron/activate/'+item.id, { enabled: item.enabled })
				.then(res=>{
					this.axios.put('/api/bot/1', { code: 99 })
					this.getItems()				
					this.snackbar = { text: res.data.msg, value: true }
				})				
				this.close()
			},

			updateItem(){								
				this.editedItem.new_image = this.newImage === true ? this.myCroppa.generateDataUrl('image/jpg', 0.8) : ''
				this.editedItem.start = this.ed.startDay+' '+ this.ed.startHour
				this.editedItem.end = this.ed.endDay+' '+ this.ed.endHour
				console.log('cek = '+this.editedItem)
				this.axios.put('/api/jumbotron/'+this.editedItem.id, this.editedItem)
				.then(res=>{
					this.axios.put('/api/bot/1', { code: 99 })
					this.getItems()				
					this.snackbar = { text: res.data.msg, value: true }
					this.close()
				})	
				.catch(err=>{	
          			var msg = this.errors = err.response.data.errors		        	
		        	this.snackbar = {value: true, text: Object.values(msg)[0][0]}
        		}) 			
			},



			deleteItem(item){	
				if( this.$store.state.license == 'pcmode'){
					return this.snackbar = {value: true, text: 'Tidak bisa menghapus pada Mode Demo'}
				}			
				if(confirm('Yakin akan dihapus?')){
					this.axios.delete('/api/jumbotron/'+item.id)
					.then(res=>{	
						this.axios.put('/api/bot/1', { code: 99 })					
						this.getItems()
						this.snackbar = { text: res.data.msg, value: true }
					})								
				}
				this.close()
			},  

			resetItem(){
				this.myCroppa.remove()
				this.editedItem = { image:'', text:'', start:'', end:'' }
			}


		}
	}

</script>
