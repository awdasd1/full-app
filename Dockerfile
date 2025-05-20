# Use a Node.js base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if using npm)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Expose the port the app runs on (adjust if needed)
EXPOSE 5173

# Command to run the application (using serve for static files)
CMD ["npx", "serve", "dist", "-s", "-l", "5173"]
