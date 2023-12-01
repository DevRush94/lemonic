import { track } from '@vue/reactivity';
import { reactive, readonly } from 'vue';

const state = reactive({
  track: [],
  currentPlaylist: null // New state for the current active playlist
});

const setTrack = (id) => {
  state.track = [...state.track, id];
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
