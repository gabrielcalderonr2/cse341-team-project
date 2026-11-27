import trips from './seeds/trips.json' with { type: 'json' };
import schedules from './seeds/schedules.json' with { type: 'json' };
import stations from './seeds/stations.json' with { type: 'json' };
import ticketClasses from './seeds/ticket-classes.json' with { type: 'json' };
import trains from './seeds/trains.json' with { type: 'json' };

const starterCollections = [
  ['trips', trips],
  ['schedules', schedules],
  ['stations', stations],
  ['ticketClasses', ticketClasses],
  ['trains', trains]
];

const initializeDatabase = async (db) => {
  if (!db) {
    throw new Error('A database connection is required to initialize data.');
  }

  for (const [collectionName, documents] of starterCollections) {
    const collection = db.collection(collectionName);
    await collection.deleteMany({});
    await collection.insertMany(documents);
  }

  // Initialize standard user roles without deleting existing roles.
  const roles = db.collection('roles');
  const now = new Date();

  for (const name of ['admin', 'user']) {
    await roles.updateOne(
      { name },
      {
        $setOnInsert: {
          name,
          createdAt: now,
          updatedAt: now
        }
      },
      { upsert: true }
    );
  }

  const bookings = db.collection('bookings');
  await bookings.createIndex({ id: 1 }, { unique: true });
};

export { initializeDatabase, starterCollections };