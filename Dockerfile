FROM node:14 as build 
WORKDIR /document-manager
COPY package*.json /document-manager/
RUN npm install
COPY . /document-manager/
ARG ENVIRONMENT=local
RUN echo "Creating a build for $ENVIRONMENT environment"
RUN npm run build:$ENVIRONMENT


FROM nginx:1.19
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/default.conf
COPY --from=build /document-manager/build /usr/share/nginx/html