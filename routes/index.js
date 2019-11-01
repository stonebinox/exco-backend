import express from 'express';
import inventoryController from '../controllers/inventoryController/inventory';
import categoryController from '../controllers/categoryController/categoryController';
import productController from '../controllers/productController/product';

const router = express.Router();

router.get('/api/v1/inventories', inventoryController.getAllInventory);
router.post('/api/v1/add-inventory', inventoryController.addInventoryType);

router.get('/api/v1/categories', categoryController.getCategories);
router.post('/api/v1/add-category', categoryController.addCategory);

router.get('/api/v1/products', productController.getProducts);
router.post('/api/v1/add-product', productController.addProductHandler);

export default router;