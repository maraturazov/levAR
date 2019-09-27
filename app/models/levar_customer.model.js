// create user model
module.exports = (sequelize, type) => {
    return sequelize.define('levar_customer', {
        shopify_store_id: {
            type: type.STRING
        },
        shopify_key: {
            type: type.STRING
        },
        shopify_password: {
            type: type.STRING
        },
    }, 
    {
        timestamps: false
    });
}