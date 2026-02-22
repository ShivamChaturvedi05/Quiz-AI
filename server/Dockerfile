# server/Dockerfile

# 1. Use the same Node version as the client
FROM node:22-alpine

# 2. Set the folder for the backend code
WORKDIR /app

# 3. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the backend code
COPY . .

# 5. Open the port your backend runs on
EXPOSE 4000

# 6. Start the backend
CMD ["npm", "start"]