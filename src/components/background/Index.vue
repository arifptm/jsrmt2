<template>
	<v-layout row wrap>
    <v-btn fixed dark fab bottom right color="primary" @click="addItem"><v-icon>add</v-icon></v-btn>
    <v-flex xs12>        
    	<v-card class="primary lighten-5" flat>    		
    		<v-card-text>
    		<v-layout row wrap>      		
		    	<v-flex xs6 >
		    		<v-text-field hint="dalam detik" persistent-hint label="Durasi per gambar" v-model.number="settings.carousel_time" :error-messages="errors ? errors.carousel_time : ''" @click="errors.carousel_time = []">       			
		    		</v-text-field>
		    	</v-flex>
		    	<v-flex xs6 text-xs-right>
		    		<v-btn color="primary" ripple @click="saveSettings">Simpan</v-btn>
		    	</v-flex>
		    	</v-layout>
	    	</v-card-text>
	    </v-card>
	  </v-flex>  

		<v-flex xs12>			  
      <v-tabs v-model="active" slider-color="primary"  fixed-tabs >
      	<v-tab v-for="n,i in Object.keys(items)" :key="i" ripple >
      		{{ n }}
  			</v-tab>
  		
    		<v-tab-item v-for="n,i in Object.values(items)" :key="i" >    			
				<v-card class="">
					<v-container fluid grid-list-lg>
						<v-layout row wrap v-if="n.length > 0">
							<v-flex xs6 v-for="item in n" :key="item.id">
								<v-card >									
									<v-img :src="$store.state.baseUrl+'/imagecache/small-hd/'+item.image"  @click="editItem(item)">
									</v-img>					
								</v-card>								
							</v-flex>
						</v-layout>
						<v-layout row wrap v-else >
							<v-flex xs12 >
							  	<v-card>
							  		<v-card-text>
							  	  	<div class="subheading">Tidak ada data</div>
							  		</v-card-text>
							  	</v-card>
								</v-flex>
							</v-layout>						
						</v-container>
					</v-card>
				</v-tab-item>
			</v-tabs>
		</v-flex>   
		

		<v-dialog v-model="dialog"   >
			<v-card>
				<v-toolbar class="primary" dark>										
					<v-toolbar-title>
						Tambah gambar
					</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click.native="dialog = false">
						<v-icon>close</v-icon>
					</v-btn>			
				</v-toolbar>		

				<v-card-text class="text-xs-center">
					<croppa v-model="myCroppa"
						:width="240"	
						:height="135"
						:quality="8"
						:prevent-white-space= "true"
						placeholder="+ Tambah gambar"
						canvas-color="#fff"
						placeholder-color="#333"
						:placeholder-font-size="16"						
						:show-remove-button="true"						
						:show-loading="true"
						:loading-size="50"
						loading-color="#606060"   
						initial-size="contain">			
					</croppa>			
				</v-card-text>					
				<v-card-actions class="primary lighten-5">
					
					<v-btn color="primary" flat dark @click.native="dialog = false">Batal</v-btn>					
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="upload">Simpan</v-btn>								  
					
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="dialog2" fullWidth >
			<v-card>
				<v-toolbar>
					<v-toolbar-title>
						#{{ editedItem.id }}
					</v-toolbar-title>
					<v-spacer></v-spacer>					
						<v-btn icon @click="dialog2 = false">
							<v-icon >close</v-icon>
						</v-btn>
				</v-toolbar>
				<v-img :src="$store.state.baseUrl+'/images/'+ editedItem.image" height="200" v-if="editedItem.image">
				</v-img>
				<v-card-actions>
			  		<v-btn color="red" dark @click="deleteItem(editedItem)">Hapus</v-btn>
			  		<v-spacer></v-spacer>
			  		<v-btn color="primary" dark @click="updateItem(editedItem)">{{ editedLabel }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-snackbar multi-line v-model="snackbar.value" :timeout="4000" color='primary darken-4'>{{ snackbar.text }}</v-snackbar>

	</v-layout>
</template>

<script>	

	import Vue from 'vue'
	import Croppa from 'vue-croppa'
	Vue.use(Croppa)	

	export default {

		data () {
			return {
				snackbar:{value: false, text:''},
				active: null,
				myCroppa:{},
				dialog: false,
				dialog2: false,
				items: {},
				editedItem:{},
				editedLabel:'',
				image:'',
				dataUrl:'',
				baseUrl: localStorage.getItem('baseUrl'),
				settings:{},
				errors:{}
			}
		},


		created(){
			this.getBg()
			this.getSettings()
			this.$store.commit('pageTitle', 'Gambar Latar')
		},

		mounted(){			
			this.active = 0
		},

		computed:{

			imag(){
				return this.myCroppa.hasImage()
			}			
		},

		methods:{

			saveSettings(){				
				this.axios.put('/api/settings/1', this.settings)
				.then(res=>{
					this.axios.put('/api/bot/1', { code: 1})
					this.snackbar = { value: true, text:'Update durasi tampilan tiap gambar...sukses!.'}
				})
				.catch(err=>{
					this.errors = err.response.data.errors
				})
			},

			getBg(){
				this.axios.get('/api/backgrounds')
				.then(res=>{
					this.items = res.data
					//console.log(res.data)
				})				
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
				this.myCroppa.remove()
				this.dialog = true
			},	

			upload() {
						var img = (this.myCroppa.hasImage() === true) ? this.myCroppa.generateDataUrl('image/png', 0.8) : ''						
        		this.axios.post('/api/background/upload', {enabled:"1", image: img})
        		.then(res=>{
        			this.axios.put('/api/bot/1', { code: 1 })
          			this.dialog = false
          			this.getBg()
          			this.snackbar = {text: "Upload gambar latar...sukses!", value: true}
          	})
          	.catch(err=>{	
		        	this.snackbar = {value: true, text: Object.values(err.response.data.errors)[0][0]}
        		}) 	
			},

			editItem(item){
				this.dialog2 = true				
				this.editedItem = item

				if (item.enabled == 1){
					this.editedLabel = 'Arsipkan'
				} 
				if (item.enabled == 0){					
					this.editedLabel = 'Aktifkan'
				} 	
				
			},

			updateItem(item){				
				this.axios.put('/api/background/'+item.id, { enabled: this.editedItem.enabled, image: this.editedItem.image })
				.then(res=>{
					this.axios.put('/api/bot/1', { code: 1 })
					this.getBg()					
					this.dialog2 = false					
					var msg = res.data.enabled == 1 ? 'aktifkan' : 'arsipkan'
					this.snackbar= {value:true,  text: 'Gambar berhasil di '+ msg }
				})	
		    .catch(err=>{	
	        	this.snackbar = {value: true, text: Object.values(err.response.data.errors)[0][0]}
	    		}) 				
			},

			deleteItem(item){	
				if( this.$store.state.license == 'pcmode'){
					return this.snackbar = {value: true, text: 'Tidak bisa menghapus pada Mode Demo'}
				}
				if(confirm('Yakin akan dihapus?')){
					this.axios.delete('/api/background/'+item.id)
					.then(res=>{											
						this.axios.put('/api/bot/1', { code: 1})
						this.getBg()
						this.snackbar.text="Gambar berhasil dihapus"
          				this.snackbar.value=true	
					})								
				}
				this.dialog2 = false		
			},  


		}
	}

</script>
