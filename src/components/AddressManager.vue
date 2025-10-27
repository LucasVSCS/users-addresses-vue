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
            @input="handleSearchInput"
            type="text"
            placeholder="Digite o nome da rua (mín. 4 caracteres)"
            class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <!-- Loading indicator -->
          <div v-if="searching" class="absolute right-3 top-1/2 -translate-y-1/2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          </div>

          <!-- Dropdown de sugestões -->
          <div
            v-if="suggestions.length > 0 && showSuggestions"
            class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <button
              v-for="addr in suggestions"
              :key="addr.id"
              @click="selectAddress(addr)"
              type="button"
              class="w-full px-3 py-2 text-left text-sm hover:bg-indigo-50 transition border-b last:border-b-0"
            >
              <p class="font-medium text-gray-900">{{ addr.rua }}</p>
              <p class="text-xs text-gray-600">CEP: {{ addr.cep }}</p>
            </button>
          </div>

          <!-- Mensagem quando não há resultados -->
          <div
            v-if="
              searchQuery.street.length >= 4 &&
              suggestions.length === 0 &&
              !searching &&
              hasSearched
            "
            class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg p-3"
          >
            <p class="text-sm text-gray-600">
              Nenhum endereço encontrado. Preencha o CEP para adicionar um novo.
            </p>
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
          @click="addAddress"
          :disabled="!canAddAddress"
          type="button"
          class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Adicionar endereço"
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

      <p class="text-xs text-gray-500 mt-1">
        Digite pelo menos 4 caracteres para buscar endereços existentes
      </p>
    </div>

    <!-- Lista de endereços selecionados -->
    <div v-if="localAddresses.length > 0" class="space-y-2">
      <label class="block text-xs font-semibold text-gray-500 mb-2">
        Endereços selecionados ({{ localAddresses.length }})
      </label>
      <div
        v-for="(addr, index) in localAddresses"
        :key="index"
        class="flex items-center justify-between p-3 rounded-lg"
        :class="
          addr.isNew
            ? 'bg-green-50 border border-green-200'
            : 'bg-indigo-50 border border-indigo-200'
        "
      >
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm font-medium text-gray-900">{{ addr.street || addr.rua }}</p>
            <span
              v-if="addr.isNew"
              class="px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full font-medium"
            >
              Novo
            </span>
            <span
              v-else
              class="px-2 py-0.5 bg-indigo-200 text-indigo-800 text-xs rounded-full font-medium"
            >
              Existente
            </span>
          </div>
          <p class="text-xs text-gray-600">
            CEP: {{ formatCEPDisplay(addr.postal_code) || formatCEPDisplay(addr.cep) }}
          </p>
        </div>
        <button
          @click="removeAddress(index)"
          type="button"
          class="p-1.5 text-red-600 hover:bg-red-100 rounded transition"
          title="Remover endereço"
        >
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

    <!-- Mensagem quando não há endereços -->
    <div
      v-else
      class="text-center py-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
    >
      <svg
        class="w-8 h-8 mx-auto text-gray-400 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <p class="text-sm text-gray-500">Nenhum endereço adicionado</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFormatters } from '../composables/useFormatters'
import { useApi } from '../composables/useApi'

const props = defineProps({
  selectedAddresses: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:selectedAddresses'])

const { formatCEP, formatCEPDisplay } = useFormatters()
const { searchAddresses } = useApi()

const searchQuery = ref({ street: '', postal_code: '' })
const suggestions = ref([])
const searching = ref(false)
const showSuggestions = ref(false)
const hasSearched = ref(false)
let searchTimeout = null

const localAddresses = computed({
  get: () => props.selectedAddresses,
  set: (value) => emit('update:selectedAddresses', value),
})

const canAddAddress = computed(() => {
  return searchQuery.value.street.trim() !== '' && searchQuery.value.postal_code.trim() !== ''
})

// Fecha sugestões ao clicar fora
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showSuggestions.value = false
  }
}

// Adiciona listener quando o componente é montado
if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside)
}

const handleSearchInput = () => {
  const query = searchQuery.value.street.trim()

  // Limpa o timeout anterior
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Reseta estados
  hasSearched.value = false

  // Se menos de 4 caracteres, limpa sugestões
  if (query.length < 4) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }

  // Aguarda 500ms após parar de digitar para fazer a busca
  searchTimeout = setTimeout(async () => {
    await performSearch(query)
  }, 500)
}

const performSearch = async (query) => {
  searching.value = true
  showSuggestions.value = false

  try {
    const data = await searchAddresses(query)
    suggestions.value = data.data || data || []
    hasSearched.value = true

    if (suggestions.value.length > 0) {
      showSuggestions.value = true
    }
  } catch (error) {
    console.error('Erro ao buscar endereços:', error)
    suggestions.value = []
  } finally {
    searching.value = false
  }
}

const selectAddress = (addr) => {
  // Verifica se já foi selecionado
  const alreadySelected = localAddresses.value.some(
    (selected) =>
      selected.id === addr.id || (selected.rua === addr.rua && selected.cep === addr.cep),
  )

  if (alreadySelected) {
    alert('Este endereço já foi adicionado!')
    return
  }

  // Adiciona endereço existente
  localAddresses.value = [
    ...localAddresses.value,
    {
      id: addr.id,
      rua: addr.rua,
      cep: addr.cep,
      isNew: false,
    },
  ]

  // Limpa campos
  searchQuery.value = { street: '', postal_code: '' }
  suggestions.value = []
  showSuggestions.value = false
  hasSearched.value = false
}

const addAddress = () => {
  if (!canAddAddress.value) return

  const street = searchQuery.value.street.trim()
  const postalCode = searchQuery.value.postal_code.trim()

  if (postalCode.length !== 8) {
    return alert('CEP do endereço a ser adicionado deve conter 8 dígitos!')
  }

  // Verifica se já foi adicionado
  const alreadySelected = localAddresses.value.some(
    (addr) =>
      (addr.street === street || addr.rua === street) &&
      (addr.postal_code === postalCode || addr.cep === postalCode),
  )

  if (alreadySelected) {
    alert('Este endereço já foi adicionado!')
    return
  }

  // Adiciona novo endereço
  localAddresses.value = [
    ...localAddresses.value,
    {
      street: street,
      postal_code: postalCode,
      isNew: true,
    },
  ]

  // Limpa campos
  searchQuery.value = { street: '', postal_code: '' }
  suggestions.value = []
  showSuggestions.value = false
  hasSearched.value = false
}

const removeAddress = (index) => {
  localAddresses.value = localAddresses.value.filter((_, i) => i !== index)
}

// Limpa timeout quando o componente é desmontado
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    window.removeEventListener('click', handleClickOutside)
  })
}
</script>
