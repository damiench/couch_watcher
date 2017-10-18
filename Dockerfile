FROM node:8.6.0

RUN mkdir -p /usr/src/couchApp
WORKDIR /usr/src/couchApp
CMD apt-get install yarn

COPY package.json /usr/src/couchApp
COPY yarn.lock /usr/src/couchApp

RUN yarn

COPY . /usr/src/couchApp

EXPOSE 3000

CMD ["npm", "start"]
