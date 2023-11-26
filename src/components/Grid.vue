<template>
  <main class="song_grid" v-if="!loading">
    <div class="playList_layout" v-for="(playlist, playlistIndex) in currentPlaylist.slice().reverse()" :key="'playlist-' + playlistIndex">
      <h3>{{ playlist.name }}</h3>
      <div class="dragger">

        <ul class="box" v-bind:id="playlist.id">
          <li
            class="grid"
            v-for="(track, trackIndex) in playlist.tracks.items"
            :key="track.track.id">
            <div class="song_box" @click="selectTrack(track.track)">
              <img :src="getAlbumCover(track)" alt="Album cover">
              <div class="song_info">
                <div class="title__name">{{ track.track.name }}</div>
                <div class="artist__name">{{ track.track.artists[0].name }}</div>
              </div>
            </div>
          </li>
        </ul>

      </div>
    </div>
  </main>
  <div v-if="loading">Loading...</div>
</template>

<script>
import { inject, ref, watch } from 'vue';

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
      currentPlaylist: [],
      scrolling: false,
      scrollDirection: null,
      currentPlaylistId: null,
      loadTimes: {},
    };
  },
  setup() {
    const store = inject('store');
    const currentPlaylist = ref([]);

    // Watch for changes in the store's currentPlaylist
    watch(() => store.state.currentPlaylist, (newCurrentPlaylist) => {
      // Update this.currentPlaylist when the store's currentPlaylist changes
      currentPlaylist.value = newCurrentPlaylist;
    });
    const AlsoToSidebar = (allPlaylistsData) => {
      console.log("object");
      store.SetSidebarPlaylist(allPlaylistsData)
    }
    // Use eventBus from createApp instance
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
      selectTrack,
      currentPlaylist, // expose currentPlaylist to the template
      AlsoToSidebar,
    };
  },
  async mounted() {
    const storedTimestamp = localStorage.getItem('token_date');
    const lastFetched = localStorage.getItem('lastFetched');
    const expires_in = Math.floor(localStorage.getItem('expires_in')) ? Math.floor(localStorage.getItem('expires_in')) : 3600
    const oneDayOld = 86400
    if (storedTimestamp) {
      const storedDate = Math.floor(new Date(storedTimestamp).getTime() / 1000);

      const currentDate = Math.floor(new Date().getTime() / 1000);
      const elapsedTime = currentDate - storedDate;
      if (elapsedTime >= expires_in) {
        console.log('Token is older');
        await this.getAccessToken();
      }
      if (lastFetched) {
        if (currentDate - Math.floor(new Date(lastFetched).getTime() / 1000) >= oneDayOld) {
          await this.getFeaturedplaylists();
        }
      }
      else {
        await this.getFeaturedplaylists();
      }
    } else {
      console.log('Token date not found in local storage');
      await this.getAccessToken();
    }

    this.mainData = JSON.parse(localStorage.getItem('mainPlaylist'));
    this.playlistTracks = JSON.parse(localStorage.getItem('subPlaylist'));
    this.currentPlaylist = JSON.parse(localStorage.getItem('currentPlaylist'));
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
      localStorage.setItem('lastFetched', new Date());
      let allPlaylistsData = [];
      for (let i = 0; i < 1; i++) {
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
      if (!localStorage.getItem('currentPlaylist')) {
        localStorage.setItem('currentPlaylist', JSON.stringify(allPlaylistsData));
        this.currentPlaylist = allPlaylistsData
        this.AlsoToSidebar(allPlaylistsData)
      }
      localStorage.setItem("subPlaylist", JSON.stringify(allPlaylistsData));
      this.cacheLoad()
    },
    async cacheLoad() {
      this.mainData = JSON.parse(localStorage.getItem('mainPlaylist'));
      this.subPlaylist = JSON.parse(localStorage.getItem('subPlaylist'));

      this.loading = false;

      // Initialize loadTimes
      for (let playlistIndex = 0; playlistIndex < this.subPlaylist.length; playlistIndex++) {
        for (let trackIndex = 0; trackIndex < 30 && trackIndex < this.subPlaylist[playlistIndex].tracks.items.length; trackIndex++) {
          const key = `${playlistIndex}-${trackIndex}`;
          this.loadTimes[key] = Date.now() + ((playlistIndex * this.subPlaylist[playlistIndex].tracks.items.length + trackIndex) * 100);
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
