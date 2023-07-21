FROM node:14 as build 
WORKDIR /document-manager
COPY package*.json .
RUN npm install
COPY . /document-manager
RUN npm run build


FROM nginx:1.19
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/default.conf
COPY --from=build /document-manager/build /usr/share/nginx/html