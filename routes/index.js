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

    const category_id = '5dc55124c1c85b7c3f9f8441'; //for graphics cards

    const pages = 1; // number of pages

    // loop through pages
    for (let i = 1; i <= pages; i++) {
        const url = `https://store.hp.com/in-en/default/accessories/graphics-cards.html?hp_facet_sub_category=Graphics+Connectors%2FAdapters&product_list_limit=30`;
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
                            category_id,
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

router.get('/api/v1/intel', (req, res) => {
    const category_id = '5dd18136743140d625ed8895'; // for Modems
    const pages = 1;
    let addedProducts = [];

    for (let i = 1; i <= pages; i++) {
        const url = `https://www.intel.in/content/www/in/en/products/wireless/wi-fi-6-series.html?page=${i}`;

        request(url, (error, response, body) => {
            if (error) throw error;

            const root = parse(body);
            const productsList = root.querySelector('.card-listings');

            if (productsList) {
                const products = productsList.childNodes;
                products.map((product, index) => {
                    if (product.tagName && product.tagName === 'div') {
                        const bladeImage = product.querySelector('.blade-image').childNodes;
                        const spanImg = bladeImage[1].querySelector('span');
                        const imgUrl = spanImg.attributes['data-src'];

                        const content = product.querySelector('.content-main');
                        const title = content.querySelector('.title');
                        const titleLink = title.childNodes[1];
                        const productLink = `https://www.intel.in/${titleLink.attributes.href}`;
                        let productTitle = titleLink.childNodes[1].innerHTML;

                        const frag = productTitle.split(' ');
                        const brand = frag[0];
                        productTitle = productTitle.replace(brand, '');
                        productTitle = productTitle.trim();

                        if (brand !== '') {
                            const cardInfo = content.querySelector('.card-info');
                            if (cardInfo && cardInfo.querySelector('ul')) {
                                const descList = cardInfo.querySelector('ul').childNodes;
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

                                let mrp = 0;
                                if (product.querySelector('.price')) {
                                    mrp = product.querySelector('.price').innerHTML;
                                    if (mrp.indexOf('Pricing Unavailable') === -1) {
                                        mrp = mrp.replace('From', '');
                                        mrp = mrp.replace('₹', '');
                                        mrp = mrp.replace(/,/g, '');
                                        mrp = mrp.trim();
                                        if (mrp.indexOf('.') !== -1) {
                                            const frag2 = mrp.split('.');
                                            mrp = frag2[0];
                                            mrp = mrp.trim();
                                        }
                                    } else {
                                        mrp = 0;
                                    }
                                }

                                const productDoc = {
                                    images: [
                                        {
                                            image_path: imgUrl,
                                            alt_text: 'Intel'
                                        }
                                    ],
                                    brand,
                                    title: productTitle,
                                    category_id,
                                    features,
                                    description,
                                    mrp,
                                    source_link: productLink,
                                };

                                const resp = productController.addProduct(productDoc);

                                if (resp.success) {
                                    addedProducts.push(productDoc);
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    return res.status(200).send({
        success: true,
        message: 'Completed parsing page',
        products_added: addedProducts,
    });
});

export default router;