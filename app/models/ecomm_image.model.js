// create user model
module.exports = (sequelize, type) => {
    return sequelize.define('ecomm_image', {
        ecomm_products_id: {
            type: type.STRING
        },
        image_url: {
            type: type.STRING
        },
    },
    {
        timestamps: false
    });
}