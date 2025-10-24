<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto p-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-1">Gerenciamento de Usuários</h1>
        <p class="text-sm text-gray-600">Sistema de cadastro e gestão</p>
      </div>

      <UserFilters
        :total="pagination.total"
        @new-user="openCreateModal"
        @apply-filters="applyFilters"
        @clear-filters="clearFilters"
      />

      <UserTable
        :users="users"
        :pagination="pagination"
        :loading="loading"
        @view="openViewModal"
        @edit="openEditModal"
        @delete="handleDeleteUser"
        @change-page="loadUsers"
      />
    </div>

    <ViewUserModal :show="showViewModal" :user="viewUser" @close="showViewModal = false" />

    <UserFormModal
      :show="showFormModal"
      :mode="modalMode"
      :form-data="formData"
      :selected-addresses="selectedAddresses"
      :all-addresses="addresses"
      :errors="errors"
      :loading="loading"
      @close="closeFormModal"
      @save="saveUser"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApi } from './composables/useApi'
import UserFilters from './components/UserFilters.vue'
import UserTable from './components/UserTable.vue'
import ViewUserModal from './components/ViewUserModal.vue'
import UserFormModal from './components/UserFormModal.vue'

const api = useApi()

const users = ref([])
const addresses = ref([])
const showViewModal = ref(false)
const showFormModal = ref(false)
const modalMode = ref('create')
const currentUser = ref(null)
const viewUser = ref(null)
const selectedAddresses = ref([])
const errors = ref({})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  from: 0,
  to: 0,
  per_page: 15,
})

const filters = ref({
  name: '',
  cpf: '',
  created_after: '',
  created_before: '',
})

const formData = ref({
  name: '',
  email: '',
  cpf: '',
  type: 'user',
})

const loading = computed(() => api.loading.value)

const loadUsers = async (page = 1) => {
  try {
    const data = await api.fetchUsers(page, filters.value)
    users.value = data.data || []
    pagination.value = {
      current_page: data.meta.current_page,
      last_page: data.meta.last_page,
      total: data.meta.total,
      from: data.meta.from,
      to: data.meta.to,
      per_page: data.meta.per_page,
    }
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  }
}

const loadAddresses = async () => {
  try {
    const data = await api.fetchAddresses()
    addresses.value = data || []
  } catch (error) {
    console.error('Erro ao carregar endereços:', error)
  }
}

const applyFilters = (newFilters) => {
  filters.value = { ...newFilters }
  loadUsers(1)
}

const clearFilters = () => {
  filters.value = {
    name: '',
    cpf: '',
    created_after: '',
    created_before: '',
  }
  loadUsers(1)
}

const openCreateModal = () => {
  modalMode.value = 'create'
  currentUser.value = null
  formData.value = {
    name: '',
    email: '',
    cpf: '',
    type: 'user',
  }
  selectedAddresses.value = []
  errors.value = {}
  showFormModal.value = true
}

const openViewModal = async (userId) => {
  try {
    const data = await api.fetchUser(userId)
    viewUser.value = data.data
    showViewModal.value = true
  } catch (error) {
    console.error('Erro ao visualizar usuário:', error)
  }
}

const openEditModal = async (userId) => {
  try {
    const data = await api.fetchUser(userId)

    modalMode.value = 'edit'
    currentUser.value = data
    formData.value = {
      name: data.nome,
      email: data.email,
      cpf: data.cpf,
      type: data.perfil,
    }

    selectedAddresses.value =
      data.enderecos?.map((addr) => ({
        id: addr.id,
        rua: addr.rua,
        cep: addr.cep,
        isNew: false,
      })) || []

    errors.value = {}
    showFormModal.value = true
  } catch (error) {
    console.error('Erro ao editar usuário:', error)
  }
}

const closeFormModal = () => {
  showFormModal.value = false
  errors.value = {}
}

const saveUser = async ({ formData: userData, selectedAddresses: addresses }) => {
  errors.value = {}

  try {
    const payload = {
      name: userData.name,
      email: userData.email,
      cpf: userData.cpf,
      type: userData.type,
      existing_addresses: addresses.filter((addr) => !addr.isNew && addr.id).map((addr) => addr.id),
      new_addresses: addresses
        .filter((addr) => addr.isNew)
        .map((addr) => ({
          street: addr.street,
          postal_code: addr.postal_code,
        })),
    }

    if (modalMode.value === 'create') {
      await api.createUser(payload)
    } else {
      await api.updateUser(currentUser.value.id, payload)
    }

    showFormModal.value = false
    loadUsers(pagination.value.current_page)
    loadAddresses()
  } catch (error) {
    if (error.errors) {
      errors.value = error.errors
    }
  }
}

const handleDeleteUser = async (userId) => {
  if (!confirm('Deseja realmente excluir este usuário?')) return

  try {
    await api.deleteUser(userId)
    loadUsers(pagination.value.current_page)
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
  }
}

onMounted(() => {
  loadUsers()
  loadAddresses()
})
</script>
