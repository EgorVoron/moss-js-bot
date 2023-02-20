FROM node:latest

WORKDIR /usr/src/bot
COPY package*.json ./
RUN npm install
COPY . ./
CMD ["node", "src/index.js"]