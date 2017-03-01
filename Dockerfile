FROM node:7

RUN apt-get update && yes | apt-get install vim less

RUN mkdir -p /opt/app/server

ADD dist /opt/app/dist
ADD api /opt/app/server/api
ADD package.json /opt/app/server

RUN echo "UI_SOURCE=/opt/app/dist" >> /opt/app/server/.env
RUN echo "NODE_PORT=3000" >> /opt/app/server/.env
RUN echo "PROXY_URL=http://private-9aad-note10.apiary-mock.com/" >> /opt/app/server/.env

RUN cd /opt/app/server && npm i --production

EXPOSE 3000

ENTRYPOINT cd /opt/app/server && npm start
