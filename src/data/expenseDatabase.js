import * as SQLite from 'expo-sqlite';

const EXPENSE_DATABASE_NAME = 'expense-tracker-starter.db';
const EXPENSE_TABLE_NAME = 'starter_expenses';
const BUDGET_TABLE_NAME = 'starter_budget';
const EXPENSE_DATABASE_VERSION = 5;
const LEGACY_SEED_COUNT = 4;

const generatedExpenseMerchants = [
  'Atelier Grocer',
  'Cedar House Cafe',
  'Northline Car Service',
  'Evergreen Books',
  'Granite Market Hall',
  'Larkspur Pharmacy',
  'Harbor Bistro',
  'Oak & Ink Stationers',
  'Morning Line Bakery',
  'Willow Transit Pass',
  'Sage Fitness Club',
  'Aster Home Goods',
  'City Green Produce',
  'Riviera Dry Cleaners',
  'Northgate Hardware',
  'Petal Coffee Roasters',
  'Quarry Books & Paper',
  'Linden Fresh Foods',
  'Blue Rail Taxi',
  'Fable Flower Shop',
  'Beacon Health Store',
  'Summit Tea House',
  'Hearth Linen Co.',
  'Metro Card Reload',
  'Crescent Market',
  'Rosemary Deli',
  'Harbor Fuel Stop',
  'Elm Garden Supplies',
  'Verde Wellness',
  'Pine Street Bakery',
];

const generatedCategories = [
  'Groceries',
  'Dining',
  'Transport',
  'Lifestyle',
  'Health',
  'Home',
];

const generatedTimeSlots = [
  { hours: 8, minutes: 10 },
  { hours: 9, minutes: 5 },
  { hours: 11, minutes: 25 },
  { hours: 12, minutes: 45 },
  { hours: 13, minutes: 35 },
  { hours: 16, minutes: 10 },
  { hours: 17, minutes: 40 },
  { hours: 18, minutes: 20 },
  { hours: 19, minutes: 15 },
  { hours: 20, minutes: 5 },
];

function formatExpenseDateLabel(date) {
  const monthLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const hours = date.getHours();
  const hour12 = hours % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridiem = hours >= 12 ? 'PM' : 'AM';

  return `${monthLabels[date.getMonth()]} ${date.getDate()}, ${hour12}:${minutes} ${meridiem}`;
}

function createRecentDateLabel(index) {
  const date = new Date();
  const timeSlot = generatedTimeSlots[index % generatedTimeSlots.length];
  const dayOffset = index % 28;

  date.setDate(date.getDate() - dayOffset);
  date.setHours(timeSlot.hours, timeSlot.minutes, 0, 0);

  return formatExpenseDateLabel(date);
}

function createGeneratedExpense(baseIndex, displayOrder, idPrefix = 'expense') {
  const merchantName =
    generatedExpenseMerchants[baseIndex % generatedExpenseMerchants.length];
  const category = generatedCategories[baseIndex % generatedCategories.length];
  const cents = ((baseIndex * 7) % 10) * 0.1 + ((baseIndex + 3) % 10) * 0.01;
  const dollars = 9 + ((baseIndex * 13) % 74);
  const amountLabel = `$${(dollars + cents).toFixed(2)}`;
  const spentAt = createRecentDateLabel(baseIndex);

  return {
    id: `${idPrefix}-${String(displayOrder).padStart(3, '0')}-${baseIndex}`,
    merchantName,
    category,
    amountLabel,
    spentAt,
    displayOrder,
  };
}

function createDynamicSeedExpenses() {
  return Array.from({ length: 95 }, (_, index) =>
    createGeneratedExpense(index, index + 1),
  );
}

const starterSeedExpenses = createDynamicSeedExpenses();

let databasePromise;

function getExpenseDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(EXPENSE_DATABASE_NAME);
  }

  return databasePromise;
}

async function insertSeedExpenses(database, expensesToInsert) {
  await database.withTransactionAsync(async () => {
    await Promise.all(
      expensesToInsert.map((expense) =>
        database.runAsync(
          `INSERT OR IGNORE INTO ${EXPENSE_TABLE_NAME} (
          id,
          merchant_name,
          category,
          amount_label,
          spent_at,
          display_order
        ) VALUES (?, ?, ?, ?, ?, ?);`,
          expense.id,
          expense.merchantName,
          expense.category,
          expense.amountLabel,
          expense.spentAt,
          expense.displayOrder,
        ),
      ),
    );
  });
}

async function getDatabaseVersion(database) {
  const versionRow = await database.getFirstAsync('PRAGMA user_version;');

  return Number(versionRow?.user_version || 0);
}

async function setDatabaseVersion(database, nextVersion) {
  await database.execAsync(`PRAGMA user_version = ${nextVersion};`);
}

async function initializeExpenseDatabase() {
  const database = await getExpenseDatabase();

  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS ${EXPENSE_TABLE_NAME} (
      id TEXT PRIMARY KEY NOT NULL,
      merchant_name TEXT NOT NULL,
      category TEXT NOT NULL,
      amount_label TEXT NOT NULL,
      spent_at TEXT NOT NULL,
      display_order INTEGER NOT NULL
    );`,
  );

  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS ${BUDGET_TABLE_NAME} (
      id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
      amount REAL NOT NULL
    );`,
  );

  const existingExpenseCount = await database.getFirstAsync(
    `SELECT COUNT(*) AS count FROM ${EXPENSE_TABLE_NAME};`,
  );
  const databaseVersion = await getDatabaseVersion(database);
  const currentExpenseCount = Number(existingExpenseCount?.count || 0);

  if (currentExpenseCount === 0) {
    await insertSeedExpenses(database, starterSeedExpenses);
    await setDatabaseVersion(database, EXPENSE_DATABASE_VERSION);
  } else if (databaseVersion < EXPENSE_DATABASE_VERSION) {
    await insertSeedExpenses(
      database,
      starterSeedExpenses.filter(
        (expense) => expense.displayOrder > LEGACY_SEED_COUNT,
      ),
    );
    await setDatabaseVersion(database, EXPENSE_DATABASE_VERSION);
  } else if (currentExpenseCount < starterSeedExpenses.length) {
    await insertSeedExpenses(database, starterSeedExpenses);
    await setDatabaseVersion(database, EXPENSE_DATABASE_VERSION);
  }

  return database;
}

async function loadExpensesFromDatabase() {
  const database = await initializeExpenseDatabase();
  const storedExpenses = await database.getAllAsync(
    `SELECT
      id,
      merchant_name AS merchantName,
      category,
      amount_label AS amountLabel,
      spent_at AS spentAt,
      display_order AS displayOrder
    FROM ${EXPENSE_TABLE_NAME}
    ORDER BY display_order ASC;`,
  );

  return storedExpenses;
}

async function addExpenseToDatabase({ merchantName, category, amount } = {}) {
  const database = await initializeExpenseDatabase();
  const nextDisplayOrderRow = await database.getFirstAsync(
    `SELECT MAX(display_order) AS maxDisplayOrder FROM ${EXPENSE_TABLE_NAME};`,
  );
  const nextDisplayOrder =
    Number(nextDisplayOrderRow?.maxDisplayOrder || 0) + 1;
  const normalizedAmountLabel = `$${Number(amount).toFixed(2)}`;
  const now = new Date();
  const nextExpense = {
    id: `expense-${now.getTime()}`,
    merchantName: merchantName.trim(),
    category: category.trim(),
    amountLabel: normalizedAmountLabel,
    spentAt: formatExpenseDateLabel(now),
    displayOrder: nextDisplayOrder,
  };

  await database.runAsync(
    `INSERT INTO ${EXPENSE_TABLE_NAME} (
      id,
      merchant_name,
      category,
      amount_label,
      spent_at,
      display_order
    ) VALUES (?, ?, ?, ?, ?, ?);`,
    nextExpense.id,
    nextExpense.merchantName,
    nextExpense.category,
    nextExpense.amountLabel,
    nextExpense.spentAt,
    nextExpense.displayOrder,
  );

  return nextExpense;
}

async function deleteExpenseFromDatabase(expenseId) {
  const database = await initializeExpenseDatabase();

  await database.runAsync(
    `DELETE FROM ${EXPENSE_TABLE_NAME} WHERE id = ?;`,
    expenseId,
  );
}

export {
  addExpenseToDatabase,
  deleteExpenseFromDatabase,
  formatExpenseDateLabel,
  initializeExpenseDatabase,
  loadBudgetFromDatabase,
  loadExpensesFromDatabase,
  starterSeedExpenses,
  upsertBudgetInDatabase,
};

async function loadBudgetFromDatabase() {
  const database = await initializeExpenseDatabase();
  const budgetRow = await database.getFirstAsync(
    `SELECT amount FROM ${BUDGET_TABLE_NAME} WHERE id = 1;`,
  );

  return budgetRow?.amount ?? null;
}

async function upsertBudgetInDatabase(amount) {
  const database = await initializeExpenseDatabase();

  await database.runAsync(
    `INSERT INTO ${BUDGET_TABLE_NAME} (id, amount)
     VALUES (1, ?)
     ON CONFLICT(id) DO UPDATE SET amount = excluded.amount;`,
    amount,
  );

  return amount;
}
