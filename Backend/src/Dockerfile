FROM node:18-alpine3.15
RUN mkdir cacheApp
WORKDIR /cacheApp
RUN npm init -y
RUN npm i express ioredis mysql mysql2 promise-mysql promise-mysql2
RUN mkdir /src
WORKDIR /cacheApp/src
COPY /database.js .
COPY /index.js .
COPY /keys.js .
EXPOSE 3000
CMD node index.js