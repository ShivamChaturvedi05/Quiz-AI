# Client/Dockerfile
FROM node:22-alpine

WORKDIR /app

# Install ALL dependencies (including Vite)
COPY package*.json ./
RUN npm install

# Copy code
COPY . .

# Use the correct Vite port
EXPOSE 5173

# Run the dev server and allow external access (--host)
CMD ["npm", "run", "dev", "--", "--host"]