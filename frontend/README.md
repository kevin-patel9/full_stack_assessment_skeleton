# problem was to make user interact with the created API's

# Frontend techstack used
    1. React.js
    2. Tailwind CSS
    3. Redux ToolKit (for fetching data)

# added all the following UI and feature for user to interact with

1. On Selection of dropdown menu (multiple user is displayed)

2. Get all home according to selected user 
    API integrated (/home/find-by-user)

3. Integrated pagination for homes upto 50 home per screen
    API integrated (/home/page-count-by-user)

4. Edit button option selected fetch already selected home
    API integrated (/user/find-by-home)

5. Now edit by adding or removing user from selected home
    API integrated (/home/update-users)

# CREATE DOCKER FILE

Added Docker file and the installation process [text](Dockerfile)

And Finally added the docker-compose in [text](../docker-compose.final.yml) in frontend section