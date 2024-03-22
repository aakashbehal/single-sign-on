FROM node:14 as build 
WORKDIR /single-sign-on
COPY package*.json /single-sign-on/
RUN npm install
COPY . /single-sign-on/
ARG ENVIRONMENT=local
RUN echo "Creating a build for $ENVIRONMENT environment"
RUN npm run build:$ENVIRONMENT


FROM nginx:1.19
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/default.conf
COPY --from=build /single-sign-on/build /usr/share/nginx/html