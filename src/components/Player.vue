<template>
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
      if (audioElement.value) audioElement.value.play();
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
</style>
