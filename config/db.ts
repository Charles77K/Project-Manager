import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.DATABASE?.replace(
        "<PASSWORD>",
        process.env.DATABASE_PASSWORD as string
      ) as string,
      {
        autoIndex: true,
      }
    ); // Simplified connection
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit on failure
  }
};

export default connectDB;
