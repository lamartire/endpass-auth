<template>
  <v-frame @close="handleClose">
    <v-description>{{ $t('global.version') }}{{ version }}</v-description>
  </v-frame>
</template>

<script>
import pkg from '@/../package.json';
import VFrame from '@/components/common/VFrame';
import { coreStore } from '@/store';
import VDescription from '@/components/common/VDescription';

if (ENV.VUE_APP_SHOW_VERSION_INFO) {
  // eslint-disable-next-line no-console
  console.info(
    `%cEndpass Auth Bridge (${pkg.version}) loaded 🔌`,
    'font-size: 14px; font-weight: bold',
  );
}

export default {
  name: 'Bridge',
  data() {
    return {
      version: pkg.version,
    };
  },

  methods: {
    handleClose() {
      coreStore.dialogClose();
    },
  },

  components: {
    VFrame,
    VDescription,
  },
};
</script>
