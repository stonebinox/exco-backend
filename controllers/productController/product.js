import Product from '../../models/Product';

class ProductController {
    getProducts(req, res) {
        Product.find({}, (err, products) => {
            if (err) throw err;

            return res.status(200).send({
                success: 'true',
                message: '',
                products: products,
            });
        });
    }

    addProduct(data) {
        const {
            title,
            description,
            brand,
            category_id,
            images,
            mrp,
        } = data;

        Product.findOne({ brand: brand, title: title }, (err, product) => {
            if (err) throw err;

            return {
                success: false,
                message: 'Product already added'
            };
        });

        const newProduct = new Product({
            crtTs: new Date(),
            title,
            description,
            brand,
            category_id,
            images,
            mrp
        });

        newProduct.save(err => {
            if (err) throw err;
        })

        return {
            success: 'true',
            message: 'Product added',
        };
    }

    addProductHandler(req, res) {
        let {
            title,
            description,
            brand,
            category_id,
            images,
            mrp,
        } = req.body;

        if (!title || title.trim().length === 0) {
            return productController.errorHandler(res, 'Invalid title');
        }

        if (!description) {
            description = '';
        }

        if (!brand || brand.trim().length === 0) {
            return productController.errorHandler(res, 'Invalid brand');
        }

        if (!category_id) {
            return productController.errorHandler(res, 'Invalid category ID');
        }

        if (!images) {
            images = [];
        }

        if (!mrp || isNaN(mrp)) {
            return productController.errorHandler(res, 'Invalid MRP');
        }

        brand = brand.trim();
        title = title.trim();

        const data = {
            title,
            description,
            brand,
            category_id,
            images,
            mrp,
        };

        const response = productController.addProduct(data);

        if (response.success) {
            return res.status(200).send({
                response
            });
        }

        return productController.errorHandler(response.message);
    }

    errorHandler(res, message) {
        return res.status.send({
            success: true,
            message: message,
        });
    }
}

const productController = new ProductController();
export default productController;