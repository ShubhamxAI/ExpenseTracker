import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

function escapeCsvValue(value) {
  const stringValue = String(value ?? '');
  const escapedValue = stringValue.replace(/"/g, '""');

  return `"${escapedValue}"`;
}

function createCsvContents(expenses = []) {
  const headerRow = ['Type', 'Merchant', 'Category', 'Amount', 'Time'];
  const dataRows = expenses.map((expense) => [
    expense.transactionType === 'credit' ? 'Credit' : 'Debit',
    expense.merchantName,
    expense.category,
    expense.amountLabel,
    expense.spentAt,
  ]);

  return [headerRow, ...dataRows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n');
}

async function exportExpensesCsv(expenses = []) {
  const exportFile = new File(
    Paths.document,
    `expense-tracker-export-${Date.now()}.csv`,
  );
  const csvContents = createCsvContents(expenses);

  exportFile.write(csvContents);

  const shareAvailable = await Sharing.isAvailableAsync();

  if (shareAvailable) {
    await Sharing.shareAsync(exportFile.uri, {
      dialogTitle: 'Export expenses CSV',
      mimeType: 'text/csv',
      UTI: 'public.comma-separated-values-text',
    });
  }

  return exportFile.uri;
}

export { exportExpensesCsv };
