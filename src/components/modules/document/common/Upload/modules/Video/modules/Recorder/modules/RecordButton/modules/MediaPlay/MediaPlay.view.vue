<template>
  <v-circle-button @click="onPlay">
    <v-svg-icon
      width="32px"
      height="32px"
      class="media-recorder-done-icon"
      name="media-play"
    />
  </v-circle-button>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import VCircleButton from '../VCircleButton';

export default {
  name: 'MediaPlayView',

  methods: {
    onPlay() {
      this.$emit('play');
    },
  },

  components: {
    VCircleButton,
    VSvgIcon,
  },
};
</script>

<style lang="postcss">
.media-recorder-done-icon {
  color: var(--endpass-ui-color-primary-7);
  margin-left: 4px;
}
</style>
