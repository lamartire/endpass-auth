<template>
  <form
    data-test="app-code-form"
    @submit.prevent="onSubmit"
  >
    <v-title>
      {{ $t('components.appCode.title') }}
    </v-title>
    <v-description>
      {{ $t('components.appCode.description') }}
    </v-description>

    <form-item>
      <v-input
        v-model="code"
        v-validate="'required|digits:6'"
        autocomplete="off"
        data-vv-as="code"
        data-vv-name="code"
        :error="errors.first('code')"
        name="code"
        :placeholder="$t('components.appCode.enterReceivedCode')"
        data-test="code-input"
      />
    </form-item>
    <form-item class="v-mb-24">
      <remember-me
        v-model="isRemember"
        data-test="remember-me-checkbox"
      />
    </form-item>
    <form-item class="v-mb-24">
      <v-button
        :disabled="!isFormValid || isLoading"
        :is-loading="isLoading"
        type="submit"
        data-test="submit-button"
      >
        {{ $t('global.confirm') }}
      </v-button>
    </form-item>
    <form-row
      v-if="isPhoneExist"
      class="v-fs-14 v-text-center"
    >
      <v-link
        :disabled="isLoading"
        role="button"
        data-test="recovery-link"
        @click.prevent="onRecover"
      >
        {{ $t('components.appCode.noCode') }}
      </v-link>
    </form-row>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import VLink from '@endpass/ui/kit/VLink';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';
import RememberMe from '../RememberMe';

export default {
  name: 'AppCodeView',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    isPhoneExist: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    code: '',
    isRemember: false,
  }),

  watch: {
    error: {
      handler(msg) {
        this.$validator.errors.removeById('sendCodeId');

        if (!msg) return;

        this.$validator.errors.add({
          id: 'sendCodeId',
          field: 'code',
          msg,
        });
      },
      immediate: true,
    },
  },

  methods: {
    onSubmit() {
      this.$emit('submit', {
        code: this.code,
        isRemember: this.isRemember,
      });
    },

    onRecover() {
      this.$emit('recover');
    },
  },

  mixins: [formMixin],

  components: {
    RememberMe,
    VTitle,
    VDescription,
    VLink,
    VButton,
    VInput,
    FormItem,
    FormRow,
  },
};
</script>
