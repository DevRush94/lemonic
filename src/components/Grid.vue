<template>
  <main class="padder">
    <div class="playList_layout" v-for="(playlist, playlistIndex) in subPlaylist" :key="'playlist-' + playlistIndex">
      <h3>{{ playlist.name }}</h3>
      <div class="dragger">
        <div
          class="scroll_left"
          @mouseover="startScrolling(playlist.id, 'left')"
          @mouseout="stopScrolling">
        </div>

        <ul class="box" v-bind:id="playlist.id">
          <li class="grid" v-for="track in playlist.tracks.items" :key="track.id">
            <div class="song_box">
              <img :src="track.track.album.images[1].url" alt="Album cover">
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
</template>

<script>
const clientId = '4875732b46fe4b2b8671c683ea012688';
const clientSecret = 'f4490eb08e334cba9e0a02a472a59f1a';
const basicAuth = btoa(clientId + ':' + clientSecret);
const redirectUri = encodeURIComponent('http://127.0.0.1:5173/');

export default {
  data() {
    return {
      mainData: null,
      playlistTracks: [],
      subPlaylist: [],
      scrolling: false,
      scrollDirection: null,
      currentPlaylistId: null
    };
  },
  async mounted() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    this.mainData = JSON.parse(localStorage.getItem('mainPlaylist'));
    this.playlistTracks = JSON.parse(localStorage.getItem('subPlaylist'));


    if (!code && !localStorage.getItem('token')) {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
    } else {
      window.history.replaceState({}, document.title, location.href.split("?")[0]);
      if (!localStorage.getItem('token')) {
        await this.getAccessToken(code);
      }
      if (!localStorage.getItem('mainPlaylist')) {
        console.log("object", localStorage.getItem('mainPlaylist'));
        await this.getFeaturedplaylists();
      }
      else {
        this.cacheLoad()
      }
    }
  },
  methods: {
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
    async getAccessToken(authorizationCode) {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${redirectUri}`
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

      // Determine the number of playlists you want to fetch
      const numberOfPlaylists = data.playlists.items.length; // You can change this number to fetch more or less
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

      this.playlistTracks = allPlaylistsData[0].tracks.items; // Using the first playlist's tracks as an example
      localStorage.setItem("subPlaylist", JSON.stringify(allPlaylistsData));
    },
    async cacheLoad() {
      this.mainData = JSON.parse(localStorage.getItem('mainPlaylist'));
      this.subPlaylist = JSON.parse(localStorage.getItem('subPlaylist'));
      console.log(this);
    }
  }
};
</script>
