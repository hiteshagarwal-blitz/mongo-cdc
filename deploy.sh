#!/bin/bash

docker build -t asia-south1-docker.pkg.dev/blitzscale-prod-project/blitzscale-prod/mongo-cdc:latest .
docker push asia-south1-docker.pkg.dev/blitzscale-prod-project/blitzscale-prod/mongo-cdc:latest
kubectl rollout restart deployment mongo-cdc -n subs
