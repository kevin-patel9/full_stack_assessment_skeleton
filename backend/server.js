require("reflect-metadata");
const express = require("express");
const cors = require("cors");
const { createConnection } = require("typeorm");
const { UserSchema } = require("./entity/User.js");
const { HomeSchema } = require("./entity/Home.js");
const { UserHomeSchema } = require("./entity/UserHome.js");

const app = express();
app.use(express.json());
app.use(cors())

createConnection({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "db_user",
  password: "6equj5_db_user",
  database: "home_db",
  entities: [UserSchema, HomeSchema, UserHomeSchema],
  synchronize: true,
  logging: false,
})
  .then(async (connection) => {
    console.log("Connected to the database");

    app.get("/", async (req, res) => {
      try {
        res.status(200).send("Api is running");
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Error fetching users" });
      }
    });

    app.get("/user/find-all", async (req, res) => {
      try {
        const userRepository = connection.getRepository("User");
        const users = await userRepository.find();
        res.status(200).send({ users });
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Error fetching users" });
      }
    });

    app.post("/home/find-by-user", async (req, res) => {
      try {
        const { username } = req.body;

        if (!username)
          return res.status(400).send({ message: "Username is required" });

        const userRepository = connection.getRepository("User");
        const queryBuilder = userRepository.createQueryBuilder("user");

        // Perform LEFT JOIN with the Home entity and filter by username
        const userHomes = await queryBuilder
                .leftJoinAndSelect("user.homes", "home")
                .where("user.username = :username", { username })
                .getOne();

        if (!userHomes)
          return res.status(404).send({ message: "User not found" });

        res.status(200).send({ userHomes });
      } catch (error) {
        console.error("Error fetching homes by user:", error);
        res.status(500).send({ message: "Error fetching homes by user" });
      }
    });

    app.post("/user/find-by-home", async (req, res) => {
      try {
        const { homeAddress } = req.body;

        if (!homeAddress)
          return res.status(400).send({ message: "homeAddress is required" });

        // Get a repository for the User entity
        const userRepository = connection.getRepository("User");

        // Query to find users by home address
        const users = await userRepository.createQueryBuilder("user")
                        .innerJoin("userhome", "userhome", "user.username = userhome.username")
                        .where("userhome.street_address = :homeAddress", { homeAddress })
                        .select("userhome.username")
                        .getRawMany();

        const usernames = users.map(user => user.userhome_username);

        if (usernames.length === 0)
          return res.status(404).send({ message: "No usernames found for the given home address" });

        res.status(200).send({ usernames });
      } catch (error) {
        console.error("Error fetching users by home:", error);
        res.status(500).send({ message: "Error fetching users by home" });
      }
    });

    app.post("/home/update-users", async (req, res) => {
      try {
        const { updateUser = { add: [], remove: [] }, street_address } = req.body;
    
        const userHomeRepository = connection.getRepository("UserHome");
    
        // Handle removal of users
        const removePromises = updateUser.remove.map(async (username) => {
            await userHomeRepository.delete({ username, street_address });
            return { username, status: "removed" };
        });
    
        // Handle addition of users
        const addPromises = updateUser.add.map(async (username) => {
            await userHomeRepository.save({ username, street_address });
            return { username, status: "added" };
        });
    
        const allPromises = [...removePromises, ...addPromises];
        await Promise.all(allPromises);
    
        res.status(200).send({ 
          message: "User updated successfully"
        });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: "Error updating user" });
      }
    });        

    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
