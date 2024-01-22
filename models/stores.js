"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Store extends Model {
        static associate(models) {
            // define association here  
            Store.hasMany(models.Employees, { as: 'employees' });
        }
    }
    Store.init(
        {
          name: DataTypes.STRING,
          code: DataTypes.STRING,
          location: DataTypes.STRING,
          category: DataTypes.STRING
        },
        {
          hooks: {
            beforeCreate : (instance, option)=>{
              if (instance.category == 'Mart') {
                instance.code = '001-'+ `${new Date().getTime()}`
              } else if (instance.category == 'Midi') {
                instance.code = '002-'+ `${new Date().getTime()}`
              } else if (instance.category == 'Express') {
                instance.code = '003-'+ `${new Date().getTime()}`
              }
            }
          },   
          sequelize,
            modelName: "Store",
            tableName: "Stores",
        }
    );
    return Store;
};
