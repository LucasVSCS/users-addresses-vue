<template>
  <div class="bg-white rounded-lg shadow-md p-3 mb-4">
    <div class="flex flex-wrap gap-2 items-center justify-between">
      <div class="flex gap-2">
        <button
          @click="$emit('new-user')"
          class="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Novo Usuário
        </button>

        <button
          @click="showFilters = !showFilters"
          class="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtros
        </button>
      </div>

      <div class="text-sm text-gray-600">Total: {{ total }} usuários</div>
    </div>

    <div
      v-if="showFilters"
      class="mt-3 pt-3 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
    >
      <input
        v-model="localFilters.name"
        type="text"
        placeholder="Buscar por nome"
        class="px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      <input
        v-model="localFilters.cpf"
        @input="localFilters.cpf = formatCPF(localFilters.cpf)"
        type="text"
        placeholder="Buscar por CPF"
        maxlength="11"
        class="px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      <input
        v-model="localFilters.created_after"
        type="date"
        placeholder="Criado após"
        class="px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      <input
        v-model="localFilters.created_before"
        type="date"
        placeholder="Criado antes"
        class="px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      <div class="col-span-full flex gap-2">
        <button
          @click="applyFilters"
          class="bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition text-sm"
        >
          Aplicar Filtros
        </button>
        <button
          @click="clearFilters"
          class="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition text-sm"
        >
          Limpar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useFormatters } from '../composables/useFormatters'

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['new-user', 'apply-filters', 'clear-filters'])

const { formatCPF } = useFormatters()
const showFilters = ref(false)
const localFilters = reactive({
  name: '',
  cpf: '',
  created_after: '',
  created_before: '',
})

const applyFilters = () => {
  emit('apply-filters', { ...localFilters })
  showFilters.value = false
}

const clearFilters = () => {
  localFilters.name = ''
  localFilters.cpf = ''
  localFilters.created_after = ''
  localFilters.created_before = ''
  emit('clear-filters')
}
</script>
