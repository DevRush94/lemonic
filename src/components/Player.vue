<template>
  <div class="player">
    <div v-if="trackUrl" class="audio-player">
      Now Playing: {{ store.state.trackId }}
      <audio ref="audio" controls :src="trackUrl" @timeupdate="onTimeUpdate" @durationchange="onDurationChange"></audio>
      <div class="audio-player-progress-container">
        <div :style="{ width: progress + '%' }" class="audio-player-progress"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, inject, computed } from 'vue';

export default {
  setup() {
    const store = inject('store');
    const trackUrl = ref('');
    const audio = ref(null);
    const duration = ref(0);
    const currentTime = ref(0);

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
            trackUrl.value = '';
          }

        } catch (error) {
          console.error("Error fetching track data:", error);
        }
      }
    });

    const onTimeUpdate = () => {
      if (audio.value) {
        currentTime.value = audio.value.currentTime;
      }
    };

    const onDurationChange = () => {
      if (audio.value) {
        duration.value = audio.value.duration;
      }
    };

    const progress = computed(() => (currentTime.value / duration.value) * 100);

    return {
      store,
      trackUrl,
      audio,
      onTimeUpdate,
      onDurationChange,
      progress
    };
  },
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

.audio-player {
  text-align: center;
  padding: 10px;
  width: 100%;
}

.audio-player-progress-container {
  width: 100%;
  height: 5px;
  background: #ccc;
  position: relative;
}

.audio-player-progress {
  height: 100%;
  background: #4caf50;
}

audio {
  visibility: hidden;
  opacity: 0;
  width: 0;
  height: 0;
}
</style>
