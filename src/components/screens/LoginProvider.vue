<template>
  <v-frame>
    <password-form
      :error="error"
      :loading="loading"
      @submit="handlePasswordSubmit"
    />
  </v-frame>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import VFrame from '@/components/common/VFrame';
import PasswordForm from '@/components/forms/PasswordForm';

export default {
  name: 'LoginProvider',

  data: () => ({
    error: null,
  }),

  computed: {
    ...mapState({
      loading: state => state.core.loading,
      isAuthorized: state => state.accounts.isAuthorized,
    }),
  },

  methods: {
    ...mapActions(['getHydraParams', 'hydraLogin', 'defineSettings']),

    async handlePasswordSubmit(password) {
      if (this.error) return;

      try {
        await this.hydraLogin(password);
      } catch (err) {
        this.error = err.message;
      }
    },
  },

  async mounted() {
    try {
      await this.getHydraParams();

      if (!this.isAuthorized) {
        this.$router.replace('/public/auth');
      }
    } catch (err) {
      if (err.message.includes('challenge_id')) {
        this.error =
          'You should provide challenge_id param in url, add it and try again!';
      }
    }
  },

  components: {
    VFrame,
    PasswordForm,
  },
};
</script>
