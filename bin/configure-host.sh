#!/usr/bin/env bash

sysctl vm.overcommit_memory=1
sysctl -w net.core.somaxconn=65535
echo madvise > /sys/kernel/mm/transparent_hugepage/enabled
firewall-cmd --add-port=5000/tcp
