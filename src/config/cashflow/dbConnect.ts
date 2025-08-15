import mongoose from "mongoose";

const MONGODATABASE_URL = process.env.DATABASE_URL as string;

if (!MONGODATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable in Vercel settings");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODATABASE_URL, {
      bufferCommands: false
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
