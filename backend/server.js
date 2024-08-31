require("reflect-metadata");
const express = require("express");
const { createConnection } = require("typeorm");
const { UserSchema } = require("./entity/User.js");
const { HomeSchema } = require("./entity/Home.js");

const app = express();
app.use(express.json());

createConnection({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "db_user",
  password: "6equj5_db_user",
  database: "home_db",
  entities: [UserSchema, HomeSchema],
  synchronize: true,
  logging: false,
})
  .then(async (connection) => {
    console.log("Connected to the database");

    app.get("/users", async (req, res) => {
      try {
        const userRepository = connection.getRepository("User");
        const users = await userRepository.find();
        res.status(200).send({ users });
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Error fetching users" });
      }
    });

    app.post("/homesByUser", async (req, res) => {
      try {
        const { username } = req.body;

        if (!username) return res.status(400).send({ message: "Username is required" });

        const userRepository = connection.getRepository("User");
        const queryBuilder = userRepository.createQueryBuilder("user");

        // Perform LEFT JOIN with the Home entity and filter by username
        const userHomes = await queryBuilder
          .leftJoinAndSelect("user.homes", "home")
          .where("user.username = :username", { username })
          .getOne();

        if (!userHomes)
          return res.status(404).send({ message: "User not found" });

        res.status(200).send(userHomes);
      } catch (error) {
        console.error("Error fetching homes by user:", error);
        res.status(500).send({ message: "Error fetching homes by user" });
      }
    });

    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
