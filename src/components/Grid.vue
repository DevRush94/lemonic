<template>
  <main class="padder" :class="loadedClass" v-if="!loading">
    <div class="playList_layout" v-for="(playlist, playlistIndex) in subPlaylist" :key="'playlist-' + playlistIndex">
      <h3>{{ playlist.name }}</h3>
      <div class="dragger">
        <div
          class="scroll_left"
          @mouseover="startScrolling(playlist.id, 'left')"
          @mouseout="stopScrolling">
        </div>
        <ul class="box" v-bind:id="playlist.id">
          <li
            class="grid"
            v-for="(track, trackIndex) in playlist.tracks.items"
            :key="track.id"
            :class="{ load: hasLoaded(playlistIndex, trackIndex) }">
            <div class="song_box">
              <img :src="getAlbumCover(track)" alt="Album cover">
            </div>
          </li>
        </ul>
        <div
          class="scroll_right"
          @mouseover="startScrolling(playlist.id, 'right')"
          @mouseout="stopScrolling">
        </div>
      </div>
    </div>
  </main>
  <div v-if="loading">Loading...</div>
</template>

<script>
const clientId = '4875732b46fe4b2b8671c683ea012688';
const clientSecret = 'f4490eb08e334cba9e0a02a472a59f1a';
const basicAuth = btoa(clientId + ':' + clientSecret);

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
      loadTimes: {}
    };
  },
  async mounted() {
    const url = new URL(window.location.href);
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
      const scrollAmount = 10;  // Adjust for scroll speed
      if (this.scrollDirection === 'left') {
        playlistElement.scrollLeft -= scrollAmount;
      } else if (this.scrollDirection === 'right') {
        playlistElement.scrollLeft += scrollAmount;
      }
      requestAnimationFrame(this.scroll);
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
      localStorage.setItem('token', data.access_token);
    },
    async getFeaturedplaylists() {
      const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists`, {
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
        const playlistData = await playlistResponse.json();
        allPlaylistsData.push(playlistData);
      }
      this.playlistTracks = allPlaylistsData[0].tracks.items;
      localStorage.setItem("subPlaylist", JSON.stringify(allPlaylistsData));
      this.cacheLoad()
    },
    async cacheLoad() {
      this.mainData = JSON.parse(localStorage.getItem('mainPlaylist'));
      this.subPlaylist = JSON.parse(localStorage.getItem('subPlaylist'));

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
