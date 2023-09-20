<template>
  <div class="player">
   Now Playing: {{ store.state.trackId }}
  </div>
</template>

<style scoped>
.player {
  position: fixed;
  bottom: 0;
  height: 60px;
  line-height: 60px;
  text-align: center;
  left: 0;
  right: 0;
  background: #666;
  color: #fff;
  z-index: 10;
}
</style>



<script setup>
import { inject } from 'vue';
const store = inject('store');
</script>

