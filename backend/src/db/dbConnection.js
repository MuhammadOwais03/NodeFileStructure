import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const DB_URI = process.env.MONGODB_URL

const connection = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${DB_URI}/${DB_NAME}`)
        console.log('MongoDB connection established', connectionInstance.connection.host)
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}

export default connection;



