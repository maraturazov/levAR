const Sequelize = require('sequelize')
const UserModel = require('./app/models/user.model')
const LevarCustomerModel = require('./app/models/levar_customer.model')
const EcommStoreModel = require('./app/models/ecomm_store.model')
const EcommProductModel = require('./app/models/ecomm_product.model')
const EcommImageModel = require('./app/models/ecomm_image.model')

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
  .then(() => console.log('Connected to user table successfully'))
  .catch(err => console.log('Failed to connect to user table'));

const LevarCustomer = LevarCustomerModel(sequelize, Sequelize);
LevarCustomer.sync()
  .then(() => console.log('Connected to levar_customer table successfully'))
  .catch(err => console.log('Failed to connect to levar_customer table'));

const EcommStore = EcommStoreModel(sequelize, Sequelize);
EcommStore.sync()
  .then(() => console.log('Connected to ecomm_store table successfully'))
  .catch(err => console.log('Failed to connect to ecomm_store table'));

const EcommProduct = EcommProductModel(sequelize, Sequelize);
EcommProduct.sync()
  .then(() => console.log('Connected to ecomm_product table successfully'))
  .catch(err => console.log('Failed to connect to ecomm_product table'));

const EcommImage = EcommImageModel(sequelize, Sequelize);
EcommImage.sync()
  .then(() => console.log('Connected to ecomm_image table successfully'))
  .catch(err => console.log('Failed to connect to ecomm_image table'));

module.exports = {
  User,
  LevarCustomer,
  EcommStore,
  EcommProduct,
  EcommImage
}