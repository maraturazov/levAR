const { EcommProduct } = require('../../sequelize');

const update = async (req, res) => {
    const variant_id = req.params.variant_id;
    await EcommProduct
    .findOne({ where: { 
        variant_id: variant_id 
    }}).then(async (product) => {
        if (!product) {
            return res.status(404).json({
                message: 'Product not found with variant id ' + variant_id
            });
        } else {
            if (!product.has_asset) {
                res.json({ 'message': 'Product which has no asset cannot be updated'})
            }
            await EcommProduct.update(
                req.body,
                { where: { variant_id: variant_id } },
            ).then(([product]) => {
                res.json({ 'message': 'Product updated successfully' });
            }).catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).json({
                        message: 'Product not found with variant id ' + variant_id
                    });                
                }
                res.status(500).json({
                    message: err.message || 'Some error occurred while updating the product.'
                });
            });
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                message: 'Product not found with variant id ' + variant_id
            });                
        }
        return res.status(500).json({
            message: 'Some error occurred while updating the Product.'
        });
    });
};

const findOne = async (req, res) => {
    const ecomm_id = req.params.ecomm_id;
    const variant_id = req.params.variant_id;
    await EcommProduct.findOne({
        where: { 
            ecomm_id: ecomm_id,
            variant_id: variant_id,
        },
    })
    .then(product => {
        if(!product) {
            return res.status(404).json({
                message: 'Product not found with variant_id ' + variant_id
            });            
        }
        res.json(product);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                message: 'product not found with variant_id ' + variant_id
            });                
        }
        return res.status(500).json({
            message: 'Error retrieving product with variant_id ' + variant_id
        });
    });
};

const findAll = async (req, res) => {
    const ecomm_id = req.params.ecomm_id;
    let obj = {};
    if (ecomm_id) {
        obj = {
            ecomm_id: ecomm_id,
        };
    }
    await EcommProduct
    .findAll({
        where: obj
    }).then(products => {
        res.json(products);
    }).catch(err => {
        res.status(500).json({
            message: err.message || 'Some error occurred while retrieving products.'
        });
    });
};


module.exports = {
    update,
    findOne,
    findAll
}