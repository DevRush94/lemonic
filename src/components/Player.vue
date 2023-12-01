<template>
  <div class="error-pop" v-if="errorTrack">
    Your taste is unique. Please try again in 15 minutes, and we'll add it.
  </div>

  <div :class="['player', getPlayerViewClass()]" v-if="FullPlaylist.length">
    <div v-if="loading" class="track_loader">Loading Selected Song, Please wait...</div>

    <div class="track_info_box" v-for="track in FullPlaylist" :key="track.id">
      <div class="just_wrapper" v-if="track.isNowPlaying">
        <img class="track_cover" :src="track.cover" :alt="track.name">
        <div class="track_sub_info">
          <div class="track_title">{{ track.name }}</div>
          <div class="track_artist">{{ track.artists }}</div>
          <div class="controls">
            <div class="inner_control">
              <button class="track_prev" @click="togglePrev">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#d3d3d3" stroke-linejoin="round">
                  <path d="M20.24 7.22v9.57A2.56 2.56 0 0 1 16.41 19l-4.15-2.39-4.15-2.4c-1.7-.98-1.7-3.43 0-4.41l4.15-2.4 4.15-2.39c1.7-.98 3.83.24 3.83 2.21z" fill="#d3d3d3" />
                  <path d="M3.76 18.18V5.82" stroke-linecap="round" />
                </svg>
              </button>
              <button class="track_toggler" @click="togglePlayPause">
                <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke-width="1.5" stroke-linejoin="round" viewBox="0 0 40 40">
                  <path d="M19.95 36.667A16.67 16.67 0 0 0 36.617 20 16.67 16.67 0 0 0 19.95 3.333 16.67 16.67 0 0 0 3.283 20 16.67 16.67 0 0 0 19.95 36.667z" stroke="#fafa33" />
                  <path d="M17.867 24.217v-8.433c0-.8-.333-1.117-1.183-1.117h-2.167c-.85 0-1.183.317-1.183 1.117v8.433c0 .8.333 1.117 1.183 1.117h2.15c.867 0 1.2-.317 1.2-1.117zm8.8 0v-8.433c0-.8-.333-1.117-1.183-1.117h-2.15c-.85 0-1.183.317-1.183 1.117v8.433c0 .8.333 1.117 1.183 1.117h2.15c.85 0 1.183-.317 1.183-1.117z" fill="#fff" stroke="#fff" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32" fill="none" stroke="#fafa33" stroke-width="1.5">
                  <path d="M25.427 25.427c5.213-5.213 5.213-13.653 0-18.853M6.573 6.573c-5.213 5.213-5.213 13.653 0 18.853m5.027 3.121a13.42 13.42 0 0 0 4.4.733c1.493-.013 2.973-.24 4.4-.733M11.6 3.453c1.427-.493 2.907-.733 4.4-.733s2.973.24 4.4.733" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M11.653 16v-2.227c0-2.773 1.96-3.907 4.36-2.52l1.933 1.12 1.933 1.12c2.4 1.387 2.4 3.653 0 5.04l-1.933 1.12-1.933 1.12c-2.4 1.387-4.36.253-4.36-2.52V16z" fill="#fafa33" stroke-miterlimit="10" stroke-linejoin="round" />
                </svg>
              </button>
              <button class="track_next" @click="toggleNext">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#d3d3d3" stroke-linejoin="round">
                  <path d="M3.76 16.78V7.21A2.56 2.56 0 0 1 7.59 5l4.15 2.39 4.15 2.4c1.7.98 1.7 3.43 0 4.41l-4.15 2.4-4.15 2.39c-1.7.98-3.83-.24-3.83-2.21z" fill="#d3d3d3" />
                  <path d="M20.24 5.82v12.36" stroke-linecap="round" />
                </svg>
              </button>
            </div>
            <div class="inner_control">
              <button class="track_download" @click="toggleDownload">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.96 5.933c2.4.207 3.38 1.44 3.38 4.14v.087c0 2.98-1.193 4.173-4.173 4.173h-4.34c-2.98 0-4.173-1.193-4.173-4.173v-.087c0-2.68.967-3.913 3.327-4.133M8 1.333V9.92" />
                  <path d="M10.233 8.433L8 10.667 5.767 8.433" />
                </svg>
              </button>
              <span class="track_duration">{{ formatDuration(store.state.track.duration_ms) }}</span>
            </div>
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
          <input
            class="volume_slider"
            type="range"
            v-model="currentVolume"
            :min="0"
            :max="1"
            step="0.1"
            @input="changeVolume" />
        </div>
        <div class="expand_icon" @click="toggleView">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 2666.667 2666.667">
            <path fill="#fff" d="M1854.355 724.512H812.302c-48.411 0-87.794 39.387-87.794 87.8v1042.051c0 48.413 39.384 87.8 87.794 87.8h521.028c22.093 0 40-17.907 40-40s-17.907-40-40-40H812.302c-4.297 0-7.795-3.493-7.795-7.8V812.311c0-4.293 3.497-7.8 7.795-7.8h1042.053c4.307 0 7.8 3.507 7.8 7.8v528.079c0 22.093 17.907 40 40 40s40-17.907 40-40V812.311c0-48.413-39.387-87.8-87.8-87.8m34.68 763.959H1492.17a13.11 13.11 0 0 0-13.107 13.107v387.466a13.12 13.12 0 0 0 13.107 13.12h396.866c7.253 0 13.12-5.88 13.12-13.12v-387.466a13.11 13.11 0 0 0-13.12-13.107m-828.335-473.106h205.427c22.091 0 40-17.92 40-40 0-22.093-17.909-40-40-40H965.796c-11.256 0-21.421 4.653-28.689 12.133-.141.133-.288.267-.427.413h0c-.469.467-.923.947-1.364 1.427-.208.227-.401.467-.603.693l-.672.787-.723.92c-.157.2-.32.4-.473.613-.255.347-.496.693-.737 1.04l-.384.547a32.4 32.4 0 0 0-.696 1.093c-.117.187-.237.36-.352.56-.215.36-.419.72-.621 1.08l-.352.627-.529 1.04-.363.733c-.149.307-.291.627-.432.947l-.375.867c-.117.28-.227.573-.337.853l-.377 1-.256.76-.364 1.12-.189.68a32.92 32.92 0 0 0-.331 1.227c-.052.2-.097.413-.145.627l-.28 1.28c-.041.2-.075.413-.113.627l-.216 1.28-.093.733-.143 1.2c-.032.32-.051.653-.076.987l-.068.96a39.19 39.19 0 0 0-.047 1.867c0 .027-.003.067-.003.107v300.333c0 22.093 17.908 40 40 40s40-17.907 40-40v-203.773l328.818 328.826c7.813 7.813 18.053 11.72 28.28 11.72 10.24 0 20.48-3.907 28.293-11.72 15.613-15.613 15.613-40.947 0-56.56l-329.655-329.653" />
          </svg>
        </div>
      </div>
    </div>

    <audio
      hidden
      autoplay
      ref="audioElement"
      :src="getCurrentTrackObjectURL()"
      @timeupdate="updateSeek"
      @durationchange="setDuration"
      controls></audio>

  </div>

  <div class="artificial-pad" v-if="store.state.track"></div>
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
    const PlayerView = ref(0);
    const errorTrack = ref(false);
    const currentVolume = ref(1);
    const FullPlaylist = ref([]);

    const changeVolume = () => {
      if (audioElement.value) audioElement.value.volume = currentVolume.value;
    };

    const togglePlayPause = () => {
      if (!audioElement.value) return;
      if (isPlaying.value) {
        audioElement.value.pause();
      } else {
        audioElement.value.play();
      }
      isPlaying.value = !isPlaying.value;
    };

    const toggleDownload = () => {
      if (trackUrl.value) {
        const link = document.createElement('a');
        link.href = trackUrl.value;
        link.download = `${store.state.track.name} - ${store.state.track.artists} [320kbps][Lemonic].mp3`;
        link.click();
        setTimeout(() => {
          link.remove();
        });
      }
    };

    const getCurrentTrackObjectURL = () => {
      const currentTrack = FullPlaylist.value.find(track => track.isNowPlaying);
      return currentTrack ? currentTrack.objectURL : '';
    };

    const setNowPlaying = (index) => {
      console.log(FullPlaylist.value);
      FullPlaylist.value.forEach((track, i) => { track.isNowPlaying = i === index; });
    };
    const togglePrev = () => {
      const currentIndex = FullPlaylist.value.findIndex(track => track.isNowPlaying);
      const prevIndex = (currentIndex - 1 + FullPlaylist.value.length) % FullPlaylist.value.length;
      setNowPlaying(prevIndex);
    };

    const toggleNext = () => {
      const currentIndex = FullPlaylist.value.findIndex(track => track.isNowPlaying);
      const nextIndex = (currentIndex + 1) % FullPlaylist.value.length;
      setNowPlaying(nextIndex);
    };

    const toggleView = () => {
      PlayerView.value = (PlayerView.value + 1) % 3;
    };

    const getPlayerViewClass = () => {
      switch (PlayerView.value) {
        case 0:
          return 'mini_player';
        case 1:
          return 'mid_player';
        case 2:
          return 'max_player';
        default:
          return '';
      }
    };

    watch(
      () => store.state.track,
      async (newTrackArray, oldTrackArray) => {
        const newTrack = newTrackArray[newTrackArray.length - 1];
        const oldTrack = oldTrackArray[oldTrackArray.length - 1];
        if (newTrack) {
          loading.value = true;

          try {
            const response = await fetch(`https://lemonic.viperadnan.com/api/raw/track/${newTrack.id}`, {
              method: 'GET',
              headers: {
                accept: 'application/json',
              },
            });
            const data = await response.json();
            if (data?.code === 404) {
              store.setTrack();
              errorTrack.value = true;
              setTimeout(() => {
                errorTrack.value = false;
              }, 15000);
            }
            if (data.url) {
              const fileResponse = await fetch(data.url);
              const arrayBuffer = await fileResponse.arrayBuffer();
              const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
              const objectURL = URL.createObjectURL(blob);

              // Update FullPlaylist
              // Get the last track from newTrackArray

              // Update FullPlaylist.value
              FullPlaylist.value.push({
                ...newTrack,
                isNowPlaying: true,
                objectURL: objectURL || newTrack.objectURL,
              });

              document.title = 'Lemonic - ' + newTrack.name;
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
            setNowPlaying(FullPlaylist.value.length - 1)
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

    const formatDuration = (duration_ms) => {
      const minutes = Math.floor(duration_ms / 60000);
      const seconds = ((duration_ms % 60000) / 1000).toFixed(0);
      return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
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
      toggleDownload,
      toggleView,
      PlayerView,
      isPlaying,
      errorTrack,
      getPlayerViewClass,
      formatDuration,
      currentVolume,
      changeVolume,
      FullPlaylist,
      togglePrev,
      toggleNext,
      getCurrentTrackObjectURL,
    };
  },
};
</script>
