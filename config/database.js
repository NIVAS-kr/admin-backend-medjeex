const mongoose = require('mongoose');


exports.connectDatabase = () => {
    const uri = process.env.MONGO_URI; // Ensure this matches your environment variable name
    mongoose
        .connect(uri)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('MongoDB connection error:', err));
};
