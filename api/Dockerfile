FROM node:15 as node-15-with-nodemon

RUN npm install --global nodemon --silent --no-fund

FROM node-15-with-nodemon

FROM node-15-with-nodemon as node-15-common

WORKDIR /opt/common

COPY ./common/package.json .
COPY ./common/package-lock.json .

#COPY ./common/lib ./lib

RUN npm install --silent --no-fund

FROM node-15-common

WORKDIR /opt/api

COPY ./api/public ./public

COPY ./api/package.json .
COPY ./api/package-lock.json .

RUN npm install --silent --no-fund

#COPY ./src ./src
#CMD ["node", "src/api-service.js"]
