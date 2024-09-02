# problem was to create api to interact with Database

# Backend techstack used
    1. Node.js
    2. TypeORM
    3. Express

# added all the following api [text](server.js)

1. GET /user/find-all  
    --- (get all users)

2. POST /home/find-by-user  
    --- (get all home according to users)

3. POST /user/find-by-home 
    --- (get alluser related to home used during on click of edit button in UI side)

4. POST /home/update-users
    --- (update by adding or removing user from selected home)

# CREATE DOCKER FILE

Added Docker file and the installation process [text](Dockerfile)

And Finally added the docker-compose in [text](../docker-compose.final.yml) in backend section