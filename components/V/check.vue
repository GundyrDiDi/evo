<script lang="ts" setup generic="T,O extends { value: T,label?: Numeric }">
defineOptions({
  inheritAttrs: false
})

const props = defineProps<{ options?: O[] }>()

const model = defineModel<boolean | null | T>()

const emits = defineEmits<{ (e: 'change', val: boolean): void }>()

const handleClick = (value?) => {
  if (value === undefined) {
    model.value = !model.value
  } else {
    model.value = model.value === value ? null : value
  }
  emits('change', !model.value)
}
</script>

<template>
  <van-field label-width="auto" v-bind="$attrs" readonly clickable>
    <template #input>
      <slot v-bind="{ value: model }">
        <div v-if="options" :class="$attrs.class">
          <label v-for="v in options" @click="handleClick(v.value)">
            {{ model === v.value ? '✅' : '▢' }}
            <slot name="label" v-bind="{ option: v }">
              {{ v.label }}
            </slot>
          </label>
        </div>
        <template v-else>
          {{ model ? '✅' : '▢' }}
          <!-- <slot name="label"></slot> -->
        </template>
      </slot>
    </template>
  </van-field>
</template>

<style scoped></style>
