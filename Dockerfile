FROM node:8.6.0

RUN mkdir -p /usr/src/couchApp
WORKDIR /usr/src/couchApp

COPY yarn.lock package.json /usr/src/couchApp/

RUN yarn

COPY . /usr/src/couchApp

EXPOSE 3000

CMD ["npm", "start"]
