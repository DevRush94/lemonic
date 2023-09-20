import { reactive, readonly } from 'vue';

const state = reactive({
  trackId: null
});

const setTrackId = (id) => {
  state.trackId = id;
};

export default {
  state: readonly(state),
  setTrackId
};
