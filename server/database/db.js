import mongoose from "mongoose";

const Connection = async () => {
  const URL ="mongodb+srv://sarthakgawri04:rJzj9dJJd32wXDr7@car-acessories.rs0vk.mongodb.net/?retryWrites=true&w=majority&appName=Car-acessories";
 
  try {
    await mongoose.connect(URL, { useUnifiedTopology: true });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting the database", error.message);
  }
};


export default Connection;