import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    crtTs: {
        type: Date,
        required: true,
    },
    inventory_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    delTs: Date,
});

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;