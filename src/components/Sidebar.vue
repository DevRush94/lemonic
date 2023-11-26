<template>
  <div class="sidebar">
    <h2>Trending Playlist</h2>
    <ul>
      <li v-for="playlist in playlists" :key="playlist.id">
        <a class="playlist_sidebar" @click="selectPlaylist(playlist)">
          <img :src="getAlbumCover(playlist)" alt="Album cover">
          <div class="right">
            {{ playlist.name }}
            <div class="count">
              {{ playlist.tracks.total }}+ Songs
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  data() {
    return {
      playlists: [],
    };
  },
  mounted() {
    // Fetch playlists from localStorage
    const mainPlaylist = localStorage.getItem('mainPlaylist');

    if (mainPlaylist) {
      const playlistsData = JSON.parse(mainPlaylist).playlists.items;
      this.playlists = playlistsData;
    }
  },
  methods: {
    getAlbumCover(track) {
      if (track && track.images && track.images[0]) {
        return track.images[0].url;
      }
      return '';
    },
    async selectPlaylist(playlist) {
      const playlistResponse = await fetch(playlist.tracks.href, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const playlistData = await playlistResponse.json();
      localStorage.setItem('currentPlaylist', JSON.stringify([JSON.parse(localStorage.getItem('subPlaylist'))[0], { ...playlist, tracks: {  ...playlistData } }]));
    }
  }
};
</script>


<style scoped>
.sidebar {
  background-color: #171717;
  padding: 20px;
  flex: 0 0 320px;
  color: #fff;

  @media screen and (max-width:767px) {
    display: none;
  }
}

h2 {
  color: #FFF;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.4px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin-top: 20px;
}

img {
  width: 52px;
  height: 52px;
  border-radius: 50%;
}

router-link {
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  display: block;
}

.playlist_sidebar {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #FFF;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.4px;
}

.count {
  color: rgba(255, 255, 255, 0.50);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.4px;
  margin-top: -2px;
}
</style>
