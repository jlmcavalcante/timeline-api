function formatCaseMilestones(marcos) {
  return marcos.map((marco, index) => {
    const { index: _, ...dadosSemIndex } = marco;
    const formatted = {
      ...dadosSemIndex,
      key: (index + 1).toString()
    };
    if (index < marcos.length - 1) {
      formatted.next = (index + 2).toString();
    }
    return formatted;
  });
}

module.exports = formatCaseMilestones;