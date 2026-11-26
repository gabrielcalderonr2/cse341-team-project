import {
  afterAll,
  beforeAll,
  beforeEach,
  inject
} from 'vitest';

import {
  closeDb,
  connectToDb,
  getDb
} from '../src/db/connect.js';

import {
  connectMongoose
} from '../src/db/mongoose.js';

import mongoose from '../src/db/mongoose.js';

import {
  initializeDatabase
} from '../src/db/initialize.js';

const connectionString = inject('MONGODB_TEST_URI');
const databaseName = 'kizuna-rail-test';

beforeAll(async () => {
  await connectToDb({
    connectionString,
    databaseName
  });

  await connectMongoose({
    connectionString,
    databaseName
  });
});

beforeEach(async () => {
  const db = getDb();
  await db.dropDatabase();
  await initializeDatabase(db);
});

afterAll(async () => {
  await mongoose.disconnect();
  await closeDb();
});
