<script>
import { provide } from 'vue';
import store from './store';
import Header from './components/Header.vue';
import Grid from './components/Grid.vue';
import Player from './components/Player.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  components: {
    Header,
    Sidebar,
    Grid,
    Player
  },
  setup() {
    provide('store', store);
  }
}
</script>

<template>
  <Header />
  <div class="main-wrappy">
    <Sidebar />
    <Grid />
  </div>
  <Player />
</template>
