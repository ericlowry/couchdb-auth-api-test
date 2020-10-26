FROM node:15 as node-15-with-nodemon

RUN npm install --global nodemon --silent --no-fund

FROM node-15-with-nodemon

WORKDIR /opt/auth

COPY ./public ./public

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install --silent --no-fund

#COPY ./src ./src
#CMD ["node", "src/auth-service.js"]
