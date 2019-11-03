import express from 'express';
import request from 'request';
import { parse } from 'node-html-parser';
import inventoryController from '../controllers/inventoryController/inventory';
import categoryController from '../controllers/categoryController/categoryController';
import productController from '../controllers/productController/product';

const router = express.Router();

// manage inventories
router.get('/api/v1/inventories', inventoryController.getAllInventory);
router.post('/api/v1/add-inventory', inventoryController.addInventoryType);

// manage categories
router.get('/api/v1/categories', categoryController.getCategories);
router.post('/api/v1/add-category', categoryController.addCategory);

// manage products
router.get('/api/v1/products', productController.getProducts);
router.post('/api/v1/add-product', productController.addProductHandler);

// get HP products
router.get('/api/v1/hp', (req, res) => {
    let addedProducts = [];

    // loop through pages
    for (let i = 1; i < 2; i++) {
        const url = `https://store.hp.com/in-en/default/accessories/batteries-chargers-adapters.html?hp_facet_sub_category=Power+Packs&product_list_limit=30`;
        request(url, (error, response, body) => {
            if (error) throw error;

            const root = parse(body);
            const products = root.querySelector('.product-items').childNodes;

            products.map((product, index) => {
                if (product.tagName && product.tagName === 'li') {
                    const imageNode = product.querySelector('.product-image-photo');
                    const imagePath = imageNode.attributes.src;
                    const imageAlt = imageNode.attributes.alt;
                    const productContentNode = product.querySelector('.product-item-link');
                    let productFullname = productContentNode.innerHTML;
                    productFullname = productFullname.trim();
                    const fragments = productFullname.split(' ');
                    const brand = fragments[0];
                    let title = productFullname.replace(brand, '');
                    title = title.trim();
                    const descNode = product.querySelector('.product-desc-features');
                    if (descNode && descNode.querySelector('ul')) {
                        const descList = descNode.querySelector('ul').childNodes;
                        const description = '';
                        let features = [];
                        descList.map((desc, index) => {
                            if (desc.tagName && desc.tagName === 'li') {
                                let descText = desc.innerHTML;
                                descText = descText.trim();
                                if (descText !== "") {
                                    features.push(descText);
                                }
                            }
                        });
                        let mrp = product.querySelector('.price').innerHTML;
                        mrp = mrp.replace('₹', '');
                        mrp = mrp.replace(/,/g, '');

                        const productDoc = {
                            images: [
                                {
                                    image_path: imagePath,
                                    alt_text: imageAlt,
                                }
                            ],
                            brand,
                            title,
                            category_id: '5dbf1f3f699624867775f6c5', //for power banks
                            features,
                            description,
                            mrp,
                        };

                        const resp = productController.addProduct(productDoc);

                        if (resp.success) {
                            addedProducts.push(productDoc);
                        }
                    }
                }
            });
        });
    }

    return res.status(200).send({
        success: 'true',
        message: 'Completed parsing page',
        products_added: addedProducts,
    });
});

export default router;