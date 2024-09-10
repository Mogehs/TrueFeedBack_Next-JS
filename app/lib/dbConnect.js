import mongoose from "mongoose";

const dbConnect = async () => {
  let connection = false;
  try {
    if (connection) {
      console.log("Connection is already established");
      return;
    } else {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connection established successfully");
      connection = true;
    }
  } catch (e) {
    console.log("Error in Connecting DB");
    process.exit(1);
  }
};

export default dbConnect;
