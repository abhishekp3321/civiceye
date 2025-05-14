import mongoose from "mongoose";
import "dotenv/config";

const url = process.env.MONGOURL;

export async function connectDB() {
  try {
    await mongoose.connect(url);
    console.log("connect to DB");
  } catch (error) {
    console.log("DB error", error);
  }
}