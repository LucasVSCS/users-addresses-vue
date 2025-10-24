<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"> Nome * </label>
      <input
        v-model="localFormData.name"
        type="text"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name[0] }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"> Email * </label>
      <input
        v-model="localFormData.email"
        type="email"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email[0] }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"> CPF * (apenas números) </label>
      <input
        v-model="localFormData.cpf"
        @input="localFormData.cpf = formatCPF(localFormData.cpf)"
        type="text"
        maxlength="11"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <p v-if="errors.cpf" class="text-red-500 text-xs mt-1">{{ errors.cpf[0] }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"> Perfil * </label>
      <select
        v-model="localFormData.type"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        <option value="user">Usuário</option>
        <option value="admin">Administrador</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormatters } from '../composables/useFormatters'

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:formData'])

const { formatCPF } = useFormatters()

const localFormData = computed({
  get: () => props.formData,
  set: (value) => emit('update:formData', value),
})
</script>
