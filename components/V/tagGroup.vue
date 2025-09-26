<script lang="ts" setup generic="T,Option extends { label?: string, icon?: string, value: T }">
defineOptions({
  inheritAttrs: false
})

// type Option = { label?: string, icon?: string, value: T }

const props = defineProps<{ options?: Option[], enums?: Record<Numeric, Option>, itemClass?: string }>()

const options = computed<Option[]>(() => {
  if (props.enums) return Object.values(props.enums)
  return props.options ?? []
})

const model = defineModel<T[] | null>()

const emits = defineEmits<{ (e: 'change', val: boolean): void }>()

const check = (opt: Option) => {
  if (model.value?.includes(opt.value)) {
    model.value = model.value?.filter(v => v !== opt.value)
  } else {
    model.value ? model.value.push(opt.value) : (model.value = [opt.value])
  }
}

const reset = () => {
  if (model.value) {
    model.value.length = 0
  }
}
</script>

<template>
  <van-field label-width="auto" v-bind="$attrs" readonly>
    <template #input>
      <div class=" flex flex-wrap gap-2 py-2">
        <div v-for="v in options"
          class=" rounded-lg border border-[rgba(255,255,255,.3)] flex items-center justify-center w-7 h-7"
          :class="[itemClass, model?.includes(v.value) && ' border-emerald-700 shadow-xs shadow-indigo-500/50']"
          @click="check(v)">
          <slot v-bind="{ option: v }">
            {{ v.icon ?? v.label ?? v.value }}
          </slot>
        </div>
        <div @click="reset"
          class=" rounded-lg bg-emerald-600 flex items-center justify-center w-7 h-7 text-[12px] font-[700]">R</div>
      </div>
    </template>
  </van-field>
</template>

<style scoped></style>
