#!/usr/bin/env bash
docker-compose exec cache sh -c "redis-cli -u \$SESSION_CACHE"
