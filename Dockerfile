FROM registry.bleacherreport.com:5000/node10.13.0_alpine:latest

WORKDIR /app

COPY package*.json /app/

RUN apk add --no-cache ca-certificates \
    && npm install

COPY . /app/

EXPOSE 80

CMD ["sh", "-c", "eval $(/tmp/aws-env) && node index"]
