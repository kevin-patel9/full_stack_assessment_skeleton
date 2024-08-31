const { EntitySchema } = require('typeorm');

const UserSchema = new EntitySchema({
  name: 'User',
  tableName: 'user',
  columns: {
    username: {
      type: 'varchar',
      primary: true,
    },
    email: {
      type: 'varchar',
      nullable: false,
    }
  },
  relations: {
    homes: {
      target: 'Home',
      type: 'many-to-many',
      inverseSide: 'users',
      joinTable: {
        name: 'userhome',
        joinColumn: { name: 'username', referencedColumnName: 'username' },
        inverseJoinColumn: { name: 'street_address', referencedColumnName: 'street_address' }
      }
    }
  }
});

module.exports = { UserSchema };
