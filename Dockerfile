FROM node:16-alpine as build

COPY . /app
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --quiet --no-progress --production

COPY . .

# Build and run
EXPOSE 8080
CMD npm start
