ARG NODE_VERSION=13
ARG NGINX_VERSION=1.17

FROM node:${NODE_VERSION}-alpine

RUN mkdir -p /usr/src/admin

WORKDIR /usr/src/admin

# Prevent the reinstallation of node modules at every changes in the source code
COPY package.json yarn.lock ./

# Mettre à jour le gestionnaire de dépendance
RUN apk update
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
	&& yarn install \
	&& apk del .gyp

COPY . ./

#VOLUME /usr/src/admin/node_modules

#ENV HTTPS true

# CMD ["yarn", "start"]

CMD ["yarn", "start"]

# "build" stage
# depends on the "development" stage above
#FROM api_platform_admin_development AS api_platform_admin_build

#ARG REACT_APP_API_ENTRYPOINT

#RUN set -eux; \
#	yarn build


# "nginx" stage
# depends on the "build" stage above
#FROM nginx:${NGINX_VERSION}-alpine AS api_platform_admin_nginx

#COPY docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

#WORKDIR /usr/src/admin/build

#COPY --from=api_platform_admin_build /usr/src/admin/build ./
