'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        review: 'Pretty good',
        stars: 4
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Alright',
        stars: 3
      },
      {
        spotId: 2,
        userId: 1,
        review: 'Awesome',
        stars: 5
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: ['Pretty good', 'Alright', 'Awesome'] }
    }, {});
  }
};
