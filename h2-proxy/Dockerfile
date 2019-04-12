FROM alpine:latest

ARG cert_pass

RUN apk add --no-cache openssl

# Use this self-generated certificate only in dev, IT IS NOT SECURE!
RUN openssl genrsa -des3 -passout pass:$cert_pass -out cert.pass.key 2048
RUN openssl rsa -passin pass:$cert_pass -in cert.pass.key -out cert.key
RUN rm cert.pass.key
RUN openssl req -new -passout pass:$cert_pass -key cert.key -out cert.csr \
    -subj '/C=BE/ST=Liege/L=Liege/O=Buja Market Dev/CN=localhost'
RUN openssl x509 -req -sha256 -days 365 -in cert.csr -signkey cert.key -out cert.crt

FROM nginx:1.15-alpine

RUN mkdir -p /etc/nginx/ssl/
COPY --from=0 cert.key cert.crt /etc/nginx/ssl/
COPY conf.d /etc/nginx/conf.d/
