// create user model
module.exports = (sequelize, type) => {
    return sequelize.define('ecomm_product', {
        levar_customer_id: {
            type: type.INTEGER
        },
        ecomm_id: {
            type: type.STRING
        },
        ecomm_title: {
            type: type.STRING
        },
        product_type: {
            type: type.STRING
        },
        body_html: {
            type: type.STRING
        },
        vendor: {
            type: type.STRING
        },
        tags: {
            type: type.STRING
        },
        variant_id: {
            type: type.STRING
        },
        variant_title: {
            type: type.STRING
        },
        sku: {
            type: type.STRING
        },
        price: {
            type: type.DECIMAL
        },  
        created_date: {
            type: type.DATE
        },
        updated_date: {
            type: type.DATE
        },
        inventory_qty: {
            type: type.INTEGER
        },
        ecomm_store_id: {
            type: type.INTEGER
        },
        has_asset: {
            type: type.BOOLEAN
        }
    },
    {
        timestamps: false
    });
}