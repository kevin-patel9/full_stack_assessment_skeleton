FROM node:14

WORKDIR /apps

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Expose the port the app runs on
EXPOSE 3000

CMD ["npm", "start"]