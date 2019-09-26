const express = require('express');
const bodyParser = require('body-parser');

const passport = require('passport');

const app = express();
// initialize passport with express
app.use(passport.initialize());

// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const usersRouter = require('./app/routes/users');

// set some basic routes
app.get('/', function(req, res) {
    res.json({ message: 'Express is up!' });
});

// user route
app.use('/user', usersRouter);

// protected route
app.get('/test_token', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.json('Success! You can now see this without a token.');
});

// start app
app.listen(4800, function() {
  console.log('Express is running on port 4800');
});