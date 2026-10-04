import mongoose from "mongoose"

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI environment variable is not defined");
    }

    mongoose.connect(mongoUri, {
        dbName: "LIBRARY_MANAGEMENT_SYSTEM"
    }).then(res => {
        console.log(`Database connected successfully!`);
    }).catch(err => {
        console.log(`Error connecting to database`, err);
    })
}
