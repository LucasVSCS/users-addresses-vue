<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"> Nome * </label>
      <input
        :value="formData.name"
        @input="updateField('name', $event.target.value)"
        type="text"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name[0] }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"> Email * </label>
      <input
        :value="formData.email"
        @input="updateField('email', $event.target.value)"
        type="email"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email[0] }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"> CPF * (apenas números) </label>
      <input
        :value="formData.cpf"
        @input="handleCPFInput"
        type="text"
        maxlength="11"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <p v-if="errors.cpf" class="text-red-500 text-xs mt-1">{{ errors.cpf[0] }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"> Perfil * </label>
      <select
        :value="formData.type"
        @change="updateField('type', $event.target.value)"
        class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        <option value="user">Usuário</option>
        <option value="admin">Administrador</option>
      </select>
    </div>
  </div>
</template>

<script setup>
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

const updateField = (field, value) => {
  emit('update:formData', {
    ...props.formData,
    [field]: value,
  })
}

const handleCPFInput = (event) => {
  const formatted = formatCPF(event.target.value)
  updateField('cpf', formatted)
}
</script>
