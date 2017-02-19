FROM node:7

ADD . /tmp/notebook

RUN npm i -g yarn && yarn

ENTRYPOINT bash
