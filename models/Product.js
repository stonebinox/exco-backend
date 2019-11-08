import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var productSchema = new Schema({
    crtTs: {
        type: Date,
        required: true,
    },
    delTs: Date,
    title: {
        type: String,
        required: true,
    },
    description: String,
    brand: {
        type: String,
        required: true,        
    },
    features: Array,
    category_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    images: Array,
    mrp: {
        type: Number,
        required: true,
        default: 0,
    },
    selling_price: {
        type: Number,
        required: true,
        default: 0,
    },
    in_stock: {
        type: Boolean,
        required: true,
        default: true,
    },
    source_link: String,
});

var Product = mongoose.model('Product', productSchema);

module.exports = Product;