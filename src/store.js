import { reactive, readonly } from 'vue';

const state = reactive({
  track: null
});

const setTrack = (id) => {
  state.track = id;
};

export default {
  state: readonly(state),
  setTrack
};
