// create user model
module.exports = (sequelize, type) => {
    return sequelize.define('ecomm_store', {
        store_name: {
            type: type.STRING
        },
    },
    {
        timestamps: false
    });
}