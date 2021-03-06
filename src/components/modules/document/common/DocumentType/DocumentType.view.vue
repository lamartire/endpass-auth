<template>
  <div
    class="document-types-item"
    @click="onSelect"
  >
    <div class="document-type-icon">
      <v-svg-icon
        :name="docTypeIcon"
        height="28px"
        width="28px"
      />
    </div>
    <div class="document-type-details">
      <div class="document-type-label">
        {{ $options.DOC_TYPES_TRANSLATES[documentType] }}
      </div>
      <div
        v-if="isShowDescription"
        class="document-type-description"
      >
        <document-status
          v-if="isDocumentStatusExist"
          :status="documentStatus"
          :date="dateOfExpiry"
        />
        <span
          v-else
          class="document-not-added"
        >
          {{ notSelectedTitle }}
        </span>
      </div>
    </div>
    <div
      class="document-type-action-icon"
      :class="{
        'is-chosen': isChosen,
      }"
    >
      <v-svg-icon
        width="21px"
        height="21px"
        :name="actionIcon"
      />
    </div>
  </div>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import {
  DOC_ICONS_BY_TYPES,
  DOC_STATUS_VALUES,
} from './DocumentType.constants';
import DocumentStatus from './modules/DocumentStatus';
import { DOC_TYPES_TRANSLATES } from '@/constants/translates';

export default {
  name: 'DocumentTypeView',

  DOC_TYPES_TRANSLATES,

  props: {
    documentType: {
      type: String,
      required: true,
    },

    isSelectable: {
      type: Boolean,
      default: false,
    },

    isShowDescription: {
      type: Boolean,
      default: false,
    },

    isChosen: {
      type: Boolean,
      default: false,
    },

    document: {
      type: Object,
      default: () => ({}),
    },

    totalDocuments: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    notSelectedTitle() {
      if (!this.totalDocuments) {
        return this.$t('components.uploadDocument.pleaseAdd');
      }

      return this.$t('components.uploadDocument.totalVerified', {
        total: this.totalDocuments,
      });
    },

    docTypeIcon() {
      return DOC_ICONS_BY_TYPES[this.documentType];
    },

    actionIcon() {
      if (!this.isSelectable) return 'chevron-right';

      return this.isChosen ? 'check-alt' : 'circle-mark';
    },

    documentStatus() {
      if (!this.document) return null;
      return this.document.status;
    },

    dateOfExpiry() {
      const { dateOfExpiry, createdAt } = this.document || {};
      if (!dateOfExpiry || dateOfExpiry < 0) return createdAt;
      return dateOfExpiry;
    },

    isDocumentStatusExist() {
      return DOC_STATUS_VALUES.includes(this.documentStatus);
    },
  },

  methods: {
    onSelect() {
      this.$emit('select', this.documentType);
    },
  },

  components: {
    DocumentStatus,
    VSvgIcon,
  },
};
</script>

<style lang="postcss">
.document-types-item {
  display: flex;
  padding: 16px 0;
  box-shadow: inset 0 -1px 0 var(--endpass-ui-color-grey-1);
  cursor: pointer;
}

.document-types-item:last-of-type {
  box-shadow: none;
}

.document-type-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--endpass-ui-color-primary-7);
  border-radius: 50%;
}

.document-type-details {
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.document-type-label {
  font-size: 16px;
  color: var(--endpass-ui-color-grey-8);
}

.document-type-description {
  margin-top: 4px;
}

.document-not-added {
  font-size: 14px;
  padding: 4px 0;
  display: inline-block;
  color: var(--endpass-ui-color-grey-5);
}

.document-type-action-icon {
  display: flex;
  align-items: center;
  margin-left: auto;
  color: var(--endpass-ui-color-grey-5);
}

.document-type-action-icon.is-chosen {
  color: var(--endpass-ui-color-green-2);
}
</style>
