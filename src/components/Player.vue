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
        <div class="track_artist">{{ store.state.track.artists }}</div>
        <div class="controls">
          <button class="track_toggler" @click="togglePlayPause">
            <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" fill="#fff" width="30" height="30" viewBox="0 0 64 64">
              <path d="M24 23h2v18h-2zm13 0h2v18h-2zM32 0A31.78 31.78 0 0 0 9.374 9.375C3.329 15.417 0 23.453 0 32a31.78 31.78 0 0 0 9.374 22.626A31.78 31.78 0 0 0 32 64c8.547 0 16.583-3.33 22.627-9.375A31.78 31.78 0 0 0 64 32a31.78 31.78 0 0 0-9.374-22.626A31.78 31.78 0 0 0 32 0zm21.213 53.212A29.8 29.8 0 0 1 32 62c-8.013 0-15.546-3.121-21.212-8.789A29.79 29.79 0 0 1 2 32c0-8.013 3.121-15.546 8.788-21.212A29.8 29.8 0 0 1 32 2a29.8 29.8 0 0 1 21.213 8.789A29.79 29.79 0 0 1 62 32c0 8.013-3.12 15.546-8.787 21.212z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" xmlns:v="https://vecta.io/nano" width="40" height="40" fill="none" stroke-width="1.5" stroke-linejoin="round" viewBox="0 0 40 40">
              <path d="M19.95 36.667A16.67 16.67 0 0 0 36.617 20 16.67 16.67 0 0 0 19.95 3.333 16.67 16.67 0 0 0 3.283 20 16.67 16.67 0 0 0 19.95 36.667z" stroke="#fafa33" />
              <path d="M17.867 24.217v-8.433c0-.8-.333-1.117-1.183-1.117h-2.167c-.85 0-1.183.317-1.183 1.117v8.433c0 .8.333 1.117 1.183 1.117h2.15c.867 0 1.2-.317 1.2-1.117zm8.8 0v-8.433c0-.8-.333-1.117-1.183-1.117h-2.15c-.85 0-1.183.317-1.183 1.117v8.433c0 .8.333 1.117 1.183 1.117h2.15c.85 0 1.183-.317 1.183-1.117z" fill="#fff" stroke="#fff" />
            </svg>
            <!-- <svg  xmlns="http://www.w3.org/2000/svg" fill="#fff" height="30" width="30" viewBox="0 0 60 60">
              <path d="M45.563 29.174l-22-15c-.307-.208-.703-.231-1.031-.058A1 1 0 0 0 22 15v30a1 1 0 0 0 .533.884A.99.99 0 0 0 23 46a1 1 0 0 0 .563-.174l22-15a1 1 0 0 0 0-1.652zM24 43.107V16.893L43.225 30 24 43.107zM30 0C13.458 0 0 13.458 0 30s13.458 30 30 30 30-13.458 30-30S46.542 0 30 0zm0 58C14.561 58 2 45.439 2 30S14.561 2 30 2s28 12.561 28 28-12.561 28-28 28z" />
            </svg> -->
          </button>
          <span class="track_duration">{{ Math.floor(Math.floor(store.state.track.duration_ms / 1000) / 60) + ":" + Math.floor(store.state.track.duration_ms / 1000) % 60 }}</span>
        </div>
        <input
          class="player_range"
          type="range"
          v-model="currentTime"
          :min="0"
          :max="duration"
          @mousedown="startDragging"
          @mouseup="stopDragging"
          @change="stopDragging" />
      </div>
      <div class="expand_icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 2666.667 2666.667">
          <path fill="#fff" d="M1854.355 724.512H812.302c-48.411 0-87.794 39.387-87.794 87.8v1042.051c0 48.413 39.384 87.8 87.794 87.8h521.028c22.093 0 40-17.907 40-40s-17.907-40-40-40H812.302c-4.297 0-7.795-3.493-7.795-7.8V812.311c0-4.293 3.497-7.8 7.795-7.8h1042.053c4.307 0 7.8 3.507 7.8 7.8v528.079c0 22.093 17.907 40 40 40s40-17.907 40-40V812.311c0-48.413-39.387-87.8-87.8-87.8m34.68 763.959H1492.17a13.11 13.11 0 0 0-13.107 13.107v387.466a13.12 13.12 0 0 0 13.107 13.12h396.866c7.253 0 13.12-5.88 13.12-13.12v-387.466a13.11 13.11 0 0 0-13.12-13.107m-828.335-473.106h205.427c22.091 0 40-17.92 40-40 0-22.093-17.909-40-40-40H965.796c-11.256 0-21.421 4.653-28.689 12.133-.141.133-.288.267-.427.413h0c-.469.467-.923.947-1.364 1.427-.208.227-.401.467-.603.693l-.672.787-.723.92c-.157.2-.32.4-.473.613-.255.347-.496.693-.737 1.04l-.384.547a32.4 32.4 0 0 0-.696 1.093c-.117.187-.237.36-.352.56-.215.36-.419.72-.621 1.08l-.352.627-.529 1.04-.363.733c-.149.307-.291.627-.432.947l-.375.867c-.117.28-.227.573-.337.853l-.377 1-.256.76-.364 1.12-.189.68a32.92 32.92 0 0 0-.331 1.227c-.052.2-.097.413-.145.627l-.28 1.28c-.041.2-.075.413-.113.627l-.216 1.28-.093.733-.143 1.2c-.032.32-.051.653-.076.987l-.068.96a39.19 39.19 0 0 0-.047 1.867c0 .027-.003.067-.003.107v300.333c0 22.093 17.908 40 40 40s40-17.907 40-40v-203.773l328.818 328.826c7.813 7.813 18.053 11.72 28.28 11.72 10.24 0 20.48-3.907 28.293-11.72 15.613-15.613 15.613-40.947 0-56.56l-329.655-329.653" />
        </svg>
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
  bottom: 15px;
  right: 15px;
  background: #171717;
  color: #fff;
  z-index: 10;
  padding: 10px;
  font-size: 0;
  width: calc(100% - 30px);
  max-width: 450px;
  overflow: hidden;
  border-radius: 10px;
  height: 130px;
  border: 1px solid rgba(255, 255, 255, 0.20);

  @media screen and (max-width:767px) {
    bottom: 0;
    right: 0;
    box-shadow: none;
    border-radius: 0;
    width: 100%;

  }
}

audio {
  visibility: hidden;
  width: 0;
  height: 0;
  opacity: 0;
}



.track_info_box {

  .track_cover {
    width: 130px;
    left: 0;
    top: 0;
    bottom: 0;
    position: absolute;
    aspect-ratio: 1;
  }

  .track_sub_info {
    padding-left: 130px;

    & .controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    & .track_artist {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      padding-bottom: 8px;
      letter-spacing: .2px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    & .track_title {
      font-size: 14px;
      font-weight: 400;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      @media screen and (max-width:767px) {
        font-size: 14px;
      }
    }

    .track_toggler {

      height: 40px;
    }

    .player_range {
      vertical-align: middle;
      height: 3px;
      outline: none;
      background: #fff;
      width: calc(100% - 35px);
      margin-top: 15px;
      color: #FAFA33;
      filter: hue-rotate(200deg) brightness(2.5);

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
  z-index: 1;
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

.expand_icon {
  position: absolute;
  right: 0;
  bottom: 0;
}

@media screen and (max-width:767px) {
  .artifical-pad {
    padding-bottom: 145px;
  }
}
</style>
