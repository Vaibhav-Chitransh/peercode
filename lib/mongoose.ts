import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGO_URL) return console.log('MISSING MONGODB URL');
    if(isConnected) return console.log('MONGODB already connected');

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: 'PeerCode',
        })

        isConnected = true;
        // console.log('MONGODB is connected');
    } catch (error) {
        console.log('MONGODB connection failed', error);
    }
}