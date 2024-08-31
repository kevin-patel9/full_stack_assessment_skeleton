const { EntitySchema } = require('typeorm');

const HomeSchema = new EntitySchema({
  name: 'Home',
  tableName: 'home',
  columns: {
    street_address: {
      type: 'varchar',
      primary: true,
    },
    state: {
      type: 'varchar',
      nullable: false,
    },
    zip: {
      type: 'varchar',
      nullable: false,
    },
    sqft: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    beds: {
      type: 'int',
      nullable: false,
    },
    baths: {
      type: 'int',
      nullable: false,
    },
    list_price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    }
  },
  relations: {
    users: {
      target: 'User',
      type: 'many-to-many',
      inverseSide: 'homes'
    }
  }
});

module.exports = { HomeSchema };
