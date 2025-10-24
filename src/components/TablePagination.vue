<template>
  <div class="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
    <div class="text-sm text-gray-600">
      Exibindo {{ pagination.from }} a {{ pagination.to }} de {{ pagination.total }} registros
    </div>
    <div class="flex gap-1">
      <button
        @click="$emit('change-page', pagination.current_page - 1)"
        :disabled="pagination.current_page === 1"
        class="px-3 py-1 rounded text-sm transition bg-white text-gray-700 hover:bg-gray-100 border disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &laquo; Anterior
      </button>

      <button
        v-for="(page, index) in pageNumbers"
        :key="index"
        @click="page !== '...' && $emit('change-page', page)"
        :disabled="page === '...'"
        :class="[
          'px-3 py-1 rounded text-sm transition',
          page === pagination.current_page
            ? 'bg-indigo-600 text-white'
            : page === '...'
              ? 'bg-white text-gray-700 cursor-default'
              : 'bg-white text-gray-700 hover:bg-gray-100 border',
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="$emit('change-page', pagination.current_page + 1)"
        :disabled="pagination.current_page === pagination.last_page"
        class="px-3 py-1 rounded text-sm transition bg-white text-gray-700 hover:bg-gray-100 border disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próxima &raquo;
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePagination } from '../composables/usePagination'

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
})

defineEmits(['change-page'])

const { getPageNumbers } = usePagination()

const pageNumbers = computed(() =>
  getPageNumbers(props.pagination.current_page, props.pagination.last_page),
)
</script>
