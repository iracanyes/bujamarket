ARG NODE_VERSION=13
ARG NGINX_VERSION=1.17

FROM node:${NODE_VERSION}-alpine AS api_platform_client_development

RUN mkdir -p /usr/src/client

WORKDIR /usr/src/client

RUN yarn global add @api-platform/client-generator

# Prevent the reinstallation of node modules at every changes in the source code
COPY package.json yarn.lock ./
RUN set -eux; \
#	yarn install
	yarn install

COPY . ./

ENV HTTPS true

CMD ["yarn", "start"]

# "build" stage
# depends on the "common" stage above
#FROM api_platform_client_development AS api_platform_client_build

#ENV NODE_ENV production
#ENV HTTPS true

#RUN set -eux; \
#	yarn build;

# "nginx" stage
# depends on the "build" stage above
#FROM nginx:${NGINX_VERSION}-alpine AS api_platform_client_nginx

#COPY docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

#WORKDIR /usr/src/client/build

#COPY --from=api_platform_client_build /usr/src/client/build ./


