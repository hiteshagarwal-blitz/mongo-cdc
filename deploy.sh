#!/bin/bash

docker build -t asia-south1-docker.pkg.dev/blitzscale-dev-project/blitzscale-dev/mongo-cdc:latest .
docker push asia-south1-docker.pkg.dev/blitzscale-dev-project/blitzscale-dev/mongo-cdc:latest
kubectl rollout restart deployment mongo-cdc -n subs
