import mongoose from "mongoose";

mongoose.connection.on("connected", () => {
  console.log("Database Connected");
});

const connectDB = async () => {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) {
    console.error(
      "MONGODB_URI is not set. Please add it to your server .env (e.g. mongodb://localhost:27017 or your Atlas URI)."
    );
    return;
  }

  const dbName = "PROJECT_ECOM_DB";
  const fullUri = `${baseUri.replace(/\/$/, "")}/${dbName}`;

  try {
    // Provide a short serverSelectionTimeoutMS so failures show quickly
    await mongoose.connect(fullUri, {
      serverSelectionTimeoutMS: 10000, // 10s
    });
    console.log(`Connected to MongoDB: ${fullUri.split("@").pop()}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message || error);
    // do not exit process here so the server can show the error in logs
  }
};

export default connectDB;
