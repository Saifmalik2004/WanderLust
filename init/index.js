const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initdata = require("./data");

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log("some error:", err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};


const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: '665d9a8b2c74ce0e3e2d1005' }))
    await Listing.insertMany(initdata.data)
    console.log("data was initialized");
}

initDB();