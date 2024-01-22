'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employees.belongsTo(models.Store, {foreignKey: 'id', as: 'store'})
    }
  }
  Employees.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty:{
            msg : 'Tidak Boleh Kosong'
          },
          notNull: {
            msg : 'Tidak Boleh Kosong'
          }
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty:{
            msg : 'Tidak Boleh Kosong'
          },
          notNull: {
            msg : 'Tidak Boleh Kosong'
          }
        },
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
          isDate: true,
          isAgeValidation(value) {
            // Validasi Umur
            const age = new Date().getFullYear() - new Date(value).getFullYear();
            if (age <= 17) {
              throw new Error('Employee must be at least 18 years old.');
            }
          },
        },
      },
      education: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty:{
            msg : 'Tidak Boleh Kosong'
          },
          notNull: {
            msg : 'Tidak Boleh Kosong'
          }
        },
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salary: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
        },
      },
      StoreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Employees',
      hooks: {
        // Hook for beforeUpdate to apply validations on update
        beforeUpdate: (employee) => {
          if (employee.changed('position')) {
            // Trigger validation for position if it is being updated
            employee.validate({ fields: ['position'] });
          }
        },
      },
      // Define virtual fields
      getterMethods: {
        Age() {
          // Calculate age based on date of birth
          return (
            new Date().getFullYear() - new Date(this.getDataValue('dateOfBirth')).getFullYear()
          );
        },
      },
    }
  )
  return Employees
}