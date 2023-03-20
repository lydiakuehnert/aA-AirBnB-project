'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'somewhere1.com',
        preview: true
      },
      {
        spotId: 1,
        url: 'somewhere2.com',
        preview: true
      },
      {
        spotId: 2,
        url: 'somewhere3.com',
        preview: false
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['somewhere.com', 'elsewhere.com', 'hithere.com'] }
    }, {});
  }
};
