<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Nome
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              CPF
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Perfil
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Cadastro
            </th>
            <th
              class="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition">
            <td class="px-4 py-3 text-sm text-gray-900">
              {{ user.nome }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ user.cpf }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ user.email }}
            </td>
            <td class="px-4 py-3 text-sm">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  user.perfil === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700',
                ]"
              >
                {{ user.perfil === 'admin' ? 'Admin' : 'Usuário' }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ formatDate(user.data_cadastro) }}
            </td>
            <td class="px-4 py-3 text-sm">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="$emit('view', user.id)"
                  class="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
                  title="Visualizar"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  @click="$emit('edit', user.id)"
                  class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                  title="Editar"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="$emit('delete', user.id)"
                  class="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                  title="Excluir"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <TablePagination
      v-if="pagination.last_page > 1"
      :pagination="pagination"
      @change-page="$emit('change-page', $event)"
    />
  </div>
</template>

<script setup>
import { useFormatters } from '../composables/useFormatters'
import TablePagination from './TablePagination.vue'

defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  pagination: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['view', 'edit', 'delete', 'change-page'])

const { formatDate } = useFormatters()
</script>
