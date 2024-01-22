'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Employees',
      'salary',
      {
        type: Sequelize.DataTypes.INTEGER,
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Employees', 'salary', {})
  }
};
