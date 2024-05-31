# Getting base image from DockerHub
FROM node:16.20.2-alpine

ENV NODE_ENV production

#Defineing Working Directory
WORKDIR /root

# Copying source code to Image in /user/app directory
COPY . /root

CMD ["npm", "run", "start"]
