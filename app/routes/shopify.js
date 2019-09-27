const express = require('express');
const router = express.Router();
const shopifyAPI = require('shopify-node-api');
const { LevarCustomer, EcommStore, EcommProduct, EcommImage } = require('../../sequelize');


router.get('/app/products', async (req, res, next) => {
    await LevarCustomer.findAll()
    .then(levar_customers => {
        levar_customers.forEach(async (levar_customer) => {
            await EcommStore.findOne({
                where: { id: levar_customer.shopify_store_id }
            })
            .then(async (ecomm_store) => {
                const Shopify = new shopifyAPI({
                    shop: ecomm_store.store_name, // .myshopify.com
                    shopify_api_key: levar_customer.shopify_key, // Your API key
                    access_token: levar_customer.shopify_password // Your API password
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
                            .findOne({ where: 
                                { 
                                    ecomm_id: product.id,
                                    variant_id: variant.id 
                                } 
                            })
                            .then(async prd => {
                                if(prd) {
                                    await EcommProduct.update(
                                        _product, 
                                        { where:
                                            { 
                                                ecomm_id: product.id,
                                                variant_id: variant.id 
                                            } 
                                        }
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
                            await EcommImage
                            .findOne({ where: _image
                            })
                            .then(async img => {
                                if(img) {
                                    await EcommImage.update(_image,
                                        {
                                            where: _image
                                        });
                                } else {
                                    await EcommImage.create(_image);
                                }
                            });
                        });
                    });
                    res.json(data);
                });
            })
        });
    });
});

module.exports = router;