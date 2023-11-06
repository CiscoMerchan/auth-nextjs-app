import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('Mongodb connection error, please make sure MongoDB is running.' + err);
            process.exit();
        })

    } catch (error) {
        console.log('No connection with the DB')
        console.log(error)

    }
    

}