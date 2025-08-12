<script lang="ts" setup>

defineProps<{ type: 'date' | 'time' | 'dateTime' }>()

const model = defineModel<string | string[] | null>()

</script>

<template>
  <!-- <div class="flex flex-col gap-4">
    <UCalendar v-model="date" :month-controls="false" :year-controls="false" />

    <div class="flex justify-between gap-4">
      <UButton color="neutral" variant="outline" @click="date = date.subtract({ months: 1 })">
        Prev
      </UButton>

      <UButton color="neutral" variant="outline" @click="date = date.add({ months: 1 })">
        Next
      </UButton>
    </div>
  </div> -->
</template>

<style lang="scss" scoped></style>
