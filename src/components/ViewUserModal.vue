<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Detalhes do Usuário</h2>
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

      <div v-if="user" class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Nome</label>
            <p class="text-sm text-gray-900 break-words">{{ user.nome }}</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Email</label>
            <p class="text-sm text-gray-900 break-words">{{ user.email }}</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">CPF</label>
            <p class="text-sm text-gray-900">{{ formatCPFDisplay(user.cpf) }}</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Perfil</label>
            <span
              :class="[
                'inline-block px-2 py-1 rounded-full text-xs font-medium',
                user.perfil === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700',
              ]"
            >
              {{ user.perfil === 'admin' ? 'Administrador' : 'Usuário' }}
            </span>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Data de Cadastro</label>
            <p class="text-sm text-gray-900">{{ formatDate(user.data_cadastro) }}</p>
          </div>
        </div>

        <div v-if="user.enderecos && user.enderecos.length > 0" class="border-t pt-4">
          <label class="block text-xs font-semibold text-gray-500 mb-3">Endereços</label>
          <div class="space-y-2">
            <div v-for="addr in user.enderecos" :key="addr.id" class="p-3 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-900">{{ addr.rua }}</p>
              <p class="text-xs text-gray-600">CEP: {{ formatCEPDisplay(addr.cep) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="border-t pt-4">
          <label class="block text-xs font-semibold text-gray-500 mb-2">Endereços</label>
          <p class="text-sm text-gray-400">Nenhum endereço cadastrado</p>
        </div>
      </div>

      <div class="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end border-t">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFormatters } from '../composables/useFormatters'

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: null,
  },
})

defineEmits(['close'])

const { formatDate, formatCPFDisplay, formatCEPDisplay } = useFormatters()
</script>
