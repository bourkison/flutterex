// https://stackoverflow.com/questions/16226472/mongoose-autoreconnect-option
// Unified Topology causing unstable connection

const mongoose = require('mongoose');
let conn = null;

module.exports = async (uri) => {
    console.log("Beginning connection:", uri);
    
    if (conn === null) {
        console.log("Creating connection");

        mongoose.connection.on("connected", () => {
            console.log("Connection established to Mongo");
        });

        mongoose.connection.on("disconnected", () => {
            console.log("Lost Mongo connection...");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("Reconnected to Mongo");
        });

        mongoose.connection.on("error", (err) => {
            console.log("Could not connect to Mongo:", err);
        })

        conn = mongoose.createConnection(uri, { 
            useNewUrlParser: true,
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
            keepAlive: 30000,
            bufferMaxEntries: false
        });

        conn = await conn;
    } else {
        conn = await conn;
        console.log("Returning cached connection", conn);
    }

    // Close the Mongoose connection, when receiving SIGINT
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Force to close the MongoDB connection after SIGINT')
            process.exit(0)
        })
    })

    return conn;
}