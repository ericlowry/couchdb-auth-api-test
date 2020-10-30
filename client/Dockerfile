
FROM node:15

WORKDIR /opt/client
COPY ./package.json .
COPY ./yarn.lock .
COPY ./public ./public
RUN yarn
#CMD ["npm", "start"]
