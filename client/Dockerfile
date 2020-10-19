ARG NODE_VERSION=13
#ARG NGINX_VERSION=1.17

FROM node:${NODE_VERSION}-alpine AS api_platform_client_nginx

RUN mkdir -p /usr/src/client

WORKDIR /usr/src/client

RUN yarn global add @api-platform/client-generator

# Prevent the reinstallation of node modules at every changes in the source code
COPY package.json yarn.lock ./
#RUN set -eux; \
#	yarn install
RUN yarn install

COPY . ./

CMD ["yarn", "start"]
