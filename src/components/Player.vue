<template>
  <div class="player" v-if="trackUrl">
    Now Playing: {{ store.state.trackId }}

    <audio autoplay ref="audioElement" :src="trackUrl" @timeupdate="updateSeek" @durationchange="setDuration" controls></audio>

    <input
      type="range"
      :value="currentTime"
      :min="0"
      :max="duration"
      @input="changeSeek" />
  </div>
</template>

<script>
import { ref, watch, inject, computed } from 'vue';

export default {
  setup() {
    const store = inject('store');
    const trackUrl = ref('');
    const audioElement = ref(null);
    const currentTime = ref(0);
    const duration = ref(0);

    const progress = computed(() => (currentTime.value / duration.value) * 100 || 0);

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
          trackUrl.value = data.url ? data.url : '';

        } catch (error) {
          console.error("Error fetching track data:", error);
        }
      }
    });

    const updateSeek = () => {
      if (audioElement.value) {
        currentTime.value = audioElement.value.currentTime;
      }
    }

    const setDuration = () => {
      if (audioElement.value) {
        duration.value = audioElement.value.duration;
      }
    }

    const changeSeek = (event) => {
      if (audioElement.value) {
        audioElement.value.currentTime = event.target.value;
      }
    }
    return {
      store,
      trackUrl,
      audioElement,
      currentTime,
      duration,
      updateSeek,
      setDuration,
      changeSeek
    };
  }
}
</script>

<style scoped>
.player {
  position: fixed;
  bottom: 0;
  height: 90px;
  text-align: center;
  left: 0;
  right: 0;
  background: #666;
  color: #fff;
  z-index: 10;
  padding: 10px;
}

audio {
  visibility: hidden;
  width: 0;
  height: 0;
  opacity: 0;
}
</style>
