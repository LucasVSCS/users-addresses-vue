export function useFormatters () {
  /**
   * Formata um valor para o padrão de CPF (xxx.xxx.xxx-xx)
   */
  const formatCPF = value => {
    const cpf = value.replace (/\D/g, '');

    if (cpf.length === 11) {
      return cpf.replace (/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    }
  };

  /**
   * Formata um valor para o padrão de CEP (xxxxx-xxx)
   */
  const formatCEP = value => {
    if (!value) return '';

    let cep = value.replace (/\D/g, '');

    if (cep.length == 8) {
      return (cep = cep.slice (0, 8).replace (/(\d{5})(\d)/, '$1-$2'));
    }
  };

  const formatDate = date => {
    if (!date) return '';

    return new Date (date).toLocaleDateString ('pt-BR', {timeZone: 'UTC'});
  };

  return {
    formatCPF,
    formatCEP,
    formatDate,
  };
}
