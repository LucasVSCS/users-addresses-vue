export function useFormatters () {
  const formatCPF = value => {
    if (!value) return '';
    const cpf = value.replace (/\D/g, '').slice (0, 11);
    return cpf;
  };

  const formatCPFDisplay = value => {
    if (!value) return '';
    const cpf = value.replace (/\D/g, '');

    if (cpf.length === 11) {
      return cpf.replace (/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    }
    return cpf;
  };

  const formatCEP = value => {
    if (!value) return '';
    const cep = value.replace (/\D/g, '').slice (0, 8);
    return cep;
  };

  const formatCEPDisplay = value => {
    if (!value) return '';
    const cep = value.replace (/\D/g, '');

    if (cep.length === 8) {
      return cep.replace (/(\d{5})(\d{3})/, '$1-$2');
    }
    return cep;
  };

  const formatDate = date => {
    if (!date) return '';
    return new Date (date).toLocaleDateString ('pt-BR', {timeZone: 'UTC'});
  };

  return {
    formatCPF,
    formatCPFDisplay,
    formatCEP,
    formatCEPDisplay,
    formatDate,
  };
}
