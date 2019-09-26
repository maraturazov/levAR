const router = require('express').Router();
const users = require('../controllers/user.controller.js');

// register route
router.route('/register').post(users.create);

// get all users
router.route('/users').get(users.findAll);

// get a single user with id
router.route('/users/:userId').get(users.findOne);

// update route
router.route('/update/:userId').put(users.update);

//remove user route
router.route('/delete/:userId').delete(users.remove);

//login route
router.route('/login').post(users.login);

module.exports = router;
  