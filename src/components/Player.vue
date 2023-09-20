<template>
  <div class="player">
    Now Playing: {{ store.state.trackId }}
    <audio v-if="trackUrl" controls :src="trackUrl"></audio>
  </div>
</template>

<script>
import { ref, watch, inject } from 'vue';

export default {
  setup() {
    const store = inject('store');
    const trackUrl = ref('');

    watch(() => store.state.trackId, async (newTrackId) => {
      if (newTrackId) {
        try {
          const response = await fetch(`https://lemonic.viperadnan.com/api/raw/track/${newTrackId}`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
            }
          });

          const data = await response.json();
          if (data.url) {
            trackUrl.value = data.url;
          } else {
            console.warn("No track URL found for this track ID");
            trackUrl.value = '';  // Reset the URL if not found
          }

        } catch (error) {
          console.error("Error fetching track data:", error);
        }
      }
    });

    return {
      store,
      trackUrl
    };
  }
}

</script>



<style scoped>
.player {
  position: fixed;
  bottom: 0;
  height: 80px;
  text-align: center;
  left: 0;
  right: 0;
  background: #666;
  color: #fff;
  z-index: 10;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
