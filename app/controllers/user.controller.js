const { User } = require('../../sequelize');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = User.findOne({
        where: { id: jwt_payload.id },
    });

    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

// use the strategy
passport.use(strategy);

const create = async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({
        where: { email: email },
    });
    if (user) {
        res.status(400).json({ 
            message: 'User is already existing' 
        });
    } else {
        await User.create({ 
            email, password 
        }).then(user =>
            res.json({ 
                user, 
                message: 'account created successfully' 
            })
        ).catch(error => {
            res.status(500).json({
                message: error.message || 'Some error occurred while creating the User.'
            });
        });
    }
};
  
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email && !password) {
        res.status(401).json({ 
            message: 'Email and password is required' 
        });
    } else if (!email) {
        res.status(401).json({ 
            message: 'Email is required' 
        });
    } else if (!password) {
        res.status(401).json({ 
            message: 'Password is required' 
        });
    } else {
        await User.findOne({
            where: { email: email }
        })
        .then(user => {
            if (!user) {
                res.status(404).json({ 
                    message: 'No such user found'
                });
            }
            if (user.password === password) {
                let payload = { id: user.id };
                let token = jwt.sign(payload, jwtOptions.secretOrKey);
                res.json({ message: 'ok', token: token });
            } else {
                res.status(400).json({ message: 'Password is incorrect' });
            }
        }).catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).json({
                    message: 'No such user found'
                });                
            }
            return res.status(500).json({
                message: 'Some error occurred while signing in'
            });
        });

    }
}

const remove = async (req, res) => {
    const userId = req.params.userId;
    await User.destroy({
        where: { id: userId },
    }).then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found with id ' + userId
            });
        }
        res.json({message: 'User deleted successfully!'});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            res.status(404).json({
                message: 'User not found with id ' + userId
            });            
        }
        return res.status(500).json({
            message: 'Could not delete note with id ' + userId
        });
    });
};
  
const update = async (req, res) => {
    const userId = req.params.userId;
    const { email, password } = req.body;
    await User.update(
        {
            email: email,
            password: password,
        },
        { where: { id: userId } },
    ).then(([user]) => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found with id ' + userId
            });
        }
        res.json({ 'message': 'User updated successfully' });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                message: 'User not found with id ' + userId
            });                
        }
        res.status(500).json({
            message: err.message || 'Some error occurred while updating the User.'
        });
    });
};

const findAll = async (req, res) => {
    User.findAll()
    .then(users => {
        res.json(users);
    }).catch(err => {
        res.status(500).json({
            message: err.message || 'Some error occurred while retrieving users.'
        });
    });
};

const findOne = async (req, res) => {
    const userId = req.params.userId;
    await User.findOne({
        where: { id: userId },
    })
    .then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found with id ' + userId
            });            
        }
        res.json(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                message: 'User not found with id ' + userId
            });                
        }
        return res.status(500).json({
            message: 'Error retrieving user with id ' + userId
        });
    });
};

module.exports = {
    create,
    login,
    update,
    remove,
    findAll,
    findOne,
}