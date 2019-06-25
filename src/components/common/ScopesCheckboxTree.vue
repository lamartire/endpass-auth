<template>
  <div>
    <label class="checkbox">
      <v-checkbox
        v-if="level.title"
        :model-value="valuesMap[level.key]"
        type="checkbox"
        @change="onChange(level, $event)"
      >
        {{ level.title }}
      </v-checkbox>
    </label>
    <scopes-checkbox-tree
      v-for="childLevel in children"
      :key="childLevel.key"
      :level="childLevel"
      :children="childLevel.children"
      :values-map="valuesMap"
      :class="{
        'scope-level': true,
        'scope-level_is-child': true,
      }"
      @change="onChangeLevel"
    />
  </div>
</template>

<script>
import VCheckbox from '@endpass/ui/kit/VCheckbox';

const ScopesCheckboxTree = {
  name: 'ScopesCheckboxTree',

  props: {
    children: {
      type: Object,
      default: () => ({}),
    },

    valuesMap: {
      type: Object,
      default: () => ({}),
    },

    level: {
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    checkedScopes: [],
  }),

  methods: {
    onChange(scope, value) {
      Object.keys(this.valuesMap).forEach(key => {
        if (key.indexOf(scope.key) === 0) {
          this.valuesMap[key] = value;
        }
      });

      this.$emit('change', this.valuesMap);
    },

    onChangeLevel(valuesMap) {
      this.$emit('change', valuesMap);
    },
  },

  components: {
    VCheckbox,
  },
};

export default ScopesCheckboxTree;
</script>

<style lang="postcss">
.scope-level_is-child {
  margin-left: 20px;
}
</style>
