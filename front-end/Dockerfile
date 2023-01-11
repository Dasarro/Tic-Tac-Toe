FROM node:18.12.0-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install -g node-gyp
RUN npm install -g @angular/cli
COPY . .
EXPOSE 4200
