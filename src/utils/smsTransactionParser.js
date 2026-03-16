const amountPattern =
  /(?:INR|Rs\.?|₹)\s*([0-9,]+(?:\.\d{1,2})?)|([0-9,]+(?:\.\d{1,2})?)\s*(?:INR|Rs\.?|₹)/i;

const debitMerchantPatterns = [
  /\bat\s+([A-Za-z0-9&.,'\-\s]{2,60}?)(?:\s+on\b|\s+txn\b|\.|,|$)/i,
  /\bto\s+([A-Za-z0-9&.,'\-\s]{2,60}?)(?:\s+on\b|\s+ref\b|\.|,|$)/i,
  /\btowards\s+([A-Za-z0-9&.,'\-\s]{2,60}?)(?:\s+on\b|\.|,|$)/i,
];

const creditSourcePatterns = [
  /\bfrom\s+([A-Za-z0-9&.,'\-\s]{2,60}?)(?:\s+on\b|\s+ref\b|\.|,|$)/i,
  /\bby\s+([A-Za-z0-9&.,'\-\s]{2,60}?)(?:\s+on\b|\s+ref\b|\.|,|$)/i,
  /\bvia\s+([A-Za-z0-9&.,'\-\s]{2,60}?)(?:\s+on\b|\.|,|$)/i,
];

function normalizeEntityName(entityName = '') {
  return entityName
    .replace(/\s+/g, ' ')
    .replace(/^(upi|card|acct|a\/c)\s+/i, '')
    .replace(/\b(avl|bal|utr|ref|info|txn)\b.*$/i, '')
    .replace(/[.,;:]+$/g, '')
    .trim();
}

function extractAmount(messageText = '') {
  const amountMatch = messageText.match(amountPattern);

  if (!amountMatch) {
    return null;
  }

  const amountValue = amountMatch[1] || amountMatch[2] || '';
  const normalizedAmount = Number.parseFloat(amountValue.replace(/,/g, ''));

  return Number.isNaN(normalizedAmount) ? null : normalizedAmount;
}

function detectTransactionType(messageText = '') {
  if (/\b(credited|credit|received|deposit(ed)?|salary)\b/i.test(messageText)) {
    return 'credit';
  }

  if (/\b(debited|spent|paid|purchase|withdrawn|sent)\b/i.test(messageText)) {
    return 'debit';
  }

  return null;
}

function extractCounterparty(
  messageText = '',
  transactionType = 'debit',
  sender = '',
) {
  const patterns =
    transactionType === 'credit' ? creditSourcePatterns : debitMerchantPatterns;

  const matchedEntityName = patterns
    .map((pattern) => messageText.match(pattern)?.[1] || '')
    .map((entityName) => normalizeEntityName(entityName))
    .find(Boolean);

  if (matchedEntityName) {
    return matchedEntityName;
  }

  return (
    normalizeEntityName(sender) ||
    (transactionType === 'credit' ? 'Bank Credit' : 'Card Payment')
  );
}

function inferCategory(counterparty = '', transactionType = 'debit') {
  if (transactionType === 'credit') {
    return 'Credit';
  }

  if (
    /(cafe|coffee|bistro|bakery|swiggy|zomato|deli|tea)/i.test(counterparty)
  ) {
    return 'Dining';
  }

  if (/(taxi|uber|ola|metro|transit|rail|fuel|petrol)/i.test(counterparty)) {
    return 'Transport';
  }

  if (/(pharmacy|health|clinic|wellness|fitness)/i.test(counterparty)) {
    return 'Health';
  }

  if (/(market|grocer|fresh|produce|mart|grocery)/i.test(counterparty)) {
    return 'Groceries';
  }

  if (/(linen|home|hardware|garden)/i.test(counterparty)) {
    return 'Home';
  }

  return 'Lifestyle';
}

function parseBankSmsMessage(messageText = '', { sender } = {}) {
  const normalizedMessageText = String(messageText).trim();

  if (!normalizedMessageText) {
    return null;
  }

  const transactionType = detectTransactionType(normalizedMessageText);
  const amount = extractAmount(normalizedMessageText);

  if (!transactionType || amount === null) {
    return null;
  }

  const merchantName = extractCounterparty(
    normalizedMessageText,
    transactionType,
    sender,
  );
  const category = inferCategory(merchantName, transactionType);

  return {
    transactionType,
    merchantName,
    category,
    amount,
    sourceMessage: normalizedMessageText,
  };
}

export { parseBankSmsMessage };
