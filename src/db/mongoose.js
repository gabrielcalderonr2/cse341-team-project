import mongoose from "mongoose";

let connectionPromise;

export async function connectMongoose(options = {}) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    const connectionString =
      options.connectionString || process.env.MONGODB_URI;

    const databaseName =
      options.databaseName ||
      process.env.MONGODB_DB_NAME ||
      "kizuna-rail";

    if (!connectionString) {
      throw new Error("MONGODB_URI is required.");
    }

    connectionPromise = mongoose.connect(connectionString, {
      dbName: databaseName,
    });
  }

  try {
    await connectionPromise;
    console.log("Mongoose connected to MongoDB.");
    return mongoose.connection;
  } catch (error) {
    connectionPromise = undefined;
    throw error;
  }
}

export default mongoose;
