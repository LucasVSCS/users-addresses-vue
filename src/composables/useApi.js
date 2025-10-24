import { ref } from 'vue'

export function useApi () {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const loading = ref(false)

  const fetchUsers = async (page = 1, filters = {}) => {
    loading.value = true
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      })

      const response = await fetch(`${API_BASE_URL}/users?${queryParams}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async userId => {
    loading.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createUser = async userData => {
    loading.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw errorData
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (userId, userData) => {
    loading.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw errorData
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async userId => {
    loading.value = true
    try {
      await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/addresses`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao carregar endereços:', error)
      throw error
    }
  }

  return {
    loading,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    fetchAddresses
  }
}
