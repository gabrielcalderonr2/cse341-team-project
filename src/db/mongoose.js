import mongoose from "mongoose";

let connectionPromise;

export async function connectMongoose() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "kizuna-rail",
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
