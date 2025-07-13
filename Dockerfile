# Base image for React and Node.js
FROM node:20.10

# Install system-level dependencies
RUN apt-get update && apt-get install -y nano git cron

#RUN docker-php-ext-install mysqli pdo_mysql curl

# Install PM2 globally
RUN npm install -g pm2

WORKDIR /app

COPY . .

#COPY ./api/package.json ./

COPY package*.json ./

# Install application dependencies
RUN npm install
#RUN pwd

# Expose ports
EXPOSE 8080

# Set environment variable
ENV NODE_ENV=staging

# Define the command to start the application
#CMD ["pm2", "start", "ecosystem.config.js", "--env", "staging"]
#CMD ["pm2 start ecosystem.config.js --env staging"]
#CMD pm2-runtime start index.js --env staging
CMD pm2-runtime start ./ecosystem.config.js --env staging

#CMD ["npm", "run", "dev"]
