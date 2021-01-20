# the different stages of this Dockerfile are meant to be built into separate images
# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target
#
# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact

ARG PHP_VERSION=7.4.2
ARG NGINX_VERSION=1.17

ARG VARNISH_VERSION=6.2
#
# "php" stage
FROM php:${PHP_VERSION}-fpm-alpine AS bjmkt_php

# Update package manager
RUN apk update

# Setting the timezone : Europe/Brussels
RUN apk add --no-cache tzdata;
#	ls /usr/share/zoneinfo; \
#	cp /usr/share/zoneinfo/Europe/Brussels /etc/localtime
# timezone
ENV TZ="Europe/Brussels"
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone; \
	date; \
	apk del tzdata;


# Set the locale for
#RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y locales

#RUN sed -i -e 's/# fr_BE.UTF-8 UTF-8/fr_BE.UTF-8 UTF-8/' /etc/locale.gen && \
#    locale-gen
#ENV LANG fr_BE.UTF-8
#ENV LANGUAGE fr_BE:fr
#ENV LC_ALL fr_BE.UTF-8

# persistent / runtime deps
RUN apk add --no-cache \
		acl \
		file \
		fcgi \
		gettext \
		git \
	;

ARG APCU_VERSION=5.1.18
RUN set -eux; \
	apk add --no-cache --virtual .build-deps \
		$PHPIZE_DEPS \
		icu-dev \
		libzip-dev \
		# Changement de driver DB PostGre => MySQL
		#postgresql-dev \
		# MySQL
		mysql-dev \
		zlib-dev \
		# Add mbstring
		oniguruma-dev \
	; \
	\
	docker-php-ext-configure zip ; \
	docker-php-ext-install -j$(nproc) \
		intl \
		# Changement de driver DB PostGre => MySQL
        # Désactivation de l'extension PHP  PDO PostGre
		#pdo_pgsql \
		# MySQL
		mysqli pdo pdo_mysql \
		fileinfo \
		zip \
	; \
	pecl install \
		apcu-${APCU_VERSION} \
	; \
	pecl clear-cache; \
	# Activation des extensions PHP MySQL
    docker-php-ext-enable \
        mysqli \
        pdo_mysql \
        fileinfo \
    ; \

	docker-php-ext-enable \
		apcu \
		opcache \
	; \
	\
	runDeps="$( \
		scanelf --needed --nobanner --format '%n#p' --recursive /usr/local/lib/php/extensions \
			| tr ',' '\n' \
			| sort -u \
			| awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
	)"; \
	apk add --no-cache --virtual .api-phpexts-rundeps $runDeps; \
	\
	apk del .build-deps

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN ln -s $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini
COPY docker/php/conf.d/api-platform.ini $PHP_INI_DIR/conf.d/api-platform.ini

RUN set -eux; \
	{ \
		echo '[www]'; \
		echo 'ping.path = /ping'; \
	} | tee /usr/local/etc/php-fpm.d/docker-healthcheck.conf

# Workaround to allow using PHPUnit 8 with Symfony 4.3
ENV SYMFONY_PHPUNIT_VERSION=8.3

# https://getcomposer.org/doc/03-cli.md#composer-allow-superuser
ENV COMPOSER_ALLOW_SUPERUSER=1
# install Symfony Flex globally to speed up download of Composer packages (parallelized prefetching)
RUN set -eux; \
	composer global require "symfony/flex" --prefer-dist --no-progress --no-suggest --classmap-authoritative; \
	composer clear-cache -vvv
ENV PATH="${PATH}:/root/.composer/vendor/bin"

# fix work iconv library with alphine
RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ --allow-untrusted gnu-libiconv
ENV LD_PRELOAD /usr/lib/preloadable_libiconv.so php

WORKDIR /srv/api

# build for production
ARG APP_ENV=prod

# prevent the reinstallation of vendors at every changes in the source code
COPY composer.json composer.lock symfony.lock ./
# do not use .env files in production
RUN echo '<?php return [];' > .env.local.php
RUN set -eux; \
	composer install --prefer-dist --no-dev --no-autoloader --no-scripts --no-progress --no-suggest; \
	composer clear-cache;

# do not use .env files in production
#COPY .env.prod ./.env
#RUN composer dump-env prod; \
#	rm .env

# copy only specifically what we need
COPY bin bin/
COPY config config/
COPY public public/
COPY private private/
COPY src src/
COPY templates templates/

ENV API_ENTRYPOINT=${API_ENTRYPOINT}
ENV MERCURE_SUBSCRIBE_URL=${MERCURE_SUBSCRIBE_URL}
ENV VARNISH_URL=${VARNISH_URL}
ENV API_ENTRYPOINT=${API_ENTRYPOINT}
ENV APP_HOST_URL=${APP_HOST_URL}
ENV APP_OWNER_ADDRESS=${APP_OWNER_ADDRESS}
ENV APP_OWNER_PHONE_NUMBER=${APP_OWNER_PHONE_NUMBER}
ENV APP_OWNER_CONTACT_EMAIL=${APP_OWNER_CONTACT_EMAIL}
ENV APP_HOST_URL=${APP_HOST_URL}
ENV APP_FULLNAME=${APP_FULLNAME}

# do not use .env files in production
#COPY ./.env.prod ./.env
#RUN composer dump-env prod; \
#	rm .env

RUN set -eux; \
	mkdir -p var/cache var/log var/dompdf; \
	composer dump-autoload --classmap-authoritative --no-dev; \
	composer run-script --no-dev post-install-cmd; \
	chmod +x bin/console; sync
VOLUME /srv/api/var

COPY docker/php/docker-healthcheck.sh /usr/local/bin/docker-healthcheck
RUN chmod +x /usr/local/bin/docker-healthcheck

HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD ["docker-healthcheck"]

COPY docker/php/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
CMD ["php-fpm"]


# "nginx" stage
# depends on the "php" stage above
FROM nginx:${NGINX_VERSION}-alpine AS bjmkt_nginx

COPY docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /srv/api

COPY --from=bjmkt_php /srv/api/public public/


# "varnish" stage
# does not depend on any of the above stages, but placed here to keep everything in one Dockerfile
#FROM cooptilleuls/varnish:${VARNISH_VERSION}-alpine AS api_platform_varnish
FROM cooptilleuls/varnish:${VARNISH_VERSION}-alpine AS bjmkt_cache-proxy

COPY docker/varnish/conf/default.vcl /usr/local/etc/varnish/default.vcl

#CMD ["varnishd", "-F", "-f", "/usr/local/etc/varnish/default.vcl", "-p", "http_resp_hdr_len=65536", "-p", "http_resp_size=98304"]
