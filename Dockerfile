FROM node:20.14.0-alpine 
# todo: check how it works with slim image

RUN apk add --no-cache bash

RUN mkdir -p /app
WORKDIR /app

COPY ./entrypoint.sh ./
COPY ./index.js ./

ARG RUN_ENV=production
ENV NODE_ENV=$RUN_ENV

ENTRYPOINT ["bash", "./entrypoint.sh"]
