FROM registry.ylt.zone/library/nginx:1.18.0
LABEL MAINTAINER="ma.songlin@yilutong.com"

RUN apk upgrade --update

COPY dist /opt/
