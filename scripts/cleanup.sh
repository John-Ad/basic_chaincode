#!/bin/sh

./network.sh down
docker system prune
docker volume prune
