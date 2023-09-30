<template>
  <div v-if="loading" class="loader">Loading Selected Song, Please wait...</div>
  <div class="player" v-if="trackUrl">
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
import { ref, watch, inject, computed } from 'vue';

export default {
  setup() {
    const store = inject('store');
    const trackUrl = ref('');
    const audioElement = ref(null);
    const currentTime = ref(0);
    const duration = ref(0);
    const loading = ref(false); // Loader state
    const isDragging = ref(false); // to detect if user is dragging

    watch(() => store.state.trackId, async (newTrackId) => {
      if (newTrackId) {
        loading.value = true; // Start loading
        try {
          // Fetching the metadata to get the URL of the track
          const metadataResponse = await fetch(`https://lemonic.viperadnan.com/api/raw/track/${newTrackId}`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
            }
          });

          const data = await metadataResponse.json();
          const fileUrl = data.url;

          if (!fileUrl) throw new Error("URL is not available");

          // Fetching the actual file as ArrayBuffer
          const fileResponse = await fetch(fileUrl);
          if (!fileResponse.ok) throw new Error("Error fetching track data");

          const arrayBuffer = await fileResponse.arrayBuffer();
          const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });

          trackUrl.value = URL.createObjectURL(blob);
        } catch (error) {
          console.error(error);
        } finally {
          loading.value = false; // End loading
        }
      }
    });

    const startDragging = () => {
      isDragging.value = true;
    };

    const stopDragging = () => {
      isDragging.value = false;
      setTimeout(() => {
        changeSeek(); // perform seek when user stops dragging
      });
    };
    const setDuration = () => {
      if (audioElement.value) {
        duration.value = audioElement.value.duration;
      }
    }
    const changeSeek = () => {
      if (audioElement.value) {
        audioElement.value.currentTime = currentTime.value;
      }
    }

    const updateSeek = () => {
      if (audioElement.value && !isDragging.value) {
        currentTime.value = audioElement.value.currentTime;
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
      startDragging,
      stopDragging,
      changeSeek,
      loading
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
