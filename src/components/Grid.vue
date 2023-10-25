<template>
  <main class="padder" v-if="!loading">
    <div class="playList_layout" v-for="(playlist, playlistIndex) in subPlaylist" :key="'playlist-' + playlistIndex">
      <h3>{{ playlist.name }}</h3>
      <div class="dragger">
        <div
          class="scroll_left"
          v-show="showScrollLeft[playlist.id]"
          @mouseover="startScrolling(playlist.id, 'left')"
          @mouseout="stopScrolling">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="#fff" d="M8.5 12.8l5.7 5.6c.4.4 1 .4 1.4 0s.4-1 0-1.4l-4.9-5 4.9-5c.4-.4.4-1 0-1.4-.2-.2-.4-.3-.7-.3s-.5.1-.7.3l-5.7 5.6c-.4.5-.4 1.1 0 1.6 0-.1 0-.1 0 0z" />
          </svg>
        </div>
        <ul class="box" v-bind:id="playlist.id">
          <li
            class="grid"
            v-for="(track, trackIndex) in playlist.tracks.items"
            :key="track.track.id"
            :class="{ load: hasLoaded(playlistIndex, trackIndex) }">
            <div class="song_box" @click="selectTrack(track.track)">
              <img :src="getAlbumCover(track)" alt="Album cover">
              <div class="song_info">
                <div class="title__name">{{ track.track.name }}</div>
                <div class="artist__name">{{ track.track.artists[0].name }}</div>
              </div>
            </div>
          </li>
        </ul>
        <div
          class="scroll_right"
          v-show="showScrollRight[playlist.id]"
          @mouseover="startScrolling(playlist.id, 'right')"
          @mouseout="stopScrolling">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="#fff" d="M15.54 11.29L9.88 5.64a1 1 0 1 0-1.42 1.41l4.95 5L8.46 17a1 1 0 0 0 .71 1.71 1 1 0 0 0 .71-.3l5.66-5.65a1 1 0 0 0 0-1.47z" />
          </svg>
        </div>
      </div>
    </div>
  </main>
  <div v-if="loading">Loading...</div>
</template>

<script>
import { inject } from 'vue';

const clientId = '4875732b46fe4b2b8671c683ea012688';
const clientSecret = 'f4490eb08e334cba9e0a02a472a59f1a';
const basicAuth = btoa(clientId + ':' + clientSecret);

function removeAvailableMarkets(data) {
  if (data && data.tracks && Array.isArray(data.tracks.items)) {
    data.tracks.items.forEach(item => {
      if (item.track) {
        delete item.track.available_markets;
        item.track.album && delete item.track.album.available_markets;
      }
    });
  }
  return data;
}

export default {
  data() {
    return {
      loading: true,
      mainData: null,
      playlistTracks: [],
      subPlaylist: [],
      scrolling: false,
      scrollDirection: null,
      currentPlaylistId: null,
      loadTimes: {},
      showScrollLeft: {},
      showScrollRight: {}
    };
  },
  setup() {
    const store = inject('store');

    const selectTrack = (selectedTrack) => {
      const { id, duration_ms, name, album } = selectedTrack;
      const selectedTrackObject = {
        id,
        duration_ms,
        name,
        cover: album.images[0].url,
      };
      store.setTrack(selectedTrackObject);
    };
    return {
      selectTrack
    };
  },
  async mounted() {
    const storedTimestamp = localStorage.getItem('token_date');
    const expires_in = Math.floor(localStorage.getItem('expires_in')) ? Math.floor(localStorage.getItem('expires_in')) : 3600
    if (storedTimestamp) {
      const storedDate = Math.floor(new Date(storedTimestamp).getTime() / 1000);
      const currentDate = Math.floor(new Date().getTime() / 1000);
      const elapsedTime = currentDate - storedDate;
      if (elapsedTime >= expires_in) {
        console.log('Token is older');
        await this.getAccessToken();
      }
    } else {
      console.log('Token date not found in local storage');
      await this.getAccessToken();
    }

    this.mainData = JSON.parse(localStorage.getItem('mainPlaylist'));
    this.playlistTracks = JSON.parse(localStorage.getItem('subPlaylist'));

    if (!localStorage.getItem('token')) {
      await this.getAccessToken();
    }

    if (!localStorage.getItem('mainPlaylist')) {
      await this.getFeaturedplaylists();
    } else {
      this.cacheLoad();
      this.loading = false;
    }
  },
  methods: {
    createScrollVisibilityObject() {
      const visibilityObject = {};
      if (this.subPlaylist) {
        this.subPlaylist.forEach(playlist => {
          visibilityObject[playlist.id] = true; // Initially set to true
        });
      }
      return visibilityObject;
    },
    checkScrollPosition(playlistId) {
      const playlistElement = document.getElementById(playlistId);
      const scrollLeftMax = playlistElement.scrollWidth - playlistElement.clientWidth;

      this.showScrollLeft[playlistId] = playlistElement.scrollLeft > 0;
      this.showScrollRight[playlistId] = playlistElement.scrollLeft < scrollLeftMax;
    },
    hasLoaded(playlistIndex, trackIndex) {
      const key = `${playlistIndex}-${trackIndex}`;
      const currentTime = Date.now();

      // For tracks after the 10th, load by default
      if (trackIndex >= 10) {
        return true;
      }

      if (!this.loadTimes[key]) {
        this.loadTimes[key] = currentTime + (playlistIndex * this.subPlaylist[playlistIndex].tracks.items.length + trackIndex) * 100;
      }

      return currentTime > this.loadTimes[key];
    },
    startScrolling(playlistId, direction) {
      this.scrolling = true;
      this.scrollDirection = direction;
      this.currentPlaylistId = playlistId;
      this.scroll();
    },
    scroll() {
      if (!this.scrolling) {
        return;
      }
      const playlistElement = document.getElementById(this.currentPlaylistId);
      const scrollAmount = 15;  // Adjust for scroll speed
      if (this.scrollDirection === 'left') {
        playlistElement.scrollLeft -= scrollAmount;
      } else if (this.scrollDirection === 'right') {
        playlistElement.scrollLeft += scrollAmount;
      }
      requestAnimationFrame(this.scroll);
      this.checkScrollPosition(this.currentPlaylistId);
    },
    stopScrolling() {
      this.scrolling = false;
    },
    async getAccessToken() {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials`
      });
      const data = await response.json();
      console.log(data);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('token_date', new Date());
      localStorage.setItem('expires_in', data.expires_in);
    },
    async getFeaturedplaylists() {
      const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?country=IN`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      this.mainData = data;
      localStorage.setItem("mainPlaylist", JSON.stringify(this.mainData));
      console.log(data);
      const numberOfPlaylists = data.playlists.items.length;
      let allPlaylistsData = [];
      for (let i = 0; i < numberOfPlaylists; i++) {
        const playlistResponse = await fetch(data.playlists.items[i].href, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        let playlistData = await playlistResponse.json();
        playlistData = removeAvailableMarkets(playlistData)
        allPlaylistsData.push(playlistData);
      }
      this.playlistTracks = allPlaylistsData[0].tracks.items;
      localStorage.setItem("subPlaylist", JSON.stringify(allPlaylistsData));
      this.cacheLoad()
    },
    async cacheLoad() {
      this.mainData = JSON.parse(localStorage.getItem('mainPlaylist'));
      this.subPlaylist = JSON.parse(localStorage.getItem('subPlaylist'));
      this.initializeScrollVisibilityObjects();

      this.loading = false;

      // Initialize loadTimes
      for (let playlistIndex = 0; playlistIndex < this.subPlaylist.length; playlistIndex++) {
        for (let trackIndex = 0; trackIndex < 10 && trackIndex < this.subPlaylist[playlistIndex].tracks.items.length; trackIndex++) {
          const key = `${playlistIndex}-${trackIndex}`;
          this.loadTimes[key] = Date.now() + ((playlistIndex * this.subPlaylist[playlistIndex].tracks.items.length + trackIndex) * 100);
        }
      }

      // Start cascading effect
      this.$nextTick(() => {
        this.startCascadingEffect();
      });
    },
    initializeScrollVisibilityObjects() {
      this.showScrollLeft = this.createScrollVisibilityObject();
      this.showScrollRight = this.createScrollVisibilityObject();

      // Loop over each playlist and check the initial scroll position
      this.subPlaylist.forEach(playlist => {
        setTimeout(() => this.checkScrollPosition(playlist.id))
      });
    },
    startCascadingEffect() {
      const timePerTrack = 50;  // 2000ms for 10 tracks
      for (let playlistIndex = 0; playlistIndex < this.subPlaylist.length; playlistIndex++) {
        for (let trackIndex = 0; trackIndex < 10 && trackIndex < this.subPlaylist[playlistIndex].tracks.items.length; trackIndex++) {
          const key = `${playlistIndex}-${trackIndex}`;
          // Calculating the delay for each track
          const delay = (playlistIndex * 10 + trackIndex) * timePerTrack;

          setTimeout(() => {
            this.loadTimes[key] = 0.1;  // Set to past time to trigger the effect
          }, delay);
        }
      }
    },

    getAlbumCover(track) {
      if (track && track.track && track.track.album && track.track.album.images && track.track.album.images[1]) {
        return track.track.album.images[1].url;
      }
      return '';
    }
  }
};
</script>
