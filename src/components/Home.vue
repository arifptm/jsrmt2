<template>
  <div>
    <v-container>  
      <v-layout text-xs-center wrap >    
      <v-flex xs12>
        <v-img
        :src="require('../assets/jasma_icon_150.jpg')"
        class="my-3"
        contain
        height="150"
        ></v-img>
      </v-flex>

      <v-flex>
        <h1 class=" mb-3 display-1 primary--text text--lighten-1 font-weight-thin">
          Ahlan wa sahlan...
        </h1>        
        <p>Gunakan pintasan berikut:</p>
      </v-flex>

      <v-flex xs12>
        <v-card flat>
          <v-container grid-list-md fluid class="py-0">
            <v-layout row wrap>
              <v-flex xs6 v-for="menu in menus" :key="menu.text" v-if="menu.for.includes($store.state.license)">
                <v-card class="py-1" color="primary" @click="$router.push(menu.path)">
                  <v-icon size="32" color="blue lighten-5">{{ menu.icon }}</v-icon>
                  <div class="white--text font-weight-bold">{{ menu.text }}</div>
                </v-card>                
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>        
      </v-flex>

      
    </v-layout>
  </v-container>
</div>
</template>

<script>
  export default {
    data: () => ({
      menus:[
        { text:'Identitas', icon: 'location_city', path: '/identities', for: ['pcmode', 'std', 'pro', 'demo'] },
        { text:'Gambar latar', icon: 'collections', path: '/backgrounds', for: ['pcmode', 'std', 'pro', 'demo'] },
        { text:'Pengumuman', icon: 'notifications_active', path: '/tickers', for: ['pcmode', 'std', 'pro', 'demo'] },
        { text:'Jumbotron', icon: 'desktop_windows', path: '/jumbotrons', for: ['pcmode', 'pro', 'demo'] },
        { text:'Khotbah', icon: 'local_library', path: '/khotbahs', for: ['std'] },
      ]
    }),

    created(){
      this.$store.state.pageTitle = 'Jasma Digital'
    }
  }
</script>

<style>

</style>
