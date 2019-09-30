const { EcommImage } = require('../../sequelize');

const update = async (req, res) => {
    const ecomm_products_id = req.params.ecomm_products_id;
    await EcommImage.update(
        req.body,
        { where: { ecomm_products_id: ecomm_products_id } },
    ).then(([image]) => {
        if(!image) {
            return res.status(404).json({
                message: 'Image not found with ecomm_products_id ' + ecomm_products_id
            });
        }
        res.json({ 'message': 'Image updated successfully' });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                message: 'Image not found with ecomm_products_id ' + ecomm_products_id
            });                
        }
        res.status(500).json({
            message: err.message || 'Some error occurred while updating the image.'
        });
    });
};

const findOne = async (req, res) => {
    const ecomm_products_id = req.params.ecomm_products_id;
    await EcommImage.findOne({
        where: { 
            ecomm_products_id: ecomm_products_id,
        },
    })
    .then(image => {
        if(!image) {
            return res.status(404).json({
                message: 'Image not found with ecomm_products_id ' + ecomm_products_id
            });            
        }
        res.json(image);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                message: 'Image not found with ecomm_products_id ' + ecomm_products_id
            });                
        }
        return res.status(500).json({
            message: 'Error retrieving image with ecomm_products_id ' + ecomm_products_id
        });
    });
};

const findAll = async (req, res) => {
    await EcommImage
    .findAll()
    .then(images => {
        res.json(images);
    })
    .catch(err => {
        res.status(500).json({
            message: err.message || 'Some error occurred while retrieving images.'
        });
    });
};

module.exports = {
    update,
    findOne,
    findAll
}