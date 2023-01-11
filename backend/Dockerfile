FROM node:18.12.0-alpine

WORKDIR /backend
COPY package*.json .
RUN npm install
COPY . .

EXPOSE 3000
CMD [ "npm", "run", "dev" ]