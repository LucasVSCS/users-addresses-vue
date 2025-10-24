export function useFormatters () {
  const formatCPF = value => {
    return value.replace(/\D/g, '').slice(0, 11)
  }

  const formatCEP = value => {
    return value.replace(/\D/g, '').slice(0, 8)
  }

  const formatDate = date => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  return {
    formatCPF,
    formatCEP,
    formatDate
  }
}
