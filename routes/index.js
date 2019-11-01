import express from 'express';
import inventoryController from '../inventoryController/inventory';

const router = express.Router();

router.get('/api/v1/inventory', inventoryController.getAllInventory);
router.post('/api/v1/add-inventory', inventoryController.addInventoryType);

export default router;