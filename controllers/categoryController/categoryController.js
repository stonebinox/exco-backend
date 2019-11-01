import Category from '../../models/Category';

class CategoryController {
    getCategories(req, res) {
        if (!req.body.inventory_id) {
            return res.status(400).send({
                success: 'false',
                message: 'Invalid inventory ID' 
            });
        }

        const inventory_id = req.body.inventory_id;

        Category.find({ inventory_id }, (err, categories) => {
            if (err) throw err;

            return res.status(200).send({
                success: 'true',
                message: '',
                categories,
            });
        });
    }

    addCategory(req, res) {
        if (!req.body.name) {
            return res.status(400).send({
                success: 'false',
                message: 'Invalid category name'
            });
        }

        let inventory_id;

        if (!req.body.inventory_id) {
            inventory_id = '5dbc0b6c922e11646a8c88e6';
        } else {
            inventory_id = req.body.inventory_id;
        }

        const newCategory = new Category({
            name: req.body.name,
            inventory_id,
            crtTs: new Date(),
        });

        newCategory.save(err => {
            if (err) throw err;
        });

        return res.status(200).send({
            success: 'true',
            message: 'Category added',
        });
    }
}

const categoryController = new CategoryController();
export default categoryController;