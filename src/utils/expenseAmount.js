function parseAmountLabelValue(amountLabel = '') {
  const normalizedLabel = String(amountLabel)
    .replace(/,/g, '')
    .replace(/[^0-9.+-]/g, '');

  if (!normalizedLabel) {
    return 0;
  }

  const numericValue = Number.parseFloat(normalizedLabel);

  return Number.isNaN(numericValue) ? 0 : numericValue;
}

function getSignedExpenseAmount(expense = {}) {
  const numericValue = Math.abs(parseAmountLabelValue(expense.amountLabel));

  if (expense.transactionType === 'credit') {
    return -numericValue;
  }

  return numericValue;
}

function formatAmountLabel(amount, transactionType = 'debit') {
  const normalizedAmount = Math.abs(Number(amount) || 0).toFixed(2);

  if (transactionType === 'credit') {
    return `+$${normalizedAmount}`;
  }

  return `$${normalizedAmount}`;
}

export { formatAmountLabel, getSignedExpenseAmount, parseAmountLabelValue };
