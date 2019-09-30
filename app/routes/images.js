const router = require('express').Router();
const passport = require('passport');
const images = require('../controllers/ecomm_image.controller')

// get all images
router.get('/images', passport.authenticate('jwt', { session: false }), images.findAll);

// get images by ecomm_products_id
router.get('/images/:ecomm_products_id', passport.authenticate('jwt', { session: false }), images.findOne);

// update route
router.post('/update/:ecomm_products_id', passport.authenticate('jwt', { session: false }), images.update);

module.exports = router;