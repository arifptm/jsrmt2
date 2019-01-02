<template>
	<v-fade-transition>
		<div>		
			<v-card>			
				<v-toolbar color="primary" dark fixed flat>
	        <v-toolbar-side-icon @click.native="$store.commit('drawerState')"></v-toolbar-side-icon>
	        <v-toolbar-title class="ml-1">{{ $store.state.pageTitle }}</v-toolbar-title>    
	        <v-spacer></v-spacer>        
	        <v-icon @click="$router.push({name:'setting'})">close</v-icon>
	      </v-toolbar>

			  <v-expansion-panel>
			    <v-expansion-panel-content class="success">
			    	<div slot="header" class="subheading">Shubuh <span class="green--text text--darken-1">{{ settings.mrt_shubuh_start > 0 || settings.mrt_shubuh_stop > 0 ? '- aktif' : '' }}</span></div>
			 			
								<v-container grid-list-md class="white">
									<v-layout row wrap>
								  	<v-flex xs6><v-text-field label="Mulai" v-model="settings.mrt_shubuh_start" hint="menit, sebelum adzan Shubuh" persistent-hint></v-text-field></v-flex>
								  	<v-flex xs6><v-text-field label="Berhenti" v-model="settings.mrt_shubuh_stop" hint="menit, sebelum adzan Shubuh" persistent-hint></v-text-field></v-flex>				  
								  	<v-flex xs9 v-show="settings.mrt_shubuh_start > 0 || settings.mrt_shubuh_stop > 0"><v-autocomplete label="Surah & Qori" :items="murottals" v-model="murottalShubuh.id" hide-details></v-autocomplete></v-flex>
								  	<v-flex xs3 class="text-xs-right" v-show="settings.mrt_shubuh_start > 0 || settings.mrt_shubuh_stop > 0"><v-btn color="primary" icon @click="murottalShubuh.isPlaying ? pause(murottalShubuh) : preview(murottalShubuh)"><v-icon color="white">{{ murottalShubuh.isPlaying ? 'pause' : 'play_arrow' }}</v-icon></v-btn></v-flex>
									</v-layout>	    			    
								</v-container>

			    </v-expansion-panel-content>
			    <hr>
			    <v-expansion-panel-content class="success">
			    	<div slot="header" class="subheading">Dzuhur <span class="green--text text--darken-1">{{ settings.mrt_dzuhur_start > 0 || settings.mrt_dzuhur_stop > 0 ? '- aktif' : '' }}</span></div>
						<v-container grid-list-md class="white">
							<v-layout row wrap >			    
							  <v-flex xs6><v-text-field label="Mulai" v-model="settings.mrt_dzuhur_start" hint="menit, sebelum adzan Dzuhur" persistent-hint></v-text-field></v-flex>
							  <v-flex xs6><v-text-field label="Berhenti" v-model="settings.mrt_dzuhur_stop" hint="menit, sebelum adzan Dzuhur" persistent-hint></v-text-field></v-flex>				  
							  <v-flex xs19 v-show="settings.mrt_dzuhur_start > 0 || settings.mrt_dzuhur_stop > 0"><v-autocomplete label="Surah & Qori" :items="murottals" v-model="murottalDzuhur.id" hide-details></v-autocomplete></v-flex>
						  	<v-flex xs3 class="text-xs-right" v-show="settings.mrt_dzuhur_start > 0 || settings.mrt_dzuhur_stop > 0"><v-btn color="primary" icon @click="murottalDzuhur.isPlaying ? pause(murottalDzuhur) : preview(murottalDzuhur)"><v-icon color="white">{{ murottalDzuhur.isPlaying ? 'pause' : 'play_arrow' }}</v-icon></v-btn></v-flex>
							</v-layout>	
						</v-container>
		    	</v-expansion-panel-content>
		    	<hr>
			    <v-expansion-panel-content class="success">
			    	<div slot="header" class="subheading">Jumat <span class="green--text text--darken-1">{{ settings.mrt_jumat_start > 0 || settings.mrt_jumat_stop > 0 ? '- aktif' : '' }}</span></div>
						<v-container grid-list-md class="white">
								<v-layout row wrap >			  		  
								  <v-flex xs6><v-text-field label="Mulai" v-model="settings.mrt_jumat_start" hint="menit, sebelum ibadah Jumat" persistent-hint></v-text-field></v-flex>
								  <v-flex xs6><v-text-field label="Berhenti" v-model="settings.mrt_jumat_stop" hint="menit, sebelum ibadah Jumat" persistent-hint></v-text-field></v-flex>				  
								  <v-flex xs9 v-show="settings.mrt_jumat_start > 0 || settings.mrt_jumat_stop > 0"><v-autocomplete label="Surah & Qori" :items="murottals" v-model="murottalJumat.id" hide-details></v-autocomplete></v-flex>
							  	<v-flex xs3 class="text-xs-right" v-show="settings.mrt_jumat_start > 0 || settings.mrt_jumat_stop > 0"><v-btn color="primary" icon @click="murottalJumat.isPlaying ? pause(murottalJumat) : preview(murottalJumat)"><v-icon color="white">{{ murottalJumat.isPlaying ? 'pause' : 'play_arrow' }}</v-icon></v-btn></v-flex>
								</v-layout>	
							</v-container>
			    </v-expansion-panel-content>
			    <hr>
			    <v-expansion-panel-content class="success">
			    	<div slot="header" class="subheading">Ashar <span class="green--text text--darken-1">{{ settings.mrt_ashar_start > 0 || settings.mrt_ashar_stop > 0 ? '- aktif' : '' }}</span></div>
							<v-container grid-list-md class="white">
								<v-layout row wrap>			  		  
								  <v-flex xs6><v-text-field label="Mulai" v-model="settings.mrt_ashar_start" hint="menit, sebelum adzan Ashar" persistent-hint></v-text-field></v-flex>
								  <v-flex xs6><v-text-field label="Berhenti" v-model="settings.mrt_ashar_stop" hint="menit, sebelum adzan Ashar" persistent-hint></v-text-field></v-flex>				  
								  <v-flex xs9 v-show="settings.mrt_ashar_start > 0 || settings.mrt_ashar_stop > 0"><v-autocomplete label="Surah & Qori" :items="murottals" v-model="murottalAshar.id" hide-details></v-autocomplete></v-flex>
							  	<v-flex xs3 class="text-xs-right" v-show="settings.mrt_ashar_start > 0 || settings.mrt_ashar_stop > 0"><v-btn color="primary" icon @click="murottalAshar.isPlaying ? pause(murottalAshar) : preview(murottalAshar)"><v-icon color="white">{{ murottalAshar.isPlaying ? 'pause' : 'play_arrow' }}</v-icon></v-btn></v-flex>
								</v-layout>	
							</v-container>
			    </v-expansion-panel-content>		    
			    <hr>
			    <v-expansion-panel-content class="success">
			    	<div slot="header" class="subheading">Maghrib <span class="green--text text--darken-1">{{ settings.mrt_maghrib_start > 0 || settings.mrt_maghrib_stop > 0 ? '- aktif' : '' }}</span></div>
							<v-container grid-list-md class="white">
								<v-layout row wrap>			  	  
								  <v-flex xs6><v-text-field label="Mulai" v-model="settings.mrt_maghrib_start" hint="menit, sebelum adzan Maghrib" persistent-hint></v-text-field></v-flex>
								  <v-flex xs6><v-text-field label="Berhenti" v-model="settings.mrt_maghrib_stop" hint="menit, sebelum adzan Maghrib" persistent-hint></v-text-field></v-flex>				  
								  <v-flex xs9 v-show="settings.mrt_maghrib_start > 0 || settings.mrt_maghrib_stop > 0"><v-autocomplete label="Surah & Qori" :items="murottals" v-model="murottalMaghrib.id" hide-details></v-autocomplete></v-flex>
							  	<v-flex xs3 class="text-xs-right" v-show="settings.mrt_maghrib_start > 0 || settings.mrt_maghrib_stop > 0"><v-btn color="primary" icon @click="murottalMaghrib.isPlaying ? pause(murottalMaghrib) : preview(murottalMaghrib)"><v-icon color="white">{{ murottalMaghrib.isPlaying ? 'pause' : 'play_arrow' }}</v-icon></v-btn></v-flex>
								</v-layout>	
							</v-container>
			    </v-expansion-panel-content>
			    <hr>
			    <v-expansion-panel-content class="success">
			    	<div slot="header" class="subheading">Isya <span class="green--text text--darken-1">{{ settings.mrt_isya_start > 0 || settings.mrt_isya_stop > 0 ? "- aktif" : '' }}</span></div>
						<v-container grid-list-md class="white">
								<v-layout row wrap>			  
								  <v-flex xs6><v-text-field label="Mulai" v-model="settings.mrt_isya_start" hint="menit, sebelum adzan Isya" persistent-hint></v-text-field></v-flex>
								  <v-flex xs6><v-text-field label="Berhenti" v-model="settings.mrt_isya_stop" hint="menit, sebelum adzan Isya" persistent-hint></v-text-field></v-flex>				  
								  <v-flex xs9 v-show="settings.mrt_isya_start > 0 || settings.mrt_isya_stop > 0"><v-autocomplete label="Surah & Qori" :items="murottals" v-model="murottalIsya.id" hide-details></v-autocomplete></v-flex>
							  	<v-flex xs3 class="text-xs-right" v-show="settings.mrt_isya_start > 0 || settings.mrt_isya_stop > 0"><v-btn color="primary" icon @click="murottalIsya.isPlaying ? pause(murottalIsya) : preview(murottalIsya)"><v-icon color="white">{{ murottalIsya.isPlaying ? 'pause' : 'play_arrow' }}</v-icon></v-btn></v-flex>
								</v-layout>					  			    				
							</v-container>   	
					</v-expansion-panel-content>			
			  </v-expansion-panel>
			  
		  	<v-card-text>
			    <p>Setelah selesai</p>
			    <v-radio-group v-model="settings.mrt_next" row hide-details>
			      <v-radio color="primary" label="Berhenti" :value="0"></v-radio>
			      <v-radio color="primary" label="Lanjut" :value="1"></v-radio>
			      <v-radio color="primary" label="Ulang" :value="2"></v-radio>
			    </v-radio-group>
			  </v-card-text>

				<v-card-actions>										
					  <v-btn flat color="primary" @click="$router.push('/settings')">Batal</v-btn>				  
					  <v-spacer></v-spacer>
					  <v-btn color="primary" @click="saveSettings()">Simpan</v-btn>
				</v-card-actions>
			</v-card>
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
				murottals:[],				
				murottalShubuh: {},
				murottalDzuhur: {},
				murottalJumat: {},
				murottalAshar: {},
				murottalMaghrib: {},
				murottalIsya: {},
				snackbar:{value:false, text:''},
				errors:{}
			}
		},

		created(){
			this.init()
			this.$store.commit('pageTitle', 'Murottal')
		},

		methods:{
			init(){
				this.getSettings()
				this.getMurottals()				
			},
			getSettings(){
				this.axios.get('/api/menu-settings')
				.then(res=>{
					// var audioPath = localStorage.getItem('baseUrl')+'/static/murottals/'
					this.settings = res.data				
					this.murottalShubuh = {audio: new Audio(), isPlaying: false, id: this.settings.mrt_shubuh_id}
					this.murottalDzuhur = {audio: new Audio(), isPlaying: false, id: this.settings.mrt_dzuhur_id}
					this.murottalJumat = {audio: new Audio(), isPlaying: false, id: this.settings.mrt_jumat_id}
					this.murottalAshar = {audio: new Audio(), isPlaying: false, id: this.settings.mrt_ashar_id}
					this.murottalMaghrib = {audio: new Audio(), isPlaying: false, id: this.settings.mrt_maghrib_id}
					this.murottalIsya = {audio: new Audio(), isPlaying: false, id: this.settings.mrt_isya_id}					
				})
			},
			getMurottals(){
				this.axios.get('/api/murottals')
				.then(res=>{
					this.murottals = res.data.map(item=>{
						return { value: parseInt(item.id), text:item.surah+' | '+item.qori.name }
					})
				})
			},

			saveSettings(){
				this.settings.mrt_shubuh_id = this.murottalShubuh.id
				this.settings.mrt_dzuhur_id = this.murottalDzuhur.id
				this.settings.mrt_jumat_id = this.murottalJumat.id
				this.settings.mrt_ashar_id = this.murottalAshar.id
				this.settings.mrt_maghrib_id = this.murottalMaghrib.id
				this.settings.mrt_isya_id = this.murottalIsya.id

				if (this.settings.mrt_shubuh_start == '')  this.settings.mrt_shubuh_start = 0
				if (this.settings.mrt_shubuh_stop == '')  this.settings.mrt_shubuh_stop = 0
				if (this.settings.mrt_dzuhur_start == '')  this.settings.mrt_dzuhur_start = 0
				if (this.settings.mrt_dzuhur_stop == '')  this.settings.mrt_dzuhur_stop = 0
				if (this.settings.mrt_jumat_start == '')  this.settings.mrt_jumat_start = 0
				if (this.settings.mrt_jumat_stop == '')  this.settings.mrt_jumat_stop = 0
				if (this.settings.mrt_ashar_start == '') this.settings.mrt_ashar_start = 0
				if (this.settings.mrt_ashar_stop == '')  this.settings.mrt_ashar_stop = 0
				if (this.settings.mrt_maghrib_start == '')  this.settings.mrt_maghrib_start = 0
				if (this.settings.mrt_maghrib_stop == '')  this.settings.mrt_maghrib_stop = 0
				if (this.settings.mrt_isya_start == '')  this.settings.mrt_isya_start = 0
				if (this.settings.mrt_isya_stop == '') this.settings.mrt_isya_stop = 0

				this.axios.put('/api/settings/1', this.settings)
				.then(res=>{
					this.snackbar = {value:true, text:'Update pengaturan...sukses!'}
				})
				.catch(err=>{
		          this.$auth.destroyToken()
		          this.$store.commit('licensing', '')                    
		          this.$store.commit('authenticate', false)
		          this.errors = err.response.data.errors
		          
		          if (!err.response){
		            this.snackbar = {value:true, text: 'Tidak menemukan alat. Pastikan HP ini terhubung dengan Wifi Jasma!'}
		          } else {            
		            this.snackbar = {value:true, text: 'Terjadi kesalahan (' + err.response.status + '). Silakan kontak customer service.'}
		          }          
		        })
			},

			preview(audio){
				this.axios.get('/api/murottal/'+ audio.id)
				.then(res=>{
					var audioPath = this.$store.state.baseUrl+'/static/murottals/'
					audio.isPlaying = true
					audio.audio.src = audioPath + res.data.qori_id+'/'+ res.data.filename
				audio.audio.load()
				audio.audio.play()	
				audio.audio.onerror = () => { 
					this.snackbar={value:true, text:"Kesalahan sistem / File tidak ditemukan"} 
					audio.isPlaying = false
					}
				})
				
			},

			pause(audio){
				audio.isPlaying = false
				audio.audio.pause()
			}

		},

		beforeDestroy(){
			this.murottalShubuh.isPlaying = false
			this.murottalShubuh.audio.pause()
			this.murottalDzuhur.isPlaying = false
			this.murottalDzuhur.audio.pause()
			this.murottalJumat.isPlaying = false
			this.murottalJumat.audio.pause()
			this.murottalAshar.isPlaying = false
			this.murottalAshar.audio.pause()
			this.murottalMaghrib.isPlaying = false
			this.murottalMaghrib.audio.pause()
			this.murottalIsya.isPlaying = false
			this.murottalIsya.audio.pause()
		}

	}	
</script>

<style>

</style>