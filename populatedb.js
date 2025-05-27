require('dotenv').config();
const mongoose = require('mongoose');
const PROPERTY = require('./models/property');
const properties = require('./data/properties.json');

const populate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'torii-gate' });
        await PROPERTY.deleteMany(); // Clear existing properties
        await PROPERTY.create(properties); // Insert new properties
        console.log("properties added")
    } catch (error) {
        console.log( error);
    }
}

populate()
