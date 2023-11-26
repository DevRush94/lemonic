<template>
  <div class="error-pop" v-if="errorTrack">
    Your taste is unique. Please try again in 15 minutes, and we'll add it.
  </div>
  <!-- <div class="player-loading" v-if="store.state.track && !trackUrl">Loading</div> -->
  <div class="player" v-if="store.state.track">
    <div v-if="loading" class="track_loader">Loading Selected Song, Please wait...</div>

    <div class="track_info_box">
      <img class="track_cover" :src="store.state.track.cover" :alt="store.state.track.name">

      <div class="track_sub_info">
        <div class="track_title">{{ store.state.track.name }}</div>
        <button class="track_toggler" @click="togglePlayPause">
          <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" fill="#fff" width="40" height="40" viewBox="0 0 64 64">
            <path d="M24 23h2v18h-2zm13 0h2v18h-2zM32 0A31.78 31.78 0 0 0 9.374 9.375C3.329 15.417 0 23.453 0 32a31.78 31.78 0 0 0 9.374 22.626A31.78 31.78 0 0 0 32 64c8.547 0 16.583-3.33 22.627-9.375A31.78 31.78 0 0 0 64 32a31.78 31.78 0 0 0-9.374-22.626A31.78 31.78 0 0 0 32 0zm21.213 53.212A29.8 29.8 0 0 1 32 62c-8.013 0-15.546-3.121-21.212-8.789A29.79 29.79 0 0 1 2 32c0-8.013 3.121-15.546 8.788-21.212A29.8 29.8 0 0 1 32 2a29.8 29.8 0 0 1 21.213 8.789A29.79 29.79 0 0 1 62 32c0 8.013-3.12 15.546-8.787 21.212z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="#fff" height="40" width="40" viewBox="0 0 60 60">
            <path d="M45.563 29.174l-22-15c-.307-.208-.703-.231-1.031-.058A1 1 0 0 0 22 15v30a1 1 0 0 0 .533.884A.99.99 0 0 0 23 46a1 1 0 0 0 .563-.174l22-15a1 1 0 0 0 0-1.652zM24 43.107V16.893L43.225 30 24 43.107zM30 0C13.458 0 0 13.458 0 30s13.458 30 30 30 30-13.458 30-30S46.542 0 30 0zm0 58C14.561 58 2 45.439 2 30S14.561 2 30 2s28 12.561 28 28-12.561 28-28 28z" />
          </svg>
        </button>
        <input
          class="player_range"
          type="range"
          v-model="currentTime"
          :min="0"
          :max="duration"
          @mousedown="startDragging"
          @mouseup="stopDragging"
          @change="stopDragging" />
        <span class="track_duration">{{ Math.floor(Math.floor(store.state.track.duration_ms / 1000) / 60) + ":" + Math.floor(store.state.track.duration_ms / 1000) % 60 }}</span>
      </div>
    </div>


    <audio hidden
      autoplay
      ref="audioElement"
      :src="trackUrl"
      @timeupdate="updateSeek"
      @durationchange="setDuration"
      controls></audio>



  </div>
  <div class="artifical-pad" v-if="store.state.track"></div>
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
    const isPlaying = ref(true);
    const errorTrack = ref(false); // Initialize errorTrack as false
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
      () => store.state.track,
      async (newTrack, oldTrack) => {
        if (newTrack) {
          loading.value = true;

          try {
            const response = await fetch(`https://lemonic.viperadnan.com/api/raw/track/${newTrack.id}`, {
              method: 'GET',
              headers: {
                'accept': 'application/json',
              },
            });
            const data = await response.json();
            if (data?.code === 404) {
              store.setTrack();
              errorTrack.value = true;
              setTimeout(() => {
                errorTrack.value = false;
              }, 15000); // 30 seconds in milliseconds
            }
            if (data.url) {
              const fileResponse = await fetch(data.url);
              const arrayBuffer = await fileResponse.arrayBuffer();
              const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
              trackUrl.value = URL.createObjectURL(blob);
              document.title = "Lemonic - " + newTrack.name;
              if (window.innerWidth < 768) {
                const linkElement = document.createElement('link');
                linkElement.rel = 'icon';
                linkElement.type = 'image/png';
                linkElement.href = newTrack.cover;
                const headElement = document.querySelector('head');
                headElement.appendChild(linkElement);
              }
            }
          } catch (error) {
            console.error('Error fetching track data:', error);
          } finally {
            // Stop the previous song
            if (oldTrack && audioElement.value) {
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
        // isPlaying.value = !isPlaying.value;
        // If Repeat mode on Enable Below
        audioElement.value.play();
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
      isPlaying,
      errorTrack,
    };
  },
};
</script>

<style scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #111;
  color: #fff;
  z-index: 10;
  padding: 15px;
  font-size: 0;
}

audio {
  visibility: hidden;
  width: 0;
  height: 0;
  opacity: 0;
}



.track_info_box {
  .track_cover {
    width: 100px;
    display: inline-block;
    vertical-align: middle;
  }

  .track_sub_info {
    width: calc(100% - 100px);
    display: inline-block;
    vertical-align: middle;
    padding-left: 15px;

    .track_title {
      font-size: 22px;
      font-weight: 500;
      letter-spacing: 0.5px;
      padding-bottom: 15px;

      @media screen and (max-width:767px) {
        font-size: 14px;
        padding-bottom: 10px;
      }
    }

    .track_toggler {
      vertical-align: middle;
      height: 40px;
    }

    .player_range {
      vertical-align: middle;
      margin-left: 15px;
      height: 5px;
      outline: none;
      background: #fff;
      width: calc(15vw + 50px);
      margin-right: 20px;

      &::-webkit-slider-thumb {
        transition: .3s all cubic-bezier(.815, 1.65, .4, .68);
      }

      &::-webkit-slider-thumb:hover {
        transform: scale(1.3);
      }

    }
  }
}

.track_loader {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
  color: #fff;
  font-size: 10px;
  line-height: 130px;
  text-align: center;
}

.track_duration {
  font-size: 13px;
  vertical-align: middle;
  display: inline-block;

  @media screen and (max-width:350px) {
    display: none;
  }
}

.error-pop {
  position: fixed;
  top: 10px;
  right: 0;
  padding: 12px;
  background: rgb(210 75 75);
  color: #fff;
  font-size: 14px;
  left: 0;
  width: calc(10vw + 300px);
  margin: auto;
  text-align: center;
}

.artifical-pad {
  padding-bottom: 130px;
}</style>
