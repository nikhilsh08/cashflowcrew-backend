import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({ path: './.env' });
export const dbConnect = () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error("DATABASE_URL environment variable is not defined.");
    }
    mongoose.connect(databaseUrl, {}).then(()=>{
        console.log("Database connected")
    }).catch((error:Error)=>{
        console.log("databse connection failed....",error)
    })

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
        console.log(`Database connected `);
    });
}


