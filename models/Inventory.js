import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var inventorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    crtTs: {
        type: Date,
        required: true,
    },
    delTs: Date,
});

var Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
