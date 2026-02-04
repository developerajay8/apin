import { error } from "console";
import mongoose from "mongoose";

export async function connect() {
  try {
    const MONGO_URI = process.env.MONGODBS_URI;
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(MONGO_URI);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("mongodb connected successfully");
    });
    connection.on("error", (err) => {
      console.log(
        "mongodb connection error , please make sure db is up and running: " +
          err,
      );
      process.exit();
    });
  } catch (error) {
    console.log("somthing went wrong in connecting to DB");
    console.log(error);
  }
}
