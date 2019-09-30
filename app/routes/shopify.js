const router = require('express').Router();
const passport = require('passport');
const shopify = require('../controllers/shopify.controller')

// get products route
router.post('/get_products', passport.authenticate('jwt', { session: false }), shopify.get_products);

module.exports = router;