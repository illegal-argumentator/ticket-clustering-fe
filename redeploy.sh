#!/bin/bash

APP_NAME="ticket-clustering-fe"
IMAGE_NAME="ticket-clustering-fe-image"
PORT_HOST=5173
PORT_CONTAINER=80

echo "===> Pull latest code (optional)"

echo "===> Stop old container (if exists)"
docker stop $APP_NAME 2>/dev/null || true
docker rm $APP_NAME 2>/dev/null || true

echo "===> Remove old image (optional)"
docker rmi $IMAGE_NAME 2>/dev/null || true

echo "===> Build new image"
docker build -t $IMAGE_NAME .

echo "===> Run new container"
docker run -d \
  --name $APP_NAME \
  -p $PORT_HOST:$PORT_CONTAINER \
  --restart unless-stopped \
  $IMAGE_NAME

echo "===> Done! Container status:"
docker ps | grep $APP_NAME