<script>
import { provide } from 'vue';
import store from './store';
import Header from './components/Header.vue';
import Grid from './components/Grid.vue';
import Player from './components/Player.vue';

export default {
  components: {
    Header,
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
 <Grid />
 <Player />
</template>
