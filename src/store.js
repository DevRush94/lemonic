import { reactive, readonly } from 'vue';

const state = reactive({
  track: null,
  currentPlaylist: null // New state for the current active playlist
});

const setTrack = (id) => {
  state.track = id;
};

const setCurrentPlaylist = (playlist) => {
  state.currentPlaylist = JSON.parse(playlist);
}

const SetSidebarPlaylist = (playlist) => {
  state.sidebarPlaylist = (playlist);
}

export default {
  state: readonly(state),
  setTrack,
  setCurrentPlaylist,
  SetSidebarPlaylist
};
