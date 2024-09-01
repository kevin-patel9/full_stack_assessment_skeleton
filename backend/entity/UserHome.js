const { EntitySchema } = require("typeorm");

const UserHomeSchema = new EntitySchema({
  name: "UserHome",
  tableName: "userhome",
  columns: {
    username: {
      type: "varchar",
      primary: true,
    },
    street_address: {
      type: "varchar",
      primary: true,
    },
  }
});

module.exports = { UserHomeSchema };