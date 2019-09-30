const shopifyAPI = require('shopify-node-api');
const { LevarCustomer, EcommStore, EcommImage, EcommProduct } = require('../../sequelize');

const get_products = async (req, res, next) => {
    const { store_url, secret_key, password } = req.body;
    let store_id;
    await EcommStore.findOne({
        where: { store_name: store_url }
    })
    .then(async (store) => {
        let levar_customer, ecomm_store;
        if (store) {
            ecomm_store = store;
            levar_customer = await LevarCustomer.findOne({
                where: { shopify_store_id: store.id }
            });
            store_id = store.id;
        } else {
            ecomm_store = await EcommStore.create({
                store_name: store_url
            });
            store_id = ecomm_store.id;
            levar_customer = await LevarCustomer.create({
                shopify_store_id: store_id,
                shopify_key: secret_key,
                shopify_password: password
            });
        }
        const Shopify = new shopifyAPI({
            shop: store_url, // .myshopify.com
            shopify_api_key: secret_key, // Your API key
            access_token: password // Your API password
        });
        await Shopify.get('/admin/products.json', async (err, data, headers) => {
            const products = data.products;
            await products.forEach(async (product) => {
                // create or update ecomm_products
                await product.variants.forEach(async (variant) => {
                    const _product = {
                        levar_customer_id: levar_customer.id,
                        ecomm_id: product.id,
                        ecomm_title: product.title,
                        product_type: product.product_type,
                        body_html: product.body_html,
                        vendor: product.vendor,
                        tags: product.tags,
                        variant_id: variant.id,
                        variant_title: variant.title,
                        sku: variant.sku,
                        price: variant.price,  
                        created_date: variant.created_at,
                        updated_date: variant.updated_at,
                        inventory_qty: variant.inventory_quantity,
                        ecomm_store_id: ecomm_store.id,
                    }   
                    await EcommProduct
                    .findOne({ where: {
                        ecomm_id: product.id,
                        variant_id: variant.id 
                    }})
                    .then(async prd => {
                        if(prd) {
                            await EcommProduct.update(
                                _product, 
                                { where: {
                                    ecomm_id: product.id,
                                    variant_id: variant.id 
                                }}
                            );
                        } else {
                            await EcommProduct.create(_product);
                        }
                    });
                });

                // create or update ecomm_images
                await product.images.forEach(async (image) => {
                    const _image = {
                        ecomm_products_id: image.id,
                        image_url: image.src,
                    } 
                    EcommImage
                    .findOne({ where: {
                        ecomm_products_id: image.id,
                    }})
                    .then(async img => {
                        if(img) {
                            return await EcommImage.update(
                                _image, 
                                { where: {
                                    ecomm_products_id: image.id,
                                }}
                            );
                        } else {
                            return await EcommImage.create(_image);
                        }
                    });
                });
            });
            res.json(data);
        });
    });
}

module.exports = {
    get_products
}