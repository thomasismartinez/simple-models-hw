const mongoose = require('mongoose');

const DogsShema = new mongoose.Schema({ // define data structure of cat
    name: {
        type: String, // this object is a string
        required: true, // All dogs MUST have a name
        unique: true, // no dog can have the same name
        trim: true, // no leading or trailing white space
    },
    breed: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        min: 0,
        required: true
    },
    createdDate: { // standard practice for databases
        type: Date,
        default: Date.now, // if not specified the date is now/today
    },
});

// creating space for cat data in model
const DogModel = mongoose.model('Dog', DogsShema);
module.exports = DogModel;