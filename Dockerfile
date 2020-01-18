FROM node:12-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6881/udp
EXPOSE 3000
CMD [ "npm", "start" ]