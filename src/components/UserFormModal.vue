<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">
          {{ mode === 'create' ? 'Novo Usuário' : 'Editar Usuário' }}
        </h2>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-lg transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <UserFormFields v-model:form-data="localFormData" :errors="errors" />

        <AddressManager
          v-model:selected-addresses="localSelectedAddresses"
          :all-addresses="allAddresses"
        />
      </div>

      <div class="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
        <button
          @click="handleSave"
          :disabled="loading"
          class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {{ loading ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import UserFormFields from './UserFormFields.vue'
import AddressManager from './AddressManager.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'create',
  },
  formData: {
    type: Object,
    default: () => ({}),
  },
  selectedAddresses: {
    type: Array,
    default: () => [],
  },
  allAddresses: {
    type: Array,
    default: () => [],
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

const localFormData = ref({ ...props.formData })
const localSelectedAddresses = ref([...props.selectedAddresses])

watch(
  () => props.formData,
  (newVal) => {
    localFormData.value = { ...newVal }
  },
  { deep: true },
)

watch(
  () => props.selectedAddresses,
  (newVal) => {
    localSelectedAddresses.value = [...newVal]
  },
  { deep: true },
)

const handleSave = () => {
  emit('save', {
    formData: localFormData.value,
    selectedAddresses: localSelectedAddresses.value,
  })
}
</script>
