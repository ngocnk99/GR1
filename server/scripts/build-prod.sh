#!/bin/bash

set -euo pipefail

DOCKER_REGISTRY=localhost:5000

docker build --build-arg node_env=production -t $DOCKER_REGISTRY/vietnamtickets-api-prod:"${1:-latest}" .
docker push $DOCKER_REGISTRY/vietnamtickets-api-prod:"$BUILD_NUMBER"