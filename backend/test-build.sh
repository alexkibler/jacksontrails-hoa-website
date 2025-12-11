#!/bin/bash
docker run --rm -v "$(pwd):/src" -w /src golang:1.22-alpine3.19 sh -c "
  ls -la migrations/*.go
  echo '---'
  go mod tidy
  go build -v -o /tmp/test main.go 2>&1 | grep migrations
"
