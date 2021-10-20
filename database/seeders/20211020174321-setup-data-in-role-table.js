'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', [
        {
          name: 'admin',
          description: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'trainingStaff',
          description: 'trainingStaff',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'trainer',
          description: 'trainer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'trainee',
          description: 'trainee',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'student',
          description: 'student',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
