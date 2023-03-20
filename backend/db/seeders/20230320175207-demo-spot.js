'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '123 High Street',
        city: 'Marlinton',
        state: 'WV',
        country: 'USA',
        lat: 38.2235,
        lng: 80.0945,
        name: 'House on a Hill',
        description: 'Beautiful spot!',
        price: 100.00
      },
      {
        ownerId: 1,
        address: '124 High Street',
        city: 'Marlinton',
        state: 'WV',
        country: 'USA',
        lat: 38.2234,
        lng: 80.0944,
        name: 'House by a Lake',
        description: 'Peaceful spot!!',
        price: 200.00
      },
      {
        ownerId: 2,
        address: '125 High Street',
        city: 'Marlinton',
        state: 'WV',
        country: 'USA',
        lat: 38.2236,
        lng: 80.0946,
        name: 'House by the Water',
        description: 'Great spot!!!',
        price: 300.00
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['House on a Hill', 'House by a Lake', 'House by the Water'] }
    }, {});
  }
};
