

'use strict'
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename) // const env = 'production' // 'developmentDesktop20191004' //  //   // process.env.NODE_ENV ||  
const env = process.env.NODE_ENV_CTRL || 'development' //test 'developmentpc' //  // 'development'// 'production' // 
const config = require( '../configs/dbconfig-custom.json')[env];// ./apiServe // __dirname + 
// let config
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, {... config
		, dialect: 'mariadb',		dialectOptions: {			timezone: 'Etc/GMT-9'		},		define: {			timestamps: false		}	}
//	,	define: {timestamps: false}
	)
}
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/* db[ 'holdings' ].hasOne( db[ 'cryptoaccounts' ]
  , { 
    foreignKey : 'id' ,
    sourceKey : 'cryptoaccountsid'
  }
) */
module.exports = db;
