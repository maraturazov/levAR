const router = require('express').Router();
const passport = require('passport');
const products = require('../controllers/ecomm_product.controller')

// get all products
router.get('/products', passport.authenticate('jwt', { session: false }), products.findAll);

// get products by ecomm_id
router.get('/products/:ecomm_id', passport.authenticate('jwt', { session: false }), products.findAll);

// get products by ecomm_id and variant_id
router.get('/products/:ecomm_id/:variant_id', passport.authenticate('jwt', { session: false }), products.findOne);

// update route
router.post('/update/:variant_id', passport.authenticate('jwt', { session: false }), products.update);

module.exports = router;