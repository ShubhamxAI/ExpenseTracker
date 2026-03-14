import * as SQLite from 'expo-sqlite';

const EXPENSE_DATABASE_NAME = 'expense-tracker-starter.db';
const EXPENSE_TABLE_NAME = 'starter_expenses';
const EXPENSE_DATABASE_VERSION = 2;
const LEGACY_SEED_COUNT = 4;

const starterSeedExpenses = [
  {
    id: 'expense-001',
    merchantName: 'Atelier Grocer',
    category: 'Groceries',
    amountLabel: '$84.20',
    spentAt: 'Today, 9:30 AM',
    displayOrder: 1,
  },
  {
    id: 'expense-002',
    merchantName: 'Cedar House Cafe',
    category: 'Dining',
    amountLabel: '$18.50',
    spentAt: 'Today, 8:10 AM',
    displayOrder: 2,
  },
  {
    id: 'expense-003',
    merchantName: 'Northline Car Service',
    category: 'Transport',
    amountLabel: '$42.00',
    spentAt: 'Yesterday, 6:45 PM',
    displayOrder: 3,
  },
  {
    id: 'expense-004',
    merchantName: 'Evergreen Books',
    category: 'Lifestyle',
    amountLabel: '$27.95',
    spentAt: 'Yesterday, 2:15 PM',
    displayOrder: 4,
  },
  {
    id: 'expense-005',
    merchantName: 'Granite Market Hall',
    category: 'Groceries',
    amountLabel: '$36.40',
    spentAt: 'Yesterday, 11:20 AM',
    displayOrder: 5,
  },
  {
    id: 'expense-006',
    merchantName: 'Larkspur Pharmacy',
    category: 'Health',
    amountLabel: '$19.85',
    spentAt: 'Yesterday, 9:05 AM',
    displayOrder: 6,
  },
  {
    id: 'expense-007',
    merchantName: 'Elm Street Fuel',
    category: 'Transport',
    amountLabel: '$51.70',
    spentAt: 'Mar 12, 7:50 PM',
    displayOrder: 7,
  },
  {
    id: 'expense-008',
    merchantName: 'Harbor Bistro',
    category: 'Dining',
    amountLabel: '$23.60',
    spentAt: 'Mar 12, 1:15 PM',
    displayOrder: 8,
  },
  {
    id: 'expense-009',
    merchantName: 'Oak & Ink Stationers',
    category: 'Lifestyle',
    amountLabel: '$14.25',
    spentAt: 'Mar 12, 10:40 AM',
    displayOrder: 9,
  },
  {
    id: 'expense-010',
    merchantName: 'Morning Line Bakery',
    category: 'Dining',
    amountLabel: '$11.90',
    spentAt: 'Mar 11, 8:05 AM',
    displayOrder: 10,
  },
  {
    id: 'expense-011',
    merchantName: 'Willow Transit Pass',
    category: 'Transport',
    amountLabel: '$28.00',
    spentAt: 'Mar 11, 7:15 AM',
    displayOrder: 11,
  },
  {
    id: 'expense-012',
    merchantName: 'Sage Fitness Club',
    category: 'Health',
    amountLabel: '$44.00',
    spentAt: 'Mar 10, 6:30 PM',
    displayOrder: 12,
  },
  {
    id: 'expense-013',
    merchantName: 'Aster Home Goods',
    category: 'Home',
    amountLabel: '$67.35',
    spentAt: 'Mar 10, 3:10 PM',
    displayOrder: 13,
  },
  {
    id: 'expense-014',
    merchantName: 'City Green Produce',
    category: 'Groceries',
    amountLabel: '$29.10',
    spentAt: 'Mar 10, 1:55 PM',
    displayOrder: 14,
  },
  {
    id: 'expense-015',
    merchantName: 'Riviera Dry Cleaners',
    category: 'Lifestyle',
    amountLabel: '$16.75',
    spentAt: 'Mar 9, 5:20 PM',
    displayOrder: 15,
  },
  {
    id: 'expense-016',
    merchantName: 'Northgate Hardware',
    category: 'Home',
    amountLabel: '$39.45',
    spentAt: 'Mar 9, 2:40 PM',
    displayOrder: 16,
  },
  {
    id: 'expense-017',
    merchantName: 'Petal Coffee Roasters',
    category: 'Dining',
    amountLabel: '$9.80',
    spentAt: 'Mar 9, 8:30 AM',
    displayOrder: 17,
  },
  {
    id: 'expense-018',
    merchantName: 'Quarry Books & Paper',
    category: 'Lifestyle',
    amountLabel: '$21.50',
    spentAt: 'Mar 8, 7:00 PM',
    displayOrder: 18,
  },
  {
    id: 'expense-019',
    merchantName: 'Linden Fresh Foods',
    category: 'Groceries',
    amountLabel: '$48.65',
    spentAt: 'Mar 8, 4:25 PM',
    displayOrder: 19,
  },
  {
    id: 'expense-020',
    merchantName: 'Blue Rail Taxi',
    category: 'Transport',
    amountLabel: '$17.20',
    spentAt: 'Mar 8, 9:10 AM',
    displayOrder: 20,
  },
  {
    id: 'expense-021',
    merchantName: 'Fable Flower Shop',
    category: 'Lifestyle',
    amountLabel: '$32.00',
    spentAt: 'Mar 7, 6:15 PM',
    displayOrder: 21,
  },
  {
    id: 'expense-022',
    merchantName: 'Beacon Health Store',
    category: 'Health',
    amountLabel: '$26.30',
    spentAt: 'Mar 7, 12:05 PM',
    displayOrder: 22,
  },
  {
    id: 'expense-023',
    merchantName: 'Summit Tea House',
    category: 'Dining',
    amountLabel: '$13.45',
    spentAt: 'Mar 7, 9:35 AM',
    displayOrder: 23,
  },
  {
    id: 'expense-024',
    merchantName: 'Hearth Linen Co.',
    category: 'Home',
    amountLabel: '$58.90',
    spentAt: 'Mar 6, 5:45 PM',
    displayOrder: 24,
  },
  {
    id: 'expense-025',
    merchantName: 'Metro Card Reload',
    category: 'Transport',
    amountLabel: '$20.00',
    spentAt: 'Mar 6, 8:00 AM',
    displayOrder: 25,
  },
];

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

async function deleteExpenseFromDatabase(expenseId) {
  const database = await initializeExpenseDatabase();

  await database.runAsync(
    `DELETE FROM ${EXPENSE_TABLE_NAME} WHERE id = ?;`,
    expenseId,
  );
}

export {
  deleteExpenseFromDatabase,
  initializeExpenseDatabase,
  loadExpensesFromDatabase,
  starterSeedExpenses,
};
