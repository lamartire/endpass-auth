<template>
  <create-account-form v-if="mode === 'create'" @request="emitAccoutRequest" />
  <otp-form
    v-else-if="mode === 'otp'"
    :loading="loading"
    :error="error"
    @submit="emitSubmit"
    @recover="emitRecover"
  />
  <recover-form
    v-else-if="mode === 'recover'"
    :loading="loading"
    :error="error"
    @submit="emitSubmit"
  />
  <message-form
    v-else-if="mode === 'sent'"
    :closable="closable"
    message="An email with authorization link was sent on your address. Open it in the same browser to sign in. Also check spam folder and exclude Endpass from spam filters."
    @cancel="emitCancel"
  />
  <message-form
    v-else-if="mode === 'authorized'"
    message="You are successfully authorized. Dialog will be closed in a few seconds."
    @cancel="emitCancel"
  />
  <auth-form
    v-else
    :inited="inited"
    :loading="loading"
    :error="error"
    :is-server-mode="mode === 'server'"
    @submit="emitSubmit"
    @error="emitError"
  />
</template>

<script>
import AuthForm from '@/components/forms/Auth';
import OtpForm from '@/components/forms/Otp';
import RecoverForm from '@/components/forms/Recover';
import MessageForm from '@/components/forms/Message';
import CreateAccountForm from '@/components/forms/CreateAccount';

export default {
  name: 'Auth',

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    closable: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: null,
    },

    inited: {
      type: Boolean,
      default: false,
    },

    mode: {
      type: String,
      default: null,
      validator: val =>
        ['otp', 'recover', 'authorized', 'sent', 'create', 'server'].includes(
          val,
        ),
    },
  },

  methods: {
    emitSubmit(payload) {
      this.$emit('submit', payload);
    },

    emitAccoutRequest(req) {
      this.$emit('accout-request');
    },

    emitError(err) {
      this.$emit('error', err);
    },

    emitCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    AuthForm,
    OtpForm,
    RecoverForm,
    MessageForm,
    CreateAccountForm,
  },
};
</script>
