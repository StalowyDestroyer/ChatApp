'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const hashedPassword1 = await bcrypt.hash("Password123", await bcrypt.genSalt(10));
    const hashedPassword2 = await bcrypt.hash("Password123", await bcrypt.genSalt(10));
    const hashedPassword3 = await bcrypt.hash("Password123", await bcrypt.genSalt(10));

    await queryInterface.bulkInsert('user', [
      {
        username: "username",
        password: hashedPassword1,
        email: "email1@email.com",
        profilePicturePath: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "userAdam",
        password: hashedPassword2,
        email: "email2@email.com",
        profilePicturePath: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "userTomek",
        password: hashedPassword3,
        email: "email3@email.com",
        profilePicturePath: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Możesz dodać tutaj komendę do usunięcia danych
    await queryInterface.bulkDelete('user', null, {});
  }
};
