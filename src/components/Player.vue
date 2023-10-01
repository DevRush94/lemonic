<template>
  <div class="player-loading" v-if="store.state.trackId && !trackUrl">Loading</div>
  <div class="player" v-if="trackUrl">
    <div v-if="loading" class="loader">Loading Selected Song, Please wait...</div>
    Now Playing: {{ store.state.trackId }}

    <audio
      autoplay
      ref="audioElement"
      :src="trackUrl"
      @timeupdate="updateSeek"
      @durationchange="setDuration"
      controls></audio>

    <input
      type="range"
      v-model="currentTime"
      :min="0"
      :max="duration"
      @mousedown="startDragging"
      @mouseup="stopDragging"
      @change="stopDragging" />

    <button @click="togglePlayPause">{{ isPlaying ? 'Pause' : 'Play' }}</button>

  </div>
</template>

<script>
import { ref, watch, inject } from 'vue';

export default {
  setup() {
    const store = inject('store');
    const trackUrl = ref('');
    const audioElement = ref(null);
    const currentTime = ref(0);
    const duration = ref(0);
    const loading = ref(false);
    const isDragging = ref(false);
    const isPlaying = ref(true); // Assuming audio auto-plays. Adjust as per your need

    const togglePlayPause = () => {
      if (!audioElement.value) return;
      if (isPlaying.value) {
        audioElement.value.pause();
      } else {
        audioElement.value.play();
      }
      isPlaying.value = !isPlaying.value;
    };

    watch(
      () => store.state.trackId,
      async (newTrackId, oldTrackId) => {
        if (newTrackId) {
          loading.value = true;


          try {
            const response = await fetch(`https://lemonic.viperadnan.com/api/raw/track/${newTrackId}`, {
              method: 'GET',
              headers: {
                'accept': 'application/json',
              },
            });

            const data = await response.json();
            if (data.url) {
              const fileResponse = await fetch(data.url);
              const arrayBuffer = await fileResponse.arrayBuffer();
              const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
              trackUrl.value = URL.createObjectURL(blob);
            }
          } catch (error) {
            console.error("Error fetching track data:", error);
          } finally {
            // Stop the previous song
            if (oldTrackId && audioElement.value) {
              audioElement.value.pause();
              audioElement.value.currentTime = 0;
            }
            loading.value = false;
          }
        }
      }
    );

    const startDragging = () => {
      isDragging.value = true;
      if (audioElement.value) audioElement.value.pause();
    };

    const stopDragging = () => {
      isDragging.value = false;
      if (audioElement.value && isPlaying.value) audioElement.value.play();
      changeSeek();
    };

    const setDuration = () => {
      if (audioElement.value) duration.value = audioElement.value.duration;
    };

    const changeSeek = () => {
      if (audioElement.value) audioElement.value.currentTime = currentTime.value;
    };

    const updateSeek = () => {
      if (audioElement.value && !isDragging.value) currentTime.value = audioElement.value.currentTime;
      if (currentTime.value === audioElement.value.duration) {
        isPlaying.value = !isPlaying.value;
        // If Repeat mode on Enable Below
        // audioElement.value.play();
      }
    };

    return {
      store,
      trackUrl,
      audioElement,
      currentTime,
      duration,
      updateSeek,
      setDuration,
      startDragging,
      stopDragging,
      changeSeek,
      loading,
      togglePlayPause,
      isPlaying
    };
  },
};
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

.player-loading {
  width: 50%;
  height: 90px;
  background: #000;
  position: fixed;
  right: 0;
  bottom: 0;
}
</style>
