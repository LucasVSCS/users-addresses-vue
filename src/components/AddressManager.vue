<template>
  <div class="border-t pt-4">
    <h3 class="font-semibold text-gray-800 mb-3 text-sm">Endereços</h3>

    <div class="relative mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Buscar ou adicionar endereço
      </label>
      <div class="flex gap-2">
        <div class="flex-1 relative">
          <input
            v-model="searchQuery.street"
            @input="handleSearch"
            type="text"
            placeholder="Digite o nome da rua (mín. 3 caracteres)"
            class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <div
            v-if="suggestions.length > 0 && searchQuery.street.length >= 3"
            class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <button
              v-for="addr in suggestions"
              :key="addr.id"
              @click="selectAddress(addr)"
              class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition border-b last:border-b-0"
            >
              <p class="font-medium text-gray-900">{{ addr.rua }}</p>
              <p class="text-xs text-gray-600">CEP: {{ addr.cep }}</p>
            </button>
          </div>
        </div>

        <input
          v-model="searchQuery.postal_code"
          @input="searchQuery.postal_code = formatCEP(searchQuery.postal_code)"
          type="text"
          placeholder="CEP"
          maxlength="8"
          class="w-32 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <button
          @click="addNewAddress"
          :disabled="!searchQuery.street || !searchQuery.postal_code"
          class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="localAddresses.length > 0" class="space-y-2">
      <label class="block text-xs font-semibold text-gray-500 mb-2">Endereços selecionados</label>
      <div
        v-for="(addr, index) in localAddresses"
        :key="index"
        class="flex items-center justify-between p-3 bg-indigo-50 rounded-lg"
      >
        <div>
          <p class="text-sm font-medium text-gray-900">{{ addr.street || addr.rua }}</p>
          <p class="text-xs text-gray-600">CEP: {{ addr.postal_code || addr.cep }}</p>
        </div>
        <button @click="removeAddress(index)" class="p-1 text-red-600 hover:bg-red-100 rounded">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFormatters } from '../composables/useFormatters'

const props = defineProps({
  selectedAddresses: {
    type: Array,
    default: () => [],
  },
  allAddresses: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:selectedAddresses'])

const { formatCEP } = useFormatters()

const searchQuery = ref({ street: '', postal_code: '' })
const suggestions = ref([])

const localAddresses = computed({
  get: () => props.selectedAddresses,
  set: (value) => emit('update:selectedAddresses', value),
})

const handleSearch = () => {
  const query = searchQuery.value.street.toLowerCase()

  if (query.length >= 3) {
    suggestions.value = props.allAddresses.filter((addr) => addr.rua.toLowerCase().includes(query))
  } else {
    suggestions.value = []
  }
}

const selectAddress = (addr) => {
  const alreadySelected = localAddresses.value.some((selected) => selected.id === addr.id)

  if (!alreadySelected) {
    localAddresses.value = [...localAddresses.value, addr]
  }

  searchQuery.value = { street: '', postal_code: '' }
  suggestions.value = []
}

const addNewAddress = () => {
  if (!searchQuery.value.street || !searchQuery.value.postal_code) return

  const alreadySelected = localAddresses.value.some(
    (addr) =>
      addr.street === searchQuery.value.street &&
      addr.postal_code === searchQuery.value.postal_code,
  )

  if (!alreadySelected) {
    localAddresses.value = [
      ...localAddresses.value,
      {
        street: searchQuery.value.street,
        postal_code: searchQuery.value.postal_code,
        isNew: true,
      },
    ]
  }

  searchQuery.value = { street: '', postal_code: '' }
  suggestions.value = []
}

const removeAddress = (index) => {
  localAddresses.value = localAddresses.value.filter((_, i) => i !== index)
}
</script>
