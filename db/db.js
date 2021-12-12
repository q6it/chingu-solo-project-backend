import mongoose from 'mongoose';

export const connectToDb = async () => {
    try {
        console.log('🚀 ~ file: db.js ~ line 6 ~ createDb ~ process.env.DB', process.env.DB);
        await mongoose.connect(process.env.DB);
        console.log('connected to database.');
    } catch (error) {
        console.log('could not connect to database', error);
    }
};
