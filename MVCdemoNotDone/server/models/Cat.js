const mongoose = require('mongoose');

const CatsSchema = new mongoose.Schema({ // define data structure of cat
    name: {
        type: String, // this object is a string
        required: true, // All cats MUST have a name
        unique: true, // no cat can have the same name
        trim: true, // no leading or trailing white space
    },
    bedsOwned: {
        type: Number,
        min: 0,
        required: true,
    },
    createdDate: { // standard practice for databases
        type: Date,
        default: Date.now, // if not specified the date is now/today
    },
});

// creating space for cat data in model
const CatModel = mongoose.model('Cat', CatsSchema);
module.exports = CatModel;