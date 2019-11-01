import Inventory from '../../models/Inventory';

class InventoryController {
    getAllInventory(req, res) {
        Inventory.find({}, (err, inventoryItems) => {
            if (err) throw err;

            return res.status(200).send({
                success: 'true',
                message: '',
                inventory: inventoryItems,
            });
        });
    }

    addInventoryType(req, res) {
        if (!req.body.type) {
            return res.status(400).send({
                success: 'false',
                message: 'type is required',
            });
        }

        const newInventory = new Inventory({
            name: req.body.type,
            crtTs: new Date()
        });

        newInventory.save(err => {
            if (err) throw err;
        })

        return res.status(200).send({
            success: 'true',
            message: 'Type added',
        });
    }
}

const inventoryController = new InventoryController();
export default inventoryController;