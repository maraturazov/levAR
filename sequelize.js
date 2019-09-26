const Sequelize = require('sequelize')
const UserModel = require('./app/models/user.model')

const sequelize = new Sequelize('levAR', 'contractor', 'contract22', {
    host: 'levarrds.cfnewtqbosoi.us-east-1.rds.amazonaws.com',
    port: 3306,
    logging: console.log,
    maxConcurrentQueries: 100,
    dialect: 'mysql',
    dialectOptions: {
        ssl:'Amazon RDS'
    },
    pool: { maxConnections: 5, maxIdleTime: 30},
    language: 'en'
})

sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

const User = UserModel(sequelize, Sequelize);

User.sync()
  .then(() => console.log('User table created successfully'))
  .catch(err => console.log('oooh, did you enter wrong database credentials?'));

module.exports = {
  User,
}