<template>
	<div>
		<v-tabs v-model="active" color="success" dark slider-color="primary darken-4" fixed-tabs>		
			<v-tab ripple class="primary--text text--darken-5">Murottal</v-tab>
			<v-tab ripple class="primary--text text--darken-5">Qori</v-tab>
		  <v-tab-item>
		    <v-card>
		    	<v-layout row wrap class="grey lighten-4">
            <v-btn color="primary" fab depressed dark  @click.prevent="createMurottal()"><v-icon>add</v-icon></v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchMurottal"  label="Cari" single-line class="pr-3" clearable></v-text-field>     
          </v-layout>
			    <v-data-table :headers='headersMurottal' hide-headers :items="murottals" :search="searchMurottal" disable-initial-sort>
			      <template slot="items" slot-scope="props">
			        <tr>
			          <td class="pl-3 pr-0"  @click="editMurottal(props.item)"><div class="body-2">{{ props.item.surah }}</div><div class="caption">{{ props.item.qori.name }}</div></td>
			          <td class="pl-0 pr-3 text-xs-right">
			          	<v-btn icon color="primary" @click="props.item.isPlaying ? murottalPause(props.index) : murottalPlay(props.index)"> 
			          		<v-icon color="white">{{ props.item.isPlaying === true ? 'pause' : 'play_arrow' }}</v-icon>
			          	</v-btn>
			            <v-btn icon @click="removeMurottal(props.item.id)"> <v-icon color="red">delete</v-icon></v-btn>
			          </td>
			        </tr>
			      </template>
			    </v-data-table>
  			</v-card>
		  </v-tab-item>
		  
		  <v-tab-item>
		    <v-card>
        	<v-layout row wrap class="grey lighten-4">
            <v-btn color="primary" fab depressed dark  @click.prevent="createQori()"><v-icon>add</v-icon></v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchQori"  label="Cari" single-line class="pr-3" clearable></v-text-field>     
          </v-layout>
			    <v-data-table :headers='headersQori' hide-headers :items="qoris" :search="searchQori" disable-initial-sort>
			      <template slot="items" slot-scope="props">
			        <tr>
			          <td class="pl-3 pr-0" @click="editQori(props.item)"><div>{{ props.item.name }}</div> 
			          	<div class="caption">({{ props.item.murottals_count }} file)</div></td>


			          <td class="pl-0 pr-3 text-xs-right">			            

			            <v-btn icon @click="removeQori(props.item.id)" :disabled="props.item.murottals_count > 0 || props.item.id == 12"> <v-icon color="red">delete</v-icon></v-btn>			            
			          </td>
			        </tr>
			      </template>
			    </v-data-table>
  			</v-card>
		  </v-tab-item>
		</v-tabs>

    <v-dialog v-model="dialogQori"  persistent :overlay="false" max-width="500px" transition="dialog-transition">
      <v-card>
      	<v-toolbar class="primary" dark>
      		<v-toolbar-title>{{ qoriDialogTitle }}</v-toolbar-title><v-spacer></v-spacer>
      		<v-icon @click="closeQoriDialog()">close</v-icon>
      	</v-toolbar>

        <v-card-text>
          <v-text-field label="Nama Qori" v-model="editedQori.name" :error-messages="errors ? errors.name : ''" @click="errors.name = []"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="storeQori">{{ qoriSaveButton }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogMurottal"  persistent :overlay="false" max-width="500px" transition="dialog-transition">
    	<v-card>
    		<v-toolbar class="primary" dark>
    			<v-toolbar-title>{{ murottalDialogTitle }}</v-toolbar-title><v-spacer></v-spacer>
    			<v-icon @click="closeMurottalDialog">close</v-icon>
    		</v-toolbar>  	  
    		<v-card-text>
    			<label color="primary" @click="$refs.file.value = ''" v-if="murottalEditedIndex == -1" >
    				<v-chip color="primary" text-color="white">Pilih audio<v-icon right>audiotrack</v-icon>
    				</v-chip>
    				<span v-if="editedMurottal.file">{{ editedMurottal.file.name }} / {{ parseInt( Math.round( ( editedMurottal.file.size ) / 1000000 ))  }} MB</span>
    				<input type="file" ref="file" id="file" style="display:none" v-on:change="handleFileUpload()">
    			</label>
    			<div v-else>Data murottal tidak dapat diubah.<br>Silakan hapus data berikut lebih dulu, selanjutnya upload murottal baru.</div>
    			<v-divider class="my-3"></v-divider>
    			<v-select hint="Harus dipilih salah satu!" persistent-hint label="Qori" v-model="editedMurottal.qori_id" :items="qoris" item-text="name" item-value="id" :readonly="murottalEditedIndex != -1"></v-select>
    			<v-text-field hint="Kolom ini harus diisi!" persistent-hint label="Surat/Catatan" v-model="editedMurottal.surah" :error-messages="errors ? errors.file : ''" :readonly="murottalEditedIndex != -1"></v-text-field>
    			<v-progress-linear  v-show="uploadPercentage > 0 && uploadPercentage < 100" v-model="uploadPercentage"></v-progress-linear>
    		</v-card-text>
    		<v-card-actions>
    			<v-btn :disabled="editedMurottal.surah == ''" block color="primary" v-on:click="submitFile()" v-if="murottalEditedIndex == -1">upload</v-btn>
    			<v-btn block color="red" dark v-on:click="removeMurottal(editedMurottal.id)" v-else>Hapus</v-btn>
    		</v-card-actions>
    	</v-card>        


    </v-dialog>
    
    <v-snackbar multi-line v-model="snackbar.value" :timeout="4000" color='primary darken-4'>{{ snackbar.text }}</v-snackbar>

	
</div>

</template>

<script>
	import UploadButton from 'vuetify-upload-button';
	export default{
		components: {'upload-btn': UploadButton},
		data(){
			return{
				active:'',
				dialogQori:false,
				dialogMurottal:false,
				searchMurottal:'',
				searchQori:'',
				qoriEditedIndex: -1,
				editedQori:{ name:'' },
				editedMurottal: { qori_id: null, surah:'', file:null },
				murottalEditedIndex: -1,
				headersMurottal:[
					{ text: 'Qori', value: 'qori.name', class:"pl-3 pr-0"},
					{ text: 'Surah', value: 'surah', class:"hidden-xs-only" },
					{ text: 'Aksi', value: '', class:"pl-0 pr-3"},
				],
				headersQori:[
					{ text: 'Name', value: 'name', class:"pl-3 pr-0"},					
					{ text: 'Aksi', value: '', class:"pl-0 pr-3"},
				],
				murottals:[],
				errors:{},
				murottal:{
					file: '',	
					qori_id:'',
					surah:''
				},		    
				murottalPreview: { audio: new Audio(), playingIndex: '' },

	    		uploadPercentage: 0,
	    		qoris:[],	    		
	    		snackbar: {value:false, text:''},
			}
		},

		created(){
			this.getQoris()
			this.getMurottals()
			this.$store.commit('pageTitle', 'Daftar Murottal')
		},

		computed:{
			qoriDialogTitle(){
				return this.qoriEditedIndex == -1 ? 'Tambah Qori' : 'Edit Qori'				
			},
			qoriSaveButton(){
				return this.qoriEditedIndex == -1 ? 'Simpan' : 'Perbarui'
			},
			murottalDialogTitle(){				
				return this.murottalEditedIndex == -1 ? 'Tambah Murottal' : 'Edit Murottal'
			}
		},

		methods:{
			getQoris(){
				this.axios.get('/api/qoris')
				.then(res=>{
					this.qoris = res.data
				})
			},

			getMurottals(){
				this.axios.get('/api/murottals')
				.then(res=>{
					this.murottals = res.data.map(item=>{
						return Object.assign(item, {isPlaying:false})
					})
				})
			},

			createMurottal(){
				this.dialogMurottal = true
				this.editedMurottal.qori_id = 12
			},

			closeMurottalDialog(){
				this.murottalEditedIndex = -1
				this.dialogMurottal = false
				this.editedMurottal = { file:null, qori_id:null, surah:'' }
				this.errors = {}
			},
			editMurottal(item){	
				this.murottalEditedIndex = item.id
				this.editedMurottal = Object.assign({}, item)
				this.dialogMurottal = true
			},
			removeMurottal(id){
				if( this.$store.state.license == 'pcmode'){
					return this.snackbar = {value: true, text: 'Tidak bisa menghapus pada Mode Demo'}
				}
				confirm('Menghapus Murottal?') && 				
				this.axios.delete('/api/murottal/'+id)
				.then(res=>{
					this.axios.put('/api/bot/1', {code:9})
					this.snackbar = { value: true, text:'Murottal berhasi dihapus'}
					this.getMurottals()
					this.getQoris()
					this.closeMurottalDialog()
				})
			},
			
			createQori(){
				this.dialogQori = true
			},
			closeQoriDialog(){
				this.qoriEditedIndex = -1
				this.dialogQori = false
				this.editedQori.name = ''
				this.errors = {}
			},
			editQori(item){
				if (item.id == 12) {
					alert('Tidak bisa diedit')
				} else {
					this.qoriEditedIndex = item.index
					this.editedQori = Object.assign({}, item)				
					this.dialogQori = true
				}
			},
			storeQori(){
				if(this.qoriEditedIndex == -1){
					this.axios.post('/api/qori', this.editedQori)
					.then(res=>{
						this.axios.put('/api/bot/1', {code:9})
						this.getQoris()
						this.closeQoriDialog()
						this.snackbar = { value: true, text:'Qori berhasi ditambahkan'}
						this.editedQori.name = ''
					})
						.catch(err=>{
				    	this.errors = err.response.data.errors
				  	})
				} else {
					this.axios.put('/api/qori/'+this.editedQori.id, this.editedQori)
					.then(res=>{
						this.getQoris()
						this.closeQoriDialog()
						this.snackbar = { value: true, text:'Qori berhasi diperbarui'}
						this.editedQori.name = ''
					})
						.catch(err=>{
				    	this.errors = err.response.data.errors
				  	})
				}

			},			
			removeQori(id){
				if( this.$store.state.license == 'pcmode'){
					return this.snackbar = {value: true, text: 'Tidak bisa menghapus pada Mode Demo'}
				}
				confirm('Menghapus Qori?') && 				
				this.axios.delete('/api/qori/'+id)
				.then(res=>{					
					this.snackbar = { value: true, text:'Qori berhasi dihapus'}
					this.getQoris()
				})
			},			

			murottalPlay(index){	
				if(this.murottalPreview.playingIndex != ''){
					this.murottals[this.murottalPreview.playingIndex].isPlaying = false
				}

				this.murottalPreview.playingIndex = index
				var audioPath = this.$store.state.baseUrl+'/static/murottals/'
				var item = this.murottals[index]

				item.isPlaying = true
				this.murottalPreview.audio.src = audioPath + item.qori_id+'/'+ item.filename
				this.murottalPreview.audio.load()
				this.murottalPreview.audio.play()
			},

			murottalPause(index){
				var item = this.murottals[index]
				item.isPlaying = false
				this.murottalPreview.audio.pause()
			},
			
			handleFileUpload(){				
  				this.editedMurottal.file = this.$refs.file.files[0];
  				if (this.editedMurottal.file.name.split('.').pop().toLowerCase() != 'mp3' ){
  					this.editedMurottal.file = null
  					alert('Extensi file yang diijinkan adalam .mp3')
  				}
			},

			submitFile(){
				if (this.murottalEditedIndex == -1){
				  	let formData = new FormData()
				  	formData.append('file', this.editedMurottal.file)
				  	formData.append('qori_id', this.editedMurottal.qori_id)
				  	formData.append('surah', this.editedMurottal.surah)

				  	this.axios.post( '/api/murottal', formData, {
				      	headers: { 'Content-Type': 'multipart/form-data'},
				      	onUploadProgress: function( progressEvent ) {
				        	this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) )
				      	}.bind(this),
				    })
				  	.then(res=>{	
				  		this.axios.put('/api/bot/1', {code:9})		  	
				    	this.getMurottals()
				    	this.getQoris()
				    	this.closeMurottalDialog()					
						this.editedMurottal = { file:null, qori_id:null, surah:'' }					
				  	})
				  	.catch(err=>{
				    	this.errors = err.response.data.errors
				  	})
				} else {
					alert("Tidak diijinkan !")
				}
			},
		},

		beforeDestroy(){
			this.murottalPreview.isPlaying = false
			this.murottalPreview.audio.pause()
		}

	}
</script>