<script lang="ts" setup>

</script>

<template>
  
</template>

<style lang="scss" scoped>
  
</style>

<!-- <template>
  <ASearch></ASearch>
  <UTable :class="[' max-w-[1000px]', loading && 'pointer-events-none']" :data="withNewRowData"
    :columns="[action].concat(columns)" :loading="loading">
    <template v-for="{ meta, id } in columns" #[`${id}-cell`]="{ row: { original } }">
      <ATagModal v-if="meta.name === 'tags'" v-model="original.tags" @change="update(original)" />
      <ACheck v-else-if="meta.name === 'owned'" v-model="original[meta.name]" @change="update(original)" />
      <ACheck v-else-if="meta.name === 'extra'" v-model="original[meta.name]" @change="update(original)" />
      <ADate v-else-if="meta.name === 'complete_time'" v-model="original[meta.name]" @change="update(original)"
        type="date" />
      <ASelect v-else-if="meta.enums" v-model="original[meta.name]" :enums="meta.enums" :asArray="meta.asArray"
        @change="update(original)" />
      <AText v-else v-model="original[meta.name]" @change="update(original)" />
      <EditCell v-else v-model="original[meta.name]" v-bind="_pick(meta, ['enums', 'asArray'])"
        :always="original === editNewRow" @update="update(original)" />
    </template>
  </UTable>
</template> -->