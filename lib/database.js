import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async() => {
    mongoose.set('strictQuery', true);

    const currentState = mongoose.connection.readyState;

    if(currentState === 1) {
        if (!isConnected) {
            console.log('MongoDB is already connected');
            isConnected = true; 
        }
        return;
    } else if (currentState === 2) { 
        console.log('MongoDB is connecting...');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'data',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('MongoDB is connected');
    } catch (error) {
        console.log('Error connecting to MongoDB: ', error);
    }
}