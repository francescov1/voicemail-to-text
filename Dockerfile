FROM node:16-alpine as build

COPY . /app
WORKDIR /app

# Install dependencies
RUN npm install --production

# Build and run
CMD npm start