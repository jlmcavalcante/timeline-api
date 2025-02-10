function formatDateToDDMMYYYY(dataStr) {
  // Divide a string em partes.
  const partes = dataStr.split('-');
  const ano = partes[0];
  const mes = partes[1];
  const dia = partes[2];
  
  return `${dia}/${mes}/${ano}`;
}

module.exports = formatDateToDDMMYYYY;